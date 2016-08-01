"use strict";

var S = S || {};

S.config = {
    user: {
        username: "",
        userpass: ""
    },
    db: {
        url: "",
        name: ""
    },
    header: {
        backColor: "#3f51b5",
        backColorOffline: "#999",
        timeoutOffline: "45"
    },
    fiche: {
        update_timeout: 30,
        //In minutes (Ex: 30 minutes)
        pathologys: [ "unconscious", "cardio-respiratory-stop", "little-care", "bleeding", "difficulty-breathing", "malaise", "trauma", "medical-consultation" ],
        origins: [ "spontaneous", "stretcher", "vpsp", "with-witness", "with-security" ],
        outputs: [ "left-in-place", "simple", "monitoring-and-single-output", "firemen-evacuation", "evacuation" ]
    },
    local: {
        /* default */
        "ask-for": {
            "take-validation": !0,
            "give-validation": !0,
            "reopen-validation": !0,
            "addPathology-validation": !0,
            "addOrigin-validation": !0,
            "changePrimaryAffection-validation": !1,
            "changeInformation-validation": !0,
            "checkin-validation": !1,
            "delete-validation": !0
        }
    }
}, $.extend(!0, S.config.user, "string" == typeof localStorage["sofia-user-config"] ? JSON.parse(localStorage["sofia-user-config"]) : null), 
$.extend(!0, S.config.db, "string" == typeof localStorage["sofia-server-config"] ? JSON.parse(localStorage["sofia-server-config"]) : null), 
$.extend(!0, S.config.local, "string" == typeof localStorage["sofia-local-config"] ? JSON.parse(localStorage["sofia-local-config"]) : null);