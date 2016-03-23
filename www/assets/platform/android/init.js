/* global componentHandler, S */
'use strict';
//(function () {
  //Vue.config.silent = true
  console.log("Init android platform");

  $("head").append('<link rel="stylesheet" type="text/css" href="assets/lib/material-design-lite/material.min.css">');
  $("head").append('<link rel="stylesheet" type="text/css" href="assets/lib/dialog-polyfill/dialog-polyfill.css">');

  //$("head").append('<link rel="stylesheet" type="text/css" href="assets/css/platform/android.css">');

  //$("head").append('<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">');
  //$("body").append('<script src="assets/lib/material-design-lite/material.min.js"></script>');


  requirejs(['lib/material-design-lite/material.min','lib/dialog-polyfill/dialog-polyfill', 'promise!platform/android/template'], function () {
      S.platform = {
          isLoaded: true,
          id: "android",
          events: {
              afterDeviceReady: function () {
                $("#menu .mdl-navigation .mdl-navigation__link").on("click",function(){
                  $(".mdl-layout__obfuscator.is-visible").click();
                })
              },
              afterPageLoad: function () {
                  window.setTimeout(componentHandler.upgradeDom, 150); //Application de la lib material-design
              }
          }
      };
  });
//}());
