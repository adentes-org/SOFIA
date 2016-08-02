/* global $, Vue, requirejs */

console.log("Init browser platform");
define(["platform/android/init"], function(android) {
  "use strict";
   $("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/android/css/style.css">');
	return android; //Load android interface in browser.
});
