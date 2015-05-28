var API_URL  = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/";
var back     = "/img/card-back.jpg";
var deck_id;
var status = "";

var $newGame = $(".new-game");
var $dealButton = $(".deal");
var $fold = $('.fold');
var $check = $(".check");
var $community = $(".community-cards");
var $hole = $(".hole-cards")


$newGame.click(function(){
  newDecks(6);
  $dealButton.removeAttr("disabled");
});

$dealButton.click(function(){
  drawCards(2, $hole);
  $dealButton.attr("disabled", "disabled");
})

$fold.click(function(){
  $community.empty();
  $hole.empty();
})

$check.click(function(){
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
    break;
  }
})

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

function appendCards(data, target){
  data.cards.forEach(function(card){
      var card = card.image==="http://deckofcardsapi.com/static/img/AD.png" ? "../img/aceDiamond.png" : card.image
      target.append("<img src="+ card +"></img>")
    });
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

