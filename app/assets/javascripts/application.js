// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require angular/angular
//= require_tree .
var app = angular.module("connect4",[]);

var gameTable = []; //Game Data Table || Value 0 = none; 1 = Player1; 2 = Player2

var levelTracker = []; //Column Level Tracker

var connectMax = 0;

var columnMax,rowMax;

var turn = 0; //0 - Player1 Turn  1 - Player2 Turn

var turnCounter = 0;

app.controller("GameController",function($scope){

	

	$scope.rules = {

		columns : 7,

		connect : 4,

		rows : 6,

		columnArray : [7,8,9],

		rowArray : [6,7,8],

		connectArray : [4,5,6]

		};

	$scope.$watch('checked', function(newValue,oldValue){

		if(!newValue){

			$scope.rules.columns = 7;

			$scope.rules.connect = 4;

			$scope.rules.rows = 6;

		}

	});

	$scope.game = {

		table : [],

		columns : [],

		connect : 4,

		rows : [],

		gameType : 1

	};

	$scope.pushData = function(storage, valueRange){

		var i=valueRange-1;

		for(;i>=0;i--){

			storage.push(i);

		}

	};

	$scope.initializeGameTable = function(){

		$scope.game.table = [];

		$scope.game.columns = [];

		$scope.game.rows = [];

	}

	$scope.start = function(value){

		var columns = $scope.rules.columns;

		var rows = $scope.rules.rows;

		var connect = $scope.rules.connect;

		document.getElementById('menu').className="hide";

		document.getElementById('game-view').className="unhide";

		$scope.initializeGameTable();

		$scope.game.table = [1];

		$scope.pushData($scope.game.columns,$scope.rules.columns);//For UI Iteration purpose

		$scope.pushData($scope.game.rows,$scope.rules.rows);//For UI Iteration purpose

		$scope.game.connect = $scope.rules.connect;//For UI purpose

		$scope.game.gameType = value; //Singleplayer or Multiplayer TBC

		initializeGameTable(columns,rows,connect); //Initialize Game Table Data

		initializeLevelTracker(columns);

		initializeTurnCounter(); 

		startGame();

	};

	$scope.dropToken = function(id){

		var temp = id;

		dropToken(temp);

	}

	function getNodeIndex(nodeId){

		var temp =parseInt(nodeId.replace("game-node",""));

		var x = (temp/10) * columnMax; 

		temp = temp % 10;

		return  temp + x;

	};

	function getColumnIndex(nodeId){

		return parseInt(nodeId.replace("game-node-header",""));

	};

	function checkTurnAvailability(){ //Returns true if turn is available; false if not

		return turnCounter>0? true:false;

	}

	function checkDropAvailability(column){

		return levelTracker[column]<rowMax? true: false;

	}

	function setBackgroundToken(id){

		var bgPurple = "bg-purple"; //Player 1 Background Color

		var bgGreen = "bg-green"; //Player 2 Background Color

		var colorStr = bgPurple;

		if(turn){

			colorStr= bgGreen;

		}

		document.getElementById(id).className = colorStr;

	}

	function setTokenInColumn(column){

		var str= "game-node";

		var temp = column + (columnMax*levelTracker[column]);

		console.log("-------------------");

		console.log("columnMax * levelTracker => "+columnMax*levelTracker[column]);

		console.log("row => "+levelTracker[column]);

		console.log("column => "+column);

		console.log("set token to => "+temp);

		gameTable[temp]=turn+1; //1-Player1 2-Player2

		console.log("data token =>"+gameTable[temp]);

		setBackgroundToken(str+levelTracker[column]+''+column) //Set background color of input text

		

	}

	function isLeftEnd(point){

		var retval = false;

		if(point%columnMax==(columnMax-1)){

			retval = true;

			console.log("point ["+point+"] vertical end left=> TRUE");

		}

		return retval;

	}

	function isRightEnd(point){

		var retval = false;

		if(point%columnMax==0){

			retval = true;

			console.log("point ["+point+"] vertical end right=> TRUE");

		}

		return retval;

	}

	function isTopEnd(point){

		var retval = false;

		if(columnMax*rowMax > point && point >  (columnMax*rowMax) - columnMax){

			retval = true;

			console.log("point ["+point+"] horizontal end top=> TRUE");	

		}

		return retval;

	}

	function isBottomEnd(point){

		var retval = false;

		if(point<columnMax && point >=0){

			retval = true;

			console.log("point ["+point+"] horizontal end bottom=> TRUE");	

		}

		return retval;

	}

	function countUp(point,value){

		var count;

		if(point>=columnMax*rowMax){

			console.log("point ["+point+"] exceeds max");	

			return 0;

		}

		else if(isTopEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countUp(point+columnMax)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countDown(point,value){

		var count;

		if(point<0){

			console.log("point ["+point+"] less than 0 ");	

			return 0;

		}

		else if(isBottomEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countDown(point-columnMax,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countLeft(point,value){

		var count;

		if(isLeftEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countLeft(point+1,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countRight(point,value){

		var count;

		if(isRightEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countRight(point-1,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countRightUp(point,value){

		var count;

		if(point>=columnMax*rowMax){

			return 0;

		}

		else if(isTopEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else if(isRightEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countRightUp(point+columnMax-1,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countLeftUp(point,value){

		var count;

		if(point>=columnMax*rowMax){

			return 0;

		}

		else if(isTopEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else if(isLeftEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countLeftUp(point+columnMax+1,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countRightDown(point,value){

		var count;

		if(point<0){

			return 0;

		}

		else if(isBottomEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else if(isRightEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countRightDown(point-columnMax-1,value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function countLeftDown(point,value){

		var count;

		if(point<0){

			return 0;

		}

		else if(isBottomEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else if(isLeftEnd(point)){

			if(gameTable[point]==value)

				return 1;

			else

				return 0;

		}

		else{

			if(gameTable[point]==value){

				count=countLeftDown(point-(columnMax-1),value)+1;

				return count;

			}

			else{

				return 0;

			}

		}

	}

	function checkIfWon(column){

		var row = levelTracker[column];

		var startingPoint = column + columnMax * row;

		var value = turn+1;

		var horizontal = (countUp(startingPoint,value)+countDown(startingPoint,value)-1);

		var vertical = (countLeft(startingPoint,value)+countRight(startingPoint,value)-1);

		var diagonal1 = (countLeftUp(startingPoint,value)+countRightDown(startingPoint,value)-1);

		var diagonal2 = (countLeftDown(startingPoint,value)+countRightUp(startingPoint,value)-1);

		var retval = true;

		console.log("+++++++++++++++++");

		console.log("Count Up "+countUp(startingPoint,value));

		console.log("Count Down "+countDown(startingPoint,value));

		console.log("Count Left "+countLeft(startingPoint,value));

		console.log("Count Right "+countRight(startingPoint,value));

		console.log("Count LeftUp "+countLeftUp(startingPoint,value));

		console.log("Count RightUp "+countRightUp(startingPoint,value));

		console.log("Count LeftDown "+countLeftDown(startingPoint,value));

		console.log("Count RightDown "+countRightDown(startingPoint,value));

		console.log("+++++++++++++++++");

		if(horizontal<connectMax && vertical<connectMax && diagonal1<connectMax && diagonal2<connectMax){

			retval = false;

		}

		return retval;

	}

	function endGame(){

		turnCounter=0;

		document.getElementById('menu').className="unhide";

		//document.getElementById('game-view').className="hide";

					

	}

	function getWonMessage(){

		var player1 = "Player1 ";

		var player2 = "Player2 ";

		var temp = turn? player2:player1;

		return "END OF GAME - "+ temp + "WON";

	}

	function dropToken(id){

		console.log("Dropped Token at "+id);

		var column = getColumnIndex(id);

		if(checkTurnAvailability()){

			if(checkDropAvailability(column)){

				setTokenInColumn(column);

				if(checkIfWon(column)) //Check if Won

				{

					setMessage(getWonMessage(),turn);

					endGame();

				}

				else{

					incrementLevel(column); //Increment level 

					changeTurn();

					decrementTurnCounter();

					if(checkTurnAvailability())

					{

						setMessage(getTurnMessage(),turn);

					}

					else{

						setMessage("END OF GAME - DRAW",2);

						endGame();

					}

				}

				

			}

			else{

				setMessage("INVALID MOVE: Column is FULL. Please Try again",2);

				

			}

		}

		else{

			setMessage("END OF GAME - DRAW",2);

			endGame();

		}

	}

	function initializeGameTableBG(columns,rows){

		var bgWhite = "bg-white";

		var x = parseInt(rows);

		var y = parseInt(columns);

		var str = "game-node";

		var elem;

		for(x=0;x<rows;x++){

			for(y=0;y<columns;y++){

				if(elem = document.getElementById(str+x+''+y)){

					elem.className = bgWhite;

				}

			}

		}

		

	}

	function initializeGameTable(columns, rows,connect){

		var temp = columns * rows;

		var x;

		columnMax = columns;

		rowMax = rows;

		connectMax = connect;

		for(x=0;x<temp;x++){

			gameTable[x] = 0; //0-blank 1-Player1 2-Player2

		}

		initializeGameTableBG(columns, rows);

	}

	function initializeLevelTracker(columns){

		var x;

		for(x=0;x<columns;x++){

			levelTracker[x] = 0; //0 blank row 

		}



	}

	function initializeTurnCounter(){

		turnCounter = columnMax*rowMax;

	}

	function incrementLevel(column){

		levelTracker[column]++;

	}

	function decrementTurnCounter(){

		turnCounter--;

	}

	function changeTurn(){

		turn = turn? 0:1;

	}

	function getTurnMessage(){

		var player1 = "Player1 ";

		var player2 = "Player2 ";

		var temp = turn? player2:player1;

		return temp + "TURN";

	}

	function setMessage(str,color){

		var colorStr;

		var msgRed = "msg-red ";

		var msgWhite = "msg-white "; 

		var msgBlack = "msg-black ";

		var bgPurple = "bg-purple"; //Player 1 Background Color

		var bgGreen = "bg-green"; //Player 2 Background Color

		var bgWhite = "bg-white"; //Error Background Color

		

		switch(color){

			case 0: colorStr = msgWhite + bgPurple;

			break;

			case 1: colorStr = msgWhite + bgGreen;

			break;

			case 2: colorStr = msgRed + bgWhite;

			break;

			default: colorStr = msgBlack + bgWhite;

			break

		}

		document.getElementById("message").innerHTML = str;

		document.getElementById("message").className = colorStr;

	}

	function startGame(){

		setMessage(getTurnMessage(),0);

		

	}

});


