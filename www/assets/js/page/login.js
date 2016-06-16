/* global S */
define({
    options : {
        displayQuickAddButton : false,
        displayHeader : false,
        displayMenu : false,
    },
    route: {
      data: function() {
          return {
            u : S.config.user,
            db : S.config.db
          };
      }
    },
    methods: {
      login: function () {
        //TODO check format of user and pass
        //TODO determine if not use lazy attribute to use less ressouces
        S.user.login(this.u.username, this.u.userpass,false).then(function(user){
            console.log("Receiving the user : ",user);
            S.vue.router.go("/");
        });
        /*.catch(function(error){
            //TODO handle errors
        });
        */
      },
      showConfigurationModal: function () {
          S.tool.getDialog("#show-config-dialog").showModal();
      },
      closeConfigurationModal: function () {
          this.db = S.config.db; //Reset
          S.tool.getDialog("#show-config-dialog").close();
      },
      scanQRCode: function () {
        var el = this;
        cordova.plugins.barcodeScanner.scan(
            function (result) {
              console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
              if(!result.cancelled){
                if(result.format !== "QR_CODE"){
                  //alert("Format "+result.format+" incorrect !")
                  navigator.notification.alert(S.lang.alert["incorrect-format"]+ " : "+result.format);
                }else{
                  var tmp = result.text.split("/");
                  if(result.text.indexOf("@")> -1){ //We have a username
                    tmp[2] = tmp[2].split("@");
                    el.u.username = tmp[2].shift();
                    if(el.u.username.indexOf(":")> -1){ //We have a password
                      el.u.userpass = el.u.username.split(":")[1];
                      el.u.username = el.u.username.split(":")[0];
                    }
                    tmp[2] = tmp[2].join("");
                  }
                  el.db.name = tmp.pop();
                  el.db.url = tmp.join('/');

                  //S.data.pages['_login'].methods.checkInput()
                  window.setTimeout("S.data.pages._login.methods.checkInput();",500);
                }
              }
            },
            function (error) {
              //alert("Scanning failed: " + error);
              navigator.notification.alert(S.lang.alert["scan-fail"]+" : " + error);
            }
         );
      },
      checkInput: function () {
            console.log("Checking input ...");
            $('#_login .mdl-textfield__input').each(function(){
              console.log(this.value.length,this.value,this);
              if(this.value.length>0){
                $(this).parent().addClass('is-dirty'); //Hide the the placeholder
              }else{
                $(this).parent().removeClass('is-dirty');
              }
            });
      },
      updtConfiguration: function () {
          S.db.setUrl(this.db);
          S.tool.getDialog("#show-config-dialog").close();
      }
    }
});
