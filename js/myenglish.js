/*
This script may be useful for learning English
TODO - sort
left - то, что стоит в левой части - там собственно 
  setup
  study
  test
  stat
right  
  tables
  
*/
//var available = ["put", "come", "call", "throw"];
var lang = 'ukr';
if (lang == 'ukr') {
  $("#trans").attr("value", "Ukrainian");
} else {
  $("#trans").attr("value", "Russian");
}
var testRezult = [];
var wordsEtalon = words;
var wordsLength = words.length;
var prepareTest = [];
for (f = 0; f < wordsLength; f++){
  if (prepareTest.indexOf(words[f].key[0]) < 0){
    prepareTest.push(words[f].key[0]);
  }
}
console.log("prepareTest.length: " + prepareTest.length);
//console.log("prepareTest: " + prepareTest);

var myVar, oldIndex, newIndex, showEnglish, showRussian, showExample, randomQuestion;


var wordsFound = [];
wordsFoundLength = wordsFound.length;
questions = 0;
rightAnswers = 0;
wrongAnswers = 0;
statQuestion = [];
var statWords = [];


oldIndex = 0;

var found = false;
var randIndex = function(wordsLength){
  myVar = Math.floor(Math.random()*wordsLength);
  return myVar;
};

showEnglish = function(){
  newIndex = randIndex(wordsLength);
  while (newIndex == oldIndex) newIndex = randIndex(wordsLength); // надо исключить появление повтора
  oldIndex = newIndex;
  $("#word-eng").html(words[newIndex].eng);
  $("#showverb").attr("value", words[newIndex].key[0]);
  $("#showkeys").attr("value", words[newIndex].key[1]);
  $("#word-rus").html("- ");
  $("#word-example").html("- ");
  $("#tableverbs").html(" ");
  $("#tablekeys").html(" ");
  $("#tablefull").html(" ");
  $(".filter-buttons").show();
}
showRussian = function(){
  if (lang == 'ukr') { 
    $("#word-rus").html(words[newIndex].ukr);
  } else {
    $("#word-rus").html(words[newIndex].rus);
  } 
}
showExample = function(){
  $("#word-example").html(words[newIndex].exam);
}

searchWords = function(numKey){
  wordsFound = [];
  etalon = words[newIndex].key[numKey];
  for (f = 0; f < wordsLength; f++){
    if (etalon == words[f].key[numKey]){
      wordsFoundLength = wordsFound.length;
      wordsFound[wordsFoundLength] = words[f];
    }
  }
  wordsFound.sort(function(a,b){
    if (a.eng > b.eng) {
      return 1;
    }
    if (b.eng > a.eng) {
      return -1;
    }
    return 0;
  });
}

makeTable = function() {
  var i,outTable, found, langhead;   
  wordsFoundLength = wordsFound.length;
  langhead = (lang == 'ukr') ? "Ukrainian" : "Russian";
  outTable = "<table class='grupped'><tr><th>#</th><th id='verbHeader'>Verb</th><th id='verbRus'>" + langhead + "</th><th>Example</th></tr>";
  for (i = 0; i < wordsFoundLength; i++){
    found = (lang == 'ukr') ? wordsFound[i].ukr : wordsFound[i].rus;
    outTable  += "<tr><td>" 
              + (i+1) + "</td><td>" 
              + wordsFound[i].eng + "</td><td>" 
              + found + "</td><td>" 
              + wordsFound[i].exam + "</td></tr>";
  }
  outTable += "</table>";
  return outTable;  
}

showTableVerbs = function(){
  var outTableVerbs;
  searchWords(0); 
  outTableVerbs = makeTable();  
  $("#tableverbs").html(outTableVerbs);

}

showTableKeys = function(){
  var outTableKeys;
  searchWords(1); 
  outTableKeys = makeTable();  
  $("#tablekeys").html(outTableKeys);
}
/* 

*/
sortWords = function(){
  wordsFound = words.sort(function(a,b){
    if (a.eng > b.eng) {
      return 1;
    }
    if (b.eng > a.eng) {
      return -1;
    }
    return 0;
  });
}
showFullTable = function(){
  var outFullTable;
  sortWords();
  outFullTable = makeTable();
  $("#tablefull").html(outFullTable);  
}

/* === Setup === */

doneSetup = function(){
  var myPower = $("input[name='power'").val();
  var myDelay = $("input[name='delay'").val();
  //console.log(myPower);
  //console.log(typeof Number(myPower));
  power = Number(myPower);
  delay = Number(myDelay);
  if (power > 10) {
    power = 10;
  } else if (power <= 2){
    power = 2;
  }
  initTest();
  $(".setup-left").hide();
}

callSetup = function(){
  console.log("my show test");
  $(".setup-left").show();
  $("input[name='power'").val(power); 
  $("input[name='delay'").val(delay); 
  
}

switchUkr = function() {
  lang = 'ukr';
  $("#trans").attr("value", "Ukrainian");
}
switchUsa = function() {
  lang = 'eng';
}
switchRus = function() {
  lang = 'rus';
  $("#trans").attr("value", "Russian");
}
