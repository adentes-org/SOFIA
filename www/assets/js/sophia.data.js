'use strict';
var S = S || {};

S.data = {
    pages: {
        "fiche/:fiche_id": {
            options: {
                displaySearchbox: false
            },
            route: {
                data: function (transition) {
                      return S.db.fiches.getByID(this.$route.params.fiche_id);
                      //TODO catch
                }
            }
        },
        add : {
                options: {
                    displayQuickAddButton : false,
                    displaySearchbox: false
                },
                route: {
                      data: function (transition) {
                          var deferred = new $.Deferred()
                          var ret = {
                                 "uid": S.user._current.name+"-",
                                 "owner_id": S.user._current.name,
                                 "patient": {
                                     "firstname": "",
                                     "lastname" : "",
                                     "birthdate": "",
                                     "gender": ""
                                 },
                                 "pathologys": [],
                                 "events": []
                          }
                          S.db.fiches.getCount().then(function(count){
                            ret.uid += (count+1);
                            console.log(ret);
                            deferred.resolve(ret);
                          });
                          return deferred.promise();
                    }
                },
                methods: {
                  add: function (event) {
                    console.log(this._data);
                    //TODO don't make direct call

                    $("#add_form :input").attr("disabled", true);
                    S.db.post(
                      {
                             "uid": this._data.uid,
                             "owner_id": this._data.owner_id,
                             "patient": this._data.patient,
                             "pathologys": [],
                             "events": []
                      }
                    ).then(function (response) {
                      S.vue.router.go("/");
                      console.log(response);
                    }).catch(function (err) {
                      console.log(err);
                    });


                  }
                }
        },
        "_login" : {
            options : {
                displayQuickAddButton : false,
                displayHeader : false,
                displayMenu : false,
            },
            data: function() {
                //TODO clean only for testing purpose
                return {
                  username : "User11",
                  userpass : "3WWWWE"
                };
            },
            methods: {
              login: function (event) {
                //TODO check format of user and pass
                //TODO determine if not use lazy attribute to use less ressouces
                S.user.login(this.username, this.userpass).then(function(user){
                    console.log(user);
                    S.vue.router.go("/");
                })
                /*.catch(function(error){
                    //TODO handle errors
                });
                */
              }
            }
        },
        home: {
            route: {
              data: function (transition) {
                  return S.db.fiches.getAllWithMine()
                  //TODO catch
              }
            },
            data: function () {
              return {
                  fiches: [],
                  my_fiches: []
              };
            }
        }
    }
};
