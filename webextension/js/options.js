document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

let firstInstall = false;

function restoreOptions() {

    // Load translated texts on option page
    function buildOptionsPage(stringsToRestore) {
        for (const name of stringsToRestore) {
            document.querySelector("#L_" + name)
            .appendChild(document.createTextNode(browser.i18n.getMessage(name)));
        }
    }

    buildOptionsPage(["stateDesc", "stateTitle", "state", "state_0", "state_1", "state_2", 
        "shiftClickTitle", "shiftClickDesc", "shiftClick", "saveTitle", "save"]);
    
    // Restore saved settings or defaults on the option page
    let getting = browser.storage.sync.get()
    getting.then((settingsToRestore) => {
        function restoreSelect(name, defaultValue) {
            if (settingsToRestore[name] === undefined) {
                document.querySelector("#" + name)
                .value = defaultValue;
            } else {
                document.querySelector("#" + name)
                .value = settingsToRestore[name];
            }
        }
        
        function restoreCheckbox(name, defaultValue) {
            if (settingsToRestore[name] === undefined) {
                document.querySelector("#" + name)
                .checked = defaultValue;
            } else {
                document.querySelector("#" + name)
                .checked = settingsToRestore[name];
            }
        }

        // Just installed ?
        if (settingsToRestore['state'] === undefined) {
            firstInstall = true;
            settings = defaultSettings;
        } else {
            settings = settingsToRestore;
        }
        // Run restore settings
        for (let thisSetting in settings) {
            if (typeof(defaultSettings[thisSetting]) === 'boolean') {
                restoreCheckbox(thisSetting, defaultSettings[thisSetting]);
            } else {
                restoreSelect(thisSetting, defaultSettings[thisSetting]);
            }
        }
        // Save config for new install
        if (firstInstall) {
            saveDefaults();
        }
    });
}

function saveOptions(e) {
    e.preventDefault();
    let settingsToSave = {};
    for (let thisSetting in defaultSettings) {
        if (typeof(defaultSettings[thisSetting]) === 'boolean') {
            settingsToSave[thisSetting] = document.querySelector("#"+thisSetting).checked;
        } else {
            settingsToSave[thisSetting] = document.querySelector("#"+thisSetting).value;
        }
    }
      
    browser.storage.sync.set(settingsToSave);
}

function saveDefaults() {

    function onOk() {
        console.log('Default settings saved');
    }

    function onError(e) {
        console.log(`Error: unable to save defaults / ${error}`);
    }

    let settingsToSave = {};
    for (let thisSetting in defaultSettings) {
            settingsToSave[thisSetting] = defaultSettings[thisSetting];
    }

    browser.storage.sync.set(settingsToSave)
        .then(onOk, onError);
}