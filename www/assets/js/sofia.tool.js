'use strict';
define(["jquery", "dialog-polyfill"], function($,dialogPolyfill) {
    var tool = {
        uniq: function (a) {
          return $.grep(a, function(item, pos) {
                return $.inArray(item, a) === pos;
          });
        },
        getDialog: function (queryId) {
          var dialog = document.querySelector(queryId);
          if (!dialog.showModal || !dialog.close) {
                dialogPolyfill.registerDialog(dialog);
          }
          return dialog;
        },
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
        },
        debounce : function (fn, delay) {
          var timer = null;
          return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
              fn.apply(context, args);
            }, delay);
          };
        },
        loadStatic: function (paths) {
            //return new Promise(function (fulfill, reject){
                paths.base = paths.base || ""; // Use a empty string if not existing
                var data = {}; //TODO determine if let is sufficient
                var pool = [];
                $.each(paths.files, function(id,path){
                    if(typeof path === "string"){
                        // Load static
                        //console.log("get("+paths.base+path+")");
                        pool.push($.get(paths.base+path).then(function(content){ //Not working on Android
                        //pool.push(S.tool.get(paths.base+path).then(function(content){
                            data[id] = content;
                        }, function(error){
                            console.log("Error getting : "+ JSON.stringify(error));
                        })); //TODO manage reject.
                    } else if(typeof path === "object"){
                        // Chain load static
                        // TODO use a  more recursive structure and use a local path.base
                        /*
                        console.log("chain("+JSON.stringify({
                            base : paths.base,
                            files : path
                        })+")");
                        */
                        pool.push(S.tool.loadStatic({
                            base : paths.base,
                            files : path
                        }).then(function(d){
                            data[id] = d; //TODO check if not better to use extend
                        }, function(error){
                            console.log("Error chaining : "+ JSON.stringify(error));
                        })); //TODO manage reject
                    } else {
                        console.log("Incompatible type : " + id + " -> " + (typeof path)); //TODO use a Promise.reject() ?
                    }
                });
                /*
                return Promise.all(pool).then(function(){
                    //console.log(data);
                    return Promise.resolve(data);
                });
                */
                //Quick and dirty fix test
                var dfd = $.Deferred();
                $.when.apply(this || $, pool).then(function () {
                    dfd.resolve(data);
                });
                return dfd.promise();
            //});
        }
    }; 
    return tool
});
