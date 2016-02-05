'use strict';
var S = S || {};

S.data = {
    pages: {
        "fiche/:fiche_id": {
            options: {
                displayQuickAddButton : false,
                displaySearchbox: false
            },
            route: {
                data: function (transition) {
                    var ret;
                    var deferred = new $.Deferred()
                    S.db.fiches.getByID(this.$route.params.fiche_id).then(function (doc) {
                      console.log(doc);
                      ret = {
                        fiche:doc,
                        user:S.user._current,
                        history: [], //TODO (Will be build after because not at first and require data)
                        config : {
                          pathologys : [
                            "Inconscient",
                            "Arret Cardio Respiratoire",
                            "Petit soin",
                            "Hémorragie",
                            "Difficulté respiratoire",
                            "Malaise",
                            "Traumatologie",
                            "Consultation médicale",
                          ]
                        }
                      };
                      deferred.resolve(ret);

                      console.log("Fetching change for fiche in background ... ",ret.fiche, this)
                      S.db.changes({
                        since: 0,
                        include_docs: true,
                        style: 'all_docs', limit: 100,
                        doc_ids: [ret.fiche._id]
                      }).then(function (changes) {
                        console.log(changes)
                        ret.history.push("Done ("+changes.results.length+"/"+changes.last_seq+")");
                        console.log(ret);
                      }).catch(function (err) {
                        console.log(err);
                      });


                    })

                    return deferred.promise();
                }
            },
            methods: {
              showAddPathologyModal: function (event) {
                  var dialog = document.querySelector('dialog');
                  if (! dialog.showModal) {
                        dialogPolyfill.registerDialog(dialog);
                  }
                  dialog.showModal();
              },
              addPathology: function (event) {
                //TODO use list
                var dialog = document.querySelector('dialog');
                if (! dialog.close) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.close();
                var path = $(event.srcElement).text();
                var ask=confirm("Etes-vous sûr d'ajouter "+path+" ?");
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.pathologys.push(path);
                    S.db.put(this._data.fiche);
                }

                /*
                var path = prompt("Saisir une affection :", "Coupure");

                if (path != null) {
                  //TODO check exitance of team
                   var ask=confirm("Etes-vous sûr d'ajouter "+path+" ?");
                   if(ask){
                       console.log(this._data.fiche);
                       this._data.fiche.pathologys.push(path);
                       S.db.put(this._data.fiche);
                   }
                }*/
               },
              reopen: function (event) {
                 var ask=confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.closed = false;
                     S.db.put(this._data.fiche);
                 }
               },
              close: function (event) {
                 var ask=confirm("Etes-vous sûr ?");
                 //TODO ask for closing information
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.closed = true;
                     S.db.put(this._data.fiche);
                 }
               },
              take: function (event) {
                 var ask=confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.owner_id = S.user._current.name
                     S.db.put(this._data.fiche);
                 }
              },
              give: function (event) {
                /*
                S.db.users.getAll().then(function(userlist){
                  console.log(userlist);
                });
                */
                var team = prompt("Saisir une équipe :", "UserX");

                if (team != null) {
                  //TODO check exitance of team
                   var ask=confirm("Etes-vous sûr de tranferer à "+team+" ?");
                   if(ask){
                       console.log(this._data.fiche);
                       this._data.fiche.owner_id = team;
                       S.db.put(this._data.fiche);
                   }
                }
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
                             "closed" : false,
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
