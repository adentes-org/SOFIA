define([ "app/page/home", "app/page/login", "app/page/fiche", "app/page/add", "app/page/memo", "app/page/settings" ], function(e, p, a, g, i, s) {
    "use strict";
    var data = {
        pages: {
            "fiche/:fiche_id": a,
            add: g,
            _login: p,
            settings: s,
            memo: i,
            home: e
        }
    };
    return data;
});
