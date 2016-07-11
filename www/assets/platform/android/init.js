'use strict';

define(["jquery",'lib/material-design-lite/material.min', 'promise!platform/android/template'], function($,componentHandler,template) {
  //Vue.config.silent = true
  console.log("Init android platform");

  $("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/material-design-lite/material.min.css">');
  $("head").append('<link rel="stylesheet" type="text/css" href="dist/lib/dialog-polyfill/dialog-polyfill.css">'); //Load style for dialog
  $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/android/css/style.css">');

  var platform = {
          isLoaded: true,
          id: "android",
          template: template,
          events: {
              afterDeviceReady: function () {
                $("#menu .mdl-navigation .mdl-navigation__link").on("click",function(){
                  $(".mdl-layout__obfuscator.is-visible").click();
                });
              },
              afterPageLoad: function () {
                  window.setTimeout(componentHandler.upgradeDom, 250); //Application de la lib material-design
              }
          }
      };
  return platform;
});
