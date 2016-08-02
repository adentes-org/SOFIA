define(["jquery", "app/sofia.config"], function($,config) {
  "use strict";
  var user = {
      _current: {
          restoreSession: function() {
              var e = JSON.parse(localStorage["sofia-last-login"]);
              console.log("Restoring previous session:" + e), $.extend(user._current, e.doc);
          },
          wasLoggedIn: function() {
              //config.db._full_url || S.db.remoteDB._db_name, config.user.username, config.user.userpass
              if ("string" != typeof localStorage["sofia-last-login"]) {
                  return !1;
              }
              var e = JSON.parse(localStorage["sofia-last-login"]);
              if (e.db !== S.db.remoteDB._db_name) {
                  return !1;
              }
              if (e.user.name !== config.user.username || e.user.pass !== config.user.userpass) {
                  return !1;
              }
              var r = new Date();
              return r.setHours(r.getHours() - 3), !(e.at < r);
          },
          isLogged: function() {
              return "undefined" != typeof user._current.name && (null !== user._current.name || "_admin" === user._current.roles[0]);
          },
          isAdmin: function() {
              //console.log("isAdmin ? ", user._current.isLogged && ($.inArray("_admin", user._current.roles)!==-1 || $.inArray("sofia-admin", user._current.roles)!==-1));
              return user._current.isLogged && ($.inArray("_admin", user._current.roles) !== -1 || $.inArray("sofia-admin", user._current.roles) !== -1);
          }
      },
      login: function(e, r, n) {
          return console.log("Trying to login : ", e, r, n), "undefined" == typeof n && (n = !1),
          S.db.users.login(e, r, n).then(function(n) {
              //We are logged in
              return localStorage["sofia-last-login"] = JSON.stringify({
                  db: S.db.remoteDB._db_name,
                  user: {
                      name: e,
                      pass: r
                  },
                  doc: n,
                  at: new Date()
              }), n;
          });
      },
      set: function(e, r, n) {
          console.log("Setting user in memory", e, r, n), config.user = {
              username: e,
              userpass: r
          }, localStorage["sofia-user-config"] = JSON.stringify(config.user), "undefined" != typeof n && $.extend(user._current, n),
          null === user._current.name && (user._current.name = config.user.username);
      },
      /*
      logout : function(){
        user._current.name !== null; //logout
        //TODO redirect to login
      },
      */
      reset: function() {
          //config.user.username=""; // We don't reset in case the team really exist
          config.user.userpass = "", delete localStorage["sofia-user-config"];
      }
  };
  return user;
});
