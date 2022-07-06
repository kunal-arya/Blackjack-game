const yourCards = document.querySelector('[data-your-cards]');
const dealerCards = document.querySelector('[data-dealer-card]');
const hitBtn = document.querySelector('[data-hit-btn]');
const stayBtn = document.querySelector('[data-stay-btn]');
const hiddenCard = document.querySelector('[data-hidden]');
let yourSumEl = document.querySelector('[data-your-sum]');
let dealerSumEl = document.querySelector(`[data-dealer-sum]`);
let resultEl = document.querySelector('[data-result]')

window.onload = function() {
    buildDeck();
    shuffleCards();
    startGame();
}

let deck = [];
let dealerSum = 0;
let dealerAceCount = 0;

let yourSum = 0;
let yourAceCount = 0;
let hidden;
let canHit = true;

function buildDeck(){
    const value = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["S", "C", "D", "H"];
    for(let i = 0 ; i < value.length ; i++){
        for(let j = 0 ; j < types.length ; j++){
            deck.push(`${value[i]}-${types[j]}`);
        }
    }
}


function shuffleCards(){
    for(let i = 0 ; i < deck.length ; i++){
        let random = Math.floor(Math.random() * 52);
        let temp = deck[i];
        deck[i] = deck[random];
        deck[random] = temp;
    }
}




function startGame(){
    hidden = deck.pop();
    dealerSum += checkValue(hidden);
    dealerAceCount = checkAceCount(hidden);
    while(dealerSum < 17){
        // <img>
        let card = deck.pop();
        appendCards(dealerCards,card);
        dealerSum += checkValue(card);
        dealerAceCount += checkAceCount(card);
    }

    for(let i = 0 ; i < 2 ; i++){
        let card = deck.pop();
        appendCards(yourCards,card);
        yourSum += checkValue(card);
        yourAceCount += checkAceCount(card);
    }
    
    hitBtn.addEventListener("click", hitClickHandler);
    stayBtn.addEventListener("click", stayClickHandler);
}

function hitClickHandler(){
    if(!canHit){
        return;
    }

    let card = deck.pop();
    appendCards(yourCards,card);
    yourSum += checkValue(card);
    yourAceCount += checkAceCount(card);

    if(reduceAce(yourSum,yourAceCount) > 21){
        canHit = false;
    }
}

function stayClickHandler(){
    dealerSum = reduceAce(dealerSum,dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    console.log(hidden);

    hiddenCard.src = `./cards/${hidden}.png`;

    let message = "";

    if(yourSum > 21){
        message = "you Lose"
    } else if (dealerSum > 21){
        message = "you Win"
    } else if (yourSum === dealerSum){
        message = "You Lose"
    } else if( yourSum > dealerSum){
        message = "you win"
    } else if( yourSum < dealerSum){
        message = "you Lose"
    }

    console.log(message);

    dealerSumEl.innerText = `Dealer Total: ${dealerSum}`;
    yourSumEl.innerText = `your Total: ${yourSum}`;
    resultEl.innerText = `Result: ${message}`;

}

function reduceAce(sum,count) {
    while(sum > 21 && count > 0){
        sum -= 10;
        count--;
    }
    return sum;
}

function appendCards(playerCards,card){
    let imgEl = document.createElement('img');
    imgEl.src = `./cards/${card}.png`;
    playerCards.append(imgEl);
}



function checkValue(card) {
    let data = card.split('-');
    let value = data[0];
    if(isNaN(value)){
        if(value === "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAceCount(card) {
    let value = card[0];
    if(value === "A"){
        return 1;
    }
    return 0;
}