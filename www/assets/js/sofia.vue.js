define(["jquery", "app/sofia.config", "app/sofia.tool"], function($,config,tool) {
  "use strict";
  var vue = {
      el: {
          pages: {}
      },
      map: {},
      init: function() {
          vue.declare_filter(), vue.declare_compoment(), vue.parse_template(), vue.init_menu(),
          vue.init_router();
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
              S.template.pages.hasOwnProperty(e) && (vue.el.pages[e] = vue.generate_page(e),
              vue.map["/" + e] = {
                  url: "/" + e,
                  name: (S.lang[e] || e).capitalize(),
                  component: vue.el.pages[e],
                  options: S.data.pages[e] && S.data.pages[e].options || {}
              });
          }
      },
      updateOptions: function(e) {
          if (e.options) {
              var t = e.options, a = vue.router.app.$data, n = a.headerOptions;
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
          var t = vue.map[e.to.fullPath];
          tool.isMenuEntry(e.to.path) && (// On change le titre dans le menu si c'est une entrée dans le menu (qui commence pas par _)
          vue.el.menu.$set("current", t.name), $("head>title").text("SOFIA" + (t.name && "" !== t.name ? " - " + t.name : ""))),
          vue.updateOptions(t), "function" == typeof S.platform.events.afterPageLoad && S.platform.events.afterPageLoad();
      },
      beforeEach: function(e) {
          console.log(S.user,config);
          "/_login" === e.to.path || S.user._current.isLogged() ? "/_login" === e.to.path && S.user._current.isLogged() ? //Case where we go back in history (we are already logged at the front door) so we abort
          e.abort() : e.next() : ("" !== config.user.username && "" !== config.user.userpass && //We have something to try !
          S.user.login(config.user.username, config.user.userpass, !0).fail(function(t) {
              switch (console.log(t), t.status) {
                case 401:
                  //Wrong cred
                  S.user.reset(), //We clear cache if their are bad
                  e.redirect("/_login");
                  break;

                case 500:
                  //Database didn't respond maybe we are offline we can go on it should be fine
                  S.user._current.wasLoggedIn() && (//Doing like we are logged in
                  S.user._current.restoreSession(), S.db.fiches.startSync(), vue.router.go("/"));
                  break;

                default:
                  //We redirect to login page
                  e.redirect("/_login");
              }
          }).then(function(e) {
              //We are logged
              console.log("Receiving the user : ", e), vue.router.go("/");
          }), e.redirect("/_login"));
      },
      init_router: function() {
          vue.el.App = Vue.extend({
              data: function() {
                  return {
                      searchbox: "",
                      headerOptions: {
                          title: "",
                          display: !0,
                          backColor: config.header.backColorOffline,
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
          }), vue.router = new VueRouter(), vue.router.map(vue.map), vue.router.beforeEach(vue.beforeEach),
          vue.router.afterEach(vue.afterEach), // Redirect certain routes to other routes (by default hom and if not logged redirect to login)
          vue.router.redirect({
              "/": "/home",
              "*": "/home"
          }), vue.router.start(vue.el.App, ".app"), //TODO fix why the menu vue clear the v-link
          $("#menu a.mdl-navigation__link").each(function(e, t) {
              $(t).attr("v-link", $(t).attr("link"));
          });
      },
      init_menu: function() {
          vue.el.menu = new Vue({
              el: "#menu",
              data: {
                  current: "Login",
                  links: vue.map
              },
              methods: {
                  isMenuEntry: tool.isMenuEntry
              }
          });
      }
  };
  return vue;
});
