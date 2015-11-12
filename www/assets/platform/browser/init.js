'use strict';
console.log("Init browser platform");

// For testing purpose //
$("head").append('<link rel="stylesheet" type="text/css" href="assets/platform/android/style.css">');
requirejs(['platform/android/init']);
/////////////////////////

/*
 S.platform = {
 isLoaded: true,
 id: browser
 }
 */