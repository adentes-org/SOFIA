/* global S */
//var S = S || {}; //Keep it that way to throw a error if loaded to soon;
/* */
define(['jquery'], function($) {
    var deferred = new $.Deferred(); //TODO migrate to strandard promise
    S.tool.loadStatic({
        base : "assets/platform/android/template/",
        files : {
            header : "header.tmpl",
            fiche : "fiche.tmpl",
            menu : "menu.tmpl",
            toast : "toast.tmpl",
            pages : {
                home : "pages/home.tmpl",
                add  : "pages/add.tmpl",
                _login : "pages/login.tmpl",
                "fiche/:fiche_id":  "pages/fiche.tmpl",
                settings : "pages/settings.tmpl",
                memo: "pages/memo.tmpl",
            },
            buttons : {
                quickAdd : "buttons/quickAdd.tmpl"
            }
        }
    }).then(function(data){
        S.template = $.extend(true, S.template, data);
        S.template.page_wrapper = function (id, page) {
            return '<div class="page-content" id="' + id + '">' + ((typeof page === "function")?page():page)   + '</div>';
        };
        S.template.base = function () {
            return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">' +
                    "\n"  + '<app-header v-bind:options="headerOptions" v-bind:searchbox.sync="searchbox"></app-header>' +
                    "\n" + S.template.menu +
                    "\n" + '<main class="mdl-layout__content">' + '<router-view  v-bind:searchbox="searchbox"></router-view>' + '</main>' +
                    "\n" + S.template.buttons.quickAdd +
                    "\n" + S.template.toast +
                    '</div>';
        };
        //console.log(S.template);
        //TODO return requirejs
    }).then(function(){
        S.template._isLoaded = true;
        deferred.resolve(S.template);
    });
    //TODO reject case;
    return deferred.promise();
});
