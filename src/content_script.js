/*
 *
 * content_script.js
 *
 */

function getDataFromMindEraserButton(mind_eraser_button) {
  var target_url = mind_eraser_button.getAttribute("data-target-url");
  var login_path = mind_eraser_button.getAttribute("data-target-login-path");
  return { 
    "target_url": target_url,
    "login_url": target_url + login_path, 
    "username_selector": mind_eraser_button.getAttribute("data-target-username-selector"), 
    "password_selector": mind_eraser_button.getAttribute("data-target-password-selector"), 
    "base64_encoded_username": mind_eraser_button.getAttribute("data-target-encoded-username"), 
    "base64_encoded_password": mind_eraser_button.getAttribute("data-target-encoded-password"),
    "form_button_selector": mind_eraser_button.getAttribute("data-target-form-button-selector")
  }
}

function mindEraserButtonClicked(mind_eraser_button) {
  var data = getDataFromMindEraserButton(mind_eraser_button);
  chrome.extension.sendMessage(data);
}

function attachOnClickEventToMindEraserButton(mind_eraser_button) {
  mind_eraser_button.onclick = function(){
    mindEraserButtonClicked(this);
    return false;
  };
}

function initializeMindEraser() {
  var mind_eraser_buttons = document.getElementsByClassName("mind-eraser-btn");
  for (var i=0; i < mind_eraser_buttons.length; ++i) {
    attachOnClickEventToMindEraserButton(mind_eraser_buttons[i]);
  }
}

initializeMindEraser();
