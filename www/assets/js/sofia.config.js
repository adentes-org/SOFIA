'use strict';
var S = S || {};

S.config = {
  db : {
    url : "https://carapuce.sapk.fr:5984",
    name : "sofia-fiches"
  },
  local : { /* default */
    "ask-for" : {
      "take-validation" : true,
      "give-validation" : true,
      "reopen-validation" : true,
      "addPathology-validation" : true,
      "addOrigin-validation" : true,
      "changePrimaryAffection-validation" : false,
      "changeInformation-validation" : true
    }
  }
};

$.extend(true, S.config.local, (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : null);
//S.config.local = (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : _defaultConfig;

//TODO check if all config is ok
