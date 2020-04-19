browser.omnibox.setDefaultSuggestion({
    description: `Search mapped estudij subjects`
});

browser.omnibox.onInputChanged.addListener((text, addSuggestions) => {
    let sElements = window.localStorage.getItem("elements");
    let aElements = JSON.parse(sElements ? sElements : "[]");

    let aMatchingElements = aElements.filter(oElement => oElement.name.includes(text));

    new Promise(resolve => {
        let aSuggestions = [];

        if (aMatchingElements.length > 0) {

            aMatchingElements.forEach(oElement => {
                aSuggestions.push({content: oElement.name, description: `${oElement.name} -> ${oElement.url}`});
            });
        } else {
            aSuggestions.push({content: null, description: "No results found"});
        }

        return resolve(aSuggestions);
    }).then(addSuggestions);
});

browser.omnibox.onInputEntered.addListener((text, disposition) => {
    let sElements = window.localStorage.getItem("elements");
    let aElements = JSON.parse(sElements ? sElements : "[]");

    let aMatchingElements = aElements.filter(oElement => oElement.name === text);
    
    if (aMatchingElements.length > 0) {
        switch (disposition) {
            case "currentTab":
                browser.tabs.update({url: aMatchingElements[0].url});
                break;
            case "newForegroundTab":
                browser.tabs.create({url: aMatchingElements[0].url});
                break;
            case "newBackgroundTab":
                browser.tabs.create({url: aMatchingElements[0].url, active: false});
                break;
        }
    }
});