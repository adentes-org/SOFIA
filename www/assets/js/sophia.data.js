'use strict';
var S = S || {};

S.data = {
    pages: {
        "fiche/:fiche_id": {
            options: {
                displaySearchbox: false
            },
            data: function () {

            },
            computed: {
                fiche: function () {
                    //TODO not use fake data and direct acces to local db
                    var d = S.data.pages.inbox.data();


                    for (var f in d.fiches) {
                        if (d.fiches[f].id === this.$route.params.fiche_id) {
                            return d.fiches[f];
                        }
                    }

                }
            }
        },
        "_login" : {
            options : {
                displayQuickAddButton : false,
                displayHeader : false,
                displayMenu : false,
            }
        },
        home: {
            data: function () {   ///TODO don't use a function but a object that is updated. But d'ont know how
                //TODO not use fake data and direct acces to local db
                return {
                    fiches: [
                        {
                            id: 1,
                            owner_id: 1,
                            patient: {
                                firstname: "Prénom",
                                lastname: "Nom",
                                birthdate: "01/11/1991",
                                gender: "Homme"
                            },
                            pathologys: ["Coupure"],
                            events: [] //Entrée, sortie, changements 
                        },
                        {
                            id: 22,
                            owner_id: 1,
                            patient: {
                                firstname: "Prénom",
                                lastname: "Nom",
                                birthdate: "02/11/1991",
                                gender: "Homme"
                            },
                            pathologys: ["Coma", "Vomissement"],
                            events: [] //Entrée, sortie, changements 
                        },
                        {
                            id: 3,
                            owner_id: 1,
                            patient: {
                                firstname: "Prénom",
                                lastname: "Nom",
                                birthdate: "03/11/1991",
                                gender: "Femme"
                            },
                            pathologys: ["Inconnue"],
                            events: [] //Entrée, sortie, changements 
                        }
                    ]
                };
            },
            computed: {
                /*
                 fiches_html: function () {
                 var fiches_html = [];
                 for (var id in this.fiches) {
                 fiches_html.push(S.template.fiche(this.fiches[id]));
                 }
                 console.log(fiches_html);
                 return fiches_html;
                 }
                 //*/
            }
        }
    }
};