
'use strict';
define([], function() {
    var app = {
        // Application Constructor
        initialize: function () {
            S.app.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            //We use requirejs so everything is ready whenwe are here
            //document.addEventListener('deviceready', this.onDeviceReady, false);
            window.setTimeout(S.app.onDeviceReady, 1000); //TODO when everything is rework test to remove this timing
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
            window.setTimeout(S.app.removeLoader, 1000);
        }
    };
    return app;
});
