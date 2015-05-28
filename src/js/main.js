var API_URL  = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/";
var back     = "/img/card-back.jpg";
var deck_id;
var status;
var cash = 100;
var bet = 0;
var replace = [];
var you = new Player();
var opponent= new Player();

//buttons
var $newGame = $(".new-game");
var $dealButton = $(".deal");
var $fold = $('.fold');
var $form = $('form');
var $betInput = $('.bet-input');
var $check = $(".check");
var $bet = $(".bet");
var $call = (".call");
var $raise = $(".raise");

//divs
var $community = $(".community-cards");
var $hole = $(".hole-cards");
var $opponent = $(".opponent");

//appends starting cash and bet on load
addBetToPage();

$newGame.click(function(){
  newDecks(1);
  $dealButton.removeAttr("disabled");
  status = "";
  replace.length = 0;
});

$dealButton.click(function(){
  drawCards(2, $hole);
  drawCards(2, $opponent);
  $dealButton.attr("disabled", "disabled");
})

$fold.click(function(){
  $community.empty();
  $hole.empty();
})

$form.submit(function(){
  if($betInput.val() <= cash){
    bet += parseInt($betInput.val());
    addBetToPage();
    dealCommunity();
  }
  else{
    alert("You don't have enough money!");
  }
  event.preventDefault();
})

$check.click(function(){
  dealCommunity();
})


//==========================================under the hood=================================

//player constructor
function Player(){
  this.hand = [];
  this.royalFlush = false;
  this.straightFlush = false;
  this.fourOfAKind = false;
  this.fullHouse = false;
  this.flush = false;
  this.straight = false;
  this.threeOfAKind = false;
  this.twoPair = false;
  this.onePair = false;
  this.highCard = true;
}

// get new decks
function newDecks(deck_count){
   var link = API_URL + deck_count;
  getJSON(link, function(data){
    deck_id = data.deck_id;
  });
}

//draw cards from deck and append
function drawCards(card_count, target, callback){
  var address = DRAW_URL + deck_id + "/?count=" + card_count;
  getJSON(address, function(data){
    appendCards(data, target);
  });
  if(callback){
      callback();
    }
}

//append cards to page face up for player face down for opponent
function appendCards(data, target){
  data.cards.forEach(function(cardData){
    var card = cardData.image==="http://deckofcardsapi.com/static/img/AD.png" ? "../img/aceDiamond.png" : cardData.image;
    if(target===$opponent){
      replace.push(card);
      opponent.hand.push(cardData.code);
      target.append("<img src="+ back +"></img>");
    }else{
      you.hand.push(cardData.code);
      target.append("<img src="+ card +"></img>");
    }
  });
}

//deals community cards depending on status
function dealCommunity(){
  switch(status){
    case "":
    drawCards(3, $community);
    status = "turn";
    break;
    case "turn":
    drawCards(1, $community);
    status = "river";
    break;
    case "river":
    drawCards(1, $community);
    status = "finished";
    revealOpponent();
    break;
  }
}

//reveals opponents face down cards
function revealOpponent(){
  $opponent.empty();
  replace.forEach(function(card){
    $opponent.append("<img src="+ card +"></img>");
  })
}


//adds bet to page
function addBetToPage(){
  $(".cash-space").text("$"+cash);
  $(".current-bet-space").text("$"+bet);
}

//scott's magic function for this api
function getJSON(url, cb) {
   // THIS WILL ADD THE CROSS ORIGIN HEADERS
  var request = new XMLHttpRequest();

  request.open('GET', "https://jsonp.afeld.me/?url=" + url);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    }else{console.log("fail");}
  };

   request.send();
}

