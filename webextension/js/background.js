let urlToOpen;
let settings = {};
let sourceWindow = {};

function createNewWindowTab(isPrivate) {

  function isSupportedProtocol(urlString) {
    let supportedProtocols = [
      "https:", 
      "http:"];
    let url = document.createElement('a');
    url.href = urlString;
    return supportedProtocols.indexOf(url.protocol) != -1;
  };

  if (isSupportedProtocol(urlToOpen)) {
    let tabParams = {
      url: urlToOpen,
      state: settings.state,
      incognito: isPrivate
    };
    if (settings.state === 'same') {
      tabParams.state = sourceWindow.state
      if (sourceWindow.state === 'normal') {
        tabParams.top = sourceWindow.top;
        tabParams.left = sourceWindow.left;
        tabParams.height = sourceWindow.height;
        tabParams.width = sourceWindow.width;
      }
    }
    browser.windows.create(tabParams);
  } else {
    throw ('Protocol not supported !');
  }
  
}

// Get size and position of the original window
// then create the new window
function getCurrentWindowThenCreateNewWindow(isPrivate) {
  let gettingWindow = browser.windows.getCurrent();
  gettingWindow.then((win) => {
    sourceWindow.top = win.top;
    sourceWindow.left = win.left;
    sourceWindow.height = win.height;
    sourceWindow.width = win.width;
    sourceWindow.state = win.state;
  }).then(() => {
    createNewWindowTab(isPrivate);
  });
}

function loadConfig() {
  let gettingConfig = browser.storage.sync.get();
  gettingConfig.then((settingsToRestore) => {
    // No saved setting at this time => defaults, else load saved settings
    if (settingsToRestore['state'] === undefined) {
      for (let thisSetting in defaultSettings) {
        settings[thisSetting] = defaultSettings[thisSetting];
      }
    } else {
      for (let thisSetting in settingsToRestore) {
        settings[thisSetting] = settingsToRestore[thisSetting];
      }
    }
  });
}

// load configuration at first launch
loadConfig();

// listen to storage change
browser.storage.onChanged.addListener(loadConfig);

// listen to browserAction icon
browser.browserAction.onClicked.addListener(function(tab) {
  urlToOpen = tab.url;
  getCurrentWindowThenCreateNewWindow(true);
});

// listen to content.js
browser.runtime.onMessage.addListener(clickFromContent);

function clickFromContent(message) {
  urlToOpen = message.url;
  getCurrentWindowThenCreateNewWindow(settings.shiftClick);
}