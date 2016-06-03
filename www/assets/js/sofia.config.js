'use strict';
var S = S || {};

S.config = {
  user : {
    username : "",
    userpass : ""
  },
  db : {
    url : "",
    name : "",
  },
  header : {
    backColor : "#3f51b5",
    backColorOffline : "#999",
    timeoutOffline : "45" /* Number of seconds without info to be consider offline*/
  },
  fiche : {
    pathologys : [
      "unconscious",
      "cardio-respiratory-stop",
      "little-care",
      "bleeding",
      "difficulty-breathing",
      "malaise",
      "trauma",
      "medical-consultation",
    ],
    origins : [
      "spontaneous",
      "stretcher",
      "vpsp",
      "with-witness",
      "with-security",
    ],
    outputs : [
      "left-in-place",
      "simple",
      "monitoring-and-single-output",
      "firemen-evacuation",
      "evacuation",
    ]
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
      "checkin-validation" : false,
      "delete-validation" : true
    }
  }
};

$.extend(true, S.config.user, (typeof localStorage["sofia-user-config"] === "string") ? JSON.parse(localStorage["sofia-user-config"]) : null);
$.extend(true, S.config.db, (typeof localStorage["sofia-server-config"] === "string") ? JSON.parse(localStorage["sofia-server-config"]) : null);
$.extend(true, S.config.local, (typeof localStorage["sofia-local-config"] === "string") ? JSON.parse(localStorage["sofia-local-config"]) : null);
//TODO check if all config is ok
