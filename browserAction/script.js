class Element {
    constructor(name, url){
        this.name = name;
        this.url = url;
    }

    static getFromObject(object) {
        return new Element(object.name, object.url);
    }
    
    generateTableHTML() {
        let parser = new DOMParser();

        let sElement =  `<div><div style="display: flex;">
            <div style="flex: 0.9;">
                <div><b>${this.name} =></b></div>
                <a class="matter-link" href="${this.url}">${this.url}</a>
            </div>
            <div style="flex: 0.1;">
                <button style="height: 100%; width: 100%;" name="${this.name}" class="remove-btn matter-button-contained matter-error">Remove</button>
            </div>      
        </div>
        <hr></div>
        `;

        return parser.parseFromString(sElement, 'text/html').body.firstChild;
    }
}

let aElements = [];

document.addEventListener("DOMContentLoaded", function(){
    let aElementTable = document.getElementsByClassName("elements-table");
    let sElements = window.localStorage.getItem("elements");

    JSON.parse(sElements ? sElements : "[]").forEach(oStorageElement => {
        let oElemnent = Element.getFromObject(oStorageElement);

        aElementTable[0].append(oElemnent.generateTableHTML());

        aElements.push(oElemnent);
    });

    addRemoveListener();
});
  

document.getElementById("add-element").addEventListener("click", oEvent => {
    let oElementNameForm = document.getElementById("name-form");
    let oElementURLForm = document.getElementById("url-form");

    let sElementName = document.getElementById("element-name").value;
    let sElementURL =  document.getElementById("element-url").value;

    if (sElementName && sElementURL && sElementName !== "" && sElementURL !== "" && sElementURL.includes("https://estudij.um.si/")) {
        oElementNameForm.classList.remove("border-red");
        oElementURLForm.classList.remove("border-red");

        let aElementTable = document.getElementsByClassName("elements-table");        

        let oElemnent = new Element(sElementName, sElementURL);

        if (aElements.filter(oSavedElement => oSavedElement.name === sElementName).length === 0) {
            aElements.push(oElemnent);

            window.localStorage.setItem("elements", JSON.stringify(aElements));
    
            aElementTable[0].append(oElemnent.generateTableHTML());
    
            document.getElementById("element-name").value = "";
            document.getElementById("element-url").value = "";
        } else {
            alert("element name already exists!");
        }        
    } else {
        if (!sElementName || sElementName === "") {
            oElementNameForm.classList += " border-red";
        }
        
        if (!sElementURL || sElementURL === "" || !sElementURL.includes("https://estudij.um.si/")) {
            oElementURLForm.classList += " border-red";
        }
    }

    addRemoveListener();
});

function addRemoveListener() {
    let aBtns = document.getElementsByClassName("remove-btn")
    for(let i = 0; i < aBtns.length; i++) {
        aBtns[i].addEventListener("click", oEvent => {
            let aElementTable = document.getElementsByClassName("elements-table");        
    
            aElements = aElements.filter(oSavedElement => oSavedElement.name !== oEvent.target.name);
        
            aElementTable[0].innerHTML = "";
        
            aElements.forEach(oElement => aElementTable[0].append(oElement.generateTableHTML()));
        
            window.localStorage.setItem("elements", JSON.stringify(aElements));

            addRemoveListener();
        });
    };
}