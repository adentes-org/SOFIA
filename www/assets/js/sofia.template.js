'use strict';
define([], function() {
    var base_template = {
        base: function () {
            return "Platform not supported !";
        },
        buttons: {
            quickAdd: ""
        },
        pages: {
            home: "",
            add : "",
            _login: "",
            memo: "{{{ memo }}}",
            "fiche/:fiche_id":  "{{ fiche | json }}",
            settings : "{{ S.config | json }}"
        },
        header: function () {},
        menu: function () {}
    };
    return base_template;
});
