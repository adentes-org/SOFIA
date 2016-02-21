'use strict';
var S = S || {};

S.user = {
    _current : {
        isLogged : function(){
            return (typeof S.user._current.name !== "undefined" && typeof S.user._current._id !== "undefined" && (S.user._current.name !== null || S.user._current.roles[0] === "_admin" ) ) ;
        }
    },
    login : function(user,pass,silent){
    console.log("Trying to login : ", user,pass,silent);
      if(typeof silent === "undefined"){
        silent = false;
      }
      return S.db.users.login(user,pass,silent);
    },
    set : function(user,pass){
      S.config.user = {
          username : user,
          userpass : pass
      };
      localStorage["sofia-user-config"] = JSON.stringify(S.config.user);
      $.extend(S.user._current, response);
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
