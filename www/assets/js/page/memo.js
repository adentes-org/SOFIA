/* global S */

define(['i18n!app/nls/base'],function(lang) {
  return {
    options : {
        title: lang["memo"].capitalize(),
        displayQuickAddButton : false,
        displaySearchbox: false
    },
    route: {
      data: function () {
          return S.db.config.getMemo()
      }
    },
  }
})
