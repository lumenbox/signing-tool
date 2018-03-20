
const DkifSigner = (function () {
  // const StellarSdk = require('stellar-sdk');
  const StellarSdk = StellarBase;
  var fldPublicKey;
  var txtLoginInfo;
  var btnGenerateKey;
  var btnLogin;
  var dlgLogin;
  var dlgSign;
  var fldSignature;
  var keyPair;
  var fldAddress;
  var fldAccount;
  var selMemoType;
  var fldMemo;
  var lblMemo;
  var btnSign;

  const fnGenerateKey = function () {
    var keyPair = StellarSdk.Keypair.random();
    fldSigningKey.MDCTextField.value = keyPair.secret();
    txtLoginInfo.style.display = "block";
    fldSigningKeyField.type = "text";
    dlgLogin.MDCDialog.listen('MDCDialog:accept', fnShowPubKey);
    dlgLogin.MDCDialog.show();
  };

  const fnLoginKey = function() {
    fldSigningKey.MDCTextField.value = "";
    txtLoginInfo.style.display = "none";
    fldSigningKeyField.type = "password";
    dlgLogin.MDCDialog.listen('MDCDialog:accept', fnShowPubKey);
    dlgLogin.MDCDialog.show();
  };

  const fnShowPubKey = function () {
    var secret = fldSigningKey.MDCTextField.value;
    keyPair = StellarSdk.Keypair.fromSecret(secret);
    fldPublicKey.MDCTextField.value = keyPair.publicKey();
  };

  const fnSignRecord = function() {
    var address = fldAddress.MDCTextField.value;
    var account = fldAccount.MDCTextField.value;
    var memoTypeIdx = selMemoType.MDCSelect.selectedIndex;
    if (memoTypeIdx < 0) {
      memoTypeIdx = 0;
    }
    var memoType;
    switch(memoTypeIdx) {
      case 0:
      memoType = StellarBase.MemoNone;
      break;
      case 1:
      memoType = StellarBase.MemoText;
      break;
      case 2:
      memoType = StellarBase.MemoId;
      break;
      case 3:
      memoType = StellarBase.MemoHash;
      break;
      case 4:
      memoType = StellarBase.MemoReturn;
      break;
      default:
      memoType = StellarBase.MemoNone;
    }
    var memoText = fldMemo.MDCTextField.value;
    var theMemo = new StellarSdk.Memo(memoType, memoText);
    var theFederationResponse = new StellarSdk.FederationResponse(address, account, theMemo);
    fldSignature.MDCTextField.value = theFederationResponse.sign(keyPair).toString("base64");
    dlgSign.MDCDialog.show();
  };

  const init = function () {
    fldSigningKey = document.getElementById("signing-key");
    fldSigningKeyField = document.getElementById("signing-key-field");
    txtLoginInfo = document.getElementById("login-dialog-info");
    btnGenerateKey = document.getElementById("generate-key");
    btnLogin = document.getElementById("login-button");
    fldPublicKey = document.getElementById("public-key");
    dlgLogin = document.getElementById("login-dialog");
    dlgLogin.MDCDialog = new mdc.dialog.MDCDialog(dlgLogin);
    dlgSign = document.getElementById("signature-dialog");
    dlgSign.MDCDialog = new mdc.dialog.MDCDialog(dlgSign);
    fldSignature = document.getElementById("signature");
    fldAddress = document.getElementById("stellar-address");
    fldAccount = document.getElementById("account-id");
    selMemoType = document.getElementById("memo-type");
    fldMemo = document.getElementById("memo");
    lblMemo = document.getElementById("memo-label");
    btnSign = document.getElementById("sign");
    // on-click of generate key: generate a random key
    btnGenerateKey.addEventListener("click", fnGenerateKey);
    btnLogin.addEventListener("click", fnLoginKey);
    // listen on memo type
    var mdcMemoType = selMemoType.MDCSelect;
    var mdcMemoFld = fldMemo.MDCTextField;
    mdcMemoType.listen('MDCSelect:change', () => {
      if (mdcMemoType.selectedIndex == 0) {
        mdcMemoType.selectedIndex = -1;
        mdcMemoFld.disabled = true;
        mdcMemoFld.required = false;
        mdcMemoFld.value = "";
        lblMemo.innerHTML = "";
      }
      if (mdcMemoType.selectedIndex == 1) {
        mdcMemoFld.disabled = false;
        mdcMemoFld.required = true;
        lblMemo.innerHTML = "Memo (up to 28 character text)";
      }
      if (mdcMemoType.selectedIndex == 2) {
        mdcMemoFld.disabled = false;
        mdcMemoFld.required = true;
        lblMemo.innerHTML = "Memo ID number";
      }
      if (mdcMemoType.selectedIndex == 3) {
        mdcMemoFld.disabled = false;
        mdcMemoFld.required = true;
        lblMemo.innerHTML = "Memo hash (64 character encoded)";
      }
      if (mdcMemoType.selectedIndex == 4) {
        mdcMemoFld.disabled = false;
        mdcMemoFld.required = true;
        lblMemo.innerHTML = "Memo return (64 character encoded)";
      }
    });
    // on-click for the sign-button
    btnSign.addEventListener("click", fnSignRecord);
  }

  return {
    'init': init
  };
})();
