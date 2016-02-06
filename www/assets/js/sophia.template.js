'use strict';
var S = S || {};

S.template = {
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
        memo: "<div class='mdl-shadow--4dp' style='width: 96%;margin: 20px 2%;padding: 1px;text-align: center;'><h3>Informations</h3></div>",
        "fiche/:fiche_id":  "{{ fiche | json }}"
    },
    header: function () {},
    menu: function () {}
};
