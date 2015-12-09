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
    loadStatic: function (paths, then, fallback) {
        //TODO use Promise http://www.html5rocks.com/en/tutorials/es6/promises/ https://github.com/jakearchibald/es6-promise#readme
        //TODO maybe evaluate this posibility http://vuejs.org/guide/application.html
        var data = {},
            fileToLoad = 0;
        function callbackLauncher(){
            //This is call after debounce of multiple call and call the calback only if the lit is fullfil
            //console.log("File resting to load after debounce : "+fileToLoad);
            if(fileToLoad === 0){
                then(data);
            }
        }
        $(data).on("fileLoaded",function(evt, file, content){
            fileToLoad--;
            //console.log("File resting to load : "+fileToLoad);
        });
        $(data).on("fileLoaded",S.tool.debounce(callbackLauncher, 100));
        
        paths.base = paths.base || ""; // Use a empty string if not existing
        
        $.each(paths.files, function(id,path){
            //console.log(id,path,typeof path )
            fileToLoad++;
            if(typeof path === "string"){
                //TODO load the file
                $.get(paths.base+"/"+path, function(content){
                    data[id] = content;
                    $(data).trigger("fileLoaded",paths.base+"/"+path,content);
                });//TODO fallback for file not found ?
            }else if(typeof path === "object"){
                //TODO load the object recursively
                S.tool.loadStatic({
                    base : paths.base,
                    files : path
                }, function(d){
                    data[id] = d; //TODO check if not better to use extend
                    $(data).trigger("fileLoaded",paths.base+"/"+path, d);
                });
            }else {
                fallback("Incompatible type : " + id + " -> " + (typeof path));
            }
        });        
    }
};
