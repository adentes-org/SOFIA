'use strict';
var S = S || {};

S.user = {
    _current : {
        isLogged : function(){
            return (typeof S.user._current.name != "undefined" && (S.user._current.name != null || S.user._current.roles[0] === "_admin" ) ) ;
            //TODO rellogin if not based on registred value
            /*
            //TODO don't use jquery promise ?
            var deferred = new $.Deferred()
            db.getSession(function (err, response) {
              if (err) {
                // network error
                deferred.reject("No network !");
              } else if (!response.userCtx.name) {
                // nobody's logged in
                deferred.reject("Not logged !");
              } else {
                // response.userCtx.name is the current user
                deferred.resolve(response.userCtx);
              }
            });
            return deferred.promise();
            */
        }
    },
    login : function(user,pass){
      //TODO
      console.log("Trying to login : ", user,pass);
      return S.db.users.login(user,pass);
    }
};
