var interval = setInterval(doStuff, 1000);

function doStuff(){
    window.balanceTable = document.getElementById("balanceTable");

    if(window.balanceTable != null){
        var tr = window.balanceTable.firstElementChild.firstElementChild;
        tr.appendChild(createCategorieText("Paper Balance"));
        tr.appendChild(createCategorieText("Paper +/-"));

        window.tbody = window.balanceTable.children[1];
        updateBalances();

        var observer = new MutationObserver(updateBalances);
        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(window.tbody, config);

        clearInterval(interval);
    }
}

function updateBalances(){
    Array.from(window.tbody.children).forEach(t => createBalanceText(t));    
}

function createBalanceText(tr){
    var ticker = tr.children[2].innerText.trim();
    if(tr.children.length > 9){
        tr.children[9].childNodes[0].nodeValue = getHeld(ticker);
        return;
    }
        
    var balance = getHeld(ticker);

    var div = document.createElement("div");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");

    td1.innerText = balance;
    td1.classList.add("number");
    td1.appendChild(div);
    td2.appendChild(div);
    td2.classList.add("options");

    div.appendChild(createSpawnButton(ticker));
    div.appendChild(createDeleteButton(ticker));
    div.classList.add("center-block");
    div.classList.add("text-center");

    tr.appendChild(td1);
    tr.appendChild(td2);
}

function createDeleteButton(balance){
    let element = document.createElement("button");
    let ticker = balance;
    element.type = "button";
    element.classList.add("btn");
    element.classList.add("btn-primary");
    element.classList.add("btn-xs");
    element.classList.add("text-center");
    element.style = "margin:-6px 2px";
    var span = document.createElement("span");
    span.classList.add("fa");
    span.classList.add("fa-minus");
    element.appendChild(span);
    //btn btn-primary btn-xs text-center wallet

    element.onclick = function(){
        setHeld(ticker, 0);
        updateBalances();
    }
    return element;
}

function createSpawnButton(balance){
    let element = document.createElement("button");
    let ticker = balance;
    element.type = "button";
    element.classList.add("btn");
    element.classList.add("btn-primary");
    element.classList.add("btn-xs");
    element.classList.add("text-center");
    element.style = "margin:-6px 2px";    
    var span = document.createElement("span");
    span.classList.add("fa");
    span.classList.add("fa-plus");
    element.appendChild(span);
    //btn btn-primary btn-xs text-center wallet

    element.onclick = function(){
        setHeld(ticker, getHeld(ticker) + 1000);
        updateBalances();
    }
    return element;
}

function createCategorieText(text){
    var element = document.createElement("th");
    element.classList.add("col-header");
    element.classList.add("col-header-label");
    element.classList.add("name");
    element.classList.add("sorting");
    element.tabIndex = 0;
    element.setAttribute("aria-controls", "balanceTable");
    element.rowSpan = 1;
    element.colSpan = 1;
    element.innerText = text;
    return element;
}

function getHeld(ticker){
    var heldBuy = parseFloat(localStorage.getItem(ticker));
    heldBuy = (heldBuy == null || isNaN(heldBuy)) ? (ticker == "USDT" ? 20000 : 0) : heldBuy;
    return heldBuy;    
}

function setHeld(ticker, val){
    localStorage.setItem(ticker, val.toString());
}


