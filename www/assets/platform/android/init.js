/* global componentHandler, S, $, requirejs */
define(["jquery",'lib/material-design-lite/material.min', 'promise!platform/android/template'], function($,componentHandler,template) {
  "use strict";
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
              updateDOM: function () {
                if(typeof componentHandler !== "undefined" &&  typeof componentHandler.upgradeDom === "function"){
                    componentHandler.upgradeDom();
                }else{
                    console.log("Spawning updateDOM not ready");
                    window.setTimeout(platform.updateDOM, 250);
                }
              },
              afterPageLoad: function () {
                  window.setTimeout(platform.updateDOM, 250); //Application de la lib material-design
              }
          }
      };
  return platform;
});
