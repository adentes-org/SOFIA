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
            props: ['f','u','l'],
            // the prop can be used inside templates, and will also be set as `this.f`
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
                return ( this.options.displaySearchbox && typeof this.options.titleInSearch !== "undefined" && this.options.titleInSearch !== "" && this.searchbox.length>0 ) ? this.options.titleInSearch : this.options.title;
              }
            }
        });
    },
    declare_filter: function () {
        Vue.filter('formatTime', function (value) {
          var d = new Date(value);
          return S.lang['the']+" "+d.toLocaleDateString().slice(0, -5)+" "+S.lang['at']+" "+d.toLocaleTimeString().slice(0, -3);
        })
    },
    generate_page: function (id) {
        return Vue.extend(
            $.extend({ //Base object that is merge with  S.data.pages[i]
                    props: ['searchbox'],
                    template: S.template.page_wrapper(id, S.template.pages[id]),
                    data: null,
                    computed:  null,
                    methods: null,
                    route: null
            }, S.data.pages[id])
        );
    },
    parse_template: function () {
        for (var i in S.template.pages) {
            if(S.template.pages.hasOwnProperty(i)){
                S.vue.el.pages[i] = S.vue.generate_page(i);
                S.vue.map["/" + i] = {url: "/" + i, name: (S.lang[i] || i).capitalize(), component: S.vue.el.pages[i], options: (S.data.pages[i] && S.data.pages[i].options || {})};
            }
        }
    },
    updateOptions: function (current) {
        if (current.options) {
            var cOptions = current.options;
            var appData = S.vue.router.app.$data
            var headerOptions = appData.headerOptions;
            /*
            headerOptions.displaySearchbox = (typeof cOptions.displaySearchbox === "boolean") ? cOptions.displaySearchbox : true;
            headerOptions.display = (typeof cOptions.displayHeader === "boolean") ? cOptions.displayHeader : true;
            headerOptions.title = (typeof cOptions.title === "string") ? cOptions.title : "";
            headerOptions.titleInSearch = (typeof cOptions.titleInSearch === "string") ? cOptions.titleInSearch : ""; //We show nothing by default in searchmode
            headerOptions.onHeaderClick = (typeof cOptions.onHeaderClick === "function") ? cOptions.onHeaderClick : null;
            */
            $.extend(headerOptions, {
              displaySearchbox : cOptions.displaySearchbox,
              display : cOptions.displayHeader,
              title : cOptions.title,
              titleInSearch : cOptions.titleInSearch,
              onHeaderClick : cOptions.onHeaderClick,
            });

            appData.quickAddButtonOptions.display = (typeof cOptions.displayQuickAddButton === "boolean") ? cOptions.displayQuickAddButton : true;
            appData.MenuOptions.display = (typeof cOptions.displayMenu === "boolean") ? cOptions.displayMenu : true;
        }
    },
    afterEach: function (transition) {
            console.log('Successfully navigated to: ' + transition.to.path, transition.to.path.slice(1));
            //* Use in the header of the menu
            var current = S.vue.map[transition.to.fullPath];
            if (S.tool.isMenuEntry(transition.to.path)) { // On change le titre dans le menu si c'est une entrée dans le menu (qui commence pas par _)
                S.vue.el.menu.$set('current', current.name);
                $("head>title").text("SOFIA" + ((current.name && current.name !== "") ? " - " + current.name : ""));
            }

            S.vue.updateOptions(current)

            if(typeof S.platform.events.afterPageLoad === "function"){
                S.platform.events.afterPageLoad();
            }
    },
    beforeEach: function (transition) {
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
            transition.redirect("/_login") //TODO backup url coming to redirect after
          } else if (transition.to.path === '/_login' && S.user._current.isLogged()) {
            //Case where we go back in history (we are already logged at the front door) so we abort
            transition.abort()
          } else {
            transition.next()
          }
    },
    init_router: function () {
        S.vue.el.App = Vue.extend({
            data: function () {
                return {
                    searchbox: "",
                    headerOptions: {
                        "title": "",
                        "display": true,
                        "backColor"  : S.config.header.backColorOffline, /* @Start of offline */
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
        S.vue.router.beforeEach(S.vue.beforeEach)
        S.vue.router.afterEach(S.vue.afterEach);
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
        S.vue.el.menu = new Vue({
            el: '#menu',
            data: {current: "Login", links: S.vue.map},
            methods: {
                isMenuEntry: S.tool.isMenuEntry
            }
        });
    }
};
