function showNumberWithAnimation(i,j,randNumber){
	var numbercell=$('#number-cell-'+i+'-'+j);
	numbercell.css('background-color',getNumberBackgroundColor(randNumber));
	numbercell.css('color',getNumberColor(randNumber));
	numbercell.text(board[i][j]);
	//numbercell.text(getNumberText( randNumber ));
	//numbercell.css('font-size',"18px" );

	numbercell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},50);
	// startMove(numbercell,{
	// 	width:"100px",
	// 	height:"100px",
	// 	top:getPosTop(i,j),
	// 	left:getPosLeft(i,j)
	// });
};

//移动的动画效果
function showMoveAnimation(fromx,fromy,tox,toy){
	var numbercell=$('#number-cell-'+fromy+'-'+fromy);
	numbercell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
};

//分数的显现
function updateScore(score){
	$('#score').text(score);
};