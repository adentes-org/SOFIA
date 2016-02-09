'use strict';
var S = S || {};

S.config = {
  db : {
    url : "http://carapuce.sapk.fr:5984",
    name : "sofia-fiches"
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

S.config.local = (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : S.config.local;
