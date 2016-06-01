define({
    options: {
        title: "",
        displayQuickAddButton : false,
        displaySearchbox: false,
        onHeaderClick : function(){S.tool.getDialog("#update-fiche-information-dialog").showModal()}
    },
    route: {
        data: function () {
            var ret;
            var deferred = new $.Deferred()
            var ficheId = this.$route.params.fiche_id;
            S.db.config.getUsers().then(function(userlist){
              console.log(userlist);
            //S.db.config.getUsers().then(function(userlist){              console.log(userlist);
              S.db.fiches.getByID(ficheId).then(function (doc) {
                console.log(doc);
                S.vue.router.app.$children[0].$data.options.title = doc.patient.firstname +" "+ doc.patient.lastname;
                ret = {
                  fiche:doc,
                  user:S.user._current,
                  history: [],
                  config : S.config.fiche,
                  lang : S.lang,
                  users : userlist
                };
                console.log(ret);
                deferred.resolve(ret);
                if(!ret.fiche.origin || ret.fiche.origin === ""){ // L'ogine n'est pas saisie on force la saisie
                    S.tool.getDialog("#add-origin-dialog").showModal();
                }
                /*
                console.log("Fetching change for fiche in background ... ",ret.fiche, this)
                S.db.fiches.getChanges(ret.fiche._id).then(function (changes) {
                  console.log(changes)
                  ret.history.push("Done ("+changes.results.length+"/"+changes.last_seq+")");
                  console.log(ret);
                }).catch(function (err) {
                  console.log(err);
                });
                */
              });

            })
            return deferred.promise();
        }
    },
    computed: {
      _patient_age: function () {
        return moment(this.fiche.patient.birthdate).fromNow(true)
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
            $.extend(true,data.fiche, doc) //Reset to what is in localDB
          });
      },
      changeInformation: function () {
        var ask= (!S.config.local["ask-for"]["changeInformation-validation"] || confirm(S.lang["ask-confirm"]+" ?")); //TODO replace with navigator.notification.confirm
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
        var newPrimaryID = $(event.srcElement).val();
        var oldPrimary = S.lang.fiche.pathologys[this._data.fiche.primaryAffection] || this._data.fiche.primaryAffection;
        var newPrimary = S.lang.fiche.pathologys[newPrimaryID] || newPrimaryID;
        var ask= (!S.config.local["ask-for"]["changePrimaryAffection-validation"] || confirm(S.lang["ask-confirm-choice"]+""+newPrimary+" ?"));  //TODO replace with navigator.notification.confirm
        if(ask){
            console.log(this._data.fiche);
            this._data.fiche.events.push({
              type : "action",
              action : "changePrimaryAffection",
              message : S.user._current.name+" "+S.lang.log["change-primary"]+" <b>"+oldPrimary+"</b> "+S.lang["to"]+" <b>"+newPrimary+"</b>",
              timestamp : Date.now(),
              user :  S.user._current.name
            })
            this._data.fiche.primaryAffection = newPrimaryID;
            S.db.fiches.put(this._data.fiche);
        }
      },
      addOrigin: function (event) {
        var origin = $(event.srcElement).text();
        var originId = $.trim($(event.srcElement).attr("data-id"));
        S.tool.getDialog("#add-origin-dialog").close();
        var ask= (!S.config.local["ask-for"]["addOrigin-validation"] || confirm(S.lang["ask-confirm-choice"]+" : "+origin+" ?"));
        if(ask){
            console.log(this._data.fiche);
            this._data.fiche.events.push({
              type : "action",
              action : "addOrigin",
              message : S.user._current.name+" "+S.lang.log['set-origin']+" : <b>"+origin+"</b>",
              timestamp : Date.now(),
              user :  S.user._current.name
            })
            this._data.fiche.origin = originId;
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
        var el = $(event.srcElement);
        if(! el.is(".mdl-list__item-primary-content")){ //Find the content if it is the li that trigger
          el = el.find(".mdl-list__item-primary-content");
        }
        var path = $.trim(el.text());
        var pathId = $.trim(el.attr("data-id"));
        S.tool.getDialog("#add-path-dialog").close();
        var ask= !S.config.local["ask-for"]["addPathology-validation"] || confirm("Etes-vous sûr d'ajouter "+path+" ?");
        if(ask){
            console.log(this._data.fiche);
            this._data.fiche.events.push({
              type : "action",
              action : "addPathology",
              message : S.user._current.name+" "+S.lang.log["add-path"]+" : <b>"+path+"</b>",
              timestamp : Date.now(),
              user :  S.user._current.name
            })
            if(this._data.fiche.pathologys.length === 0){
               this._data.fiche.primaryAffection = pathId; // By default we use the first added patho
            }
            this._data.fiche.pathologys.push(pathId);
            S.db.fiches.put(this._data.fiche);

            //Update ui if needed by interface
            if(typeof S.platform.events.afterPageLoad === "function"){
                S.platform.events.afterPageLoad();
            }

        }
       },
      reopen: function () {
         var ask= !S.config.local["ask-for"]["reopen-validation"] || confirm(S.lang["ask-confirm"]+" ?");
         if(ask){
             console.log(this._data.fiche);
             this._data.fiche.events.push({
               type : "action",
               action : "reopen",
               message : S.user._current.name+" "+S.lang.log["reopen-fiche"]+".",
               timestamp : Date.now(),
               user :  S.user._current.name
             })
             this._data.fiche.closed = false;
             this._data.fiche.close_context = {};
             S.db.fiches.put(this._data.fiche);
         }
       },
      undelete: function () {
        if(S.user._current.isAdmin()){
          //We are admin
          var ask= !S.config.local["ask-for"]["delete-validation"] || confirm("Etes-vous sûr d'annuler la suppression de la fiche ?");
          if(ask){
            this._data.fiche.deleted = false;
            this._data.fiche.events.push({
              type : "action",
              action : "undelete",
              message : S.user._current.name+" "+S.lang.log["cancel-del"]+".",
              timestamp : Date.now(),
              user :  S.user._current.name
            })
            S.db.fiches.put(this._data.fiche);
          }
        }else{
          //Else we do nothing
        }
      },
      delete: function () {
        if(S.user._current.isAdmin()){
          //We are admin
          var ask= !S.config.local["ask-for"]["delete-validation"] || confirm("Etes-vous sûr de supprimer la fiche ?");
          if(ask){
            this._data.fiche.deleted = true;
            this._data.fiche.events.push({
              type : "action",
              action : "delete",
              message : S.user._current.name+" "+S.lang.log["del-fiche"]+".",
              timestamp : Date.now(),
              user :  S.user._current.name
            })
            S.db.fiches.put(this._data.fiche);
          }
        }else{
          //Else we do nothing
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
          message : S.user._current.name+" "+S.lang.log["close-fiche"]+".",
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
         var ask= !S.config.local["ask-for"]["take-validation"] || confirm(S.lang["ask-confirm"]+" ?");
         if(ask){
             console.log(this._data.fiche);
             this._data.fiche.events.push({
               type : "action",
               action : "take",
               message : S.user._current.name+" "+S.lang.log["take-fiche-from"]+" "+this._data.fiche.owner_id,
               timestamp : Date.now(),
               user :  S.user._current.name
             })
             this._data.fiche.owner_id = S.user._current.name
             S.db.fiches.put(this._data.fiche);
         }
      },
      setGiveForm : function(event){
        this._data.fiche.owner_id = $.trim($(event.srcElement).text());
      },
      giveTicket : function(){
      var fiche = this._data.fiche;
       var ask= !S.config.local["ask-for"]["give-validation"] || confirm("Etes-vous sûr de tranferer à "+fiche.owner_id+" ?");
         S.db.fiches.getByID(this.$route.params.fiche_id).then(function (old) {
           if(ask){ //We have consent or it's auto-validate by config
               console.log(fiche);
               fiche.events.push({
                 type : "action",
                 action : "take",
                 message : S.user._current.name+" "+S.lang.log["give-fiche-to"]+" "+ fiche.owner_id +" ("+S.lang.log["old-prop"]+" : "+old.owner_id+")",
                 timestamp : Date.now(),
                 user :  S.user._current.name
               })
               S.db.fiches.put(fiche);
            }else{
              $.extend(true,fiche, old) //Reset to what is in localDB
            }
            S.tool.getDialog("#give-ticket-dialog").close();
       });
      },
      cancelGiveForm : function(){
        var data = this._data
        S.db.fiches.getByID(this.$route.params.fiche_id).then(function (doc) {
          $.extend(true,data.fiche, doc) //Reset to what is in localDB
        });
        S.tool.getDialog("#give-ticket-dialog").close()
      },
      showGiveModal: function () {
        S.tool.getDialog("#give-ticket-dialog").showModal();
      }
    }
})