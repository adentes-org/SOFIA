/*
 * Init the app dependency with requirejs
 */
/* global requirejs */
//TODO pass to minimized vresion of libs

requirejs.config({
    baseUrl: 'assets',
    paths: {
        app: 'js',
        lib: 'lib',
        cordova: '../cordova',
        jquery: 'lib/jquery/jquery.min',
        pouchdb: 'lib/pouchdb/pouchdb.min'
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
        }
    }
});
requirejs(['cordova', 'jquery', 'pouchdb'], function (cordova, $) {
    requirejs(['app/sophia.template', 'app/sophia.config'], function () {
        requirejs(['platform/' + cordova.platformId + '/init'], function () {
            requirejs(['app/sophia.app']);
        });
    });
});