"use strict";
define(['jquery','i18n!app/nls/base', 'vue', 'vue-router', 'moment',
          'app/sofia.tool','app/sofia.config','app/sofia.user','app/sofia.db', 'app/sofia.data',
            'platform/' + cordova.platformId + '/init','app/sofia.vue','app/sofia.app','app/sofia.polyfill','moment-locales'],
            function ($,lang, Vue, VueRouter, moment,
                tool,config,user,db,data,platform,vue,app) {
      //Define primary object
      S = {
        lang : lang,
        language : localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en', //TODO use language allready pass to requirejs

        config : config,
        tool:tool,
        user:user,
        db:db,
        data: data, //TODO rename data to page or at least expose or regroup in data
        platform:platform,
        template:platform.template,
        vue:vue,
        app:app
      };
      console.log(S,'platform/' + cordova.platformId + '/init');

      // Setup plugins
      Vue.use(VueRouter);
      moment.locale(S.language);

      //Setup DB
      db.setUrl(config.db); //TODO check usefullnes of that

      window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety //TODO everythings is now ready

      //Apply theming
      //This should is loaded by platform
      //$("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog
      //$("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + cordova.platformId + '/css/style.css">');

      return S;
      //TODO HERE

      /*
              requirejs([, ], function () {
                  window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety
              });
      */
  });
