define({
    options : {
        title: S.lang["settings"].capitalize(),
        displayQuickAddButton : false,
        displaySearchbox: false
    },
    route: {
      data: function () {
          var ret = {
            user : S.user._current,
            lang : S.lang,
            askFor : []
          }
          $.each(S.config.local["ask-for"],function(id,value){
            ret.askFor.push({"id":id,"value":value,"lang":S.lang.config[id] || id});
          });
          return ret;
      }
    },
    methods: {
      update: function (event) {
        console.log(this,event,$(event.srcElement).attr("name"),$(event.srcElement).is(':checked'))
        S.config.local["ask-for"][$(event.srcElement).attr("name")] = $(event.srcElement).is(':checked');
        localStorage["sofia-local-config"] = JSON.stringify(S.config.local)
      },
      resetCredConfig: function(){
        S.user.reset();
        window.location.reload();
      },
      resetServerConfig: function(){
        delete localStorage['sofia-server-config'];
        window.location.reload();
      },
      showLangModal : function() {
        S.tool.getDialog("#choose-lang-dialog").showModal();
      },
      changeLanguage: function (event) {
        var lang = $.trim($(event.srcElement).attr("data-id"));
        localStorage["sofia-language"] = lang;
        console.log($(event.srcElement),$(event.srcElement).attr("data-id"), lang,localStorage["sofia-language"]);
        S.tool.getDialog("#choose-lang-dialog").close();
        //Reload app
        window.location.reload();
      }
    },
});
