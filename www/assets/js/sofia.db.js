/* global PouchDB */
'use strict';
var S = S || {};

//TODO paginataion
var req_limit = 1000000;

/**** DEBUG ****/
//TODO disable for live
//PouchDB.debug.enable('*');
PouchDB.debug.disable();
/**** ***** ****/

S.db = {
  /*"localDB" : new PouchDB("local-"+S.config.db.name.replace(/^\/+/, '')), */
  /*"remoteDB" : new PouchDB(S.config.db._full_url, {skipSetup: true}), */
  setUrl : function(dbConfig) {
    S.config.db = dbConfig; //TODO check
    localStorage["sofia-server-config"] = JSON.stringify(S.config.db);
    S.config.db._full_url = S.config.db.url.replace(/\/+$/, '')+"/"+S.config.db.name.replace(/^\/+/, '');
    S.config.db._local_url ="local-"+S.config.db._full_url.replace(/:/gi, '').replace(/\/+/gi, '#');
    //S.config.db._local_url = "local-"+S.config.db.name.replace(/^\/+/, '');

    S.db.localDB = new PouchDB(S.config.db._local_url); // Use the full url in case same db on other domain could lead to corruption //TODO maybe clean it if exist ?
    S.db.remoteDB = new PouchDB(S.config.db._full_url, {skipSetup: true});
  },
  clearLocal : function(){
    return S.db.localDB.destroy();
  }
}

S.db.setUrl(S.config.db);
//S.db_users = new PouchDB(S.config.db._user_url, {skipSetup: true});

S.db.config = {
  getMemo : function(){
    var deferred = new $.Deferred();
    S.db.localDB.getAttachment('_design/sofia-config', 'memo.html').then(function (blob) {
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
}
S.db.users = {
  login : function(user,pass,silent){
    //TODO don't use jquery promise
    var deferred = new $.Deferred();
    S.db.remoteDB.login(user, pass, function (err, response) {
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
          S.db.fiches.startSync();
          //console.log("Resolving the deffer with", response);
          deferred.resolve(response);
        }
      }
    });
    return deferred.promise();
  }
}
/*
S.db.users = {
  getAll : function() {
    //TODO not working
    var deferred = new $.Deferred()
    S.db_users.allDocs({keys: ["name"]}).then(function (result) {
      console.log(result);
      var ret = [];
      $.each(result.rows, function( index, value ) {
        //ret[ret.length] = value.doc.name;
      });
      deferred.resolve(ret);
    }).catch(function (err) {
      // handle err
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise();
  },
};
*/
S.db.fiches = {
  changeToParse : 0,
  parseSync : function(info) {
          console.log("Parsing sync : ", info);

          S.vue.router.app.$children[0].$data.options.displayLoadingBar = false;

          console.log("Currently shown page : ",window.location.hash.slice(3).split("/")[0]);
          //switch($(S.vue.router.app.$children[1].$el).attr("id")){
          //TODO detect if refresh needed base on the element refresh and the one being displayed
          switch(window.location.hash.slice(3).split("/")[0]){
              case "memo" :
                        S.db.config.getMemo().then(function(data){
                          S.vue.router.app.$children[1].$data.memo = data.memo;
                          console.log("Updating memo data : ",data)
                        })
                        break;
              case "home" :
                        S.db.fiches.getAllWithMine().then(function(data){
                          S.vue.router.app.$children[1].$data.fiches = data.fiches;
                          S.vue.router.app.$children[1].$data.my_fiches = data.my_fiches;
                          console.log("Updating home data : ",data)
                        })
                        break;
              case "fiche" :
                        var ficheid= window.location.hash.slice(3).split("/")[1]
                        S.db.fiches.getByID(ficheid).then(function (doc) {
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
          if(S.db.fiches.changeToParse>0)
            S.db.fiches.changeToParse--;
  },
  watch : function(sync) {
    sync.on('change', function (change) {
      S.db.fiches.changeToParse++;
      console.log("Pouchdb.sync.change event",change,Date());// yo, something changed!
    }).on('paused', function (info) {
      // replication was paused, usually because of a lost connection or end of transmission
      console.log("Pouchdb.sync.paused event",info,Date());
      //We jsut receive data from server so wa are online
        if(S.vue.router.app.$children[0].$data.options.backColor !== S.config.header.backColor){
          //The header is display not as online
          console.log("Setting header color to online")
          S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColor;
        } else {
          //The header is display as online
          if(S.db.fiches.offlineTimeout){
            console.log("Clearing offline timeout")
            window.clearTimeout(S.db.fiches.offlineTimeout)
          }
          //We are changing the color if in the n second swe did'nt comme back here
          S.db.fiches.offlineTimeout = window.setTimeout("console.log('Setting header color to offline');S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColorOffline;",S.config.header.timeoutOffline*1000);
        }
        if(S.db.fiches.changeToParse>0 || S.vue.router.app.$children[0].$data.options.displayLoadingBar)
          S.db.fiches.parseSync(info);
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
      S.db.fiches.watch(S.db.localDB.sync(S.db.remoteDB, {
        live: true,
        retry: true
      })); //Reload Sync
    });
  },
  startSync : function() {
              console.log("Starting sync ...");
              S.db.fiches.watch(S.db.localDB.sync(S.db.remoteDB, {
                live: true,
                retry: true
              }));
              console.log("Sync in place !");
  },
  post : function(obj) { //Create
    return S.db.localDB.post(obj);
  },
  put : function(obj) { //Update or Create
    //TODO check-up
    obj.pathologys = S.tool.uniq(obj.pathologys); // Remove any duplicate
    return S.db.localDB.put(obj).catch(function (err) {
            console.log(err);
            if (err.status === 409) {
              // conflict! //TODO handle
            } else {
              // some other error
            }
        });
  },
  getByID : function(id) {
    var deferred = new $.Deferred()
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
      var deferred = new $.Deferred()
      S.db.fiches.getAll().then(function(result){
        result.my_fiches = S.db.fiches.filterMine(result.fiches);
        deferred.resolve(result);
      });
      return deferred.promise();
    },
  getAll : function() {
    var deferred = new $.Deferred()
    S.db.localDB.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
      // handle result
      var ret = {
          user : S.user._current,
          fiches: []
      }
      $.each(result.rows, function( index, value ) {
        if(value.doc["_id"].split("/")[0] === "_design" ){
          return; //If it's a design doc
        }
        ret.fiches[ret.fiches.length] = value.doc;
        value.doc.last_update = value.doc.events[value.doc.events.length -1].timestamp
        value.doc.last_update_since = moment(value.doc.last_update).fromNow();
        var d = moment(value.doc.patient.birthdate);
        value.doc.patient.age = moment().diff(d, 'years')
        value.doc.patient.age_formatted = d.fromNow(true)
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
  //TODO maybe use startkey for get all the team fiches?
  getMyCreationCount : function (){
    var deferred = new $.Deferred()

    S.db.localDB.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
      var count = 0;
      $.each(result.rows, function( index, value ) {
        if(value.doc["_id"].split("/")[0] == "_design" ){
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
  },
}
