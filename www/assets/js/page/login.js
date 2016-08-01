/* global S */
define(['i18n!app/nls/base',"app/sofia.tool"],function(lang,tool) {
  return {
      options: {
          displayQuickAddButton: !1,
          displayHeader: !1,
          displayMenu: !1
      },
      route: {
          data: function() {
              return {
                  u: S.config.user,
                  db: S.config.db
              };
          }
      },
      methods: {
          login: function() {
              //TODO check format of user and pass
              //TODO determine if not use lazy attribute to use less ressouces
              S.user.login(this.u.username, this.u.userpass, !1).then(function(o) {
                  console.log("Receiving the user : ", o), S.vue.router.go("/");
              });
          },
          showConfigurationModal: function() {
              tool.getDialog("#show-config-dialog").showModal();
          },
          closeConfigurationModal: function() {
              this.db = S.config.db, //Reset
              tool.getDialog("#show-config-dialog").close();
          },
          scanQRCode: function() {
              var o = this;
              cordova.plugins.barcodeScanner.scan(function(e) {
                  if (console.log("We got a barcode\nResult: " + e.text + "\nFormat: " + e.format + "\nCancelled: " + e.cancelled),
                  !e.cancelled) {
                      if ("QR_CODE" !== e.format) {
                          //alert("Format "+result.format+" incorrect !")
                          alert(lang.alert["incorrect-format"] + " : " + e.format);
                      } else {
                          var n = e.text.split("/");
                          e.text.indexOf("@") > -1 && (//We have a username
                          n[2] = n[2].split("@"), o.u.username = n[2].shift(), o.u.username.indexOf(":") > -1 && (//We have a password
                          o.u.userpass = o.u.username.split(":")[1], o.u.username = o.u.username.split(":")[0]),
                          n[2] = n[2].join("")), o.db.name = n.pop(), o.db.url = n.join("/"), //S.data.pages['_login'].methods.checkInput()
                          window.setTimeout("S.data.pages._login.methods.checkInput();", 500);
                      }
                  }
              }, function(o) {
                  //alert("Scanning failed: " + error);
                  alert(lang.alert["scan-fail"] + " : " + o);
              });
          },
          checkInput: function() {
              console.log("Checking input ..."), $("#_login .mdl-textfield__input").each(function() {
                  console.log(this.value.length, this.value, this), this.value.length > 0 ? $(this).parent().addClass("is-dirty") : $(this).parent().removeClass("is-dirty");
              });
          },
          updtConfiguration: function() {
              S.db.setUrl(this.db), tool.getDialog("#show-config-dialog").close();
          }
      }
    };
});
