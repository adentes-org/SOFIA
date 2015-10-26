var S = S || {};

S.app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        //We use requirejs so everything is ready whenwe are here
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        window.setTimeout(S.app.onDeviceReady, 1000);
    },
    removeLoader: function () {
        $('body>.app-loading').remove();
    },
    onDeviceReady: function () {
        $("body>.app").append(S.template.base());
        componentHandler.upgradeDom();
        $("body").removeClass("loading");
        window.setTimeout(S.app.removeLoader, 1000);
    }
};

S.app.initialize();
