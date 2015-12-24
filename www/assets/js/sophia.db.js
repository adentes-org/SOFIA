'use strict';
var S = S || {};

S.db = new PouchDB(S.config.db.url, {skipSetup: true});

console.log(S.db);
