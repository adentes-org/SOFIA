/* global requirejs */
'use strict';
/*
 * Init the app dependency with requirejs
 */
requirejs.config({
    baseUrl: 'dist',
    paths: {
        app: 'js',
        main: "js/main",
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
        "moment-locales": 'lib/moment/locales.min',
        objectdiff: 'lib/objectdiff/objectDiff',
    },
    shim: {
        "main": {
            exports: 'S'
        },
        cordova: {
            exports: 'cordova'
        },
        jquery: {
            exports: '$'
        },
        pouchdb: {
            exports: 'PouchDB'
        },       
        "pouchdb-authentication": ['pouchdb'],
        vue: {
            exports: 'Vue'
        },
        "vue-router":{
            exports: 'VueRouter',
            deps:['vue']
        },
        pouchdb: {
            exports: 'PouchDB'
        },
        moment: {
            exports: 'moment'
        },
        "dialog-polyfill" :{
            exports: 'dialogPolyfill'
        },
        objectdiff: {
            exports: 'objectDiff'
        },
        "moment-locales": ['moment'],
    },
    config: {
        //Set the config for the i18n
        //module ID
        i18n: {
            locale: language
        }
    }
});


requirejs(['cordova'], function(cordova){
    // Load the main app module to start the app (in cordova)
    requirejs(["main"]);
} , function (err) {
  //Handle error for example if cordova isn't here
  console.log(err.requireModules, err.requireType);
  if(err && err.requireModules.length === 1 && err.requireModules[0] === "cordova" && err.requireType === "scripterror"){ //Cordova fail to load
    //Ignoring and mocking
    window.cordova = {
      is_mock: true,
      platformId : "browser"
    }
    // Load the main app module to start the app (in web version)
    requirejs(["main"]);
  } else {
    throw err;
  }
});
