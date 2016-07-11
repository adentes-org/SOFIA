/* global Vue */
'use strict';
define(["jquery", "platform/android/init"], function($,android) {
	console.log("Init browser platform");
	// For testing purpose //
	Vue.config.debug = true;
	$("head").append('<link rel="stylesheet" type="text/css" href="dist/platform/android/css/style.css">');
	return android; //Load android interface in browser.
});
