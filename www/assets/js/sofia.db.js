
/* globals S, console, window */
'use strict';
define(["jquery","pouchdb","moment","objectdiff","pouchdb-authentication","moment-locales"], function($,PouchDB,moment,objectDiff) {
  //TODO paginataion
  var req_limit = 1000000;
  /**** DEBUG ****/
  //Disabled for live
  //PouchDB.debug.enable('*');
  PouchDB.debug.disable();
  /**** ***** ****/

  var db = {
    /*"localDB" : new PouchDB("local-"+S.config.db.name.replace(/^\/+/, '')), */
    /*"remoteDB" : new PouchDB(S.config.db._full_url, {skipSetup: true}), */
    setUrl : function(dbConfig) {
      S.config.db = dbConfig; //TODO check
      localStorage["sofia-server-config"] = JSON.stringify(S.config.db);
      S.config.db._full_url = S.config.db.url.replace(/\/+$/, '')+"/"+S.config.db.name.replace(/^\/+/, '');
      S.config.db._local_url ="local-"+S.config.db._full_url.replace(/:/gi, '').replace(/\/+/gi, '#');
      //S.config.db._local_url = "local-"+S.config.db.name.replace(/^\/+/, '');

      db.localDB = new PouchDB(S.config.db._local_url); // Use the full url in case same db on other domain could lead to corruption //TODO maybe clean it if exist ?
      db.remoteDB = new PouchDB(S.config.db._full_url, {skipSetup: true});
    },
    clearLocal : function(){
      return db.localDB.destroy();
    }
  };

  db.config = {
    getUsers : function(){
      var deferred = new $.Deferred();
      db.localDB.get('_design/sofia-config').then(function(doc){
        console.log(deferred.resolve(doc.users || [])); //Return empty array if not present in DB (old version) depends on adentes-org/sofia-db#dd9feee
      }).catch(function (err) {
        console.log(err);
      });
      return deferred.promise();
    },
    getMemo : function(){
      var deferred = new $.Deferred();
      db.localDB.getAttachment('_design/sofia-config', 'memo.html').then(function (blob) {
        // handle result
        var reader = new FileReader();
        reader.onload = function(){
          deferred.resolve({ memo : reader.result});
        };
        reader.readAsText(blob);
      }).catch(function (err) {
        console.log(err);
      });
      return deferred.promise();
    }
  };
  db.users = {
    login : function(user,pass,silent){
      //TODO don't use jquery promise
      var deferred = new $.Deferred();
      db.remoteDB.login(user, pass, function (err, response) {
        if (err) {
          console.log(err);
          if(!silent){
            alert(err.message);
          }
          deferred.reject(err);
        }else{
          if(response.ok) {
            //We are logged in
            console.log("We are logged in !", response);
            S.user.set(user,pass,response);
            db.fiches.startSync();
            deferred.resolve(response);
          }
        }
      });
      return deferred.promise();
    }
  };

  db.fiches = {
    changeToParse : 0,
    parseSync : function(info) {
            console.log("Parsing sync : ", info);

            S.vue.router.app.$children[0].$data.options.displayLoadingBar = false;

            console.log("Currently shown page : ",window.location.hash.slice(3).split("/")[0]);
            //switch($(S.vue.router.app.$children[1].$el).attr("id")){
            //TODO detect if refresh needed base on the element refresh and the one being displayed
            switch(window.location.hash.slice(3).split("/")[0]){
                case "memo" :
                          db.config.getMemo().then(function(data){
                            S.vue.router.app.$children[1].$data.memo = data.memo;
                            console.log("Updating memo data : ",data);
                          });
                          break;
                case "home" :
                          db.fiches.getAllWithMine().then(function(data){
                            S.vue.router.app.$children[1].$data.fiches = data.fiches;
                            S.vue.router.app.$children[1].$data.my_fiches = data.my_fiches;
                            console.log("Updating home data : ",data);
                          });
                          break;
                case "fiche" :
                          var ficheid= window.location.hash.slice(3).split("/")[1];
                          db.fiches.getByID(ficheid).then(function (doc) {
                            //S.vue.router.app.$children[1].$data.history
                            //S.vue.router.app.$children[1].$data.fiche
                            S.vue.router.app.$children[1].$data.fiche = doc;
                            S.vue.router.app.$children[0].$data.options.title = doc.patient.firstname +" "+ doc.patient.lastname;

                            //S.vue.router.app.$children[1].$set('fiche', 2)
                          });
                        break;
                default :
                          S.vue.router.replace(window.location.hash.slice(2)); //TODO better reload data not page
                          break;
            }
            if(db.fiches.changeToParse>0){
              db.fiches.changeToParse--;
            }
    },
    resetTimeout : function() {
      //Clear all timer
      if(db.fiches.offlineTimeout){
          console.log("Clearing offlineTimeout timeout");
          window.clearTimeout(db.fiches.offlineTimeout);
      }
      if(db.fiches.offlineAfterTimeout){
          console.log("Clearing offlineAfterTimeout timeout");
          window.clearTimeout(db.fiches.offlineAfterTimeout);
      }
      //We watch for a other change event to happen
      db.fiches.offlineTimeout = window.setTimeout(db.fiches.timeout,S.config.header.timeoutOffline*1000);
    },
    timeout : function() {
      console.log("db.fiches.offlineTimeout tigged !");
      db.remoteDB.info().then(function (result) {
        console.log("Reseting timeout after getting informtion from online db",result);
        db.fiches.resetTimeout();
      }).catch(function (err) {
        console.log(err);
      });
      /*
      db.localDB.compact().then(function (result) {
        window.clearTimeout(db.fiches.offlineAfterTimeout);
      }).catch(function (err) {
        console.log(err);
      });
      */
      db.fiches.offlineAfterTimeout = window.setTimeout("console.log('Setting header color to offline');S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColorOffline;",5*1000); //TODO use a func
    },
    watch : function(sync) {
      sync.on('change', function (change) {
        db.fiches.changeToParse++;
        console.log("Pouchdb.sync.change event",change,Date());// yo, something changed!
      }).on('paused', function (info) {
        // replication was paused, usually because of a lost connection or end of transmission
        console.log("Pouchdb.sync.paused event",info,Date());
        //We jsut receive data from server so wa are online
          if(S.vue.router.app.$children[0].$data.options.backColor !== S.config.header.backColor){
            //The header is display not as online
            console.log("Setting header color to online");
            S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColor;
          } /*else {
            //The header is display as online
          }*/
          db.fiches.resetTimeout();

          if(db.fiches.changeToParse>0 || S.vue.router.app.$children[0].$data.options.displayLoadingBar){
            db.fiches.parseSync(info);
          }
      }).on('active', function (info) {
        console.log("Pouchdb.sync.active event",info,Date());
        // replication was resumed
        S.vue.router.app.$children[0].$data.options.displayLoadingBar = true;
      }).on('error', function (err) {
        console.log("Pouchdb.sync.error event",err,Date());
        // totally unhandled error (shouldn't happen)
      }).on('complete', function (info) {
        console.log("Pouchdb.sync.complete event",info,Date());
        // replication was canceled!
        db.fiches.watch(db.localDB.sync(db.remoteDB, {
          live: true,
          retry: true
        })); //Reload Sync
      });
    },
    startSync : function() {
                console.log("Starting sync ...");
                db.fiches.watch(db.localDB.sync(db.remoteDB, {
                  live: true,
                  retry: true
                }));
                console.log("Sync in place !");
    },
    post : function(obj) { //Create
      return db.localDB.post(obj);
    },
    getDiffConflict : function(o,n) {
      //return objectDiff.diff(o.patient, n.patient)
      return objectDiff.diff($.extend({}, o, {events : []}), $.extend({}, n, {events : []})); //Create a shallow clone and overwrite events parts to not be big in term of data
    },
    mergeConflict : function(o,n) { // o : obj in db, n: obj to commit
      //This is never call normally because the vue and obj of the vue is instantly update when in localDB
      /* This will merge and keep a maximum of information (things deleted previously could be added) */
      var ret = $.extend({},o,{
        close_context : n.close_context,
        deleted : n.deleted,
        closed : n.closed,
        patient : n.patient,
        origin : n.origin,
        owner_id : n.owner_id,
        primaryAffection : n.primaryAffection,
        uid : n.uid
      }); //Close and overwrite some parts that can be directly
      $.each(n.pathologys, function(id,val){
        if ($.inArray(val,ret.pathologys) === -1) { //Not found
          ret.pathologys.push(val);
        }
      });
      $.each(n.events, function(id,val){
        /*
        if ($.inArray(val,ret.events) === -1) { //Not found
          ret.events.push(val);
        }
        */
          var found = false;
          var searching = JSON.stringify(val);
          $.each(ret.events, function(i,v){
            if(!found && JSON.stringify(v) === searching ){
              found = true;
            }
          });
          if(!found){
            ret.events.push(val);
          }
      });
      ret.events.sort(function(x, y){ //Order
        return x.timestamp - y.timestamp;
      });
      /* */
      ret._rev=o._rev;
      ret.events.push({
                type : "action",
                action : "autoMergeConflict",
                message : S.lang.log["auto-merge"],
                /*  diff : objectDiff.diff(o, ret), */ //Take too much space
                diff : db.fiches.getDiffConflict(o,ret),
                timestamp : Date.now(),
                user :  S.user._current.name
      });
      return ret;
    },
    put : function(obj) { //Update or Create
      obj.pathologys = S.tool.uniq(obj.pathologys); // Remove any duplicate
      return db.localDB.put(obj).catch(function (err) {
              console.log(err);
              if (err.status === 409 || err.name === 'conflict') {
                // conflict!
                db.fiches.getByID(obj._id).then(function (doc) {
                  db.fiches.put(db.fiches.mergeConflict(doc,obj));//Saving merge conflict
                });//TODO detection loop
              } else {
                // some other error
              }
          });
    },
    getByID : function(id) {
        var deferred = new $.Deferred();
        S.db.localDB.get(id).then(function (doc) {
          console.log(doc);
          deferred.resolve(doc);
        }).catch(function (err) {
          // handle err
          console.log(err);
          deferred.reject(err);
        });

        return deferred.promise();

    },
    filterMine : function(fiches) {
        var my_fiches = [];
        $.each(fiches, function( index, doc ) {
          if(doc.owner_id === S.user._current.name){
            my_fiches[my_fiches.length] = doc;
          }
        });
        return my_fiches;
    },
    getAllWithMine : function() {
          var deferred = new $.Deferred();
          S.db.fiches.getAll().then(function(result){
            result.my_fiches = S.db.fiches.filterMine(result.fiches);
            deferred.resolve(result);
          });
          return deferred.promise();
    },
    getAll : function() {
        var deferred = new $.Deferred();
        S.db.localDB.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
          // handle result
          var ret = {
              user : S.user._current,
              fiches: []
          };
          $.each(result.rows, function( index, value ) {
            if(value.doc._id.split("/")[0] === "_design" ){
              return; //If it's a design doc
            }
            ret.fiches[ret.fiches.length] = value.doc;

            value.doc.creation_date = moment(value.doc.events[0].timestamp).format("ddd, H:mm");
            value.doc.last_update = value.doc.events[value.doc.events.length -1].timestamp;
            var m = moment(value.doc.last_update);
            value.doc.last_update_since = m.fromNow();
            value.doc.last_update_is_old = m.add(S.config.fiche.update_timeout, 'minutes').isBefore();
            var d = moment(value.doc.patient.birthdate);
            value.doc.patient.age = moment().diff(d, 'years');
            value.doc.patient.age_formatted = d.fromNow(true);
          });
          ret.lang =  S.lang;
          deferred.resolve(ret);
        }).catch(function (err) {
          // handle err
          console.log(err);
          deferred.reject(err);
        });
        return deferred.promise();
    },
    getMyCreationCount : function (){
        var deferred = new $.Deferred();

        S.db.localDB.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
          var count = 0;
          $.each(result.rows, function( index, value ) {
            if(value.doc._id.split("/")[0] === "_design" ){
              return; //If it's a design doc
            }
            if(value.doc.uid.split("-")[0] === S.user._current.name){
              count ++;
            }
          });
          console.log(count);
          deferred.resolve(count);
        }).catch(function (err) {
            // handle err
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise();
      }
  };
  return db;
});
