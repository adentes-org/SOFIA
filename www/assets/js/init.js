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

requirejs(['cordova', 'jquery'], function (cordova, $) {
//requirejs(['jquery'], function ($) {
    requirejs(['platform/' + cordova.platformId + '/init', 'app/index']);
});