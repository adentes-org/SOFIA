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
