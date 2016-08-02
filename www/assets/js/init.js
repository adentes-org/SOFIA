/* global requirejs */

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
        "app/sofia.vue": {
            exports: 'S.vue'
        },
        "app/sofia.tool": {
            exports: 'S.tool'
        },
        "app/sofia.config": {
            exports: 'S.config'
        },
        "app/sofia.user": {
            exports: 'S.user'
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
            locale: localStorage["sofia-language"] || navigator.language || navigator.userLanguage || 'en',
        }
    }
});

//Load APP
requirejs(["main"]);
