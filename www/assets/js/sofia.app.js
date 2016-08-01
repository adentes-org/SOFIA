/* globals window */
define(["jquery"], function($) {
    'use strict';
    var app = {
        // Application Constructor
        initialize: function () {
            app.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            window.setTimeout(app.onDeviceReady, 100); //TODO when everything is rework test to remove this timing
        },
        removeLoader: function () {
            $('body>.app-loading').remove();
        },
        onDeviceReady: function () {
            $("body>.app").append(S.template.base());
            S.vue.init();
            if(typeof S.platform.events.afterDeviceReady === "function"){
                S.platform.events.afterDeviceReady();
            }
            $("body").removeClass("loading");
            window.setTimeout(app.removeLoader, 1000);
        }
    };
    return app;
});
