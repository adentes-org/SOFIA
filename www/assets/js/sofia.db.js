/* global PouchDB, $, moment, objectDiff */
"use strict";

var S = S || {}, req_limit = 1e6;

/**** DEBUG ****/
//Disabled for live
//PouchDB.debug.enable('*');
PouchDB.debug.disable(), /**** ***** ****/
S.db = {
    /*"localDB" : new PouchDB("local-"+S.config.db.name.replace(/^\/+/, '')), */
    /*"remoteDB" : new PouchDB(S.config.db._full_url, {skipSetup: true}), */
    setUrl: function(e) {
        S.config.db = e, //TODO check
        localStorage["sofia-server-config"] = JSON.stringify(S.config.db), S.config.db._full_url = S.config.db.url.replace(/\/+$/, "") + "/" + S.config.db.name.replace(/^\/+/, ""), 
        S.config.db._local_url = "local-" + S.config.db._full_url.replace(/:/gi, "").replace(/\/+/gi, "#"), 
        //S.config.db._local_url = "local-"+S.config.db.name.replace(/^\/+/, '');
        S.db.localDB = new PouchDB(S.config.db._local_url), // Use the full url in case same db on other domain could lead to corruption //TODO maybe clean it if exist ?
        S.db.remoteDB = new PouchDB(S.config.db._full_url, {
            skipSetup: !0
        });
    },
    clearLocal: function() {
        return S.db.localDB.destroy();
    }
}, S.db.setUrl(S.config.db), S.db.config = {
    getUsers: function() {
        var e = new $.Deferred();
        return S.db.localDB.get("_design/sofia-config").then(function(o) {
            console.log(e.resolve(o.users || []));
        }).catch(function(e) {
            console.log(e);
        }), e.promise();
    },
    getMemo: function() {
        var e = new $.Deferred();
        return S.db.localDB.getAttachment("_design/sofia-config", "memo.html").then(function(o) {
            // handle result
            var n = new FileReader();
            n.onload = function() {
                e.resolve({
                    memo: n.result
                });
            }, n.readAsText(o);
        }).catch(function(e) {
            console.log(e);
        }), e.promise();
    }
}, S.db.users = {
    login: function(e, o, n) {
        //TODO don't use jquery promise
        var t = new $.Deferred();
        return S.db.remoteDB.login(e, o, function(i, c) {
            i ? (console.log(i), n || alert(i.message), t.reject(i)) : c.ok && (//We are logged in
            console.log("We are logged in !", c), S.user.set(e, o, c), S.db.fiches.startSync(), 
            t.resolve(c));
        }), t.promise();
    }
}, S.db.fiches = {
    changeToParse: 0,
    parseSync: function(e) {
        //switch($(S.vue.router.app.$children[1].$el).attr("id")){
        //TODO detect if refresh needed base on the element refresh and the one being displayed
        switch (console.log("Parsing sync : ", e), S.vue.router.app.$children[0].$data.options.displayLoadingBar = !1, 
        console.log("Currently shown page : ", window.location.hash.slice(3).split("/")[0]), 
        window.location.hash.slice(3).split("/")[0]) {
          case "memo":
            S.db.config.getMemo().then(function(e) {
                S.vue.router.app.$children[1].$data.memo = e.memo, console.log("Updating memo data : ", e);
            });
            break;

          case "home":
            S.db.fiches.getAllWithMine().then(function(e) {
                S.vue.router.app.$children[1].$data.fiches = e.fiches, S.vue.router.app.$children[1].$data.my_fiches = e.my_fiches, 
                console.log("Updating home data : ", e);
            });
            break;

          case "fiche":
            var o = window.location.hash.slice(3).split("/")[1];
            S.db.fiches.getByID(o).then(function(e) {
                //S.vue.router.app.$children[1].$data.history
                //S.vue.router.app.$children[1].$data.fiche
                S.vue.router.app.$children[1].$data.fiche = e, S.vue.router.app.$children[0].$data.options.title = e.patient.firstname + " " + e.patient.lastname;
            });
            break;

          default:
            S.vue.router.replace(window.location.hash.slice(2));
        }
        S.db.fiches.changeToParse > 0 && S.db.fiches.changeToParse--;
    },
    resetTimeout: function() {
        //Clear all timer
        S.db.fiches.offlineTimeout && (console.log("Clearing offlineTimeout timeout"), window.clearTimeout(S.db.fiches.offlineTimeout)), 
        S.db.fiches.offlineAfterTimeout && (console.log("Clearing offlineAfterTimeout timeout"), 
        window.clearTimeout(S.db.fiches.offlineAfterTimeout)), //We watch for a other change event to happen
        S.db.fiches.offlineTimeout = window.setTimeout(S.db.fiches.timeout, 1e3 * S.config.header.timeoutOffline);
    },
    timeout: function() {
        console.log("S.db.fiches.offlineTimeout tigged !"), S.db.remoteDB.info().then(function(e) {
            console.log("Reseting timeout after getting informtion from online db", e), S.db.fiches.resetTimeout();
        }).catch(function(e) {
            console.log(e);
        }), /*
    S.db.localDB.compact().then(function (result) {
      window.clearTimeout(S.db.fiches.offlineAfterTimeout);
    }).catch(function (err) {
      console.log(err);
    });
    */
        S.db.fiches.offlineAfterTimeout = window.setTimeout("console.log('Setting header color to offline');S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColorOffline;", 5e3);
    },
    watch: function(e) {
        e.on("change", function(e) {
            S.db.fiches.changeToParse++, console.log("Pouchdb.sync.change event", e, Date());
        }).on("paused", function(e) {
            // replication was paused, usually because of a lost connection or end of transmission
            console.log("Pouchdb.sync.paused event", e, Date()), //We jsut receive data from server so wa are online
            S.vue.router.app.$children[0].$data.options.backColor !== S.config.header.backColor && (//The header is display not as online
            console.log("Setting header color to online"), S.vue.router.app.$children[0].$data.options.backColor = S.config.header.backColor), 
            /*else {
          //The header is display as online
        }*/
            S.db.fiches.resetTimeout(), (S.db.fiches.changeToParse > 0 || S.vue.router.app.$children[0].$data.options.displayLoadingBar) && S.db.fiches.parseSync(e);
        }).on("active", function(e) {
            console.log("Pouchdb.sync.active event", e, Date()), // replication was resumed
            S.vue.router.app.$children[0].$data.options.displayLoadingBar = !0;
        }).on("error", function(e) {
            console.log("Pouchdb.sync.error event", e, Date());
        }).on("complete", function(e) {
            console.log("Pouchdb.sync.complete event", e, Date()), // replication was canceled!
            S.db.fiches.watch(S.db.localDB.sync(S.db.remoteDB, {
                live: !0,
                retry: !0
            }));
        });
    },
    startSync: function() {
        console.log("Starting sync ..."), S.db.fiches.watch(S.db.localDB.sync(S.db.remoteDB, {
            live: !0,
            retry: !0
        })), console.log("Sync in place !");
    },
    post: function(e) {
        //Create
        return S.db.localDB.post(e);
    },
    getDiffConflict: function(e, o) {
        //return objectDiff.diff(o.patient, n.patient)
        return objectDiff.diff($.extend({}, e, {
            events: []
        }), $.extend({}, o, {
            events: []
        }));
    },
    mergeConflict: function(e, o) {
        // o : obj in db, n: obj to commit
        //This is never call normally because the vue and obj of the vue is instantly update when in localDB
        /* This will merge and keep a maximum of information (things deleted previously could be added) */
        var n = $.extend({}, e, {
            close_context: o.close_context,
            deleted: o.deleted,
            closed: o.closed,
            patient: o.patient,
            origin: o.origin,
            owner_id: o.owner_id,
            primaryAffection: o.primaryAffection,
            uid: o.uid
        });
        //Close and overwrite some parts that can be directly
        /* */
        return $.each(o.pathologys, function(e, o) {
            $.inArray(o, n.pathologys) === -1 && //Not found
            n.pathologys.push(o);
        }), $.each(o.events, function(e, o) {
            /*
      if ($.inArray(val,ret.events) === -1) { //Not found
        ret.events.push(val);
      }
      */
            var t = !1, i = JSON.stringify(o);
            $.each(n.events, function(e, o) {
                t || JSON.stringify(o) !== i || (t = !0);
            }), t || n.events.push(o);
        }), n.events.sort(function(e, o) {
            //Order
            return e.timestamp - o.timestamp;
        }), n._rev = e._rev, n.events.push({
            type: "action",
            action: "autoMergeConflict",
            message: S.lang.log["auto-merge"],
            /*  diff : objectDiff.diff(o, ret), */
            //Take too much space
            diff: S.db.fiches.getDiffConflict(e, n),
            timestamp: Date.now(),
            user: S.user._current.name
        }), n;
    },
    put: function(e) {
        // Remove any duplicate
        //Update or Create
        return e.pathologys = S.tool.uniq(e.pathologys), S.db.localDB.put(e).catch(function(o) {
            console.log(o), 409 !== o.status && "conflict" !== o.name || // conflict!
            S.db.fiches.getByID(e._id).then(function(o) {
                S.db.fiches.put(S.db.fiches.mergeConflict(o, e));
            });
        });
    },
    getByID: function(e) {
        var o = new $.Deferred();
        return S.db.localDB.get(e).then(function(e) {
            console.log(e), o.resolve(e);
        }).catch(function(e) {
            // handle err
            console.log(e), o.reject(e);
        }), o.promise();
    },
    filterMine: function(e) {
        var o = [];
        return $.each(e, function(e, n) {
            n.owner_id === S.user._current.name && (o[o.length] = n);
        }), o;
    },
    getAllWithMine: function() {
        var e = new $.Deferred();
        return S.db.fiches.getAll().then(function(o) {
            o.my_fiches = S.db.fiches.filterMine(o.fiches), e.resolve(o);
        }), e.promise();
    },
    getAll: function() {
        var e = new $.Deferred();
        return S.db.localDB.allDocs({
            include_docs: !0,
            skip: 0,
            limit: req_limit
        }).then(function(o) {
            // handle result
            var n = {
                user: S.user._current,
                fiches: []
            };
            $.each(o.rows, function(e, o) {
                if ("_design" !== o.doc._id.split("/")[0]) {
                    n.fiches[n.fiches.length] = o.doc, o.doc.creation_date = moment(o.doc.events[0].timestamp).format("ddd, H:mm"), 
                    o.doc.last_update = o.doc.events[o.doc.events.length - 1].timestamp;
                    var t = moment(o.doc.last_update);
                    o.doc.last_update_since = t.fromNow(), o.doc.last_update_is_old = t.add(S.config.fiche.update_timeout, "minutes").isBefore();
                    var i = moment(o.doc.patient.birthdate);
                    o.doc.patient.age = moment().diff(i, "years"), o.doc.patient.age_formatted = S.tool.calAge(i);
                }
            }), n.lang = S.lang, e.resolve(n);
        }).catch(function(o) {
            // handle err
            console.log(o), e.reject(o);
        }), e.promise();
    },
    getMyCreationCount: function() {
        var e = new $.Deferred();
        return S.db.localDB.allDocs({
            include_docs: !0,
            skip: 0,
            limit: req_limit
        }).then(function(o) {
            var n = 0;
            $.each(o.rows, function(e, o) {
                "_design" !== o.doc._id.split("/")[0] && o.doc.uid.split("-")[0] === S.user._current.name && n++;
            }), console.log(n), e.resolve(n);
        }).catch(function(o) {
            // handle err
            console.log(o), e.reject(o);
        }), e.promise();
    }
};