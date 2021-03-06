/* global S */
//var S = S || {}; //Keep it that way to throw a error if loaded to soon;
/* */
define([ "jquery" ], function(e) {
    var t = new e.Deferred();
    //TODO reject case;
    //TODO migrate to strandard promise
    return S.tool.loadStatic({
        base: "assets/platform/android/template/",
        //TODO compress template file and switch to dist
        files: {
            header: "header.tmpl",
            fiche: "fiche.tmpl",
            menu: "menu.tmpl",
            toast: "toast.tmpl",
            pages: {
                home: "pages/home.tmpl",
                add: "pages/add.tmpl",
                _login: "pages/login.tmpl",
                "fiche/:fiche_id": "pages/fiche.tmpl",
                settings: "pages/settings.tmpl",
                memo: "pages/memo.tmpl"
            },
            buttons: {
                quickAdd: "buttons/quickAdd.tmpl"
            }
        }
    }).then(function(t) {
        S.template = e.extend(!0, S.template, t), S.template.page_wrapper = function(e, t) {
            return '<div class="page-content" id="' + e + '">' + ("function" == typeof t ? t() : t) + "</div>";
        }, S.template.base = function() {
            return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">\n<app-header v-bind:options="headerOptions" v-bind:searchbox.sync="searchbox"></app-header>\n' + S.template.menu + '\n<main class="mdl-layout__content"><router-view  v-bind:searchbox="searchbox"></router-view></main>\n' + S.template.buttons.quickAdd + "\n" + S.template.toast + "</div>";
        };
    }).then(function() {
        S.template._isLoaded = !0, t.resolve(S.template);
    }), t.promise();
});