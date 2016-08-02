/* global S */


define([ "jquery", 'app/sofia.tool','app/sofia.template'], function($,tool,templateBase) {
    //TODO reject case;
    //TODO migrate to strandard promise
    return tool.loadStatic({
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
    }).then(function(template) {
        var template = $.extend(true, templateBase, template);

        template.page_wrapper = function(id, page) {
            return '<div class="page-content" id="' + id + '">' + ((typeof page === "function")?page():page)   + '</div>';
        };
        template.base = function () {
            return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">' +
                    "\n"  + '<app-header v-bind:options="headerOptions" v-bind:searchbox.sync="searchbox"></app-header>' +
                    "\n" + template.menu +
                    "\n" + '<main class="mdl-layout__content">' + '<router-view  v-bind:searchbox="searchbox"></router-view>' + '</main>' +
                    "\n" + template.buttons.quickAdd +
                    "\n" + template.toast +
                    '</div>';
        };
        return template;
    }).then(function(template) {
        template._isLoaded = true;
        return template;
    });
});
