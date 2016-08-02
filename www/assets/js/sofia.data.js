define([ "app/page/home", "app/page/login", "app/page/fiche", "app/page/add", "app/page/memo", "app/page/settings" ], function(home, login, fiche, add, memo, settings) {
    "use strict";
    var data = {
        pages: {
            _login: login,
            "fiche/:fiche_id": fiche,
            add: add,
            settings: settings,
            memo: memo,
            home: home
        }
    };
    return data;
});
