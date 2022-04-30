var currentPlayer="Player1";
var otherPlayer="Player2";
var gameRunning=false;
var columns=7;
var rows=6;
var playerPoint=0;
var cellObject = {};

//  Whenever a New Game starts below function gets called
function initialiseProperties()
{
	document.getElementById("grid").innerHTML="";
	var currentPlayer="Player1";
	var otherPlayer="Player2";
	var gameRunning=false;
	var columns=7;
	var rows=6;
	var playerPoint=0;
	var cellObject = {};
}

// Below function Creates the Gameboard
function createGrid()
{
	initialiseProperties();
	var tbl = document.createElement("table");
	tbl.setAttribute('class','tblStyle');
 
	for (var j = 1; j <= rows; j++) {
		var row = document.createElement("tr");
		for (var i = 1; i <= columns; i++) {
			var cell = document.createElement("td");
			cell.setAttribute('class','cellStyle');
			var cellNum=j+""+i;
			cellObject[cellNum] = new gridInfo(j, i, "vacant");
			cell.setAttribute('id',cellNum);
			cell.setAttribute('onclick','enterCoin('+cellNum+')');
			row.appendChild(cell);
		}
	tbl.appendChild(row);
	}
	document.getElementById("grid").appendChild(tbl);
	gameRunning=true;
}

// This is an Object constructor
function gridInfo(rowNum, colNum, status){
    this.rowNumber = rowNum;
    this.colNumber = colNum;
    this.gridStatus = status;

	this.oneCellDown = function(){
		var ro=this.rowNumber;
		var co=this.colNumber;
		ro = parseInt(ro);
		
		if(ro==rows)
			return ro+""+co;
		else
		{
			ro++;
			return ro+""+co;
		}
	}
	
	this.diagonalCell = function(cid, cellLoc){
		var ro=this.rowNumber;
		var co=this.colNumber;
		
		if (cellLoc=='leftUp')
		{	
			ro = parseInt(ro);
			ro--;
			co = parseInt(co);
			co--;
		}
		else if(cellLoc=='leftDown')
		{
			ro = parseInt(ro);
			ro++;
			co = parseInt(co);
			co--;
		}
		else if(cellLoc=='rightUp')
		{
			ro = parseInt(ro);
			ro--;
			co = parseInt(co);
			co++;
		}
		else
		{
			ro = parseInt(ro);
			ro++;
			co = parseInt(co);
			co++;
		}
		
		if(ro>rows || ro<1 || co>columns ||co<1)
			return "0";
		else
			return ro+""+co;
	}
    this.showName = function () {
        alert("This is a " + this.gridStatus);
    }
}

// Below method Places the Coin, Change Properties & Check If a Player won 
function enterCoin(cellId)
{
	if(cellObject[cellId].gridStatus=="vacant" && gameRunning==true)
	{
		var lowestVacantCell=checkIfLowestVacantCell(cellId);
		if (lowestVacantCell)
		{
			changeGridProperties(cellId);
			checkIfPlayerWon(cellId);
		}
		else
		{
			alert("Coin can be insert into a lowest cell only");
		}
	} 
	
/*	if(gameRunning==true)
	{
		var cId = cellId;
		var preCId;
		while(cellObject[cId].gridStatus=="vacant")
		{
		preCId = cId;
		cId = cellObject[cId].oneCellDown();
		if(cId==cellId)
			break;
		}  
		alert(preCId);
		changeGridProperties(preCId);
		checkIfPlayerWon(preCId);
	}  */
}

function checkIfPlayerWon(cId)
{
	checkHorizontal(cId, function(ifNotWin){
		if (ifNotWin)
		{
			checkVertical(cId, function(ifNotWinn){
				if(ifNotWinn==false)
				{
				winMessage();
				}
				else
				{
					checkDiagonals(cId, function(ifWin){
						if(ifWin)
						{
						winMessage();
						}
					});
				}
			});
		}
		else
		{
			winMessage();
		}
	});
}

// Below method Checks cells diagonally
function checkDiagonals(cID, callback)
{
	//alert("Into Diagonals");
	var diagonalPoints=0;
	var playerGridStatus = cellObject[cID].gridStatus;
	var tempCId = cID;
	while (cellObject[tempCId].gridStatus==playerGridStatus)
	{
	diagonalPoints++;
		if(diagonalPoints>4)
			return callback(true);
	tempCId = cellObject[tempCId].diagonalCell(tempCId, 'leftUp');
	if(tempCId=="0")
		break;
	}
	tempCId = cID;
	while (cellObject[tempCId].gridStatus==playerGridStatus)
	{
	diagonalPoints++;
		if(diagonalPoints>4)
			return callback(true);
	tempCId = cellObject[tempCId].diagonalCell(tempCId, 'rightDown');
	if(tempCId=="0")
		break;
	}
	diagonalPoints=0; tempCId = cID;
	while (cellObject[tempCId].gridStatus==playerGridStatus)
	{
	diagonalPoints++;
		if(diagonalPoints>4)
			return callback(true);
	tempCId = cellObject[tempCId].diagonalCell(tempCId, 'rightUp');
	if(tempCId=="0")
		break;
	}
	tempCId = cID;
	while (cellObject[tempCId].gridStatus==playerGridStatus)
	{
	diagonalPoints++;
		if(diagonalPoints>4)
			return callback(true);
	tempCId = cellObject[tempCId].diagonalCell(tempCId, 'leftDown');
	if(tempCId=="0")
		break;
	}
	return callback(false);
}

// Below method will check whether the Player matched Coins in Columns[Everytime any player places a coin]
function checkVertical(cID, callback){
	var ro=cellObject[cID].rowNumber;	
	var co=cellObject[cID].colNumber;
	var gStatus=cellObject[cID].gridStatus;
	ro = parseInt(ro);
	var playerPointsDown = checkDown(ro,co,gStatus);
	if(playerPointsDown>=4)
		return callback(false);
	else
		return callback(true);
}

function checkDown(ro,co,gStatus)
{
	var playerPoints=0;
	ro = parseInt(ro);
	var cell1Down=ro;
	var cellDown3=ro+3;
	while(cell1Down<=cellDown3 && cell1Down<=rows)
	{
	 var currentCell=ro+""+co;
	 
	 if(cellObject[currentCell].gridStatus==gStatus)
		{	
			playerPoints++;
			ro++;
		}
		else
			break;
	 cell1Down++;
	}
	return playerPoints;
}

// Below method will check whether the Player matched Coins in Rows[Everytime any player places a coin]
function checkHorizontal(cID, callback){
	var ro=cellObject[cID].rowNumber;	
	var co=cellObject[cID].colNumber;
	var gStatus=cellObject[cID].gridStatus;
	co = parseInt(co);
	var playerPointsLeft = checkLeft(ro,co,gStatus);
	var playerPointsRight;
	if(playerPointsLeft>=4)
		return callback(false);
	else
	{
		playerPointsRight = checkRight(ro,co,gStatus);
		var totalPoints = playerPointsLeft+playerPointsRight;
		if(totalPoints>=5)
			return callback(false);
	}
	return callback(true);
}

function checkRight(ro,co,gStatus)
{
	var playerPoints=0;
	co = parseInt(co);
	var cellInRight=co;
	var coRight3=co+3;
	while(cellInRight<=coRight3 && cellInRight<=columns)
	{
	 var currentCell=ro+""+co;
	 
	 if(cellObject[currentCell].gridStatus==gStatus)
		{	
			playerPoints++;
			co++;
		}
		else
			break;
	 cellInRight++;
	}
	return playerPoints;
}

function checkLeft(ro,co,gStatus)
{
	var playerPoints=0;
	co = parseInt(co);
	var cellInLeft=co;
	var coLeft3=co-3;
	while(cellInLeft>=coLeft3 && cellInLeft>=1)
	{
	 var currentCell=ro+""+co;
	 
	 if(cellObject[currentCell].gridStatus==gStatus)
		{	
			playerPoints++;
			co--;
		}
		else
			break;
	 cellInLeft--;
	}
	return playerPoints;
}

// Below function changes the Object's behaviour and properties 
function changeGridProperties(cellId)
{
	if (currentPlayer=="Player1")
		{
		cellObject[cellId].gridStatus="Red";
		document.getElementById(cellId).style.backgroundColor="Red";
		currentPlayer="Player2";
		otherPlayer="Player1";
		document.getElementById('turnInfo').innerHTML=currentPlayer+"'s Turn";
		}
	else
		{
		cellObject[cellId].gridStatus="Yellow";
		document.getElementById(cellId).style.backgroundColor="Yellow";
		currentPlayer="Player1";
		otherPlayer="Player2";
		document.getElementById('turnInfo').innerHTML=currentPlayer+"'s Turn";
		}
}

// Below function Check If the Player is placing a coin in the Right Cell or not[It must be the Lowest cell only]
function checkIfLowestVacantCell(cellId)
{
	if(cellObject[cellId].rowNumber==rows)
		return true;
	else
	{
		var ro=cellObject[cellId].rowNumber;	
		var co=cellObject[cellId].colNumber;
		ro = parseInt(ro);
		ro++;
		var belowCell = ro+""+co;
		if (cellObject[belowCell].gridStatus=="vacant")
			return false;
		else
			return true;
	}
}

// Function showing Winning Message
function winMessage()
{
	alert(otherPlayer + " Won It!");
	gameRunning=false;
	document.getElementById('turnInfo').innerHTML=otherPlayer+" Won the Game!";
}