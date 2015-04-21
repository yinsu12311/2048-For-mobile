var board = new Array();//放位置和数字的数组
var score = 0;//分数
//是否重复叠加
var hasConflicted=new Array();

//触控位置
var startX=0;
var startY=0;
var endX=0;
var endY=0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

//为手机分配自适应样式
function prepareForMobile(){
	if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
};

function init(){
	for(var i = 0;i < 4;i++){
		for(var j = 0;j < 4; j++){
			// 棋盘格的布局
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	for(var i=0; i<4; i++){
			board[i]=new Array();
			hasConflicted[i]=new Array();
			for(var j=0; j<4; j++){
				board[i][j]=0;
				hasConflicted[i][j]=false;
			}
		}
	//twoDimension(board,4);
	updateBoardView();
	score=0;
};

//一维数组转变成二维数组
// function twoDimension(arr,n){
// 	for(var i=0; i<n; i++){
// 		arr[i]=new Array();
// 		for(var j=0; j<n; j++){
// 			arr[i][j]=0;
// 		}
// 	}
// 	return arr;
// };

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);

			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				//theNumberCell.text(getNumberText( board[i][j] ));
				//theNumberCell.css('font-size',"18px" );
			}
			hasConflicted[i][j]=false;
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
};

//在随机一个格子生成数字
function generateOneNumber(){
	 if(nospace(board)){
	 	return false;
	 }

	 //随机产生一个位置
	 var randx=parseInt(Math.floor(Math.random()*4));
	 var randy=parseInt(Math.floor(Math.random()*4));
	 var times=0;
	 while(times<50){
	 	if(board[randx][randy]==0){
	 		break;
	 	}
	 	randx=parseInt(Math.floor(Math.random()*4));
	 	randy=parseInt(Math.floor(Math.random()*4));
	 	times++;
	 }
	 if(times==50){
	 	for(var i=0; i<4; i++){
	 		for(var j=0; j<4; j++){
	 			if(board[i][i]==0){
	 				randx=i;
	 				randy=j;
	 			}
	 		}
	 	}
	 }

	 //随机产生一个数字
	 var randNumber=Math.random() < 0.5 ? 2 : 4;

	 //在随机位置上显示随机数字
	 board[randx][randy]=randNumber;
	 showNumberWithAnimation(randx,randy,randNumber);

	 return true;
};

//键盘的按键信息
$(document).keydown(function(event){

	switch(event.keyCode){
		case 37://left
			event.preventDefault();
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 38://up
			event.preventDefault();
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 39://right
			event.preventDefault();
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		case 40://down
			event.preventDefault();
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
			break;
		default:
			break;
	}
});

//触控开始事件
document.addEventListener('touchstart',function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
});

//解决安卓4.0的bug
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

//触控结束事件
document.addEventListener('touchend',function(event){
	endX=event.changedTouches[0].pageX;
	endY=event.changedTouches[0].pageY;
	var deltaX=endX-startX;
	var deltaY=endY-startY;
	//解决触摸屏幕也能移动数字的bug
	if(Math.abs(deltaX) < 0.2*documentWidth && Math.abs(deltaY) < 0.2*documentWidth){
		return;
	}
	//判断x轴
	if(Math.abs(deltaX) >= Math.abs(deltaY)){
		if(deltaX>0){
			//move left
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}else{
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}
	}
	//判断Y轴
	else{
		if(deltaY>0){
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}else{
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isGameOver()",300);
			}
		}
	}
});

//是否能够向左移动
function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	for(var i=0; i<4; i++){
		for(var j=1; j<4; j++){
			if(board[i][j]!=0){
				for(var k=0; k<j; k++){
					//第j列左边的第k列是否为空并且中间没有障碍物
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					//第j列和它左边的第k列是否相等并且中间没有障碍物
					else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
};

//是否能够向右移动
function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	for(var i=0;i<4; i++){
		for(var j=2; j>=0; j--){
			if(board[i][j]!=0){
				for(var k=3;k>j; k--){
					if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}
					else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
};

//是否能够向上移动
function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=1; i<4; i++){
			if(board[i][j]!=0){
				for(var k=0; k<i; k++){
					//第j列左边的第k列是否为空并且中间没有障碍物
					if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					//第j列和它左边的第k列是否相等并且中间没有障碍物
					else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
};
// function moveUp(){
// 	if(!canMoveUp(board)){
// 		return false;
// 	}
// 	for(var i=0; i<4; i++){
// 		for(var j=1; j<4; j++){
// 			if(board[j][i]!=0){
// 				for(var k=0; k<j; k++){
// 					//第j列左边的第k列是否为空并且中间没有障碍物
// 					if(board[k][i]==0 && noBlockHorizontal(i,k,j,board)){
// 						//move
// 						showMoveAnimation(j,i,k,i);
// 						board[k][i]=board[j][i];
// 						board[j][i]=0;
// 						continue;
// 					}
// 					//第j列和它左边的第k列是否相等并且中间没有障碍物
// 					else if(board[k][i]==board[j][i] && noBlockVertical(i,k,j,board) && !hasConflicted[k][j]){
// 						//move
// 						showMoveAnimation(j,i,k,i);
// 						//add
// 						board[k][i]+=board[j][i];
// 						board[j][i]=0;
//						add score
// 						score+=board[k][j];
//						updateScore(score);
//						hasConflicted[k][j]=true;
// 						continue;
// 					}
// 				}
// 			}
// 		}
// 	}
// 	setTimeout("updateBoardView()",200);
// 	return true;
// };

//是否能够向下移动
function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}
	for(var j=0; j<4; j++){
		for(var i=2; i>=0; i--){
			if(board[i][j]!=0){
				for(var k=3; k>i; k--){
					//第j列左边的第k列是否为空并且中间没有障碍物
					if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}
					//第j列和它左边的第k列是否相等并且中间没有障碍物
					else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add score
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
};

//游戏是否结束
function isGameOver(){
	if(nospace(board) && noMove(board)){
		gameOver();
	}
};
function gameOver(){
	alert('Game Over!');
}