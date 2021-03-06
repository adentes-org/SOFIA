"use strict";

String.prototype.startsWith || (String.prototype.startsWith = function(t, i) {
    return i = i || 0, this.indexOf(t, i) === i;
}), String.prototype.includes || (String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
}), String.prototype.capitalize || (String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}), //Use cordova-plugin-dialogs for more native looks
navigator.notification && "function" == typeof navigator.notification.alert && (window.alert = navigator.notification.alert);