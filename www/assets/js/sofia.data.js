'use strict';
var S = S || {};

S.data = {
    pages: {
        "fiche/:fiche_id": {
            options: {
                title: "Fiche",
                displayQuickAddButton : false,
                displaySearchbox: false,
                onHeaderClick : function(){S.tool.getDialog("#update-fiche-information-dialog").showModal()}
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
              showUpdateInformation: function () {
                  S.tool.getDialog("#update-fiche-information-dialog").showModal();
              },
              closeUpdateInformation: function () {
                  var data = this._data
                  S.tool.getDialog("#update-fiche-information-dialog").close();
                  S.db.fiches.getByID(this.$route.params.fiche_id).then(function (doc) {
                    //Reset to what is in localDB
                    $.extend(true,data.fiche, doc) //TODO maybe cache the init value ?
                  });
              },
              changeInformation: function (event) {
                var ask= (!S.config.local["ask-for"]["changeInformation-validation"] || confirm("Etes-vous sûr ?"));
                if(ask){
                  console.log(this._data.fiche);
                  this._data.fiche.events.push({
                    type : "action",
                    action : "changeInformation",
                    message : S.user._current.name+" a mis à jour les informations : {TODO}", //TODO make diff between in DB and in Vue object
                    timestamp : Date.now(),
                    user :  S.user._current.name
                  })
                  //Update this._data.fiche with additionnal data from data or update them
                  //$.extend(true, this._data.fiche, data); //TODO be more strict on wath can be edited
                  //DATA is already updated by vue in live
                  S.vue.router.app.$children[0].$data.options.title = this._data.fiche.patient.firstname +" "+ this._data.fiche.patient.lastname;
                  S.tool.getDialog("#update-fiche-information-dialog").close();

                  S.db.fiches.put(this._data.fiche);//Saving
                }
              },
              changePrimaryAffection: function (event) {
                var primary = $(event.srcElement).val();
                var ask= (!S.config.local["ask-for"]["changePrimaryAffection-validation"] || confirm("Etes-vous sûr de selectionner "+primary+" ?"));
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.events.push({
                      type : "action",
                      action : "changePrimaryAffection",
                      message : S.user._current.name+" change l'affection principale de <b>"+this._data.fiche.primaryAffection+"</b> à <b>"+primary+"</b>",
                      timestamp : Date.now(),
                      user :  S.user._current.name
                    })
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
                    this._data.fiche.events.push({
                      type : "action",
                      action : "addOrigin",
                      message : S.user._current.name+" définit l'origine à <b>"+origin+"</b>",
                      timestamp : Date.now(),
                      user :  S.user._current.name
                    })
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
                //TODO check if already exist and display it
                var path = $.trim($(event.srcElement).text());
                S.tool.getDialog("#add-path-dialog").close();
                var ask= !S.config.local["ask-for"]["addPathology-validation"] || confirm("Etes-vous sûr d'ajouter "+path+" ?");
                if(ask){
                    console.log(this._data.fiche);
                    this._data.fiche.events.push({
                      type : "action",
                      action : "addPathology",
                      message : S.user._current.name+" ajoute l'affection : <b>"+path+"</b>",
                      timestamp : Date.now(),
                      user :  S.user._current.name
                    })
                    if(this._data.fiche.pathologys.length == 0){
                       this._data.fiche.primaryAffection = path; // By default we use the first added patho
                    }
                    this._data.fiche.pathologys.push(path);
                    S.db.fiches.put(this._data.fiche);

                    //Update ui if needed by interface
                    if(typeof S.platform.events.afterPageLoad === "function"){
                        S.platform.events.afterPageLoad();
                    }

                }
               },
              reopen: function () {
                 var ask= !S.config.local["ask-for"]["reopen-validation"] || confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.events.push({
                       type : "action",
                       action : "reopen",
                       message : S.user._current.name+" ré-ouvre la fiche.",
                       timestamp : Date.now(),
                       user :  S.user._current.name
                     })
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
                this._data.fiche.events.push({
                  type : "action",
                  action : "close",
                  message : S.user._current.name+" ferme la fiche.",
                  close_context : this._data.fiche.close_context,
                  timestamp : Date.now(),
                  user :  S.user._current.name
                })

                S.db.fiches.put(this._data.fiche);
              },
              close: function () {
                  S.tool.getDialog("#close-fiche-dialog").showModal();
              },
              take: function () {
                 var ask= !S.config.local["ask-for"]["take-validation"] || confirm("Etes-vous sûr ?");
                 if(ask){
                     console.log(this._data.fiche);
                     this._data.fiche.events.push({
                       type : "action",
                       action : "take",
                       message : S.user._current.name+" prend la fiche à "+this._data.fiche.owner_id,
                       timestamp : Date.now(),
                       user :  S.user._current.name
                     })
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
                       this._data.fiche.events.push({
                         type : "action",
                         action : "take",
                         message : S.user._current.name+" donne la fiche à "+ team +"(ancien propriétaire : "+this._data.fiche.owner_id+")",
                         timestamp : Date.now(),
                         user :  S.user._current.name
                       })
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
                          S.db.fiches.getMyCreationCount().then(function(count){
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
                             "primaryAffection": "",
                             "pathologys": [],
                             "events": [{
                               type : "action",
                               action : "creation",
                               message : S.user._current.name+" crée la fiche.",
                               timestamp : Date.now(),
                               user :  S.user._current.name
                             }]
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
                return {
                  username : "",
                  userpass : ""
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
            route: {
              data: function () {
                  return S.db.config.getMemo()
              }
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
