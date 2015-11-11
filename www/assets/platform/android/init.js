'use strict';
console.log("Init android platform");

$("head").append('<link rel="stylesheet" type="text/css" href="assets/lib/material-design-lite/material.min.css">');
//$("head").append('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
//$("body").append('<script src="assets/lib/material-design-lite/material.min.js"></script>');


requirejs(['lib/material-design-lite/material.min', 'platform/android/template'], function () {
    S.platform = {
        isLoaded: true,
        id: "android",
        events: {
            afterDeviceReady: function () {
                componentHandler.upgradeDom(); //Application de la lib material-design 
            }
        }
    };

});