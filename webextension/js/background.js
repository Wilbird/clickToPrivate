let urlToOpen;
let settings = {};

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
    browser.windows.create(tabParams);
  } else {
    throw ('Protocol not supported !');
  }
  
}

function loadConfig() {
  let getting = browser.storage.sync.get();
  getting.then((settingsToRestore) => {
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
  createNewWindowTab(true);
});

// listen to content.js
browser.runtime.onMessage.addListener(notify);

function notify(message) {
  urlToOpen = message.url;
  createNewWindowTab(settings.shiftClick);
}