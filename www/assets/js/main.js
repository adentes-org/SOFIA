/* globals define, requirejs, cordova */
/* exported S */
define(["cordova", "jquery", "i18n!app/nls/base", "vue", "vue-router", "moment", "app/sofia.tool", "app/sofia.config", "app/sofia.user", "app/sofia.db", "app/sofia.data", "app/sofia.vue", "app/sofia.app", "app/sofia.polyfill", "moment-locales" ], function(cordova, $, lang, Vue, VueRouter, moment, tool, config, user, db, data, vue, app) {
    "use strict";


    var locale = lang._current;
    // Setup plugins
    Vue.use(VueRouter);
    moment.locale(locale);

    //Define primary object
    var S = {
      lang: lang,
      language: locale,
      config: config,
      //tool: tool,
      user: user,
      db: db,
      data: data,//contains pages
      //platform: platform,
      //template: platform.template,
      vue: vue,
      app: app
    };

    console.log(S);
    //Setup DB
    db.setUrl(config.db);//TODO check usefullnes of that

    require(["platform/" + cordova.platformId + "/init"], function(platform){
        S.platform = platform;
        S.template = platform.template; //TODO use directly platform
        window.setTimeout(S.app.initialize, 250);
        // Add time if all not already loaded for safety //TODO everythings is now ready
    });
    window.Vue = Vue; //TODO remove
    window.VueRouter = VueRouter; //TODO remove
    window.S = S; //TODO remove
    return S;
});
