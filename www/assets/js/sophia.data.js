'use strict';
var S = S || {};

S.data = {
    pages: {
        inbox: {
            data: function () {   ///TODO don't use a function but a object that is updated. But d'ont know how
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
                            pathologys: [],
                            events: [] //Entrée, sortie, changements 
                        },
                        {
                            id: 2,
                            owner_id: 1,
                            patient: {
                                firstname: "Prénom",
                                lastname: "Nom",
                                birthdate: "02/11/1991",
                                gender: "Homme"
                            },
                            pathologys: [],
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
                            pathologys: [],
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