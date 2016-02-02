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
      console.log("Trying to login : ", user,pass)
      //TODO don't use jquery promise
      var deferred = new $.Deferred();
      S.db.login(user, pass, function (err, response) {
        if (err) {
          console.log(err);
          deferred.reject(err);
          /*
          if (err.name === 'unauthorized') {
            // name or password incorrect
          } else {
            // cosmic rays, a meteor, etc.
            //TODO reload app
          }
          */
        }else{
          //We are logged in ?
          //console.log(response);
          if(response.ok) {
            $.extend(S.user._current, response);
            //console.log(S.user._current);
            deferred.resolve(response);
          }
        }
      });
      return deferred.promise();
    }
};
