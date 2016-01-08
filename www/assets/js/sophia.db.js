'use strict';
var S = S || {};

S.config.db._full_url = S.config.db.url.replace(/\/+$/, '')+"/"+S.config.db.name.replace(/^\/+/, '')
S.db = new PouchDB(S.config.db._full_url, {skipSetup: true});

console.log(S.db);
