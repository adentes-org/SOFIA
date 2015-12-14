/* global S */
//var S = S || {}; //Keep it that way to throw a error if loaded to soon;
/* */
S.tool.loadStatic({
    base : "assets/platform/android/template/",
    files : {
        header : "header.tmpl",
        fiche : "fiche.tmpl",
        menu : "menu.tmpl",
        pages : {
            home : "pages/home.tmpl",
            _login : "pages/login.tmpl"
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
                '</div>';
    };
    //console.log(S.template);
    //TODO return requirejs
}).done(function(){
    S.template._isLoaded = true;
    //TODO 
});
/*
S.template.header = '';
S.template.fiche = '';
S.template.menu = '';
S.template.page_wrapper = function (id, page) {
    return '<div class="page-content" id="' + id + '">' + page() + '</div>';
};
S.template.pages.inbox =  '';
//S.template.pages["fiche/:fiche_id"] = function () {return 'TODO';};
S.template.buttons.quickAdd = '';
S.template.base = function () {
    return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">' +
            "\n"  + '<app-header v-bind:options="headerOptions" v-bind:searchbox.sync="searchbox"></app-header>' +
            "\n" + S.template.menu +
            "\n" + '<main class="mdl-layout__content">' + '<router-view  v-bind:searchbox="searchbox"></router-view>' + '</main>' +
            "\n" + S.template.buttons.quickAdd +
            '</div>';
};
*/
