'use strict';
var S = S || {};
requirejs(['app/page/home','app/page/login','app/page/fiche','app/page/add','app/page/memo','app/page/settings'], function (pHome,pLogin,pFiche,pAdd,pMemo,pSettings) {
  S.data = {
      pages: {
          "fiche/:fiche_id": pFiche,
          add : pAdd,
          "_login" : pLogin,
          settings: pSettings,
          memo: pMemo,
          home: pHome
      }
  };
});
