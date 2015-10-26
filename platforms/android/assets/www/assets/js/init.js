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
        jquery: 'lib/jquery/jquery',
        android: 'platform/android/',
        ios: 'platform/ios/'
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

requirejs(['cordova','jquery'], function (cordova, $) {
//requirejs(['jquery'], function ($) {
    requirejs(['app/index']);
});