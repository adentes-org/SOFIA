'use strict';
var S = S || {};

S.template = {
    base: function () {
        return "Platform not supported !";
    },
    buttons: {
        quickAdd: function () {}
    },
    pages: {
        inbox: function () {},
        configuration: function () {
            return "Default configuration template";
        },
        "fiche/:fiche_id": function () {
            return "{{ fiche | json }}";
        }
    },
    header: function () {},
    menu: function () {}
};