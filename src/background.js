/*
 *
 * background.js
 *
 */

function getParentElementOfTagType(element, parent_tag_type) {
  var tag_name = parent_tag_type.toLowerCase();
  while (element && element.parentNode) {
    element = element.parentNode;
    if (element.tagName && element.tagName.toLowerCase() == tag_name) {
      return element;
    }
  }
  return null;
}

function submitLoginForm(username_selector, password_selector, base64_encoded_username, base64_encoded_password) {
  var username_field = document.querySelector(username_selector);
  username_field.focus();
  username_field.value = atob(base64_encoded_username);

  var password_field = document.querySelector(password_selector);
  password_field.focus();
  password_field.value = atob(base64_encoded_password);

  var login_form = getParentElementOfTagType(username_field, "form");
  if (login_form) {
    login_form.submit();
  } else {
    console.log("Can't locate login form!");
  }
}

function generateSubmitLoginFormScript(username_selector, password_selector, base64_encoded_username, base64_encoded_password) {
  var variables = [
    "'" + username_selector + "'", 
    "'" + password_selector + "'", 
    "'" + base64_encoded_username + "'", 
    "'" + base64_encoded_password + "'"
  ].join(", ")

  return [
    String(getParentElementOfTagType),
    String(submitLoginForm),
    "submitLoginForm(" + variables + ");"
  ].join("\n");
}

function onTabLoadComplete(tab, on_complete) {
  var interval = setInterval(function() {
    chrome.tabs.get(tab.id, function (updated_tab_info) {
      if (updated_tab_info.status == "complete") {
        on_complete();
        clearInterval(interval);
      }
    });
  }, 100);
}

function executeScriptInTab(tab, script, on_complete) {
  chrome.tabs.executeScript(tab.id, {code: script}, function() {
    if (typeof on_complete === "function") {
      onTabLoadComplete(tab, on_complete);
    }
  });
}

function openNewTab(options, on_complete) {
  chrome.tabs.create(options, function(new_tab) {
    onTabLoadComplete(new_tab, function() {
      on_complete(new_tab);
    });
  });
}

function openNewActiveTab(url, on_complete) {
  openNewTab({
    url: url,
    active: true
  }, on_complete);
}

function loginToAccount(login_url, login_script) {
  openNewActiveTab(login_url, function(new_tab) {
    executeScriptInTab(new_tab, login_script);
  });
}

function removeCookies(url, cookies) {
  for (var i=0; i<cookies.length; ++i) {
    chrome.cookies.remove({
      url: url, 
      name: cookies[i].name
    });
  }
}

function logoutOfAccountByRemovingCookies(target_url, on_complete) {
  chrome.cookies.getAll({url: target_url}, function(cookies) {
    removeCookies(target_url, cookies);
    on_complete();
  });
}

function mindEraserButtonClicked(target_url, login_url, login_script) {
  logoutOfAccountByRemovingCookies(target_url, function() {
    loginToAccount(login_url, login_script);
  })
}

chrome.extension.onMessage.addListener(function(request, sender, callback) {
  var target_url = request.target_url;
  var login_url = request.login_url;

  var login_script = generateSubmitLoginFormScript(
    request.username_selector, 
    request.password_selector, 
    request.base64_encoded_username, 
    request.base64_encoded_password
  );
  
  mindEraserButtonClicked(target_url, login_url, login_script);
});
