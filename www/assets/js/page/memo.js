/* global S */
define(['i18n!app/nls/base'],function(lang) {
    return {
      options: {
          title: lang.memo.capitalize(),
          displayQuickAddButton: !1,
          displaySearchbox: !1
      },
      route: {
          data: function() {
              return S.db.config.getMemo();
          }
      }
    };
});
