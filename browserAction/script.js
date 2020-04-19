class Element {
    constructor(name, url){
        this.name = name;
        this.url = url;
    }

    static getFromObject(object) {
        return new Element(object.name, object.url);
    }
    
    generateTableHTML() {
        return `<tr>
            <td>${this.name}</td>
            <td>
                <a class="matter-link" href="${this.url}">${this.url}</a>
            </td>
            <td class="table-right">
                <button name="${this.name}" class="remove-btn matter-button-contained matter-error">Remove</button>
            </td>                
        </tr>
        `;
    }
}

let aElements = [];

document.addEventListener("DOMContentLoaded", function(){
    let aElementTable = document.getElementsByClassName("elements-table");
    let sElements = window.localStorage.getItem("elements");

    JSON.parse(sElements ? sElements : "[]").forEach(oStorageElement => {
        let oElemnent = Element.getFromObject(oStorageElement);

        aElementTable[0].innerHTML += oElemnent.generateTableHTML();

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
    
            aElementTable[0].innerHTML += oElemnent.generateTableHTML();
    
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
        
            aElements.forEach(oElement => aElementTable[0].innerHTML += oElement.generateTableHTML());
        
            window.localStorage.setItem("elements", JSON.stringify(aElements));

            addRemoveListener();
        });
    };
}