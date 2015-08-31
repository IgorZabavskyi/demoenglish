var onlyWord = []; // Array of words
var wordStat = []; // Array of object with this word
var wordCurrent;
var wordForTest;
var globalDirection;
var direction; // rus-eng /// eng-rus
var questions, rightAnswers, wrongAnswers, missedAnswers;
var testAnswer, oldTestIndex;
power = 5;
delay = 3000;

/* -------------------------------------------------------------------------------------- */
searchGroupWords = function(arrVerbs, arrKeys){
  wordsTest = [];
  //etalon = words[newIndex].key[numKey]; 
  wordsLength = words.length;
  //console.log("wordsLength: " + wordsLength); 
  for (f = 0; f < wordsLength; f++){
    avCurrent = 0;
    etalonVerb = words[f].key[0];
    avCurrent = arrVerbs.indexOf(etalonVerb,avCurrent);
    if (avCurrent >= 0) {
      wordsTestLength = wordsTest.length;
      wordsTest[wordsTestLength] = words[f];
    }
    avCurrent = 0;
    etalonKey = words[f].key[1];
    avCurrent = arrKeys.indexOf(etalonKey,avCurrent);
    if (avCurrent >= 0) {
      wordsTestLength = wordsTest.length;
      wordsTest[wordsTestLength] = words[f];
    }
//    array1.indexOf(searchElement[, fromIndex])
  }
  
  wordsTest.sort(function(a,b){
    if (a.eng > b.eng) {
      return 1;
    }
    if (b.eng > a.eng) {
      return -1;
    }
    return 0;
  });
}
var arr1 = ["call", "put", "get"];
var arr2 = [];
searchGroupWords(arr1,arr2);
//console.log("Test");
//console.log(wordsTest);

/* -------------------------------------------------------------------------------------- */

function initTest(){
  var initUL = "";
  for (it = 0; it < power; it++){
    initUL += '<li id="w' + it + '" onclick="checkAnswer(' + it + ')">myanswer ' + it + '</li>';
  }
  $("#initTest").html(initUL);
  $("#variants").show();
  $("#shortTimeExample").hide();
}
initTest();

/* -------------------------------------------------------------------------------------- */
showTest = function(direction){
  $("#variants").show();
  //$("#variants").hide();
  $("#shortTimeExample").hide();  
  //$("#shortTimeExample").show();  

  globalDirection = direction;
  testAnswer = randIndex(wordsTestLength);
  while (testAnswer == oldTestIndex) testAnswer = randIndex(wordsTestLength); // надо исключить появление повтора
  oldTestIndex = testAnswer;
  var testBlock = [];
  var dubl = [];
  var testObject = {questions: '', answers: '', examples: ''}; 
  if (direction == 'rus'){
    $("#headquestion").html("&nbsp;Russian Word&nbsp;");
  } else {
    $("#headquestion").html("&nbsp;English Word&nbsp;");
  }
  
  for (j = 0; j < power; j++) {
    testLength = testBlock.length;
    found = true;
    while (found == true) {
      testIndex = randIndex(wordsTestLength);
      if (direction == 'rus'){
        newQuestion = wordsTest[testIndex].rus;
        newAnswer = wordsTest[testIndex].eng;
        newExample = wordsTest[testIndex].exam;
      } else {
        newQuestion = wordsTest[testIndex].eng;
        newAnswer = wordsTest[testIndex].rus;
        newExample = wordsTest[testIndex].exam;        
      }
      found = false;
      for (f = 0; f < testLength; f++){
        if (testBlock[f].answers == newAnswer) {
          found = true;
        }
      }
    }
    testObject = {questions: newQuestion, answers: newAnswer, examples: newExample};
    testBlock[testBlock.length] = testObject; 
  }

  randomQuestion = randIndex(power);  // это мы выбираем из 5
  wordForTest =  testBlock[randomQuestion].questions;
  examForTest =  testBlock[randomQuestion].examples;
  $("#testword").html(wordForTest);
  $("#testword").attr("answer", randomQuestion);
  $("#testword").attr("example", examForTest);

  // Вот тут если нету в базе такой строки - добавить новую строку {word: 'come in', count: 3, right: 2, wrong: 1}

  wordCurrent = {word: '', count: 1, right: 0, wrong: 0, missed: 1}; 
  wordCurrent.word = wordForTest; // это то, что мы вытащили для блока!!!
  
  var avc = 0;
  avc = onlyWord.indexOf(wordForTest,avc);
  if (avc < 0){
    onlyWord.push(wordForTest); 
    wordStat.push(wordCurrent);    
  } else {
    wordStat[avc].count++;
    wordStat[avc].missed++;
  }

  // Мы сначала смотрим, есть ли в базе наше слово 
  // попробуем работать с двумя базами - одна - имеется слово только, во вторую ставим полностью все - объект
   
  for (a = 0; a < power; a++) {
    $("#w"+a).html(testBlock[a].answers);
    $("#w"+a).css("color", "black");
  }
}

checkAnswer = function(numAnswer){
  rightAnswer = $("#testword").attr("answer");  // берем ответ из атрибута
  exampleAfter = $("#testword").attr("example");  // берем ответ из атрибута
  questions++;

  var avArr = 0;
  avArr = onlyWord.indexOf(wordForTest,avArr);

  if (numAnswer == rightAnswer){
    $("#w"+numAnswer).css("color", "green");
    $("#testword").css("color", "green");
    $("#variants").hide();
    //console.log(exampleAfter);
    $("#shortTimeExample").html(exampleAfter);
    $("#shortTimeExample").show();
    setTimeout("showTest(globalDirection);$('#testword').css('color', 'blue')",delay);
 
    rightAnswers++;
    wordStat[avArr].right++;
    wordStat[avArr].missed -= 1;
  } else {
    $("#w"+numAnswer).css("color", "red");
    $("#testword").css("color", "red");
    wrongAnswers++;
    //questions -= 1;
    wordStat[avArr].wrong++;    
  }
  $("#questions").html(questions);
  $("#rightanswers").html(rightAnswers);
  $("#wronganswers").html(wrongAnswers);
  /*
  работаем с ответами - для этого берем добавляем ответ в базу ответов и указываем, что реально ответил человек - то есть... увеличиваем счетчик правильных-неправильных ответов
   
  если кликнуто на следующий после правильного ответа - значит все нормально
  */
}
 
makeTableStat = function() {
  var i,outTable;   
  wordStatLength = 	wordStat.length;
  
  wordStatSort = wordStat.sort(function(a,b){
    if (a.word > b.word) {
      return 1;
    }
    if (b.word > a.word) {
      return -1;
    }
    return 0;
  });
  if (wordStatLength == 0) {
    outTable = "There is no statistics for the current session!";
  } else {
    outTable = "<table class='statistics-table'><tr><th id='stat-word'>Question</th><th id='stat-count'>Count</th><th id='stat-right'>Right</th><th id='stat-wrong'>Wrong</th><th id='stat-missed'>Missed</th></tr>";
    for (i = 0; i < wordStatLength; i++){
      if (wordStatSort[i].wrong > 0) {
        colorrezult = "wronganswer";
      } else {
        colorrezult = "rightanswer";
      }
      outTable  += "<tr class='" + colorrezult + "'><td>" 
                + wordStatSort[i].word + "</td><td>" 
                + wordStatSort[i].count + "</td><td>" 
                + wordStatSort[i].right + "</td><td>" 
                + wordStatSort[i].wrong + "</td><td>" 
                + wordStatSort[i].missed + "</td></tr>";
    }
    outTable += "</table>";
  }  
  return outTable;  
}

showStat = function() {
  var outTableStat; 
  
  outTableStat = makeTableStat();  
  $(".side-stat").show();
  $(".side-test").hide();
  $("#statfull").html(outTableStat);
}

doneStat = function(){
  $(".side-stat").hide();
  $(".side-test").show();
}