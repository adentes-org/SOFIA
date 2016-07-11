  define(['jquery','i18n!app/nls/base', 'vue', 'vue-router', 'moment', 'moment-locales','app/sofia.polyfill'], function ($,lang, Vue, VueRouter, moment) {
      
      var S = {
        lang : lang
        language : localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en'
      };
      
      // Setup plugins
      Vue.use(VueRouter);
      moment.locale(S.language);
      
      $("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog
      //$("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/objectdiff/style.css">'); //Load style for diff

      requirejs(['pouchdb-authentication', 'app/sofia.tool', 'app/sofia.template', 'app/sofia.config'], function () {
          $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + cordova.platformId + '/css/style.css">');
          requirejs(['platform/' + cordova.platformId + '/init', 'app/sofia.db'], function () {
              requirejs(['app/sofia.vue', 'app/sofia.data', 'app/sofia.user', 'app/sofia.app'], function () {
                  window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety
              });
          });
      });
  });
