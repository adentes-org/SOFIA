'use strict';
var S = S || {};

S.config = {
  db : {
    url : "http://carapuce.sapk.fr:5985",
    name : "sophia-fiches"
  },
  local : {
    "ask-for" : {
      "take-validation" : true,
      "give-validation" : true,
      "reopen-validation" : true,
      "addPathology-validation" : true,
      "addOrigin-validation" : true
    }
  }
};

S.config.local = (typeof localStorage["sophia-local-config"] === "string") ? JSON.parse(localStorage["sophia-local-config"]) : S.config.local;
