/* global Vue, VueRouter, $ */
"use strict";

var S = S || {};

S.vue = {
    el: {
        pages: {}
    },
    map: {},
    init: function() {
        S.vue.declare_filter(), S.vue.declare_compoment(), S.vue.parse_template(), S.vue.init_menu(), 
        S.vue.init_router();
    },
    declare_compoment: function() {
        Vue.component("fiche", {
            // declare the props
            props: [ "f", "u", "l" ],
            // the prop can be used inside templates, and will also be set as `this.f`
            template: S.template.fiche
        }), Vue.component("app-header", {
            props: [ "options", "searchbox" ],
            template: S.template.header,
            methods: {
                onHeaderClick: function() {
                    this.$data.options.onHeaderClick();
                }
            },
            computed: {
                displayedTitle: function() {
                    return this.options.displaySearchbox && "undefined" != typeof this.options.titleInSearch && "" !== this.options.titleInSearch && this.searchbox.length > 0 ? this.options.titleInSearch : this.options.title;
                }
            }
        });
    },
    declare_filter: function() {
        Vue.filter("formatTime", function(e) {
            var t = new Date(e);
            return S.lang.the + " " + t.toLocaleDateString().slice(0, -5) + " " + S.lang.at + " " + t.toLocaleTimeString().slice(0, -3);
        });
    },
    generate_page: function(e) {
        return Vue.extend($.extend({
            //Base object that is merge with  S.data.pages[i]
            props: [ "searchbox" ],
            template: S.template.page_wrapper(e, S.template.pages[e]),
            data: null,
            computed: null,
            methods: null,
            route: null
        }, S.data.pages[e]));
    },
    parse_template: function() {
        for (var e in S.template.pages) {
            S.template.pages.hasOwnProperty(e) && (S.vue.el.pages[e] = S.vue.generate_page(e), 
            S.vue.map["/" + e] = {
                url: "/" + e,
                name: (S.lang[e] || e).capitalize(),
                component: S.vue.el.pages[e],
                options: S.data.pages[e] && S.data.pages[e].options || {}
            });
        }
    },
    updateOptions: function(e) {
        if (e.options) {
            var t = e.options, a = S.vue.router.app.$data, n = a.headerOptions;
            /*
            headerOptions.displaySearchbox = (typeof cOptions.displaySearchbox === "boolean") ? cOptions.displaySearchbox : true;
            headerOptions.display = (typeof cOptions.displayHeader === "boolean") ? cOptions.displayHeader : true;
            headerOptions.title = (typeof cOptions.title === "string") ? cOptions.title : "";
            headerOptions.titleInSearch = (typeof cOptions.titleInSearch === "string") ? cOptions.titleInSearch : ""; //We show nothing by default in searchmode
            headerOptions.onHeaderClick = (typeof cOptions.onHeaderClick === "function") ? cOptions.onHeaderClick : null;
            */
            $.extend(n, {
                displaySearchbox: t.displaySearchbox,
                display: t.displayHeader,
                title: t.title,
                titleInSearch: t.titleInSearch,
                onHeaderClick: t.onHeaderClick
            }), a.quickAddButtonOptions.display = "boolean" != typeof t.displayQuickAddButton || t.displayQuickAddButton, 
            a.MenuOptions.display = "boolean" != typeof t.displayMenu || t.displayMenu;
        }
    },
    afterEach: function(e) {
        console.log("Successfully navigated to: " + e.to.path, e.to.path.slice(1));
        //* Use in the header of the menu
        var t = S.vue.map[e.to.fullPath];
        S.tool.isMenuEntry(e.to.path) && (// On change le titre dans le menu si c'est une entrée dans le menu (qui commence pas par _)
        S.vue.el.menu.$set("current", t.name), $("head>title").text("SOFIA" + (t.name && "" !== t.name ? " - " + t.name : ""))), 
        S.vue.updateOptions(t), "function" == typeof S.platform.events.afterPageLoad && S.platform.events.afterPageLoad();
    },
    beforeEach: function(e) {
        "/_login" === e.to.path || S.user._current.isLogged() ? "/_login" === e.to.path && S.user._current.isLogged() ? //Case where we go back in history (we are already logged at the front door) so we abort
        e.abort() : e.next() : ("" !== S.config.user.username && "" !== S.config.user.userpass && //We have something to try !
        S.user.login(S.config.user.username, S.config.user.userpass, !0).fail(function(t) {
            switch (console.log(t), t.status) {
              case 401:
                //Wrong cred
                S.user.reset(), //We clear cache if their are bad
                e.redirect("/_login");
                break;

              case 500:
                //Database didn't respond maybe we are offline we can go on it should be fine
                S.user._current.wasLoggedIn() && (//Doing like we are logged in
                S.user._current.restoreSession(), S.db.fiches.startSync(), S.vue.router.go("/"));
                break;

              default:
                //We redirect to login page
                e.redirect("/_login");
            }
        }).then(function(e) {
            //We are logged
            console.log("Receiving the user : ", e), S.vue.router.go("/");
        }), e.redirect("/_login"));
    },
    init_router: function() {
        S.vue.el.App = Vue.extend({
            data: function() {
                return {
                    searchbox: "",
                    headerOptions: {
                        title: "",
                        display: !0,
                        backColor: S.config.header.backColorOffline,
                        /* @Start of offline */
                        displayLoadingBar: !1,
                        displaySearchbox: !0,
                        onHeaderClick: null
                    },
                    quickAddButtonOptions: {
                        display: !0
                    },
                    MenuOptions: {
                        display: !0
                    }
                };
            }
        }), S.vue.router = new VueRouter(), S.vue.router.map(S.vue.map), S.vue.router.beforeEach(S.vue.beforeEach), 
        S.vue.router.afterEach(S.vue.afterEach), // Redirect certain routes to other routes (by default hom and if not logged redirect to login)
        S.vue.router.redirect({
            "/": "/home",
            "*": "/home"
        }), S.vue.router.start(S.vue.el.App, ".app"), //TODO fix why the menu vue clear the v-link
        $("#menu a.mdl-navigation__link").each(function(e, t) {
            $(t).attr("v-link", $(t).attr("link"));
        });
    },
    init_menu: function() {
        S.vue.el.menu = new Vue({
            el: "#menu",
            data: {
                current: "Login",
                links: S.vue.map
            },
            methods: {
                isMenuEntry: S.tool.isMenuEntry
            }
        });
    }
};