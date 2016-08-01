/* global S */
define(['i18n!app/nls/base'],function(lang) {
    return {
      options: {
          title: lang.settings.capitalize(),
          displayQuickAddButton: !1,
          displaySearchbox: !1
      },
      route: {
          data: function() {
              var o = {
                  user: S.user._current,
                  lang: lang,
                  askFor: []
              };
              return $.each(S.config.local["ask-for"], function(a, e) {
                  o.askFor.push({
                      id: a,
                      value: e,
                      lang: lang.config[a] || a
                  });
              }), o;
          }
      },
      methods: {
          update: function(o) {
              console.log(this, o, $(o.srcElement).attr("name"), $(o.srcElement).is(":checked")),
              S.config.local["ask-for"][$(o.srcElement).attr("name")] = $(o.srcElement).is(":checked"),
              localStorage["sofia-local-config"] = JSON.stringify(S.config.local);
          },
          resetCredConfig: function() {
              S.user.reset(), window.location.reload();
          },
          resetServerConfig: function() {
              delete localStorage["sofia-server-config"], window.location.reload();
          },
          showLangModal: function() {
              S.tool.getDialog("#choose-lang-dialog").showModal();
          },
          changeLanguage: function(o) {
              localStorage["sofia-language"] = $.trim($(o.srcElement).attr("data-id")), S.tool.getDialog("#choose-lang-dialog").close(),
              window.location.reload();
          },
          clearLocalDB: function() {
              S.db.clearLocal().then(function() {
                  window.location.reload();
              }).catch(function(o) {
                  console.log(o), window.location.reload();
              });
          }
      }
    };
});
