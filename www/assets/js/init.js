/* global requirejs */
'use strict';
/*
 * Init the app dependency with requirejs
 */
/* global requirejs */
var S = S || {};
var language = localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en';

requirejs.config({
    baseUrl: 'dist',
    paths: {
        app: 'js',
        platform: 'platform',
        lib: 'lib',
        cordova: '../cordova',
        jquery: 'lib/jquery/jquery.min',
        pouchdb: 'lib/pouchdb/pouchdb.min',
        "pouchdb-authentication": 'lib/pouchdb-authentication/pouchdb.authentication.min',
        vue: 'lib/vue/vue.min',
        "vue-router": 'lib/vue-router/vue-router.min',
        /* "vue-i18n": 'lib/vue-i18n-plugin/vue-i18n.min', */
        /* "vue-format": "lib/vue-format/vue-format", */
        promise: 'lib/requirejs-promise/requirejs-promise',
        "dialog-polyfill": 'lib/dialog-polyfill/dialog-polyfill',
        i18n: 'lib/requirejs-i18n/i18n',
        moment: 'lib/moment/moment.min',
        "moment-locales": 'lib/moment/locales.min'
                /*
                 browser: 'platform/browser',
                 android: 'platform/android',
                 ios: 'platform/ios'
                 */
    },
    shim: {
        cordova: {
            exports: 'cordova'
        },
        jquery: {
            exports: '$'
        },
        pouchdb: {
            exports: 'PouchDB'
        }
    },
    config: {
        //Set the config for the i18n
        //module ID
        i18n: {
            locale: language
        }
    }
});
//var base = ;
//base.unshift();
S.init = function(cordova){
  requirejs(['jquery','i18n!app/nls/base', 'vue', 'vue-router', 'pouchdb', "dialog-polyfill", 'moment', 'moment-locales', 'app/sofia.polyfill'], function ($,lang, Vue, VueRouter, PouchDB, dialogPolyfill, moment) {
       // Set plugin
      Vue.use(VueRouter);
      window.PouchDB = PouchDB; //Force PouchDB to DOM
      window.Vue = Vue; //Force Vue to DOM
      window.VueRouter = VueRouter; //Force VueRouter to DOM
      moment.locale(language);
      window.moment = moment; //Force moment to DOM
      S.lang = lang; //Setup lang

      window.dialogPolyfill = dialogPolyfill; //Force dialogPolyfill to DOM
      $("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog

      requirejs(['pouchdb-authentication', 'app/sofia.tool', 'app/sofia.template', 'app/sofia.config'], function () {
          $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + cordova.platformId + '/css/style.css">');
          requirejs(['platform/' + cordova.platformId + '/init', 'app/sofia.db'], function () {
              requirejs(['app/sofia.vue', 'app/sofia.data', 'app/sofia.user', 'app/sofia.app'], function () {
                  window.setTimeout(S.app.initialize,250); // Add time if all not already loaded for safety
              });
          });
      });
  });
};


requirejs(['cordova'], S.init , function (err) {
  //Handle error for example if cordova isn't here
  console.log(err.requireModules, err.requireType);
  if(err && err.requireModules.length === 1 && err.requireModules[0] === "cordova" && err.requireType === "scripterror"){ //Cordova fail to load
    //Ignoring and mocking
    window.cordova = {
      is_mock: true,
      platformId : "browser"
    }
    S.init(window.cordova);
  } else {
    throw err;
  }
});
