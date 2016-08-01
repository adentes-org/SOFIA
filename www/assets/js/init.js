/* global requirejs */
"use strict";

/*
 * Init the app dependency with requirejs
 */
/* global requirejs */
var S = S || {}, language = localStorage["sofia-language"] || navigator.language || navigator.userLanguage || "en";

requirejs.config({
    baseUrl: "dist",
    paths: {
        app: "js",
        platform: "platform",
        lib: "lib",
        cordova: "../cordova",
        jquery: "lib/jquery/jquery.min",
        pouchdb: "lib/pouchdb/pouchdb.min",
        "pouchdb-authentication": "lib/pouchdb-authentication/pouchdb.authentication.min",
        vue: "lib/vue/vue.min",
        "vue-router": "lib/vue-router/vue-router.min",
        /* "vue-i18n": 'lib/vue-i18n-plugin/vue-i18n.min', */
        /* "vue-format": "lib/vue-format/vue-format", */
        promise: "lib/requirejs-promise/requirejs-promise",
        "dialog-polyfill": "lib/dialog-polyfill/dialog-polyfill",
        i18n: "lib/requirejs-i18n/i18n",
        moment: "lib/moment/moment.min",
        "moment-locales": "lib/moment/locales.min",
        objectdiff: "lib/objectdiff/objectDiff"
    },
    shim: {
        cordova: {
            exports: "cordova"
        },
        jquery: {
            exports: "$"
        },
        pouchdb: {
            exports: "PouchDB"
        }
    },
    config: {
        //Set the config for the i18n
        //module ID
        i18n: {
            locale: language
        }
    }
}), //var base = ;
//base.unshift();
S.init = function(o) {
    requirejs([ "jquery", "i18n!app/nls/base", "vue", "vue-router", "pouchdb", "dialog-polyfill", "moment", "moment-locales", "app/sofia.polyfill", "objectdiff" ], function(e, i, a, l, r, t, n) {
        // Set plugin
        a.use(l), window.PouchDB = r, //Force PouchDB to DOM
        window.Vue = a, //Force Vue to DOM
        window.VueRouter = l, //Force VueRouter to DOM
        n.locale(language), window.moment = n, //Force moment to DOM
        S.lang = i, //Setup lang
        window.dialogPolyfill = t, //Force dialogPolyfill to DOM
        e("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'), 
        //Load style for dialog
        //$("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/objectdiff/style.css">'); //Load style for diff
        requirejs([ "pouchdb-authentication", "app/sofia.tool", "app/sofia.template", "app/sofia.config" ], function() {
            e("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/' + o.platformId + '/css/style.css">'), 
            requirejs([ "platform/" + o.platformId + "/init", "app/sofia.db" ], function() {
                requirejs([ "app/sofia.vue", "app/sofia.data", "app/sofia.user", "app/sofia.app" ], function() {
                    window.setTimeout(S.app.initialize, 250);
                });
            });
        });
    });
}, requirejs([ "cordova" ], S.init, function(o) {
    if (//Handle error for example if cordova isn't here
    console.log(o.requireModules, o.requireType), !o || 1 !== o.requireModules.length || "cordova" !== o.requireModules[0] || "scripterror" !== o.requireType) {
        throw o;
    }
    //Cordova fail to load
    //Ignoring and mocking
    window.cordova = {
        is_mock: !0,
        platformId: "browser"
    }, S.init(window.cordova);
});