define({
        options: {
            title: S.lang["add"].capitalize(),
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
                         "events": [],
                         "lang" : S.lang
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
});
