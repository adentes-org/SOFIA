  define(['jquery','i18n!app/nls/base', 'vue', 'vue-router', 'moment', 'moment-locales','app/sofia.tool','app/sofia.config','app/sofia.user','app/sofia.db', 'app/sofia.data','platform/' + cordova.platformId + '/init','app/sofia.app','app/sofia.polyfill',], function ($,lang, Vue, VueRouter, moment,tool,config,user,db,data,platform,app) {
      //Define primary object 
      var S = {
        lang : lang
        language : localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en',
        config : config,
        tool:tool,
        template:platform.template,
        user:user,
        db:db,
        data: data, //TODO rename data to page
        platform:platform
        app:app
      };
      
      // Setup plugins
      Vue.use(VueRouter);
      moment.locale(S.language);
      
      //Setup DB
      db.setUrl(config.db); //TODO check usefullnes of that
      
      //window.S = S; //TODO check if usefull
      window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety //TODO everythings is now ready

      //Apply theming
      //This should is loaded by platform
      //$("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog
      //$("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + cordova.platformId + '/css/style.css">');

      return S;
      //TODO HERE
      
      /*
              requirejs(['app/sofia.vue', ], function () {
                  window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety
              });
      */
  });
