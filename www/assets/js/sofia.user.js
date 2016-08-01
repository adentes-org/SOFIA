/* global $ */
"use strict";

var S = S || {};

S.user = {
    _current: {
        restoreSession: function() {
            var e = JSON.parse(localStorage["sofia-last-login"]);
            console.log("Restoring previous session:" + e), $.extend(S.user._current, e.doc);
        },
        wasLoggedIn: function() {
            //S.config.db._full_url || S.db.remoteDB._db_name, S.config.user.username, S.config.user.userpass
            if ("string" != typeof localStorage["sofia-last-login"]) {
                return !1;
            }
            var e = JSON.parse(localStorage["sofia-last-login"]);
            if (e.db !== S.db.remoteDB._db_name) {
                return !1;
            }
            if (e.user.name !== S.config.user.username || e.user.pass !== S.config.user.userpass) {
                return !1;
            }
            var r = new Date();
            return r.setHours(r.getHours() - 3), !(e.at < r);
        },
        isLogged: function() {
            return "undefined" != typeof S.user._current.name && (null !== S.user._current.name || "_admin" === S.user._current.roles[0]);
        },
        isAdmin: function() {
            //console.log("isAdmin ? ", S.user._current.isLogged && ($.inArray("_admin", S.user._current.roles)!==-1 || $.inArray("sofia-admin", S.user._current.roles)!==-1));
            return S.user._current.isLogged && ($.inArray("_admin", S.user._current.roles) !== -1 || $.inArray("sofia-admin", S.user._current.roles) !== -1);
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
        console.log("Setting user in memory", e, r, n), S.config.user = {
            username: e,
            userpass: r
        }, localStorage["sofia-user-config"] = JSON.stringify(S.config.user), "undefined" != typeof n && $.extend(S.user._current, n), 
        null === S.user._current.name && (S.user._current.name = S.config.user.username);
    },
    /*
    logout : function(){
      S.user._current.name !== null; //logout
      //TODO redirect to login
    },
    */
    reset: function() {
        //S.config.user.username=""; // We don't reset in case the team really exist
        S.config.user.userpass = "", delete localStorage["sofia-user-config"];
    }
};