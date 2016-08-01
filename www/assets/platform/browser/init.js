/* global $, Vue, requirejs */
"use strict";

console.log("Init browser platform"), // For testing purpose //
Vue.config.debug = !0, $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/android/css/style.css">'), 
requirejs([ "platform/android/init" ]);