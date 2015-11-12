'use strict';
var S = S || {};

S.vue = {
    el: {
        pages: {}
    },
    map: {},
    init: function () {
        S.vue.declare_filter();
        S.vue.declare_compoment();
        S.vue.parse_template();
        S.vue.init_menu();
        S.vue.init_router();

    },
    declare_compoment: function () {
        Vue.component('fiche', {
            // declare the props
            props: ['f'],
            // the prop can be used inside templates, and will also
            // be set as `this.f`
            template: S.template.fiche
        });
    },
    declare_filter: function () {
        /* Now using filterby with function
         Vue.filter('startsWith', function (value, input) {
         if (typeof value == "String") {
         return value.startsWith(input)
         } else {
         arr = toArray(value);
         if (input == null) {
         return arr
         }
         return value.startsWith(input)
         }
         })
         */
    },
    parse_template: function () {
        for (var i in S.template.pages) {
            S.vue.el.pages[i] = Vue.extend({
                props: ['searchbox'],
                template: S.template.page_wrapper(i, S.template.pages[i]),
                data: (S.data.pages[i]) ? S.data.pages[i].data || null : null, //We load data if set
                computed: S.data.pages[i] && S.data.pages[i].computed || null //We load computed part if set 
            });
            S.vue.map["/" + i] = {url: "/" + i, name: S.tool.capitalizeFirstLetter(i), component: S.vue.el.pages[i]};
        }
        //console.log(S.vue.map);
    },
    init_router: function () {
        S.vue.el.App = Vue.extend({
            data: {
                searchbox: ""
            }
        });
        S.vue.router = new VueRouter();
        S.vue.router.map(S.vue.map);
        S.vue.router.afterEach(function (transition) {
            console.log('Successfully navigated to: ' + transition.to.path, transition.to.path.slice(1));
            //* Use in the header of the menu
            if (S.tool.isMenuEntry(transition.to.path)) { // On change le titre dans le menu si c'est une entrée dans le menu (qui commence pas par _)
                var current = S.vue.map[transition.to.path].name;
                S.vue.el.menu.$set('current', current);
                $("head>title").text("SOFIA" + ((current && current != "") ? " - " + current : ""));
                //TODO afficher le nom de l'utilisteur dans le cas de fiche
                //console.log(S.vue.map[transition.to.path].name, S.vue.el.menu);
            }
            //*/
        });
        // Redirect certain routes to other routes
        S.vue.router.redirect({
            '/': '/inbox'
        })

        S.vue.router.start(S.vue.el.App, '.app');

        //TODO fix why the menu vue clear the v-link
        $("#menu a.mdl-navigation__link").each(function (id, el) {
            $(el).attr('v-link', $(el).attr('link'));
        });
    },
    init_menu: function () {
        //TODO choose if not use custom <menu> component
        //TODO link the title of the menu to the title of the page
        S.vue.el.menu = new Vue({
            el: '#menu',
            data: {current: "Inbox", links: S.vue.map},
            methods: {
                isMenuEntry: S.tool.isMenuEntry
            }
        });
        //*
        //*/
    }
};