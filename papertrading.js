var interval = setInterval(doStuff, 1000);

function doStuff(){
    window.formBuy = document.getElementById("form_Buy");
    window.formSell = document.getElementById("form_Sell");
    if(window.formBuy != null && window.formSell != null){
        console.log("here:" + localStorage.getItem("BTC"));
        window.formBuy.lastElementChild.appendChild(createButton("Paper Buy", "plus", paperBuy));
        window.formSell.lastElementChild.appendChild(createButton("Paper Sell", "minus", paperSell));
        let urlParams = new URLSearchParams(window.location.search);
        window.buyCurrency = urlParams.get("MarketName").split('-')[1];
        window.sellCurrency = urlParams.get("MarketName").split('-')[0];

        var headings = Array.from(document.getElementsByClassName("panel-heading"));
        var sellHeading = headings.filter(t => t.innerText.indexOf("BUY") != -1)[0].firstElementChild.firstElementChild.firstElementChild;
        var buyHeading = headings.filter(t => t.innerText.indexOf("SELL") != -1)[0].firstElementChild.firstElementChild.firstElementChild;
        window.buyBalance = createBalanceText();
        window.sellBalance = createBalanceText();
        buyHeading.insertBefore(window.buyBalance, buyHeading.lastElementChild);
        sellHeading.insertBefore(window.sellBalance, sellHeading.lastElementChild);
        updateBalance();

        
        var buyMax = window.formBuy.firstElementChild.children[1].firstElementChild;
        buyMax.insertBefore(createMaxButton(function(){
            
            window.formBuy.quantity_Buy.value = getHeldSell() / window.formBuy.price_Buy.value;
        }), buyMax.firstElementChild);
        var sellMax = window.formSell.firstElementChild.children[1].firstElementChild;
        sellMax.insertBefore(createMaxButton(function(){
            window.formSell.quantity_Sell.value = getHeldBuy();
        }), sellMax.firstElementChild);
        

        clearInterval(interval);
    }
}

function createMaxButton(callback){
//<button class="btn btn-primary" style="float: left; width:100px;">max</button>
    var element  = document.createElement("button");
    element.classList.add("btn");
    element.classList.add("btn-primary");
    element.style = "float: left; width: 100px;";
    element.innerText = "Paper Max";
    element.type = "button";
    element.onclick = callback;
    return element;
}

function createBalanceText(){
    var element = document.createElement("td");
    element.style = "text-align: left";
    return element;
}

function createButton(val, plusMinus, callback) {
    var element = document.createElement("button");
    // element.innerText = val;
    element.innerHTML = "<i class=\"fa fa-" + plusMinus + "\"></i>&nbsp; " + val
    //btn btn-primary center-block
    element.classList.add("btn");
    element.classList.add("bbtn-primarytn");
    element.classList.add("center-block");
    element.style = "width:200px; margin-top:10px;";
    element.type ="button";
    element.onclick = callback;
    return element;
}

function updateBalance(){
    window.buyBalance.innerText = "Paper:" + getHeldBuy().toFixed(8) + " " + window.buyCurrency;
    window.sellBalance.innerText = "Paper:" + getHeldSell().toFixed(8) + " " + window.sellCurrency;
}

function paperBuy(){
    var heldSell = getHeldSell();
    var heldBuy = getHeldBuy();
    var quantity = parseFloat(window.formBuy.quantity_Buy.value);
    var price = parseFloat(window.formBuy.price_Buy.value);

    if(quantity == 0 || price == 0){
        return;
    }
    if(heldSell < price*quantity){
        alert("you only have " + heldSell + " " + window.sellCurrency + " you can't spent " + (price*quantity));
        return;
    }
  
    heldBuy += quantity;
    heldSell -= (price*quantity);
    setHeldSell(heldSell);
    setHeldBuy(heldBuy);
    updateBalance();
    alert("Paper bought " + quantity + " " + window.buyCurrency + " at " + price + " " + window.sellCurrency + " for " + (quantity*price) + " " + window.sellCurrency);
}

function paperSell(){
    var heldSell = getHeldSell();
    var heldBuy = getHeldBuy();
    var quantity = parseFloat(window.formSell.quantity_Sell.value);
    var price = parseFloat(window.formSell.price_Sell.value);

    if(quantity == 0 || price == 0){
        return;
    }
    if(heldBuy < quantity){
        alert("you only have " + heldBuy + " " + window.buyCurrency + " you can't sell " + quantity);
        return;
    }

    heldSell += quantity*price;
    heldBuy -= quantity;
    setHeldBuy(heldBuy);
    setHeldSell(heldSell);
    updateBalance();
    alert("Paper sold " + quantity + " " + window.buyCurrency + " at " + price + " " + window.sellCurrency + " for " + (quantity*price) + " " + window.sellCurrency);
}

function getHeldBuy(){
    var heldBuy = parseFloat(localStorage.getItem(window.buyCurrency));
    heldBuy = (heldBuy == null || isNaN(heldBuy)) ? 0 : heldBuy;
    return heldBuy;    
}

function getHeldSell(){
    var heldSell = parseFloat(localStorage.getItem(window.sellCurrency));
    heldSell = (heldSell == null || isNaN(heldSell)) ? (window.sellCurrency == "USDT" ? 20000 : 0) : heldSell;
    return heldSell;
}

function setHeldBuy(val){
    localStorage.setItem(window.buyCurrency, val.toString());
}

function setHeldSell(val){
    localStorage.setItem(window.sellCurrency, val.toString());
}
