# Mind Eraser
Mind Eraser is a Chrome extension that lets your users log in to external websites from your website. To get this functionality, you need to configure the desired HTML elements on your website and your users must have the Mind Eraser Chrome extension installed. This is a useful tool if your users are memorizing login details or copying/pasting them.

## Security
This extension should not be used to secure login credentials from your users. Your users will be able to locate the usernames and passwords to the external services by inspecting the DOM. Also, the website containing Mind Eraser elements should only be used over a secure HTTPS connection.

## Installation
You can install the Chrome extension [here](https://chrome.google.com/webstore/detail/mind-eraser/cnkhlllkefekngjfbmjldbblhegmneol).

## Usage
After installing the extension, create a button, add the `mind-eraser-btn` class to it, and configure its `data-*` attributes.

```html
<!-- index.html -->
<button class                         = "mind-eraser-btn" 
        data-target-url               = "https://www.airbnb.com"
        data-target-login-path        = "/login" 
        data-target-username-selector = "#signin_email" 
        data-target-password-selector = "#signin_password" 
        data-target-encoded-username  = "ZW1haWxAZG9tYWluLmNvbQ==" 
        data-target-encoded-password  = "cGFzc3dvcmQ=">
  Log Me in to Airbnb
</button>
```

All of the `data-*` attributes are required. Mind Eraser attaches onclick events to all elements with the `mind-eraser-btn` class. The onclick event reads the attributes and logs the user into the target url in a separate tab.

- **data-target-url**: URL you are logging into.
- **data-target-login-path**: path location of login form.
- **data-target-username-selector**: CSS selector for the login form's username field
- **data-target-password-selector**: CSS selector for the login form's password field
- **data-target-encoded-username**: base64 encoded username.
- **data-target-encoded-password**: base64 encoded password.

## What's Happening
Mind Eraser first logs any user out of the target url site. Mind Eraser does this because it isn't sure whether the current user is the same as the intended user. To log the current user out, Mind Eraser clears the target url's cookies. Next, a new tab is opened and navigated to the login URL. The login form on the page is populated and submitted.

## When Should I Use This?
Let's pretend you have a business that manages thousands of Twitter accounts. Let's also pretend Twitter doesn't have an API and the management can't be automated. You store the login credentials for all these Twitter accounts on your website and you access them through an admin panel. Instead of copying/pasting the login details for each of these Twitter accounts, you can configure a button that logs you in. This saves you a bunch of time and you don't have to worry about accidentally pasting a password into HipChat.
