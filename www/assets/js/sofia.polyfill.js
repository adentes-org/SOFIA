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