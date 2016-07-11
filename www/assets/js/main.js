  define(['jquery','i18n!app/nls/base', 'vue', 'vue-router', 'moment', 'moment-locales','app/sofia.tool','app/sofia.config','app/sofia.template','app/sofia.user','app/sofia.db','app/sofia.app','app/sofia.polyfill'], function ($,lang, Vue, VueRouter, moment,tool,config,template,user,db,app) {
      //Define primary object 
      var S = {
        lang : lang
        language : localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en',
        config : config,
        tool:tool,
        template:template,
        user:user,
        db:db,
        app:app
      };
      
      // Setup plugins
      Vue.use(VueRouter);
      moment.locale(S.language);
      
      //window.S = S; //TODO check if usefull
      window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety //TODO everythings is now ready

      //Apply theming
      //TODO This should be loaded by platform
      $("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog
      $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + cordova.platformId + '/css/style.css">');

      return S;
      //TODO HERE
      
      /*

      requirejs(['pouchdb-authentication', ], function () {
          requirejs(['platform/' + cordova.platformId + '/init', ], function () {
              requirejs(['app/sofia.vue', 'app/sofia.data', ], function () {
                  window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety
              });
          });
      });
      */
  });
