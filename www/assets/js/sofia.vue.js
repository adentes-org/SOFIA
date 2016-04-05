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
        //TODO maybe declare them directly in the App contructor ?
        Vue.component('fiche', {
            // declare the props
            props: ['f','u'],
            // the prop can be used inside templates, and will also
            // be set as `this.f`
            template: S.template.fiche
        });
        Vue.component('app-header', {
            props: ['options', "searchbox"],
            template: S.template.header,
            methods : {
              onHeaderClick: function () {
                this.$data.options.onHeaderClick();
              }
            },
            computed: {
              displayedTitle: function () {
                return ( this.options.titleInSearch !== "" && this.searchbox.length>0 ) ? this.options.titleInSearch : this.options.title;
              }
            }
        });
    },
    declare_filter: function () {
        Vue.filter('formatTime', function (value) {
          //return new Date(value).toLocaleString();
          var d = new Date(value);
          return "le "+d.toLocaleDateString().slice(0, -5)+" à "+d.toLocaleTimeString().slice(0, -3);
        })
    },
    parse_template: function () {
        for (var i in S.template.pages) {
            if(S.template.pages.hasOwnProperty(i)){
                S.vue.el.pages[i] = Vue.extend({
                    props: ['searchbox'],
                    template: S.template.page_wrapper(i, S.template.pages[i]),
                    data: (S.data.pages[i]) ? S.data.pages[i].data || null : null, //We load data if set
                    computed: S.data.pages[i] && S.data.pages[i].computed || null, //We load computed part if set
                    methods: S.data.pages[i] && S.data.pages[i].methods || null, //We load methods part if set
                    route: S.data.pages[i] && S.data.pages[i].route || null //We load route part if set
                });
                S.vue.map["/" + i] = {url: "/" + i, name: (S.lang[i] || i).capitalize(), component: S.vue.el.pages[i], options: (S.data.pages[i] && S.data.pages[i].options || {})};
/*
                if(S.vue.map["/" + i].options.title && S.lang[S.vue.map["/" + i].options.title]){
                  S.vue.map["/" + i].options.title = S.lang[S.vue.map["/" + i].options.title].capitalize();
                }
*/
            }
        }
        //console.log(S.vue.map);
    },
    init_router: function () {
        //TODO not use S.vue.el. since it only the constructor and not the real object in use.
        S.vue.el.App = Vue.extend({
            data: function () {
                return {
                    searchbox: "",
                    headerOptions: {
                        "title": "",
                        "display": true,
                        "displayLoadingBar" : false,
                        "displaySearchbox": true,
                        "onHeaderClick": null
                    },
                    quickAddButtonOptions: {
                        "display": true
                    },
                    MenuOptions: {
                        "display": true
                    }
                }
            }
        });
        S.vue.router = new VueRouter();
        S.vue.router.map(S.vue.map);
        S.vue.router.beforeEach(function (transition) {
          if (transition.to.path !== '/_login' && !S.user._current.isLogged()) {
            if(S.config.user.username !== "" && S.config.user.userpass !== "") {
              //We have something to try !
              S.user.login(S.config.user.username, S.config.user.userpass, true).fail(function(err){
                console.log(err)
                switch (err.status) {
                  case 401: //Wrong cred
                    S.user.reset(); //We clear cache if their are bad
                    transition.redirect("/_login")
                    break;
                  case 500: //Database didn't respond maybe we are offline we can go on it should be fine
                    if(S.user._current.wasLoggedIn()){
                      //Doing like we are logged in
                      S.user._current.restoreSession()
                      S.db.fiches.startSync();
                      S.vue.router.go("/");
                    }
                    break;
                  default:
                    //We redirect to login page
                    transition.redirect("/_login")
                }
              }).then(function(user){
                //We are logged
                console.log("Receiving the user : ",user);
                S.vue.router.go("/");
              });
            }
            /*
            */
            transition.redirect("/_login") //TODO backup url coming to redirect after
          } else if (transition.to.path === '/_login' && S.user._current.isLogged()) {
            //Case where we go back in history (we are already logged at the front door) so we abort
            //TODO redirect to remember page before log
            transition.abort()
          } else {
            transition.next()
          }
        })
        S.vue.router.afterEach(function (transition) {
            console.log('Successfully navigated to: ' + transition.to.path, transition.to.path.slice(1));
            //* Use in the header of the menu
            var current = S.vue.map[transition.to.fullPath];
            console.log(current);
            if (S.tool.isMenuEntry(transition.to.path)) { // On change le titre dans le menu si c'est une entrée dans le menu (qui commence pas par _)
                S.vue.el.menu.$set('current', current.name);
                $("head>title").text("SOFIA" + ((current.name && current.name !== "") ? " - " + current.name : ""));
                //TODO use a for each to redefine each custom options
            }
            //*
            if (current.options) {
                S.vue.router.app.$data.headerOptions.displaySearchbox = (typeof current.options.displaySearchbox === "boolean") ? current.options.displaySearchbox : true;
                S.vue.router.app.$data.headerOptions.display = (typeof current.options.displayHeader === "boolean") ? current.options.displayHeader : true;
                S.vue.router.app.$data.headerOptions.title = (typeof current.options.title === "string") ? current.options.title : "";
                S.vue.router.app.$data.headerOptions.titleInSearch = (typeof current.options.titleInSearch === "string") ? current.options.titleInSearch : ""; //We show nothing by default in searchmode
                S.vue.router.app.$data.headerOptions.onHeaderClick = (typeof current.options.onHeaderClick === "function") ? current.options.onHeaderClick : null;

                S.vue.router.app.$data.quickAddButtonOptions.display = (typeof current.options.displayQuickAddButton === "boolean") ? current.options.displayQuickAddButton : true;

                S.vue.router.app.$data.MenuOptions.display = (typeof current.options.displayMenu === "boolean") ? current.options.displayMenu : true;

            }

            if(typeof S.platform.events.afterPageLoad === "function"){
                S.platform.events.afterPageLoad();
            }
        });
        // Redirect certain routes to other routes (by default hom and if not logged redirect to login)
        S.vue.router.redirect({
            '/': '/home',
            '*': '/home'// redirect any not-found route to home
        })

        S.vue.router.start(S.vue.el.App, '.app');

        //TODO fix why the menu vue clear the v-link
        $("#menu a.mdl-navigation__link").each(function (id, el) {
            $(el).attr('v-link', $(el).attr('link'));
        });
    },
    init_menu: function () {
        //TODO choose if not use custom <menu> component
        S.vue.el.menu = new Vue({
            el: '#menu',
            data: {current: "Login", links: S.vue.map},
            methods: {
                isMenuEntry: S.tool.isMenuEntry
            }
        });
    }
};
