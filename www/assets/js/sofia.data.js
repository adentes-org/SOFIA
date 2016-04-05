/* global cordova */
'use strict';
var S = S || {};
requirejs(['app/page/home','app/page/fiche','app/page/settings'], function (pHome,pFiche,pSettings) {
  S.data = {
      pages: {
          "fiche/:fiche_id": pFiche,
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
                               "deleted": false,
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
              route: {
                data: function() {
                    return {
                      u : S.config.user,
                      db : S.config.db
                    };
                }
              },
              methods: {
                login: function () {
                  //TODO check format of user and pass
                  //TODO determine if not use lazy attribute to use less ressouces
                  S.user.login(this.u.username, this.u.userpass,false).then(function(user){
                      console.log("Receiving the user : ",user);
                      S.vue.router.go("/");
                  });
                  /*.catch(function(error){
                      //TODO handle errors
                  });
                  */
                },
                showConfigurationModal: function () {
                    S.tool.getDialog("#show-config-dialog").showModal();
                },
                closeConfigurationModal: function () {
                    this.db = S.config.db; //Reset
                    S.tool.getDialog("#show-config-dialog").close();
                },
                scanQRCode: function () {
                  var el = this;
                  cordova.plugins.barcodeScanner.scan(
                      function (result) {
                        console.log("We got a barcode\n" +
                              "Result: " + result.text + "\n" +
                              "Format: " + result.format + "\n" +
                              "Cancelled: " + result.cancelled);
                        if(!result.cancelled){
                          if(result.format !== "QR_CODE"){
                            alert("Format "+result.format+" incorrect !")
                          }else{
                            var tmp = result.text.split("/");
                            if(result.text.indexOf("@")> -1){ //We have a username
                              tmp[2] = tmp[2].split("@");
                              el.u.username = tmp[2].shift();
                              if(el.u.username.indexOf(":")> -1){ //We have a password
                                el.u.userpass = el.u.username.split(":")[1]
                                el.u.username = el.u.username.split(":")[0]
                              }
                              tmp[2] = tmp[2].join("");
                            }
                            el.db.name = tmp.pop()
                            el.db.url = tmp.join('/')
                            //TODO updt config
                          }
                        }
                      },
                      function (error) {
                          alert("Scanning failed: " + error);
                      }
                   );
                },
                updtConfiguration: function () {
                    S.db.setUrl(this.db)
                    S.tool.getDialog("#show-config-dialog").close();
                }
              }
          },
          settings: pSettings,
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
          home: pHome
      }
  };
});
