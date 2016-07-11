'use strict';
define(['app/page/home','app/page/login','app/page/fiche','app/page/add','app/page/memo','app/page/settings'], function (pHome,pLogin,pFiche,pAdd,pMemo,pSettings) {
  var data = {
      pages: {
          "fiche/:fiche_id": pFiche,
          add : pAdd,
          "_login" : pLogin,
          settings: pSettings,
          memo: pMemo,
          home: pHome
      }
  };
  return data;
});
