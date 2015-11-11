'use strict';
/*
 * Init the app dependency with requirejs
 */
/* global requirejs */

requirejs.config({
    baseUrl: 'assets',
    paths: {
        app: 'js',
        lib: 'lib',
        cordova: '../cordova',
        jquery: 'lib/jquery/jquery.min',
        pouchdb: 'lib/pouchdb/pouchdb.min',
        vue: 'lib/vue/vue.min',
        "vue-router": 'lib/vue-router/vue-router.min'
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
requirejs(['cordova', 'jquery', 'vue', 'vue-router', 'pouchdb'], function (cordova, $, Vue, VueRouter) {
    Vue.use(VueRouter);
    window.Vue = Vue; //Force Vue to DOM
    window.VueRouter = VueRouter; //Force VueRouter to DOM
    requirejs(['app/sophia.template', 'app/sophia.config'], function () {
        requirejs(['platform/' + cordova.platformId + '/init'], function () {
            requirejs(['app/sophia.vue', 'app/sophia.data', 'app/sophia.tool', 'app/sophia.app'], function () {
                S.app.initialize();
            });
        });
    });
});