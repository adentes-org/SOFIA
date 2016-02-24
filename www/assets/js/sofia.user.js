'use strict';
var S = S || {};

S.user = {
    _current : {
        restoreSession : function()  {
          var last = JSON.parse(localStorage["sofia-last-login"])
          console.log("Restoring previous session:"+last);
          
          $.extend(S.user._current, last.doc);
        },
        wasLoggedIn : function(){
          //S.config.db._full_url || S.db.remoteDB._db_name, S.config.user.username, S.config.user.userpass
          if(typeof localStorage["sofia-last-login"] !== "string"){
            return false; //No trace of login
          }

          var last = JSON.parse(localStorage["sofia-last-login"])

          if(last.db !== S.db.remoteDB._db_name){
            return false; //Not same remote DB
          }

          if(last.user.name !== S.config.user.username || last.user.pass !== S.config.user.userpass){
            return false; //Not same cred
          }

          var ThreeHourSooner = new Date();
          ThreeHourSooner.setHours(ThreeHourSooner.getHours() - 3);
          if(last.at < ThreeHourSooner){
            return false; //Not logged in since 3 Hours
          }

          return true; //All good

        },
        isLogged : function(){
            return (typeof S.user._current.name !== "undefined" && (S.user._current.name !== null || S.user._current.roles[0] === "_admin" ) ) ;
        }
    },
    login : function(user,pass,silent){
      console.log("Trying to login : ", user,pass,silent);
      if(typeof silent === "undefined"){
        silent = false;
      }
      return S.db.users.login(user,pass,silent).then(function(doc){
        //We are logged in
        localStorage["sofia-last-login"] = JSON.stringify({
            db :  S.db.remoteDB._db_name,
            user : {
              name : user,
              pass : pass
            },
            doc : doc,
            at :  new Date()
          });
        return doc;
      });
    },
    set : function(user,pass,doc){
      console.log("Setting user in memory", user, pass, doc);
      S.config.user = {
          username : user,
          userpass : pass
      };
      localStorage["sofia-user-config"] = JSON.stringify(S.config.user);
      if(typeof doc !== "undefined"){
        $.extend(S.user._current, doc);
      }
    },
    logout : function(){
      S.user._current.name !== null; //logout
      //TODO redirect to login
    },
    reset : function(){
      //S.config.user.username=""; // We don't reset in case the team really exist
      S.config.user.userpass="";
      delete localStorage['sofia-user-config'];
    }
};
