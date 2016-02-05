'use strict';
var S = S || {};

//TODO paginataion
var req_limit = 1000000;
//TODO disable for live
PouchDB.debug.enable('*');

S.config.db._full_url = S.config.db.url.replace(/\/+$/, '')+"/"+S.config.db.name.replace(/^\/+/, '')
//S.config.db._user_url = S.config.db.url.replace(/\/+$/, '')+"/"+"_users"

//TODO use a local that replcaite to S.config.db._full_url for offline function
S.db = new PouchDB(S.config.db._full_url, {skipSetup: true});
//S.db_users = new PouchDB(S.config.db._user_url, {skipSetup: true});

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
  getByID : function(id) {
    var deferred = new $.Deferred()
    S.db.get(id).then(function (doc) {
      console.log(doc);
      deferred.resolve(doc);
    }).catch(function (err) {
      // handle err
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise();

  },
  getMine : function() {
    var deferred = new $.Deferred()
    //TODO don't use query too slow no local calc
    //TODO use the loogeged id
    S.db.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
      // handle result
      var ret = {
          fiches: []
      }
      $.each(result.rows, function( index, value ) {
        if(value.doc.owner_id === S.user._current.name)
          ret.fiches[ret.fiches.length] = value.doc;
      });
      //console.log(ret);
      deferred.resolve(ret);
    }).catch(function (err) {
      // handle err
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise();


  },
  getAllWithMine : function() {
      var deferred = new $.Deferred()
      //TODO don't use query too slow no local calc
      //TODO use the loogeged id
      S.db.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
        // handle result
        var ret = {
            fiches: [],
            my_fiches: []
        }
        $.each(result.rows, function( index, value ) {
          ret.fiches[ret.fiches.length] = value.doc;
          if(value.doc.owner_id === S.user._current.name)
            ret.my_fiches[ret.my_fiches.length] = value.doc;
        });
        console.log(ret);
        deferred.resolve(ret);
      }).catch(function (err) {
        // handle err
        console.log(err);
        deferred.reject(err);
      });

      return deferred.promise();


    },
  getAll : function() {
    //TODO manage paginataion
    //S.db.allDocs({skip:0,limit:100000});
    var deferred = new $.Deferred()
    //deferred.reject("No network !");
    //deferred.resolve(response.userCtx);
    S.db.allDocs({include_docs: true,skip:0,limit:req_limit}).then(function (result) {
      // handle result

      var ret = {
          fiches: []
      }
      $.each(result.rows, function( index, value ) {
        ret.fiches[ret.fiches.length] = value.doc;
      });
      deferred.resolve(ret);
    }).catch(function (err) {
      // handle err
      console.log(err);
      deferred.reject(err);
    });

    return deferred.promise();

  },
  //TODO use startkey for get all the team fiches?

  //TODO maybe use the count of the team
  getCount : function (){
    var deferred = new $.Deferred()
    S.db.info().then(function (result) {
      // handle result
      deferred.resolve(result.doc_count);
    }).catch(function (err) {
      console.log(err);
      deferred.reject(err);
    });
    return deferred.promise();
  }
}
console.log(S.db);
