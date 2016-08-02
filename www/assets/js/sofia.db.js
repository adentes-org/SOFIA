
define(["jquery","pouchdb","pouchdb-authentication", "app/sofia.config", "app/sofia.db-fiche"], function($,PouchDB,PouchDBAuth,config,dbFiche) {
  "use strict";
  /**** DEBUG ****/
  //Disabled for live
  PouchDB.debug.enable('*');
  //PouchDB.debug.disable();
  PouchDB.plugin(PouchDBAuth);

  var db = {
      setUrl: function(e) {
          console.log(config);
          config.db = e; //TODO check
          localStorage["sofia-server-config"] = JSON.stringify(config.db);
          config.db._full_url = config.db.url.replace(/\/+$/, "") + "/" + config.db.name.replace(/^\/+/, "");
          config.db._local_url = "local-" + config.db._full_url.replace(/:/gi, "").replace(/\/+/gi, "#");

          db.localDB = new PouchDB(config.db._local_url); // Use the full url in case same db on other domain could lead to corruption //TODO maybe clean it if exist ?
          db.remoteDB = new PouchDB(config.db._full_url, {
              skipSetup: true
          });
      },
      clearLocal: function() {
          return db.localDB.destroy();
      },
  };
  //db.setUrl(config.db); //TODO load somewher else
  db.config = {
      getUsers: function() {
          var e = new $.Deferred();
          return db.localDB.get("_design/sofia-config").then(function(o) {
              console.log(e.resolve(o.users || []));
          }).catch(function(e) {
              console.log(e);
          }), e.promise();
      },
      getMemo: function() {
          var e = new $.Deferred();
          return db.localDB.getAttachment("_design/sofia-config", "memo.html").then(function(o) {
              // handle result
              var n = new FileReader();
              n.onload = function() {
                  e.resolve({
                      memo: n.result
                  });
              }, n.readAsText(o);
          }).catch(function(e) {
              console.log(e);
          }), e.promise();
      }
  };
  db.users = {
      login: function(e, o, n) {
          //TODO don't use jquery promise
          var t = new $.Deferred();
          return db.remoteDB.login(e, o, function(i, c) {
              i ? (console.log(i), n || alert(i.message), t.reject(i)) : c.ok && (//We are logged in
              console.log("We are logged in !", c), S.user.set(e, o, c), db.fiches.startSync(),
              t.resolve(c));
          }), t.promise();
      }
  };
  db.fiches = dbFiche;
  return db;
});
