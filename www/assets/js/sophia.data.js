'use strict';
var S = S || {};

S.data = {
    pages: {
        inbox: {
            data: function () {
                return {//TODO
                    fiches: [
                        {
                            id: 1,
                            owner_id: 1,
                            firstname: "Prénom",
                            lastname: "Nom",
                            birthdate: "01/11/1991",
                            gender: "Homme",
                            pathologys : [], 
                            events : [] //Entrée, sortie, changements 
                        },
                        {
                            id: 2,
                            owner_id: 1,
                            firstname: "Prénom",
                            lastname: "Nom",
                            birthdate: "02/11/1991",
                            gender: "Homme",
                            pathologys : [], 
                            events : [] //Entrée, sortie, changements 
                        },
                        {
                            id: 3,
                            owner_id: 1,
                            firstname: "Prénom",
                            lastname: "Nom",
                            birthdate: "03/11/1991",
                            gender: "Femme",
                            pathologys : [], 
                            events : [] //Entrée, sortie, changements 
                        }
                    ]
                };
            },
            computed: {
                fiches_html: function () {
                    var fiches_html = [];
                    for (id in this.fiches) {
                        fiches_html.push(S.template.fiche(this.fiches[id]));
                    }
                    return fiches_html;
                }
            }
        }
    }
};