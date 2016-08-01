/* global S */
define({
    options: {
        displaySearchbox: !0,
        displayQuickAddButton: !0,
        title: S.lang["my-sheets"].capitalize(),
        titleInSearch: S.lang.search.capitalize()
    },
    route: {
        data: function() {
            return S.user._current.isAdmin() && (S.vue.router.app.$children[0].$data.options.title = S.lang["overview-of-sheets"].capitalize()), 
            S.db.fiches.getAllWithMine();
        }
    },
    data: function() {
        return {
            fiches: [],
            my_fiches: []
        };
    }
});