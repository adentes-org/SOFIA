/* global S, $, moment, objectDiff, confirm */
"use strict";

define({
    options: {
        title: "",
        displayQuickAddButton: !1,
        displaySearchbox: !1,
        onHeaderClick: function() {
            S.tool.getDialog("#update-fiche-information-dialog").showModal();
        }
    },
    route: {
        data: function() {
            var e, t = new $.Deferred(), a = this.$route.params.fiche_id;
            return S.db.config.getUsers().then(function(i) {
                console.log(i), //S.db.config.getUsers().then(function(userlist){              console.log(userlist);
                S.db.fiches.getByID(a).then(function(a) {
                    console.log(a), S.vue.router.app.$children[0].$data.options.title = a.patient.firstname + " " + a.patient.lastname, 
                    e = {
                        fiche: a,
                        user: S.user._current,
                        history: [],
                        config: S.config.fiche,
                        lang: S.lang,
                        users: i
                    }, console.log(e), t.resolve(e), e.fiche.origin && "" !== e.fiche.origin || // L'ogine n'est pas saisie on force la saisie
                    S.tool.getDialog("#add-origin-dialog").showModal();
                });
            }), t.promise();
        }
    },
    computed: {
        _patient_age: function() {
            //return moment(this.fiche.patient.birthdate).fromNow(true);
            return S.tool.calAge(moment(this.fiche.patient.birthdate));
        },
        _last_update: function() {
            //Get the timestamp of the last update and format it to be shown
            return this.fiche.events.length > 0 ? moment(this.fiche.events[this.fiche.events.length - 1].timestamp).fromNow() : "";
        }
    },
    methods: {
        showUpdateInformation: function() {
            S.tool.getDialog("#update-fiche-information-dialog").showModal();
        },
        closeUpdateInformation: function() {
            var e = this._data;
            S.tool.getDialog("#update-fiche-information-dialog").close(), S.db.fiches.getByID(this.$route.params.fiche_id).then(function(t) {
                $.extend(!0, e.fiche, t);
            });
        },
        closeDiffModal: function() {
            S.tool.getDialog("#show-diff-dialog").close();
        },
        showDiffInformation: function(e) {
            var t = $(e.srcElement);
            t.not("button") && (t = t.parent()), //console.log(el,el.attr("data-event"), el.data('event'));
            console.log(t, t.attr("data-diff"), t.data("diff")), $("#show-diff-dialog>.mdl-dialog__content").html(objectDiff.convertToXMLString(t.data("diff"))), 
            S.tool.getDialog("#show-diff-dialog").showModal();
        },
        changeInformation: function() {
            var e = !S.config.local["ask-for"]["changeInformation-validation"] || confirm(S.lang["ask-confirm"] + " ?");
            if (e) {
                var t = this._data.fiche;
                S.db.fiches.getByID(this.$route.params.fiche_id).then(function(e) {
                    console.log(t, this), t.events.push({
                        type: "action",
                        action: "changeInformation",
                        message: S.user._current.name + " " + S.lang.log["has-updated-information"] + " !",
                        diff: objectDiff.diff(e.patient, t.patient),
                        timestamp: Date.now(),
                        user: S.user._current.name
                    }), //Update this._data.fiche with additionnal data from data or update them
                    //$.extend(true, this._data.fiche, data); //TODO be more strict on wath can be edited
                    //DATA is already updated by vue in live
                    S.vue.router.app.$children[0].$data.options.title = t.patient.firstname + " " + t.patient.lastname, 
                    S.tool.getDialog("#update-fiche-information-dialog").close(), S.db.fiches.put(t);
                });
            }
        },
        changePrimaryAffection: function(e) {
            var t = $(e.srcElement).val(), a = S.lang.fiche.pathologys[this._data.fiche.primaryAffection] || this._data.fiche.primaryAffection, i = S.lang.fiche.pathologys[t] || t, o = !S.config.local["ask-for"]["changePrimaryAffection-validation"] || confirm(S.lang["ask-confirm-choice"] + "" + i + " ?");
            o && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "changePrimaryAffection",
                message: S.user._current.name + " " + S.lang.log["change-primary"] + " <b>" + a + "</b> " + S.lang.to + " <b>" + i + "</b>",
                timestamp: Date.now(),
                user: S.user._current.name
            }), this._data.fiche.primaryAffection = t, S.db.fiches.put(this._data.fiche));
        },
        addOrigin: function(e) {
            var t = $(e.srcElement);
            t.is("li") && (t = t.find("span[data-id]"));
            var a = $.trim(t.text()), i = $.trim(t.attr("data-id")), o = !S.config.local["ask-for"]["addOrigin-validation"] || confirm(S.lang["ask-confirm-choice"] + " : " + a + " ?");
            o && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "addOrigin",
                message: S.user._current.name + " " + S.lang.log["set-origin"] + " : <b>" + a + "</b>",
                timestamp: Date.now(),
                user: S.user._current.name
            }), this._data.fiche.origin = i, S.db.fiches.put(this._data.fiche), S.tool.getDialog("#add-origin-dialog").close());
        },
        showAddPathologyModal: function() {
            S.tool.getDialog("#add-path-dialog").showModal();
        },
        closeAddPathologyModal: function() {
            S.tool.getDialog("#add-path-dialog").close();
        },
        addPathology: function(e) {
            //TODO check if already exist and display it
            var t = $(e.srcElement);
            t.is(".mdl-list__item-primary-content") || (//Find the content if it is the li that trigger
            t = t.find(".mdl-list__item-primary-content"));
            var a = $.trim(t.text()), i = $.trim(t.attr("data-id"));
            S.tool.getDialog("#add-path-dialog").close();
            var o = !S.config.local["ask-for"]["addPathology-validation"] || confirm("Etes-vous sûr d'ajouter " + a + " ?");
            o && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "addPathology",
                message: S.user._current.name + " " + S.lang.log["add-path"] + " : <b>" + a + "</b>",
                timestamp: Date.now(),
                user: S.user._current.name
            }), 0 === this._data.fiche.pathologys.length && (this._data.fiche.primaryAffection = i), 
            this._data.fiche.pathologys.push(i), S.db.fiches.put(this._data.fiche), //Update ui if needed by interface
            "function" == typeof S.platform.events.afterPageLoad && S.platform.events.afterPageLoad());
        },
        addCheckIn: function() {
            //TODO only allow the team responsible the checkin
            var e = !S.config.local["ask-for"]["checkin-validation"] || confirm(S.lang["ask-confirm"] + " ?");
            e && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "checkin",
                message: S.user._current.name + " " + S.lang.log["add-checkin"] + ".",
                timestamp: Date.now(),
                user: S.user._current.name
            }), S.db.fiches.put(this._data.fiche));
        },
        reopen: function() {
            var e = !S.config.local["ask-for"]["reopen-validation"] || confirm(S.lang["ask-confirm"] + " ?");
            e && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "reopen",
                message: S.user._current.name + " " + S.lang.log["reopen-fiche"] + ".",
                timestamp: Date.now(),
                user: S.user._current.name
            }), this._data.fiche.closed = !1, this._data.fiche.close_context = {}, S.db.fiches.put(this._data.fiche));
        },
        undelete: function() {
            if (S.user._current.isAdmin()) {
                //We are admin
                var e = !S.config.local["ask-for"]["delete-validation"] || confirm("Etes-vous sûr d'annuler la suppression de la fiche ?");
                e && (this._data.fiche.deleted = !1, this._data.fiche.events.push({
                    type: "action",
                    action: "undelete",
                    message: S.user._current.name + " " + S.lang.log["cancel-del"] + ".",
                    timestamp: Date.now(),
                    user: S.user._current.name
                }), S.db.fiches.put(this._data.fiche));
            }
        },
        showDeleteModal: function() {
            S.user._current.isAdmin() && S.tool.getDialog("#delete-fiche-dialog").showModal();
        },
        closeDeleteModal: function() {
            S.tool.getDialog("#delete-fiche-dialog").close();
        },
        submitDelete: function() {
            if (S.user._current.isAdmin()) {
                //We are admin
                var e = !S.config.local["ask-for"]["delete-validation"] || confirm("Etes-vous sûr de supprimer la fiche ?");
                e && (this._data.fiche.deleted = !0, this._data.fiche.events.push({
                    type: "action",
                    action: "delete",
                    message: S.user._current.name + " " + S.lang.log["del-fiche"] + " : " + $("#delete-fiche-dialog #deleteReason").val(),
                    timestamp: Date.now(),
                    user: S.user._current.name
                }), S.db.fiches.put(this._data.fiche));
            }
            S.tool.getDialog("#delete-fiche-dialog").close();
        },
        closeCloseModal: function() {
            S.tool.getDialog("#close-fiche-dialog").close();
        },
        submitClose: function() {
            S.tool.getDialog("#close-fiche-dialog").close(), this._data.fiche.closed = !0;
            var e = {};
            $.each($("#close-fiche-dialog form").serializeArray(), function(t, a) {
                e[a.name] = a.value;
            }), this._data.fiche.close_context = e, this._data.fiche.events.push({
                type: "action",
                action: "close",
                message: S.user._current.name + " " + S.lang.log["close-fiche"] + ".",
                close_context: this._data.fiche.close_context,
                timestamp: Date.now(),
                user: S.user._current.name
            }), S.db.fiches.put(this._data.fiche);
        },
        close: function() {
            return 0 === this._data.fiche.pathologys.length || "undefined" == typeof this._data.fiche.primaryAffection || "" === this._data.fiche.primaryAffection ? alert(S.lang.alert["no-primaryAffection"] + "!") : void S.tool.getDialog("#close-fiche-dialog").showModal();
        },
        take: function() {
            var e = !S.config.local["ask-for"]["take-validation"] || confirm(S.lang["ask-confirm"] + " ?");
            e && (console.log(this._data.fiche), this._data.fiche.events.push({
                type: "action",
                action: "take",
                message: S.user._current.name + " " + S.lang.log["take-fiche-from"] + " " + this._data.fiche.owner_id,
                timestamp: Date.now(),
                user: S.user._current.name
            }), this._data.fiche.owner_id = S.user._current.name, S.db.fiches.put(this._data.fiche));
        },
        setGiveForm: function(e) {
            this._data.fiche.owner_id = $.trim($(e.srcElement).text());
        },
        giveTicket: function() {
            var e = this._data.fiche, t = !S.config.local["ask-for"]["give-validation"] || confirm("Etes-vous sûr de tranferer à " + e.owner_id + " ?");
            S.db.fiches.getByID(this.$route.params.fiche_id).then(function(a) {
                t ? (//We have consent or it's auto-validate by config
                console.log(e), e.events.push({
                    type: "action",
                    action: "take",
                    message: S.user._current.name + " " + S.lang.log["give-fiche-to"] + " " + e.owner_id + " (" + S.lang.log["old-prop"] + " : " + a.owner_id + ")",
                    timestamp: Date.now(),
                    user: S.user._current.name
                }), S.db.fiches.put(e)) : $.extend(!0, e, a), S.tool.getDialog("#give-ticket-dialog").close();
            });
        },
        cancelGiveForm: function() {
            var e = this._data;
            S.db.fiches.getByID(this.$route.params.fiche_id).then(function(t) {
                $.extend(!0, e.fiche, t);
            }), S.tool.getDialog("#give-ticket-dialog").close();
        },
        showGiveModal: function() {
            S.tool.getDialog("#give-ticket-dialog").showModal();
        }
    }
});