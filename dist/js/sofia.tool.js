"use strict";var S=S||{};S.tool={uniq:function(t){return $.grep(t,function(e,n){return $.inArray(e,t)===n})},getDialog:function(t){var e=document.querySelector(t);return e.showModal&&e.close||dialogPolyfill.registerDialog(e),e},capitalizeFirstLetter:function(t){return t.charAt(0).toUpperCase()+t.slice(1)},isMenuEntry:function(t){return"object"==typeof t&&(t=t.$key?t.$key:t.url),t.startsWith("/")&&(t=t.slice(1)),S.vue.map["/"+t]&&!t.startsWith("_")&&!t.includes(":")},debounce:function(t,e){var n=null;return function(){var o=this,r=arguments;clearTimeout(n),n=setTimeout(function(){t.apply(o,r)},e)}},loadStatic:function(t){t.base=t.base||"";var e={},n=[];$.each(t.files,function(o,r){"string"==typeof r?n.push($.get(t.base+r).then(function(t){e[o]=t},function(t){console.log("Error getting : "+JSON.stringify(t))})):"object"==typeof r?n.push(S.tool.loadStatic({base:t.base,files:r}).then(function(t){e[o]=t},function(t){console.log("Error chaining : "+JSON.stringify(t))})):console.log("Incompatible type : "+o+" -> "+typeof r)});var o=jQuery.Deferred();return $.when.apply(this||$,n).then(function(){o.resolve(e)}),o.promise()}};