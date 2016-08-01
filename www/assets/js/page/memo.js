/* global S */
define({
    options: {
        title: S.lang.memo.capitalize(),
        displayQuickAddButton: !1,
        displaySearchbox: !1
    },
    route: {
        data: function() {
            return S.db.config.getMemo();
        }
    }
});