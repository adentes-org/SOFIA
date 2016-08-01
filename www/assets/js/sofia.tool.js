/* global $, dialogPolyfill, moment */
"use strict";

var S = S || {};

S.tool = {
    uniq: function(e) {
        return $.grep(e, function(t, r) {
            return $.inArray(t, e) === r;
        });
    },
    getDialog: function(e) {
        var t = document.querySelector(e);
        return t.showModal && t.close || dialogPolyfill.registerDialog(t), t;
    },
    capitalizeFirstLetter: function(e) {
        return e.charAt(0).toUpperCase() + e.slice(1);
    },
    calAge: function(e) {
        var t = moment(), r = moment.localeData(), n = t.diff(e, "years");
        if (0 === n) {
            var i = t.diff(e, "month");
            //Getting month
            if (0 === i) {
                var o = t.diff(e, "day");
                //Getting day
                return o + r._relativeTime.dd.substr(2);
            }
            return 1 === i ? r._relativeTime.M : i + r._relativeTime.MM.substr(2);
        }
        return 1 === n ? r._relativeTime.y : n + r._relativeTime.yy.substr(2);
    },
    isMenuEntry: function(e) {
        //console.log(path, S.vue.map["/" + path], !path.startsWith("_"));
        //console.log(path, typeof path);
        //console.log(path);
        return "object" == typeof e && (e = e.$key ? e.$key : e.url), e.startsWith("/") && (e = e.slice(1)), 
        S.vue.map["/" + e] && !e.startsWith("_") && !e.includes(":");
    },
    debounce: function(e, t) {
        var r = null;
        return function() {
            var n = this, i = arguments;
            clearTimeout(r), r = setTimeout(function() {
                e.apply(n, i);
            }, t);
        };
    },
    loadStatic: function(e) {
        //return new Promise(function (fulfill, reject){
        e.base = e.base || "";
        // Use a empty string if not existing
        var t = {}, r = [];
        $.each(e.files, function(n, i) {
            "string" == typeof i ? // Load static
            //console.log("get("+paths.base+path+")");
            r.push($.get(e.base + i).then(function(e) {
                //Not working on Android
                //pool.push(S.tool.get(paths.base+path).then(function(content){
                t[n] = e;
            }, function(e) {
                console.log("Error getting : " + JSON.stringify(e));
            })) : "object" == typeof i ? // Chain load static
            // TODO use a  more recursive structure and use a local path.base
            /*
                    console.log("chain("+JSON.stringify({
                        base : paths.base,
                        files : path
                    })+")");
                    */
            r.push(S.tool.loadStatic({
                base: e.base,
                files: i
            }).then(function(e) {
                t[n] = e;
            }, function(e) {
                console.log("Error chaining : " + JSON.stringify(e));
            })) : console.log("Incompatible type : " + n + " -> " + typeof i);
        });
        /*
            return Promise.all(pool).then(function(){
                //console.log(data);
                return Promise.resolve(data);
            });
            */
        //Quick and dirty fix test
        var n = $.Deferred();
        return $.when.apply(this || $, r).then(function() {
            n.resolve(t);
        }), n.promise();
    }
};