define(["jquery"], function($) {
  "use strict";
  var tool = {
      uniq: function(list) {
          return $.grep(list, function(el, index) {
              return $.inArray(el, list) === index;
          });
      },
      getDialog: function(id) {
        var dialog = document.querySelector(id);
        if (!dialog.showModal || !dialog.close) {
              dialogPolyfill.registerDialog(dialog);
        }
        return dialog;
      },
      capitalizeFirstLetter: function(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
      },
      calAge: function(d) {
              var now = moment();
               var local = moment.localeData();

               var years = now.diff(d, 'years');
               if(years === 0){
                     var months = now.diff(d, 'month') //Getting month
                   if(months === 0){
                     var days = now.diff(d, 'day') //Getting day
                     return days+local["_relativeTime"].dd.substr(2);
                   }else if(months === 1){
                     return local["_relativeTime"].M; //1month
                   }else{
                     return months+local["_relativeTime"].MM.substr(2);
                   }
               }else if(years === 1){
                   return local["_relativeTime"].y;
               }else{
                   return years+local["_relativeTime"].yy.substr(2);
               }
      },
      isMenuEntry: function(path) {
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
      debounce: function(fn, delay) {
          var timer = null;
           return function () {
             var context = this, args = arguments;
             clearTimeout(timer);
             timer = setTimeout(function () {
               fn.apply(context, args);
             }, delay);
           };
      },
      loadStatic: function(paths) {
            //return new Promise(function (fulfill, reject){
            paths.base = paths.base || ""; // Use a empty string if not existing
            var data = {}; //TODO determine if let is sufficient
            var pool = [];
            $.each(paths.files, function(id,path){
                if(typeof path === "string"){
                    // Load static
                    //console.log("get("+paths.base+path+")");
                    pool.push($.get(paths.base+path).then(function(content){
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
                    pool.push(tool.loadStatic({
                        base : paths.base,
                        files : path
                    }).then(function(d){
                        data[id] = d; //TODO check if not better to use extend
                    }, function(error){
                        console.log("Error chaining : "+ JSON.stringify(error));
                    })); //TODO manage reject
                } else {
                    console.log("Incompatible type : " + id + "> " + (typeof path)); //TODO use a Promise.reject() ?
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
  return tool;
});
