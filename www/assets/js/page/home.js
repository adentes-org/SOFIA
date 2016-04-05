define({
    options : {
        title:  S.lang["my-sheets"].capitalize(),
        titleInSearch: S.lang["search"].capitalize()
    },
    route: {
      data: function () {
          return S.db.fiches.getAllWithMine()
      }
    },
    data: function () {
      return {
          fiches: [],
          my_fiches: []
      };
    }
})
