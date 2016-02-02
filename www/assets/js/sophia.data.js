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
            },
            methods: {
              /*
              updateFiche: function () {
                return S.db.fiches.getAll().catch(function (err) {
                  // handle err
                  console.log(err);
                  alert("Une erreur est survenue lors de la récupération des fiches")
                });
              }
              */
            }
        }
    }
};
