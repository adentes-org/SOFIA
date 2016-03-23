'use strict';
var S = S || {};

S.config = {
  user : {
    username : "",
    userpass : ""
  },
  db : {
    url : "",
    name : ""
  },
  local : { /* default */
    "ask-for" : {
      "take-validation" : true,
      "give-validation" : true,
      "reopen-validation" : true,
      "addPathology-validation" : true,
      "addOrigin-validation" : true,
      "changePrimaryAffection-validation" : false,
      "changeInformation-validation" : true,
      "delete-validation" : true
    }
  }
};

$.extend(true, S.config.user, (typeof localStorage["sofia-user-config"] === "string") ? JSON.parse(localStorage["sofia-user-config"]) : null);
$.extend(true, S.config.db, (typeof localStorage["sofia-server-config"] === "string") ? JSON.parse(localStorage["sofia-server-config"]) : null);
$.extend(true, S.config.local, (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : null);
//S.config.local = (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : _defaultConfig;
//TODO permit to reset
//TODO check if all config is ok
