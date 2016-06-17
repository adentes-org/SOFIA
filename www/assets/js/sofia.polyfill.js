'use strict';

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
  };
}

if ( !String.prototype.includes ) {
    String.prototype.includes = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

if ( !String.prototype.capitalize ) {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

//Use cordova-plugin-dialogs for more native looks
if (navigator.notification && typeof navigator.notification.alert === "function" ) {
  window.alert = navigator.notification.alert;
}

//TODO Do the opposite mockup if we use navigator.notification.alert somewhere in the code 
