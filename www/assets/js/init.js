/* global requirejs */
'use strict';
/*
 * Init the app dependency with requirejs
 */
/* global requirejs */
var S = S || {};

requirejs.config({
    baseUrl: 'assets',
    paths: {
        app: 'js',
        lib: 'lib',
        cordova: '../cordova',
        jquery: 'lib/jquery/jquery.min',
        pouchdb: 'lib/pouchdb/pouchdb.min',
        "pouchdb-authentication": 'lib/pouchdb-authentication/pouchdb.authentication.min',
        vue: 'lib/vue/vue.min',
        "vue-router": 'lib/vue-router/vue-router.min',
        promise: 'lib/requirejs-promise/requirejs-promise'
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
    }
});

//var base = ;
//base.unshift();
S.init = function(cordova){
  requirejs(['jquery', 'vue', 'vue-router', 'pouchdb', 'app/sofia.polyfill'], function ($, Vue, VueRouter, PouchDB) {
      Vue.use(VueRouter);
      window.PouchDB = PouchDB; //Force PouchDB to DOM
      console.log(PouchDB);
      window.Vue = Vue; //Force Vue to DOM
      window.VueRouter = VueRouter; //Force VueRouter to DOM
      requirejs(['pouchdb-authentication', 'app/sofia.tool', 'app/sofia.template', 'app/sofia.config'], function () {
          $("head").append('<link rel="stylesheet" type="text/css" href="assets/platform/' + cordova.platformId + '/css/style.css">');
          requirejs(['platform/' + cordova.platformId + '/init', 'app/sofia.db'], function () {
              requirejs(['app/sofia.vue', 'app/sofia.data', 'app/sofia.user', 'app/sofia.app'], function () {
                  S.app.initialize();
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
