define({
    options : {
        title: S.lang["memo"].capitalize(),
        displayQuickAddButton : false,
        displaySearchbox: false
    },
    route: {
      data: function () {
          return S.db.config.getMemo()
      }
    },
})
