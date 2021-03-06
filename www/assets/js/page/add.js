/* global S */
define({
    options: {
        title: S.lang.add.capitalize(),
        displayQuickAddButton: !1,
        displaySearchbox: !1
    },
    route: {
        data: function() {
            var e = new $.Deferred(), t = {
                uid: S.user._current.name + "-",
                owner_id: S.user._current.name,
                patient: {
                    firstname: "",
                    lastname: "",
                    birthdate: "",
                    gender: ""
                },
                pathologys: [],
                events: [],
                lang: S.lang
            };
            return S.db.fiches.getMyCreationCount().then(function(n) {
                t.uid += n + 1, console.log(t), e.resolve(t), S.vue.router.app.$children[0].$data.options.title = t.uid;
            }), e.promise();
        }
    },
    methods: {
        add: function() {
            console.log(this._data), $("#add_form :input").attr("disabled", !0), S.db.fiches.post({
                uid: this._data.uid,
                owner_id: this._data.owner_id,
                patient: this._data.patient,
                closed: !1,
                deleted: !1,
                close_context: {},
                origin: "",
                primaryAffection: "",
                pathologys: [],
                events: [ {
                    type: "action",
                    action: "creation",
                    message: S.user._current.name + " " + S.lang.log["create-fiche"] + ".",
                    timestamp: Date.now(),
                    user: S.user._current.name
                } ]
            }).then(function(e) {
                S.vue.router.go("/fiche/" + e.id), console.log(e);
            }).catch(function(e) {
                console.log(e);
            });
        }
    }
});