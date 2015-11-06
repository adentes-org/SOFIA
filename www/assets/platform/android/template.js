/* global S */

//var S = S || {}; //Keep it that way to throw a error if loaded to soon;

S.template.header = function () {
    return ' ' +
            '<header class="mdl-layout__header">' +
            '<div class="mdl-layout__header-row">' +
            '<div class="mdl-layout-spacer"></div>' +
            '<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">' +
            '<label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">' +
            '<i class="material-icons">search</i>' +
            '</label>' +
            '<div class="mdl-textfield__expandable-holder">' +
            '<input class="mdl-textfield__input" type="text" name="searchbox" id="fixed-header-drawer-exp" />' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</header>' +
            ' ';
};

S.template.menu = function () {
    return '<div class="mdl-layout__drawer" id="menu">' +
            '<span class="mdl-layout-title" id="menu-title">Sophia - {{current}}</span>' +
            '<nav class="mdl-navigation">\n\
                <template v-for="(path, link) in links">\n\
                    <a class="mdl-navigation__link" link="{path : \'{{path}}\'}" >{{ link.name }}</a>\n\
                </template>' +
            '</nav>' +
           '</div>';
};

S.template.page_wrapper = function (id, page) {
    return '<div class="page-content" id="' + id + '">' + page() + '</div>';
};

S.template.pages.inbox = function () {
    return '<ul>\n\
                <li v-for="fiche in fiches">\n\
                     {{ fiche.id }}\n\
                </li>\n\
            </ul>';
};

S.template.buttons.quickAdd = function () {
    return ' ' +
            '<button class="quick-add mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">' +
            '<i class="material-icons">add</i>' +
            '</button>' +
            ' ';
};

S.template.base = function () {
    return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">' +
            "\n" + S.template.header() +
            "\n" + S.template.menu() +
            "\n" + '<main class="mdl-layout__content">' + "<router-view></router-view>" + '</main>' +
            "\n" + S.template.buttons.quickAdd() +
            '</div>';
};