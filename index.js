//Variables for grabbiing html elements
const cardArea = document.getElementById('card-container');
//start screen variables
const howMany = document.getElementById("number-input");
const loadSub = document.getElementById("load-submit");
const startScreen = document.getElementById("start-screen");
const undoB = document.getElementById('undo-button');
//reset function variables
const resetB = document.getElementById("reset-button");
const resetAlert = document.getElementById("reset-alert");
const yesB = document.getElementById("yes");
const noB = document.getElementById("no");
//sorting function variables
const sortB = document.getElementById('sort-button');
const sortBar = document.getElementById('sort-bar');
const sortChangeB = document.getElementById('sort-change-button');
const sortValueB = document.getElementById('sort-value-button');
const sortAbcB = document.getElementById('sort-abc-button');
const hideSortB = document.getElementById('sort-hide-button');
//new variables
let coinArr;


//waiting for the page contents to load and then adding event listeners to visible elements
document.addEventListener('DOMContentLoaded', () => {
    //creating a copy of the api data so that I'm not fetching everytime I create new cards
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
        .then((response) => response.json())
        .then((data) => {
            coinArr = data;
            console.log(coinArr);
        });
    loadSub.addEventListener('click', () => {
        clearCards();
        for(let i = 0; i < howMany.value; i++){
            createCard(coinArr[i]);
        }
        cardArea.style.display = 'flex';
        startScreen.classList.add('hidden');
    });
    //adding event listener to the reset and sort buttons in the header
    resetB.addEventListener('click', () => resetAlertFunction());
    sortB.addEventListener('click', () => sortFunction());
    sortB.disabled = true;
    sortAbcB.addEventListener('click', () => sortAlphabetically());
    sortValueB.addEventListener('click', () => sortByValue());
    sortChangeB.addEventListener('click', () => sortByChange());
    hideSortB.addEventListener('click', () => hideSortBar());
});

//function for creating crypto cards 
function createCard(element){
    //initializing new elements to hold data
    let newCard = document.createElement('div');
    let newHeader = document.createElement('h3');
    let newIcon = document.createElement('img');
    let newTitle = document.createElement('p');
    let newP = document.createElement('p');
    let newTitle2 = document.createElement('p');
    let newP2 = document.createElement('p');
    let newRemove = document.createElement('input');
    //creating the content of the elements using the data I fetched from the API
    newCard.id = element.id;
    newCard.classList.add('card');
    newHeader.innerText = element.name;
    newIcon.src = element.image;
    newTitle.innerText = "Current Price (USD):";
    newTitle2.innerText = "Change In Price (USD):";
    newP.innerText = element['high_24h'];
    newP2.innerText = element['price_change_24h'];
    newRemove.classList.add('rmvButt');
    newRemove.type = 'button';
    newRemove.value = "Remove";
    //appending the content elements to the card
    newCard.appendChild(newHeader);
    newCard.appendChild(newIcon);
    newCard.appendChild(newTitle);
    newCard.appendChild(newP);
    newCard.appendChild(newTitle2);
    newCard.appendChild(newP2);
    newCard.appendChild(newRemove);
    //add hover event listeners, and remove button event listeners to every card created
    newCard.addEventListener('mouseover', (event) => {
        event.target.style.opacity = 1.0;
    });
    newCard.addEventListener('mouseleave', (event) => {
        event.target.style.opacity = 0.5;
    });
    newRemove.addEventListener('click', (event) => {
        newRemove.parentNode.parentNode.removeChild(newRemove.parentNode);
    });
    //append new card with listener to card area
    cardArea.appendChild(newCard);
    //now you can sort
    sortB.disabled = false;
};

//function to handle sequence when hitting reset button
function resetAlertFunction(){
    hideSortBar();
    sortB.disabled = true;
    cardArea.style.display = 'none';
    resetAlert.classList.remove('hidden');
    yesB.addEventListener('click',() => {
        //switching the screen to the start screen to load more cards
        resetAlert.classList.add('hidden');
        startScreen.classList.remove('hidden');
        undoB.classList.remove('hidden');
        undoB.addEventListener('click', () => undoReset());
    });
    // clears the reset screen in case it was hit on accident or the user does not actually want to reset
    noB.addEventListener('click', () => {
        resetAlert.classList.add('hidden');
        cardArea.style.display = 'flex';
        sortB.disabled = false;
    });
};


//switches the screen back to the collection of cards 
function undoReset(){
    startScreen.classList.add('hidden');
    cardArea.style.display = 'flex';
    sortB.disabled = false;
}


//made this function seperate to clear clutter 
function clearCards(){ 
    while(cardArea.firstChild){
        cardArea.removeChild(cardArea.lastChild);
    };
}


//funcion added to sort button that works the bar popup and adds sort-button event listeners
function sortFunction(){
    sortBar.style.transform = 'translateY(200px)';
}

//sorting functions
function sortAlphabetically(){
    let activeCards = [];
    while(cardArea.firstChild){
        activeCards.push(cardArea.lastChild);
        cardArea.removeChild(cardArea.lastChild);
    };
    console.log(activeCards);
    const cardsAndNames = activeCards.map((div) => {
        const cardName = div.querySelector("h3").textContent;
        return { div, cardName };
      });
    console.log(cardsAndNames);
    cardsAndNames.sort((a,b) => a.cardName.localeCompare(b.cardName))
    console.log(cardsAndNames);
    cardsAndNames.forEach((card) => cardArea.appendChild(card.div))
}
//sorting by current value of the crypto
function sortByValue(){
    let activeCards = [];
    while(cardArea.firstChild){
        activeCards.push(cardArea.lastChild);
        cardArea.removeChild(cardArea.lastChild);
    };
    console.log(activeCards);
    const cardsAndValues = activeCards.map((div) => {
        const cardValue = parseFloat(div.querySelectorAll('p')[1].textContent, 10);
        return { div, cardValue };
      });
    console.log(cardsAndValues);
    cardsAndValues.sort((a,b) => b.cardValue - a.cardValue)
    console.log(cardsAndValues);
    cardsAndValues.forEach((card) => cardArea.appendChild(card.div))
}
//sorting by highest to lowest change in price in the last 24hr
function sortByChange(){
    let activeCards = [];
    while(cardArea.firstChild){
        activeCards.push(cardArea.lastChild);
        cardArea.removeChild(cardArea.lastChild);
    };
    console.log(activeCards);
    const cardsAndValues = activeCards.map((div) => {
        const cardValue = parseFloat(div.querySelectorAll("p")[3].textContent, 10);
        return { div, cardValue };
      });
    console.log(cardsAndValues);
    cardsAndValues.sort((a,b) => b.cardValue - a.cardValue)
    console.log(cardsAndValues);
    cardsAndValues.forEach((card) => cardArea.appendChild(card.div))
}
function hideSortBar(){
    sortBar.style.transform = 'translateY(-200px)';
}