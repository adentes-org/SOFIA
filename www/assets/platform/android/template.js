/* global S */
//var S = S || {}; //Keep it that way to throw a error if loaded to soon;
S.template.header = '<header class="mdl-layout__header">\n\
                        <div class="mdl-layout__header-row">\n\
                            <div class="mdl-layout-spacer"></div>\n\
                                <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">\n\
                                    <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">\n\
                                        <i class="material-icons">search</i>\n\
                                    </label>\n\
                                    <div class="mdl-textfield__expandable-holder">\n\
                                    <input class="mdl-textfield__input" type="text" name="searchbox" v-model="searchbox" id="fixed-header-drawer-exp" />\n\
                                </div>\n\
                            </div>\n\
                        </div>\n\
                     </header>';
        S.template.fiche = '\
            <section class="section--center mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--12-col-phone mdl-shadow--2dp"> \n\
                <a class="fiche patient" href="#!/fiche/{{f.id}}">\n\
                    <div class="mdl-card" > \n\
                        <div class="mdl-card__title"> \n\
                            <h4>{{ f.patient.firstname }} {{ f.patient.lastname }}</h4>\n\
                        </div> \n\
                        <div class="mdl-card__supporting-text">\n\
                            <span class="gender">{{f.patient.gender}}</span> <span class="birthdate">{{f.patient.birthdate}}</span> \
                            <br>\n\
                            <span>{{f.pathologys | json}}<span>\n\
                        </div> \n\
                    </div>\n\
                </a>\n\
            </section>';
        /*
         S.template.card = function (title, content, media, actions) {
         //TODO ôptimize generation
         return '<section class="section--center mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--12-col-phone mdl-shadow--2dp"> \n\
         <div class="mdl-card"> \n\
         <div class="mdl-card__title"> \n\
         <h4>' + title + '</h4>\n\
         </div> \n\
         <!-- <div class="mdl-card__media">...</div> -->\n\
         <div class="mdl-card__supporting-text">' + content + '</div> \n\
         <!-- <div class="mdl-card__actions"> ... </div> -->\n\
         </div>\n\
         </section>';
         };
         */
        S.template.menu =
        '<div class="mdl-layout__drawer" id="menu">\n\
            <span class="mdl-layout-title" id="menu-title">Sophia - {{current}}</span>\n\
            <nav class="mdl-navigation">\n\
                <template v-for="link in links | filterBy isMenuEntry">\n\
                    <a class="mdl-navigation__link" link="{path : \'{{link.url}}\'}" >{{ link.name }}</a>\n\
                </template>\n\
            </nav>\n\
        </div>';
        S.template.page_wrapper = function (id, page) {
        return '<div class="page-content" id="' + id + '">' + page() + '</div>';
        };
        S.template.pages.inbox = function () {
        return '<div class="mdl-grid">\n\
                <template v-for="fiche in fiches  | filterBy searchbox" >\n\
                    <fiche v-bind:f="fiche"></fiche>\n\
                </template>\n\
            </div>';
        };
        //S.template.pages["fiche/:fiche_id"] = function () {return 'TODO';};
        S.template.buttons.quickAdd = '<button class="quick-add mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">\n\
                                        <i class="material-icons">add</i>\n\
                                    </button>';
        S.template.base = function () {
        return '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">' +
                "\n" + S.template.header +
                "\n" + S.template.menu +
                "\n" + '<main class="mdl-layout__content">' + '<router-view  v-bind:searchbox="searchbox"></router-view>' + '</main>' +
                "\n" + S.template.buttons.quickAdd +
                '</div>';
        };