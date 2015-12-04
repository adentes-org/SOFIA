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
        inbox: "",
        configuration: "Default configuration template",
        "fiche/:fiche_id":  "{{ fiche | json }}"
    },
    header: function () {},
    menu: function () {}
};