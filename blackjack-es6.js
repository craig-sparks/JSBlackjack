const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const createDeck = () => {
    let deck = [];

    for (let suit of suits) {
        for(var v = 0; v < values.length; v++) {
            let card = {Value: values[v], Suit: suit};
            deck.push(card);
        }
    }
    return deck;
}

const shuffleDeck = (deck) => {
    // for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++) {
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

const dealCard = (target, deck, stack, showFace = true) => {
    let dealtCard = deck.shift();
    let card = document.createElement("div");
    let value = document.createElement("div");
    let suit = document.createElement("div");

    card.className = "card";
    if(showFace != true) {
        card.className += " back";
    }
    value.className = "value";
    suit.className = "suit " + dealtCard.Suit;

    value.innerHTML = dealtCard.Value;
    card.appendChild(value);
    card.appendChild(suit);

    target.appendChild(card);
    stack.push(dealtCard);
}

const getCardTotals = (stack) => {
    let total = 0;
    let aceCount = 0;
    stack.forEach(
        card => {
            // If card is an ace, we just add it to ace count to deal with at the end
            if(card.Value == "A") {
                aceCount++;
            // Check for our special case cards and make their value 10
            } else if(["J","Q","K"].includes(card.Value)) {
                total += 10;
            // All other cards, add face value to total
            } else {
                total += parseInt(card.Value);
            }
        }
    );

    if(aceCount > 0) {
        // Check if score can use higher ace value without bust
        if(total <= 10) {
            if(aceCount == 1) {
                total += 11;
            } else {
                for(a=1;a<=aceCount;a++) {
                    if(total + 11 <= 21) {
                        total += 11;
                    } else {
                        total += 1;
                    }
                }
            }
        // Otherwise add a point for each ace
        } else {
            total += aceCount;
        }
    }

    return total;
}

const startGame = () => {
    playerCardContainer = document.getElementById("playerCards");
    dealerCardContainer = document.getElementById("dealerCards");

    playerScoreContainer = document.getElementById("playerScore");
    dealerScoreContainer = document.getElementById("dealerScore");

    dealerCards = [];
    playerCards = [];

    playerStandStatus = false;
    dealerStandStatus = false;

    gameDeck = createDeck();
    shuffleDeck(gameDeck);

    showActionButtons();

    playerCardContainer.innerHTML = "";
    dealerCardContainer.innerHTML = "";
    
    dealCard(playerCardContainer, gameDeck, playerCards);
    dealCard(dealerCardContainer, gameDeck, dealerCards, false);

    dealCard(playerCardContainer, gameDeck, playerCards);
    dealCard(dealerCardContainer, gameDeck, dealerCards);

    playerScore = getCardTotals(playerCards);
    dealerScore = getCardTotals(dealerCards)

    playerScoreContainer.innerHTML = playerScore.toString();
    //dealerScoreContainer.innerHTML = getCardTotals(dealerCards).toString();

    checkScoreConditions();  
}

const showActionButtons = () => {
    playerHitButton = document.getElementById("playerHit");
    playerStandButton = document.getElementById("playerStand");
    dealButton = document.getElementById("dealButton");

    dealButton.className = "hidden";
    playerHitButton.className = "";
    playerStandButton.className = "";
}

const showDealButton = () => {
    dealButton = document.getElementById("dealButton");
    playerHitButton = document.getElementById("playerHit");
    playerStandButton = document.getElementById("playerStand");
    dealButton.className = "";
    playerHitButton.className = "hidden";
    playerStandButton.className = "hidden";
}

const renderWin = () => {
    playerScoreContainer = document.getElementById("playerScore");
    playerScoreContainer.innerHTML += ' - <span class="winner">WINNER!!!</span>';
    showDealButton();
}

const renderLoss = () => {
    revealDealerCard();
    playerScoreContainer = document.getElementById("playerScore");
    playerScoreContainer.innerHTML += ' - <span class="loser">YOU LOSE!</span>';
    showDealButton();
}

const renderPush = () => {
    playerScoreContainer = document.getElementById("playerScore");
    playerScoreContainer.innerHTML += ' - <span class="push">PUSH!</span>';
    showDealButton();
}

const revealDealerCard = () => {
    console.log("reveal dealer card");
    dealerScoreContainer = document.getElementById("dealerScore");
    dealerScoreContainer.innerHTML = getCardTotals(dealerCards).toString();

    hidden = document.getElementsByClassName('back');
    console.log(hidden);
    hidden[0].className = "card";
}

const checkScoreConditions = () => {
    if(playerScore == 21 && dealerScore == 21) {
        renderPush();
        return;
    }

    if(playerScore == 21) {
        renderWin();
        revealDealerCard();
        return;
    }

    if(playerScore > 21) {
        renderLoss();
        return;
    }

    if(dealerScore == 21) {
        renderLoss();
        return;
    }

    if(playerStandStatus && dealerStandStatus) {
        if(dealerScore > playerScore) {
            renderLoss();
        } else {
            renderWin();
        }
    }
}

const playerHit = () => {
    playerCardContainer = document.getElementById("playerCards");
    playerScoreContainer = document.getElementById("playerScore");

    dealCard(playerCardContainer, gameDeck, playerCards);

    playerScore = getCardTotals(playerCards);
    playerScoreContainer.innerHTML = playerScore.toString();

    checkScoreConditions(playerScore);
}

const playerStand = () => {
    playerStandStatus = true;
    dealerTurn();
}

const dealerTurn = () => {
    console.log("Dealer Turn");
    dealerCardContainer = document.getElementById("dealerCards");

    if(dealerScore == 21) {
        console.log("Dealer 21");
        renderLoss();
        return;
    }

    if(dealerScore > 16) {
        console.log("Dealer stand at 17");
        dealerStand = true;
    }

    while(dealerScore < 17) {
        console.log("Dealing Card");
        dealCard(dealerCardContainer, gameDeck, dealerCards, true);
        dealerScore = getCardTotals(dealerCards);
    }

    dealerStandStatus = true;

    //revealDealerCard();
    checkScoreConditions(playerScore, dealerScore);
}

startGame();