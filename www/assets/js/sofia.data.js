'use strict';
var S = S || {};

S.data = {
    pages: {
        "fiche/:fiche_id": {
            options: {
                title: "Fiche",
                displayQuickAddButton : false,
                displaySearchbox: false
            },
            route: {
                data: function () {
                    var ret;
                    var deferred = new $.Deferred()
                    S.db.fiches.getByID(this.$route.params.fiche_id).then(function (doc) {
                      console.log(doc);
                      S.vue.router.app.$children[0].$data.options.title = doc.patient.firstname +" "+ doc.patient.lastname;
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
                          ],
                          origins : [
                              "Spontané",
                              "Brancardé",
                              "VPSP",
                              "Avec témoin",
                              "Avec sécurité",
                          ],
                          outputs : [
                              "Laissé sur place",
                              "Simple",
                              "Surveillance et sortie simple",
                              "Evacuation Sapeurs-Pompiers",
                              "Evacuation",
                          ]
                        }
                      };
                      deferred.resolve(ret);
                      if(!ret.fiche.origin || ret.fiche.origin === ""){ // L'ogine n'est pas saisie on force la saisie
                          S.tool.getDialog("#add-origin-dialog").showModal();
                      }
                      console.log("Fetching change for fiche in background ... ",ret.fiche, this)
                      S.db.fiches.getChanges(ret.fiche._id).then(function (changes) {
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
              changePrimaryAffection: function (event) {
                var primary = $(event.srcElement).val();
                var ask= (!S.config.local["ask-for"]["changePrimaryAffection-validation"] || confirm("Etes-vous sûr de selectionner "+primary+" ?"));
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.primaryAffection = primary;
                    S.db.fiches.put(this._data.fiche);
                }
              },
              addOrigin: function (event) {
                var origin = $(event.srcElement).text();
                S.tool.getDialog("#add-origin-dialog").close();
                var ask= (!S.config.local["ask-for"]["addOrigin-validation"] || confirm("Etes-vous sûr de selectionner "+origin+" ?"));
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.origin = origin;
                    S.db.fiches.put(this._data.fiche);
                }
              },
              showAddPathologyModal: function () {
                  S.tool.getDialog("#add-path-dialog").showModal();
              },
              closeAddPathologyModal: function () {
                  S.tool.getDialog("#add-path-dialog").close();
              },
              addPathology: function (event) {
                var path = $(event.srcElement).text();
                S.tool.getDialog("#add-path-dialog").close();
                var ask= !S.config.local["ask-for"]["addPathology-validation"] || confirm("Etes-vous sûr d'ajouter "+path+" ?");
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.pathologys.push(path);
                    S.db.fiches.put(this._data.fiche);
                }
               },
              reopen: function () {
                 var ask= !S.config.local["ask-for"]["reopen-validation"] || confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.closed = false;
                     this._data.fiche.close_context = {};
                     S.db.fiches.put(this._data.fiche);
                 }
               },
              closeCloseModal: function () {
                   S.tool.getDialog("#close-fiche-dialog").close();
              },
              submitClose: function () {
                S.tool.getDialog("#close-fiche-dialog").close();
                this._data.fiche.closed = true;
                var close_context = {};
                $.each($("#close-fiche-dialog form").serializeArray(), function(id,value){
                  close_context[value.name] = value.value;
                });
                this._data.fiche.close_context = close_context;

                S.db.fiches.put(this._data.fiche);
              },
              close: function () {
                  S.tool.getDialog("#close-fiche-dialog").showModal();
              },
              take: function () {
                 var ask= !S.config.local["ask-for"]["take-validation"] || confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.owner_id = S.user._current.name
                     S.db.fiches.put(this._data.fiche);
                 }
              },
              give: function () {
                /*
                S.db.users.getAll().then(function(userlist){
                  console.log(userlist);
                });
                */
                var team = prompt("Saisir une équipe :", "UserX");

                if (team != null) {
                  //TODO check exitance of team
                   var ask= !S.config.local["ask-for"]["give-validation"] || confirm("Etes-vous sûr de tranferer à "+team+" ?");
                   if(ask){
                       console.log(this._data.fiche);
                       this._data.fiche.owner_id = team;
                       S.db.fiches.put(this._data.fiche);
                   }
                }
              }
            }
        },
        add : {
                options: {
                    title: "Ajout",
                    displayQuickAddButton : false,
                    displaySearchbox: false
                },
                route: {
                      data: function () {
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
                            S.vue.router.app.$children[0].$data.options.title = ret.uid;
                          });

                          return deferred.promise();
                    }
                },
                methods: {
                  add: function () {
                    console.log(this._data);
                    //TODO don't make direct call

                    $("#add_form :input").attr("disabled", true);
                    S.db.fiches.post(
                      {
                             "uid": this._data.uid,
                             "owner_id": this._data.owner_id,
                             "patient": this._data.patient,
                             "closed" : false,
                             "close_context" : {},
                             "origin" : "",
                             "pathologys": [],
                             "events": []
                      }
                    ).then(function (response) {
                      //S.vue.router.go("/");
                      S.vue.router.go("/fiche/"+response.id);
                      console.log(response);
                      //TODO check for response.ok = true;
                      //response.id = 882c054fdbf6bbfcc1e429087500823c
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
              login: function () {
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
        configuration: {
            options : {
                title: "Configuration",
                displayQuickAddButton : false,
                displaySearchbox: false
            },
            route: {
              data: function () {
                  var ret = {
                    askFor : []
                  }
                  console.log(ret);
                  $.each(S.config.local["ask-for"],function(id,value){
                    ret.askFor.push({"id":id,"value":value,"lang":id});
                  });
                  console.log(ret);
                  return ret;
              }
            },
            methods: {
              update: function (event) {
                console.log(this,event,$(event.srcElement).attr("name"),$(event.srcElement).is(':checked'))
                S.config.local["ask-for"][$(event.srcElement).attr("name")] = $(event.srcElement).is(':checked');
                localStorage["sofia-local-config"] = JSON.stringify(S.config.local)
              }
            },
        },
        memo: {
            options : {
                title: "Mémo",
                displayQuickAddButton : false,
                displaySearchbox: false
            },
        },
        home: {
            options : {
                title: "Mes fiches", 
                titleInSearch: "Recherche"
            },
            route: {
              data: function () {
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
