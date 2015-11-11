'use strict';
console.log("Init browser platform");

// For testing purpose //
$("head").append('<link rel="stylesheet" type="text/css" href="assets/css/platform/android.css">');
requirejs(['platform/android/init']);
/////////////////////////

/*
S.platform = {
    isLoaded: true,
    id: browser
}
*/