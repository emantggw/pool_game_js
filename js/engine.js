/*




			



							++==	+==	   ==+	===+  ++===+    |
							||__	|  \  /	 |	 __|  ||   |  __+__		 
							||		|	\/	 |	|  |  ||   |	|
							++==	|		 |	+==+  ||   |	|___

									Created at @2019/8/21
										POOL GAME ENGINE


*/
var cs = document.getElementById("can");
var home = {
	main: document.getElementById("home"),
	playbtn: document.getElementById("playbtn")
}
var game_over = {
	main: document.getElementById("game_over"),
	playagainbtn: document.getElementById("playagainbtn")

}

/*
Modes for modal
1==>Fadein home modal{play, about, licince}
2==>Fadeout home 
3==>Fadein gameover and fading play-again/exit
4==>Fadeout 
0==>Playing do nothing
*/

function fade(opacity, mode) {
	var op = opacity / 1000 - modal.starttime / 1000;
	if (modal.mode == 1) {
		//Fadin home
		home.main.style.display = "block";
		home.main.style.opacity = op;
		home.playbtn.onclick = function () {
			modal.mode = 2;
			newgame();//Initialization new game
		}
	}
	if (modal.mode == 2) {
		//Fadeout home
		home.main.style.opacity = 1 - op;
		if (op >= 0.8)
			home.main.style.display = "none";
	}
	if (modal.mode == 3) {
		//Gameover is triggerd here after complited fading of gameover fadein
		game_over.main.style.display = "block";
		game_over.main.style.opacity = op;
		game_over.main.style.background = level.wall_color;//Hit wall color
		if (op >= 0.6) {
			game.mode = -1;//Cleanup memory
		}
		game_over.playagainbtn.onclick = function () {
			modal.mode = 4;
			newgame();
		}
	}
	if (modal.mode == 4) {
		//Fadeout home
		game_over.main.style.opacity = 1 - op;
		if (op >= 0.8)
			game_over.main.style.display = "none";
	}
}
function equationOfLine(pt1, pt2) {
	//m = (pt2.y-pt1.y)/(pt2.x-pt1.x);
	//ax+by=c

	//rotate by 180deg
	pt1 = rotate(pt1, Math.PI);
	pt2 = rotate(pt2, Math.PI);
	var a = pt2.y - pt1.y;
	var b = pt1.x - pt2.x;
	var c = a * pt1.x + b * pt1.y;
	return { a: a, b: b, c: c };

};
function mid(a, b) {
	return (a + b) / 2;
}
function inispectDistance(equ, cir) {
	var d = (Math.abs(equ.a * cir.x * level.tilewidth + equ.b * cir.y * level.tilewidth + equ.c)) / Math.sqrt(equ.a * equ.a + equ.b * equ.b);//perdpendicular distance from center

	if (Math.abs(d - cir.r) >= 0.01 && Math.abs(d - cir.r) <= 0.5) {
		return 0;//touch
	} else if (cir.r > d) {
		return 1;//intersect
	} else {
		return -1;//Out
	}


}

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');


var keycode = 0;//right;
function range(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function randColor() {
	var col = [[37, 218, 218], [37, 218, 37], [37, 37, 218], [224, 224, 31], [224, 31, 224], [224, 31, 31]];
	//return 'rgb('+Math.floor(Math.random()*1000%255)+','+Math.floor(Math.random()*1000%255)+','+Math.floor(Math.random()*1000%255)+')';
	var sel = col[Math.floor(Math.random() * col.length)];
	return 'rgb(' + sel[0] + ',' + sel[1] + ',' + sel[2] + ')';
}
function rotate(ax, rd) {
	var rt = {
		x: ax.x * Math.cos(rd) - ax.y * Math.sin(rd),
		y: ax.y * Math.cos(rd) + ax.x * Math.sin(rd)
	}
	return rt;
}
function getVertices(r, sides) {
	var ang = Math.PI * 2 / sides;
	var vert = [];
	var delta = -Math.PI / 4;//To make Normal rectangle
	for (var i = 0; i < sides; i++) {
		//console.log(Math.cos(i*ang)*r);
		var pt = { x: Math.cos(i * ang + delta) * r, y: Math.sin(i * ang + delta) * r };
		vert[i] = pt;
	}
	return vert;
}
function distanceBetween(pt1, pt2) {
	return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}

function isoTo2d(iso) {
	return { x: (2 * iso.y + iso.x), y: (2 * isoy - iso.x) / 2 };
}
function twToiso(car) {
	return { x: (car.x - car.y), y: (car.x + car.y) / 2 };
}
function keyboard(e) {
	if (!stick.moving && !stick.handing) {
		//Every key event only accepted..
		//When the balls are ready to hitted
		if (e.keyCode == 40 || e.keyCode == 38) {
			//key speed as long as still pressed it inreases it's moving speed
			stick.rad_speed += e.keyCode == 38 ? 0.005 : -0.005;
			//If down key pressed then minus -0.001 else 0.001 add
			stick.stickPosition(e.keyCode == 40 ? -0.001 : 0.001);

		}
		if (e.keyCode == 37 || e.keyCode == 39) {
			//Prepare shooting angle 
			//Left and right keys
			stick.rad_speed += e.keyCode == 37 ? 0.0005 : -0.0005;
			stick.shootAngle(e.keyCode == 37 ? -0.001 : 0.001);
		}
		if (e.keyCode == 13) {
			//If the player have decided to shoot 
			//By entering 'Enter' key
			//I used to speed guage to display by counting down the normal fps
			//In the object may increse the timestep at tippest point then re-back
			game.timestep = 1000 / 20;
			//Toggle shooting
			stick.shooting = !stick.shooting;
			//Re-toggle shooting value to shooted varibale
			//Since both are odd
			stick.shootted = !stick.shooting;
		}
	}
	if (!stick.moving && stick.handing) {
		switch (e.keyCode) {
			case 37:
				stick.wball.x -= 1;
				break;
			case 39:
				stick.wball.x += 1;
				break;
			case 38:
				stick.wball.y -= 1;
				break;
			case 40:
				stick.wball.y += 1;
				break;
			case 13:
				stick.handing = false;
				break;
		}
	}
}
function resolve(part1, part2) {
	/*
	if the two particles mass is deffrent
	v1 = u1(m1-m2)/(m1+m2) + 2*m2*u2/(m1+m2);
	v2 = u2(m2-m1)/(m1+m2) + 2*m2*u1/(m1+m2);
	if both particle has same mass then simply use this
	v1 = u2
	v2 = u1

	Two dimension 
	Here x and y velcoity considerd
	*/

	//getangle
	/*
	tan(ang) = opp/adj
	ang = atan(opp/adj);
	*/
	var yDiff = part2.y - part1.y;
	var xDiff = part2.x - part1.x;
	var vxDiff = part1.velocity.x - part2.velocity.x;
	var vyDiff = part1.velocity.y - part2.velocity.y;
	var m1 = part1.mass;
	var m2 = part2.mass;
	var angle = -Math.atan(yDiff / xDiff);
	if (yDiff * vyDiff + xDiff * vxDiff >= 0) {
		//To avoid overlap incase of both two object may access/modify
		//To avoid deadlock
		//Just like synchronize 

		/*
		====Consideration only velocity change===
		Here the first thing we rotate by created angle is to convert 1D
		because in 1D there is only x to apply newton natanian formula
		..Now we can find final V by rotated U
		..After we get V then re-rotate to former angle
		*/

		var u1 = rotate(part1.velocity, angle);
		var u2 = rotate(part2.velocity, angle);

		var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + 2 * m2 * u2.x / (m1 + m2), y: u1.y };
		var v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + 2 * m2 * u1.x / (m1 + m2), y: u2.y };

		part1.velocity = rotate(v1, -angle);
		part2.velocity = rotate(v2, -angle);
	}
}


var modal = {
	fps: 20,
	timestep: 1000 / 5,
	starttime: 0,
	isset_start_time: false,
	dur: 1000,
	lastupdate: 0,
	mode: 1
};
var game = {
	fps: 60,//Normal Frame persecond
	timestep: 1000 / 20,
	lastupdate: 0,
	mode: 0,//Ready to start,
	dev: "Emant"
};
var Level = function () {
	//Initialization
	/*
		2D, Isometric view
	If we want to feel like 3d use isometric view, which makes better your game
	but one thing consider here is that, you can just transform simple 2D to isometric there is some concepts
	offcourse even actual matrix tiles is store in 2d but the way interacting to screen is isometric
	1.
		Convert the screen display coordinate to isometric
	2.
		Use the spirtes img which is aready in diamends shape, so it can fit
	3.	If you want to use the actual core canvas to fill colors and shape of your tiles level
		you have to work hard
	Example
	you can't just translate drawrect to isometric becuase it only let you specify starting vertices(1) and width and height
	beign with top-left of the screen
	so miss 3-vertices, without them you can't translate whole rectangle 
	*/
	this.init();
};

Level.prototype.init = function () {
	this.view = "2d";
	//This design is based upon isometric view
	//You can't just set width and hight of tiles by hand,
	//It's depend on the number of virtual radius you have given, large r >> large width and height
	this.virtualRadius = 20;
	//Get vertices coordinate 
	this.vert = getVertices(this.virtualRadius, 4);
	//Inorder to get acurate width and height(actually both are equal) we have to measure the distance between two vertices
	//We have to calculate the distance between two points which relay on x
	//at v3 and v0 ==> or v2==>v1 we can get width
	//Same manner to get height V3 and V2 or v0 and v1 distance
	this.tilewidth = distanceBetween(this.vert[this.vert.length - 1], this.vert[0]);//2*this.virtualRadius*sin|cos(pi/4)
	this.tileheight = distanceBetween(this.vert[0], this.vert[1]);
	this.cols = 41;
	this.rows = 18;
	this.gap = this.cols / 9;//9 is number of stars
	//Since we are store rows and column by integer 
	//Means that we can get specific cols and rows by indexing num
	//By default my custem grid center is not top-left so we can directly draw at center of grid by half of tilewidth
	//you can looping and increment it's cols and rows(x, y) by one. simply check weather it's bounce with wall or not by(current_y+1 is not wall)
	//But the problem is that when you increase the index by some floating number(like 0.1..) how can get the exact position of this cols and rows
	//One way to do rounding to the nearest number of looping variable 0.1 >> 0, and 0.6 >> 1 so we can get actual cols and rows since they are integer
	//Not finished yet, to get actual collision it's also not accurate by checking(y+1 IS wall?) as i said my grid tile orgin is center so collision detection plus +1 
	//May not accurate since, example current_x = 11, current_y=4, wall_y = 6
	/*
	===>wall = 6;
	===>speed = 0.1
	===>current_x = 11;
	===>current_y = 4.4+speed;
		if(round(current_y)+1==6)?bounce:keep_going
		>>4.5 is rounded nearset to 5, 
		>>5+1 is also 6 then it will bounce to back, but we still remaing 0.5 to get actual pos
		==>AVOID using +1 check instaied use +0.5 -0.5 if you are using speed floating numbers 
			at this time rounding will fit to normal
	*/
	this.delta = 0.5;//Assuming for speed value is decimal(floating) number


	//At screen center position
	//Or you can leave, and by default start with top-left of screen position
	//==>2D center-obj this.x = innerWidth/2-(this.cols/2)*this.tilewidth;
	//==>2D center-obj this.y = innerHeight/2-(this.rows/2)*this.tileheight;
	//Iso center-obj
	this.x = innerWidth / 2 - (this.cols / 2) * this.tilewidth;
	this.y = innerHeight / 2 - (this.rows / 2) * this.tileheight;
	this.tiles = [];
	this.border_color = "#50AF50";
	this.table_color = "#228B22";
	this.pockets = [];
	this.balls = [];
	this.pockets.push({ x: 1, y: -0.5 });
	this.pockets.push({ x: 20, y: -0.5 });
	this.pockets.push({ x: 39, y: -0.5 });
	this.pockets.push({ x: 1, y: 17.5 });
	this.pockets.push({ x: 20, y: 17.5 });
	this.pockets.push({ x: 39, y: 17.5 });

	this.balls.push({ x: 32, y: this.rows / 2, color: "red", number: 3 });
	this.balls.push({ x: 6, y: 1, color: "#BF40BF", number: 4 });
	this.balls.push({ x: 10, y: 1, color: "#FF4500", number: 5 });
	this.balls.push({ x: 14, y: 1, color: "#008000", number: 6 });
	this.balls.push({ x: 26, y: 1, color: "#8B0000", number: 7 });
	this.balls.push({ x: 30, y: 1, color: "#000000", number: 8 });
	this.balls.push({ x: 34, y: 1, color: "#FFD700", number: 9 });
	this.balls.push({ x: 34, y: this.rows - 2, color: "#4169E1", number: 10 });
	this.balls.push({ x: 30, y: this.rows - 2, color: "#DC143C", number: 11 });
	this.balls.push({ x: 26, y: this.rows - 2, color: "#191970", number: 12 });
	this.balls.push({ x: 14, y: this.rows - 2, color: "#FF6347", number: 13 });
	this.balls.push({ x: 10, y: this.rows - 2, color: "#008080", number: 14 });
	this.balls.push({ x: 6, y: this.rows - 2, color: "#A52A2A", number: 15 });
	this.balls.push({ x: this.cols * 0.23, y: this.rows / 2, color: "white", number: 0 });

	for (var i = 0; i < this.cols; i += 1) {
		this.tiles[i] = [];
		for (var j = 0; j < this.rows; j += 1) {
			// if(i==0||i==this.cols-1||j==0||j==this.rows-1){
			// 	this.tiles[i][j] = 1;//Walls
			// }
			if ((i == 1 || i == 2 || i == 19 || i == 20 || i == 21 || i == 38 || i == 39) && (j == 0 || j == this.rows - 1)) {
				this.tiles[i][j] = -1;//Pocket
			} else if (i == 0 || i == this.cols - 1 || j == 0 || j == this.rows - 1) {
				this.tiles[i][j] = 1;
			}
			else {
				this.tiles[i][j] = 0;//Playable field
			}
		}
	}

};
Level.prototype.grad = function (x1, y1, x2, y2) {
	var gr = c.createLinearGradient(x1, y1, x2, y2);
	gr.addColorStop(0.0, this.border_color);
	gr.addColorStop(0.3, this.border_color);
	gr.addColorStop(0.1, "darkgreen");
	gr.addColorStop(0.6, this.border_color);
	return gr;
};
Level.prototype.tableDesigner = function (first_argument) {
	var sp1 = new Image();
	var sp2 = new Image();
	var sp3 = new Image();
	var sp4 = new Image();
	var chu1 = new Image();
	var chu2 = new Image();
	var pocket = new Image();
	chu1.src = "img/chepud1.png";
	chu2.src = "img/chepud2.png";
	c.drawImage(chu1, this.x - this.tilewidth * 1.5, this.y - this.tilewidth * 3);
	c.drawImage(chu1, this.x - this.tilewidth * 1.5, this.y + 17.5 * this.tilewidth);
	c.drawImage(chu2, this.x - this.tilewidth * 1.5, this.y - this.tilewidth * 3, 50, 650);
	c.drawImage(chu2, this.x + this.tilewidth * 39.5, this.y - this.tilewidth * 3, 50, 659);

	sp1.src = "img/sponda1.png";
	c.drawImage(sp1, this.x + this.tilewidth * 2, this.y - this.tilewidth / 2, 480, 28);
	c.drawImage(sp1, this.x + this.tilewidth * 21, this.y - this.tilewidth / 2, 480, 28);

	sp2.src = "img/sponda2.png";
	c.drawImage(sp2, this.x - this.tilewidth / 2, this.y, 28, 480);
	sp3.src = "img/sponda3.png";
	c.drawImage(sp3, this.x + this.tilewidth * 39.5, this.y, 28, 480);
	sp4.src = "img/sponda4.png";
	c.drawImage(sp4, this.x + this.tilewidth * 2, this.y + this.tilewidth * 16.5, 480, 28);
	c.drawImage(sp4, this.x + this.tilewidth * 21, this.y + this.tilewidth * 16.5, 480, 28);


	pocket.src = "img/pocket.png";
	c.beginPath();
	c.fillStyle = "black";
	c.arc(this.x + this.pockets[0].x * this.tilewidth, this.y + this.pockets[0].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.arc(this.x + this.pockets[1].x * this.tilewidth, this.y + this.pockets[1].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.arc(this.x + this.pockets[2].x * this.tilewidth, this.y + this.pockets[2].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.fill();
	c.closePath();

	c.beginPath();
	c.fillStyle = "black";
	c.arc(this.x + this.pockets[3].x * this.tilewidth, this.y + this.pockets[3].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.arc(this.x + this.pockets[4].x * this.tilewidth, this.y + this.pockets[4].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.arc(this.x + this.pockets[5].x * this.tilewidth, this.y + this.pockets[5].y * this.tilewidth, this.tilewidth, 0, Math.PI * 2, false);
	c.fill();
	c.closePath();

};
Level.prototype.draw = function () {
	//LOGICAL-GRIDS
	// for(var i = 0; i < this.cols; i+=1){
	// 	for(var j = 0; j < this.rows; j+=1){
	// 		if(this.tiles[i][j] == 1){
	// 			//Walls
	// 			this.drawRect(i*this.tilewidth,j*this.tileheight,this.view,"fill",this.table_color);
	// 		}else{
	// 			this.drawRect(i*this.tilewidth,j*this.tileheight,this.view,"fill",this.table_color);
	// 		}
	// 	}
	// }


	//Shera(canvas)
	c.beginPath();
	c.fillStyle = this.table_color;
	c.fillRect(this.x - this.tilewidth, this.y - this.tilewidth, this.tilewidth * (this.cols), this.tilewidth * (this.rows + 1));
	c.closePath();

	c.beginPath();
	c.strokeStyle = "#98FB98";
	c.lineWidth = 2;
	c.moveTo(this.x + this.tilewidth * 10, this.y + this.tilewidth / 2);
	c.lineTo(this.x + this.tilewidth * 10, this.y + this.tilewidth * (this.rows - 2) + this.tilewidth / 2);
	c.stroke();
	c.closePath();
	this.tableDesigner();


};
Level.prototype.drawLine = function (i, j, view, mode, color) {
	//i=i*this.tilewidth
	//j=j*this.tilewidth
	c.lineWidth = 1.5;
	if (view == "2d") {
		c.beginPath();
		c.moveTo(this.x + this.vert[3].x + i, this.y + this.vert[3].y + j);
		c.lineTo(this.x + this.vert[2].x + i, this.y + this.vert[2].y + j);
		if (mode == "stroke") {
			c.strokeStyle = color;
			c.stroke();
		} else {
			c.fillStyle = color;
			c.fill();
		}
		c.closePath();
	}

}
Level.prototype.drawRect = function (i, j, view, mode, color) {
	c.lineWidth = 0.1;
	if (view == "2d") {
		c.beginPath();
		c.moveTo(this.x + this.vert[3].x + i, this.y + this.vert[3].y + j);
		for (var r = 0; r < this.vert.length; r++) {
			c.lineTo(this.x + this.vert[r].x + i, this.y + this.vert[r].y + j);
		}
		if (mode == "stroke") {
			c.strokeStyle = color;
			c.stroke();
		} else {
			c.fillStyle = color;
			c.fill();
		}
		c.closePath();
	}
	if (view == "iso") {
		c.beginPath();
		//Isometric x
		c.moveTo(this.x + twToiso(
			{ x: this.vert[3].x + i, y: this.vert[3].y + j }).x, this.y + twToiso(
				{ x: this.vert[3].x + i, y: this.vert[3].y + j }).y);
		for (var r = 0; r < this.vert.length; r++) {
			c.lineTo(this.x + twToiso(
				{ x: this.vert[r].x + i, y: this.vert[r].y + j }).x, this.y + twToiso(
					{ x: this.vert[r].x + i, y: this.vert[r].y + j }).y);
		}
		if (mode == "stroke") {
			c.strokeStyle = color;
			c.stroke();
		} else {
			c.fillStyle = color;
			c.fill();
		}
		c.closePath();
	}

};
var Rule = function () {
	//Initialize
};
Rule.prototype.init = function () {
	this.first_touch = null;
	this.scrach = false;
	this.last_pocket_size = pocket.getSize();
	this.current_pocket_size = this.last_pocket_size;
	this.isset_target = false;

};
Rule.prototype.getNextTarget = function (balls) {
	for (var i = 0; i < balls.length - 1; i++) {
		if (balls[i].is_target) {
			//Setting current target to false and prepare for another
			balls[i].is_target = false;
			balls[i + 1].is_target = true;
			return balls[i + 1];
		}
	}
	//Setting default target
	balls[0].is_target = true;
	return balls[0];
};
Rule.prototype.update = function (balls) {
	this.wball = balls[balls.length - 1];
	this.target = !this.isset_target ? this.getNextTarget(balls) : this.target;

	if (isRolling(balls) && stick.is_fired) {
		for (var j = 0; j < balls.length; j++) {
			if (this.wball == balls[j]) {
				continue;
			}
			if (distanceBetween({ x: this.wball.x, y: this.wball.y }, { x: balls[j].x, y: balls[j].y }) - 1 < 0 && this.first_touch == null) {
				this.first_touch = balls[j];
			}
		}
	}
	if (!isRolling(balls) && stick.is_fired) {
		//Checking the balls is neather in pocket or table
		for (var i = 0; i < balls.length; i++) {
			if (Math.round(balls[i].x) < 1 || Math.round(balls[i].x + 0.5) > level.cols - 2 || Math.round(balls[i].y - 0.5) < 0 || Math.round(balls[i].y + 0.5) > level.rows - 1) {
				//Check out table ball
				//Make back to it's default position
				//IF white then decrease score, otherwise stay score the same
				if (this.wball == balls[i]) {
					//Couuntdown score
					stick.handing = true;
				}
				balls[i].init(balls[i].address);
			}

		}
		this.current_pocket_size = pocket.getSize();
		//Checking white ball is pocked at each shoot
		if (this.wball.pocked) {
			//Pull out all balls up to last pocket
			for (var i = this.current_pocket_size - 1; i >= this.last_pocket_size; i--) {
				pocket.out(i);
			}
			//Since, white ball have been entered, we have to set handing in stick true
			//TO adjust postion
			stick.handing = true;
			//Score-Minus by target number
		} else {
			//NO SCRACH
			//Checking there hit or not 
			if (this.first_touch != null) {
				//Someball is touched
				if (this.first_touch == this.target) {
					//The target is succssfully touched
					//Check the ball is pocked after touched, actually check all ball
					if (this.current_pocket_size > this.last_pocket_size) {
						//By checking current pocket size to previous one
						//If it increase, means that it has more balls than before
						//So, some balls definately entered
						//Weather the target ball or any other ball can be pocked
						for (var i = this.current_pocket_size - 1; i >= this.last_pocket_size; i--) {
							if (pocket.recived_balls[i] == this.target) {
								//You should have to shift target
								//Cause, the target is already entered
								//But one thing consider here is that,
								//make sure the next target is avaliable
								//By looking for all pocket like 'Is there my next target?'
								//If the answer is yes, shift to other target
								//Catch next target if not the current is last target
								if (this.current_pocket_size == 13) {
									//All balls is fully pocked
									//Player finished the game
								} else {
									//Confindentially more balls are left
									this.target = this.getNextTarget(balls);
									for (var j = 0; j < this.current_pocket_size; j++) {
										//Checking all ball in pocket to make sure who is next?
										if (this.target == pocket.recived_balls[j]) {
											//You have to shift to other next target
											this.target = this.getNextTarget(balls);
											//Starting back
											j = -1;
										}
									}
								}

							}
							//====Count up score
						}
					}
				} else {
					//First touched other ball before the target ball
					//Illegal!
					//Make sure no balls is pocked,since it is illegal
					//If a ball is pocked, then pull out this ball to legalize
					for (var i = this.current_pocket_size - 1; i >= this.last_pocket_size; i--) {
						pocket.out(i);
					}
					//After pulling out punish by the first touched ball
					//=====Countdown score
				}
			} else {
				//No balls touched
				//=====Countdown score by target ball
			}
		}
		this.last_pocket_size = pocket.getSize();
		stick.is_fired = false;
		this.first_touch = null;
	}
	//Setting the target flag 
	//Avoid some inconsitency
	this.isset_target = true;


};
var Pocket = function () {
	//Init
}
Pocket.prototype.init = function () {
	this.recived_balls = [];
};
Pocket.prototype.pock = function (ball) {
	//Here ball is actual object adress
	//initiliaze the the pocked ball to preveious state
	ball.init(ball.address);
	ball.pocked = true;
	this.recived_balls.push(ball);
};
Pocket.prototype.getSize = function (first_argument) {
	return this.recived_balls == undefined ? 0 : this.recived_balls.length;
};
Pocket.prototype.out = function (index) {
	//pulling out the ball
	this.recived_balls[index].pocked = false;
	//freeup somespace
	this.recived_balls.pop();
};
function isRolling(ball) {
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].velocity.x != 0.0 || balls[i].velocity.y != 0.0) {
			return true;
		}
	}
	return false;
}

var Ball = function (inf) {
	this.init(inf);
}
Ball.prototype.init = function (inf) {
	this.address = inf;
	this.x = this.address.x;
	this.y = this.address.y;
	this.r = level.tilewidth / 2;
	this.mass = 1;
	this.velocity = { x: 0.0, y: 0.0 };
	this.color = this.address.color;
	this.number = this.address.number;
	this.friction = 0.990;
	this.pocked = false;
	this.is_target = false;
};
Ball.prototype.update = function (balls) {
	//In each and every update call stick update 
	//Main aim is calling stick is, to track the movement of each balls..
	//if all balls are at rest then do it's job
	stick.update(balls);
	rule.update(balls);

	for (var i = 0; i < level.pockets.length; i++) {
		if (distanceBetween({ x: this.x * level.tilewidth, y: this.y * level.tilewidth },
			{ x: level.pockets[i].x * level.tilewidth, y: level.pockets[i].y * level.tilewidth }) - this.r - level.tilewidth < -this.r) {
			pocket.pock(this);
			break;
		}
	}

	if (level.tiles[Math.round(this.x)][Math.round(this.y - 0.5)] == -1 ||
		level.tiles[Math.round(this.x)][Math.round(this.y + 0.5)] == -1
	) {
		var x = Math.round(this.x);
		var y = Math.round(this.y - 0.5);
		if ((x == 2 || x == 21) && y == 0) {
			var e = inispectDistance(equationOfLine({ x: x * level.tilewidth + level.vert[1].x, y: level.vert[1].y },
				{ x: x * level.tilewidth + (level.vert[3].x), y: level.vert[3].y }), this);
			if (e == 0 || e == 1) {
				this.velocity = rotate(this.velocity, -Math.PI / 4);
				this.velocity.y = -this.velocity.y;
				this.velocity = rotate(this.velocity, Math.PI / 4);
			}

		} else if ((x == 19 || x == 38) && y == 0) {
			var e = inispectDistance(
				equationOfLine({ x: x * level.tilewidth + level.vert[2].x, y: level.vert[2].y },
					{ x: x * level.tilewidth + (level.vert[0].x), y: level.vert[0].y }), this);
			this.velocity = rotate(this.velocity, Math.PI / 4);
			this.velocity.y = -this.velocity.y;
			this.velocity = rotate(this.velocity, -Math.PI / 4);
		}
		else if ((x == 19 || x == 38) && Math.round(this.y + 0.5) == level.rows - 1) {
			//Lower pockets adjut y
			y = Math.round(this.y + 0.5);
			var e = inispectDistance(equationOfLine({ x: x * level.tilewidth + level.vert[3].x, y: level.vert[3].y + y * level.tilewidth },
				{ x: x * level.tilewidth + level.vert[1].x, y: level.vert[1].y + y * level.tilewidth }), this);
			this.velocity = rotate(this.velocity, -Math.PI / 4);
			this.velocity.y = -this.velocity.y;
			this.velocity = rotate(this.velocity, Math.PI / 4);
		}
		else if ((x == 2 || x == 21) && Math.round(this.y + 0.5) == level.rows - 1) {
			y = Math.round(this.y + 0.5);
			var e = inispectDistance(equationOfLine({ x: x * level.tilewidth + level.vert[0].x, y: level.vert[0].y + y * level.tilewidth },
				{ x: x * level.tilewidth + level.vert[2].x, y: level.vert[2].y + y * level.tilewidth }), this);
			this.velocity = rotate(this.velocity, Math.PI / 4);
			this.velocity.y = -this.velocity.y;
			this.velocity = rotate(this.velocity, -Math.PI / 4);
		}
	}
	//Rouding velocity to 0.0 if they are < 0.01 to make life easir!
	if (Math.abs(this.velocity.x) < 0.01 && Math.abs(this.velocity.x) > 0.0) {
		this.velocity.x = 0.0;
	}
	if (Math.abs(this.velocity.y) < 0.01 && Math.abs(this.velocity.y) > 0.0) {
		this.velocity.y = 0.0;
	}

	//Ball bounce to wall logic
	//Check the ball x and y are actually lessthan bounce limit
	//To prevent accidental treates
	if (Math.round(balls[i].x - 0.5) >= 0 && Math.round(balls[i].x + 0.5) <= level.cols - 1 && Math.round(balls[i].y - 0.5) >= 0 && Math.round(balls[i].y + 0.5) <= level.rows - 1) {
		if (level.tiles[Math.round(this.x)][Math.round(this.y + 0.5)] == 1 ||
			level.tiles[Math.round(this.x)][Math.round(this.y - 0.5)] == 1) {
			this.velocity.y = -this.velocity.y;
		}
		if (level.tiles[Math.round(this.x + 0.5)][Math.round(this.y)] == 1 ||
			level.tiles[Math.round(this.x - 0.5)][Math.round(this.y)] == 1) {
			this.velocity.x = -this.velocity.x;
		}
	}

	//Check collision current ball to other ball 
	for (var j = 0; j < balls.length; j++) {
		if (this == balls[j] || balls[j].pocked) {
			continue;
		}
		if (distanceBetween({ x: this.x, y: this.y }, { x: balls[j].x, y: balls[j].y }) - 1 < 0) {
			//Resolving the the balls by elastic collision formula
			//Conservation of KE and P(momentem) is conserved
			resolve(this, balls[j]);
		}
	}
	//Multiplying the velocity each time by friction constant
	this.velocity.x = this.velocity.x * this.friction;
	this.velocity.y = this.velocity.y * this.friction;
	//Updating x and y component
	this.y += this.velocity.y;
	this.x += this.velocity.x;

	this.draw();
};
Ball.prototype.draw = function () {

	//Make some intersting balls like real ball by adding radial gradient reflecting white color
	var gr = c.createRadialGradient(level.x + this.x * level.tilewidth + this.r * 0.5, level.y + this.y * level.tilewidth - this.r * 0.7, this.r * 0.1, level.x + this.x * level.tilewidth, level.y + this.y * level.tilewidth, this.r);
	gr.addColorStop(0.0, "white");
	gr.addColorStop(0.004, "whitesmoke");
	gr.addColorStop(0.1, "white");
	gr.addColorStop(0.6, this.color);
	c.beginPath();
	c.lineWidth = 3;
	c.strokeStyle = "deepskyblue";
	c.fillStyle = gr;
	c.arc(level.x + this.x * level.tilewidth, level.y + this.y * level.tilewidth, this.r, 0, Math.PI * 2, false);
	c.fill();
	if (this.is_target) {
		c.stroke();
	}
	c.closePath();


};
var Stick = function () {
	this.stick_length = 15;
	this.rad = 0.0;
	this.rad2 = 0.0;
	this.velocity = { x: 0.0, y: 0.0 };
	this.velocity_pack = 0;
	this.velocity_by = 10;
	this.velocity_max = 130;
	this.max_shoot_ang = Math.PI / 8;
	this.balls_is_rolling = false;
	this.handing = true;
	this.rad_speed = 0.001;
	this.shooting = false;
	this.shootted = false;
	this.is_fired = false;
	this.wball = null;


	this.stickPosition = (rd) => {
		//Called by keyup or down,  no movment of balls, no shooting
		//Ineach key type(up, down) update the rad increase or decrease
		if (!this.shooting) {
			this.rad += rd + this.rad_speed;
		}
	};
	this.shootAngle = (rd) => {
		//Called by keyup or down,  no movment of balls, no shooting
		//It's actaully not moving the stick, rather moving the target by small distance
		//Some people says FA 
		if (!this.shooting) {
			if (this.rad2 > this.max_shoot_ang) {
				this.rad2 = this.max_shoot_ang;
			} if (this.rad2 < -this.max_shoot_ang) {
				this.rad2 = -this.max_shoot_ang;
			}
			this.rad2 += rd + this.rad_speed;
		}
	}
	this.snipper = () => {
		//Here to fire only one enter key require
		//It's also called speed gauge chooser
		//The highet(tip) point has also highest speed, and respectively
		if (this.shooting) {
			//Velocity pack it over and over again untill max_lim and toggle it
			if (this.velocity_pack < 0 || this.velocity_pack > this.velocity_max) {
				this.velocity_by = -this.velocity_by;
			}
			//To make some speeding up the guage at mid-top region and lower at bottom
			//Key is setting timestep 
			if (this.velocity_pack > this.velocity_max - 50 && this.velocity_pack < this.velocity_max) {
				//At this time increase speed
				game.timestep = 1000 / 60;
			} else {
				//Return normal speed;
				game.timestep = 1000 / 20;
			}
			this.velocity_pack += this.velocity_by;
		}
	}

	this.update = function (balls) {
		this.wball = balls[balls.length - 1];
		//In each call balls moving assumed is not true
		this.balls_is_rolling = isRolling(balls);

		if (!this.balls_is_rolling && this.handing) {
			if (this.wball.x > level.balls[level.balls.length - 1].x) {
				this.wball.x = level.balls[level.balls.length - 1].x;
			}
			if (this.wball.x < 1) {
				this.wball.x = 1;
			}
			if (this.wball.y < 1) {
				this.wball.y = 1;
			}
			if (this.wball.y > level.rows - 2) {
				this.wball.y = level.rows - 2;
			}
			this.drawStick();

		}
		if (!this.balls_is_rolling && !this.handing) {
			//Each ball is at rest
			//Then track the white ball
			this.drawStick();
			if (this.shootted) {
				//To keep track used for some other method
				//In which is rellay ball is fired or not 
				//And may modified by other object too
				//But, always shootted the ball this fired is initalized true don't care about other thing
				this.is_fired = true;
				//To make things easier to the computer dived the speed by 100
				this.velocity_pack = this.velocity_pack / 130;

				//Now multiply both velocities of stick according to the velocity pack by the given angle
				//NOTE angle(rad) of stick is already saved before
				this.velocity.x = Math.cos(this.rad) * this.velocity_pack;
				this.velocity.y = Math.sin(this.rad) * this.velocity_pack;
				//Call shooter to shoot the ball by this stick velocity
				this.wball.velocity.x = Math.cos(this.rad + this.rad2) * this.velocity_pack;
				this.wball.velocity.y = Math.sin(this.rad + this.rad2) * this.velocity_pack;
				//Re-initializing velocity pack, by
				this.velocity_pack = 0.0;
				this.velcoity_by = 10;

				//shooting and shootted is triggerd by key event
				//shotted obviously, toggle of shotting 
				//so, once we get shootted true, the next time round it will remain the same true 
				//Untill to get key triggered
				//Solution is just set current shootted to false
				this.shootted = false;
				//Reset angle
				this.rad = 0.0;
				this.rad2 = 0.0;

			}
		}


	}
	this.drawStick = function () {
		if (this.shooting) {
			//Speed show
			for (var i = 450; i >= 450 - this.velocity_pack; i -= 10) {
				c.beginPath();
				c.fillStyle = "rgb(" + (500 - i) + ", 0, 0)";
				c.fillRect(50, i, 20, 10);
				c.closePath();
			}
		}
		if (!this.handing && !this.moving) {
			c.beginPath();
			c.lineWidth = 5;
			c.strokeStyle = "lime";
			c.lineCap = "round";
			c.lineWidth = 5;
			c.moveTo(level.x + this.wball.x * level.tilewidth - Math.cos(this.rad) * this.wball.r * this.stick_length - Math.cos(this.rad) * this.velocity_pack / 5, level.y + this.wball.y * level.tilewidth - Math.sin(this.rad) * this.wball.r * this.stick_length - Math.sin(this.rad) * this.velocity_pack / 5);
			c.lineTo(level.x + this.wball.x * level.tilewidth - Math.cos(this.rad + this.rad2) * this.wball.r * 1.5 - Math.cos(this.rad) * this.velocity_pack / 5, level.y + this.wball.y * level.tilewidth - Math.sin(this.rad + this.rad2) * this.wball.r * 1.5 - Math.sin(this.rad) * this.velocity_pack / 5);
			c.stroke();
			c.closePath();
			c.beginPath();
			c.lineWidth = 5;
			c.strokeStyle = "red";
			c.lineCap = "cusp";
			c.lineWidth = 1;
			c.moveTo(level.x + this.wball.x * level.tilewidth + Math.cos(this.rad) * this.wball.r * this.stick_length / 3, level.y + this.wball.y * level.tilewidth + Math.sin(this.rad) * this.wball.r * this.stick_length / 3);
			c.lineTo(level.x + this.wball.x * level.tilewidth + Math.cos(this.rad + this.rad2) * this.wball.r, level.y + this.wball.y * level.tilewidth + Math.sin(this.rad + this.rad2) * this.wball.r);
			c.stroke();
			c.closePath();
		} if (this.handing) {
			c.beginPath();
			c.strokeStyle = "silver";
			c.fillStyle = "deepskyblue";
			for (var i = 0; i < Math.PI * 2; i += Math.PI / 2) {
				c.moveTo(level.x + this.wball.x * level.tilewidth + Math.cos(i) * this.wball.r * 1.5, level.y + this.wball.y * level.tilewidth + Math.sin(i) * this.wball.r * 1.5);
				c.lineTo(level.x + this.wball.x * level.tilewidth + Math.cos(i) * this.wball.r * 3, level.y + this.wball.y * level.tilewidth + Math.sin(i) * this.wball.r * 3);
			}
			c.font = "bold 20pt TimeNewRoman";
			c.fillText("Adjust position", level.x + this.wball.x * level.tilewidth - this.wball.r * 4, level.y + this.wball.y * level.tilewidth - this.wball.r * 4);
			c.stroke();
			c.closePath();
		}
	}

};


//======SCORE
var Score = function () {
	//Initialization
};

//FPS
var FPS = function () {
	//Initialization
	this.init();
};
FPS.prototype.init = function () {
	// body...
	this.x = innerWidth * 0.95;
	this.y = innerHeight * 0.9;
	this.lastupdate = 0.0;
	this.current_frames = 0;
	this.fps = 0;

};
FPS.prototype.draw = function () {

	c.fillStyle = "teal";
	c.beginPath();
	c.arc(this.x, this.y, 50, 0, Math.PI * 2, false);
	c.fill();
	c.closePath();

	c.fillStyle = "white";
	c.font = "bold 25pt TimesNewRoman";
	c.beginPath();
	c.fillText("FPS", this.x - 30, this.y - 52);
	c.fillText(Math.floor(this.fps), this.x - 8 * (Math.floor(this.fps) + "").length, this.y + 10);
	c.closePath();
};
//DEV
var Dev = function () {
	//Initialization
	this.init();
};
Dev.prototype.init = function () {
	// body...
	this.x = innerWidth * 0.45;
	this.y = innerHeight * 0.5;
};
Dev.prototype.draw = function () {
	c.fillStyle = "rgba(30,110, 34, 0.2)";
	c.font = "bold 35pt Impact";
	c.beginPath();
	c.fillText(game.dev, this.x, this.y);
	c.closePath();
};




var level = new Level();
var score = new Score();
var fps = new FPS();
var dev = new Dev();
var stick = new Stick();
var balls;
var rule = new Rule();
var pocket = new Pocket();
window.addEventListener('keydown', this.keyboard, false);
window.addEventListener('keyup', function () {
	stick.rad_speed = 0.0;
});

function newgame() {
	balls = [];
	keycode = 2;
	game.mode = 1;//Comman Start playing
	game.lastupdate = 0;
	for (var i = 0; i < level.balls.length; i++) {
		balls.push(new Ball(level.balls[i]));
	}
	rule.init();
	pocket.init();
	main(0);//Starting main;

}

function main(timestamp) {
	c.clearRect(0, 0, innerWidth, innerHeight);

	if (timestamp - game.lastupdate >= game.timestep && stick.shooting) {
		stick.snipper();
		game.lastupdate = timestamp;
	}

	if (game.mode == 1 || game.mode == -1) {
		/*
		========NOTE====
		Snake draw and other drawing is running under normal circemstance
		which means they running 60fps, but only update snake address by specified fps,
		so the the snake draw function keep catch it's postion till update is called. One thing here is
		as i said we only want to limit snake speed not snake drawing or level, rat, score... thats why
		i let them to draw max fps
		=========
		*/
		//Show game grahic in playing and even faild also

		level.draw();
		dev.draw();
		for (var i = 0; i < balls.length; i++) {
			if (!balls[i].pocked) {
				//Only update non-pocked balls
				balls[i].update(balls);
			}
		}
	}


	//User interacting
	if (modal.mode != 0 && timestamp - modal.lastupdate >= modal.timestep) {
		//Welcome 
		modal.starttime = modal.isset_start_time ? modal.starttime : timestamp;//Setting start time
		modal.isset_start_time = true;//Set in each iteration to keep start time
		fade(timestamp, modal.mode);//Call the method to fade/inout whatever modal
		modal.lastupdate = timestamp;//Save the last timestamp

		if (timestamp - modal.starttime > modal.dur) {
			//The timestamp reached the duration
			//Update keys
			modal.isset_start_time = false;
			modal.mode = 0;
		}
	}

	//Calculating and displaying FPS 
	if (timestamp > fps.lastupdate + 1000) {
		//Update every seconds
		fps.fps = 0.25 * fps.current_frames + (1 - 0.25) * fps.fps;
		//Compute FPS
		//save lastupdate
		fps.lastupdate = timestamp;
		//Set current to zero
		fps.current_frames = 0
	}
	fps.current_frames++;
	fps.draw();
	dev.draw();

	if (game.mode != -1) {
		// Only when the game is playing the main animation is looping
		// Otherwise to save system terminate it
		window.requestAnimationFrame(main);
	}
}
main(0);

