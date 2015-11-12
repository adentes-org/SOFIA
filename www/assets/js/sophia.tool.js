'use strict';
var S = S || {};

S.tool = {
    capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    isMenuEntry: function (path) {
        //console.log(path, typeof path);
        if (typeof path === "object") {
            path = (path.$key) ? path.$key : path.url;
        }
        //console.log(path);
        if (path.startsWith("/")) {
            path = path.slice(1);
        }
        //console.log(path, S.vue.map["/" + path], !path.startsWith("_"));
        return S.vue.map["/" + path] && !path.startsWith("_") && !path.includes(":");
    }
};