/* global S */
define(['i18n!app/nls/base'],function(lang) {
   return {
      options : {
          displaySearchbox: true,
          displayQuickAddButton : true,
          title:  lang["my-sheets"].capitalize(),
          titleInSearch: lang["search"].capitalize()
      },
      route: {
        data: function () {
            if(S.user._current.isAdmin()) {
              S.vue.router.app.$children[0].$data.options.title = S.lang["overview-of-sheets"].capitalize();
            }
            return S.db.fiches.getAllWithMine()
        }
      },
      data: function() {
        return {
            fiches: [],
            my_fiches: []
        };
      }
    };
});
