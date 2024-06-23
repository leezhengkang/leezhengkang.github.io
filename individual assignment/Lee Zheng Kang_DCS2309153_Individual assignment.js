let p1 = 0;
let p2 = 0;
let p3 = 360;
let size = 750;
let moveScreen = 200;
let lineOffset = 30;
let cx1 = 0;
let x, y;
let a = 0;

// outer circle 1 fill('#FAD7E0');
// outer circle 2 fill('#E75677');
// inner circle fill('#4B165C');
function preload() {
    img = loadImage("crescendo-oglogo.png"); // Update variable assignment
}

function setup(){
    frameRate(60);
    createCanvas(1280,720);
    background("#431454"); 
    angleMode(DEGREES);

}

function draw(){
    background("#431454"); 
    push();

    translate(width/2, height/2 - moveScreen);

    if (moveScreen > 0) {moveScreen -= 3} // increased speed from 1 to 3
//left
// line 1
	if (p1 < 360) {p1 += 2} // progress p1/360 | 180 is half 50% | 360 is full 100% |
	if (p2 < 360) {p2 += 1}
	if (p3 > 0) {p3 -= 2}
	if (cx1< 600) {cx1 += 10}
	if (p1 > 60) {a += 1 + a/12}


    noFill();
    strokeWeight(5);
    

    stroke('#CF85A2');
    arc(-size/2 - lineOffset, 0, size, size, 0 , p1);
    stroke('#E75677');
    arc(-size/2 - lineOffset, 0, size, size, 0, p2);
  

    

// line 2
    stroke('#CF85A2');
    arc(-size/4 - lineOffset/2, 0, size/2, size, 0 , p1);
    stroke('#E75677');
    arc(-size/4 - lineOffset/2, 0, size/2, size, 0, p2);

// line 3
    stroke('#CF85A2');
    line(0, -1800, 0, p1 * 5 - 1800);
    stroke('#E75677');
    line(0, -1800, 0, p2 * 5 - 1800);

    stroke('#CF85A2');
    line(0, 0, 0, p1 * 5);
    stroke('#E75677');
    line(0, 0, 0, p2 * 5);

// White line left  (1)
    stroke('#FFFFFF');
    arc(-size/3 - lineOffset/1.5, 0, size/1.5, size, 0 , p1);


// White line left (3)
    stroke('#FFFFFF');
    arc(-size/5 - lineOffset/3, 0, size/2.5, size, 0 , p1);

// White line left (4)
    stroke('#FFFFFF');
    arc(-size/5.25 - lineOffset/4, 0, size/2.5, size, 0 , p1);

    
//right
    push();
    rotate(180);


// White line right (1)
    stroke('#FFFFFF');
    arc(-size/3 - lineOffset/1.5, 0, size/1.5, size, -p1,0);

// White line right (2)
    stroke('#FFFFFF');
    arc(-size/4 - lineOffset/3, 0, size/2, size, -p1,0);

// White line right (3)
    stroke('#FFFFFF');
    arc(-size/2.75 - lineOffset/4, 0, size/1.5, size, -p1,0);

// White line right (4)
    stroke('#FFFFFF');
    arc(-size/2.9 - lineOffset/6, 0, size/1.5, size, -p1,0);





// line 4
    stroke('#CF85A2');
    arc(-size/4 -lineOffset/2, 0, size/2, size, -p1, 0);
    stroke('#E75677');
    arc(-size/4 - lineOffset/2, 0, size/2, size, -p2, 0);

// line 5
    stroke('#CF85A2');
    arc(-size/2 - lineOffset, 0, size, size, -p1, 0);
    stroke('#E75677');
    arc(-size/2 -lineOffset, 0, size, size, -p2, 0);

    pop();

//cloud
    noStroke();
    fill ("#5B246A");
    circle(9,-20,60,60);
    circle(-25,-10,50,70);
    circle(33,5,59,100);
    circle(-45,10,50,50);
    rect (-45,0,72,35);


    push ();
    stroke('#F9D6DF');
    fill('#F9D6DF');
    circle( 0,cx1,80,80);
    stroke('#4B165C');
    fill('#4B165C');
    circle( 0,cx1,30,30);
    pop ();

    push ();
    translate(-size/2 - lineOffset, 0);
    if (p1 > 180) {rotate (180)}
    else {rotate(p1)}
    stroke('#F9D6DF');
    fill('#F9D6DF');
    circle(size/2, 0 ,80,80);
    stroke('#4B165C');
    fill('#4B165C');
    circle(size/2, 0 ,30,30);
    pop ();

	// line 2 circle
    push ();
    translate(-size/4 - lineOffset/2, 0);
    if (p1 < 180) {
		x = (size/4 + a) * cos(p1); // follows ellipse | (p1) to make the speed the same 
		y = (size/2 + a) * sin(p1);  // (+ a) so the circle goes out of the canvas
	}
    stroke('#F9D6DF');
    fill('#F9D6DF');
    circle(x, y ,80,80);
    stroke('#4B165C');
    fill('#4B165C');
    circle(x, y,30,30);
    pop ();

    // right side
    rotate(180)
    push ();
    translate(-size/2 - lineOffset, 0);
    if (p3 < 180) {rotate (180)}
    else {rotate(p3)}
    stroke('#F9D6DF');
    fill('#F9D6DF');
    circle(size/2, 0 ,80,80);
    stroke('#4B165C');
    fill('#4B165C');
    circle(size/2, 0 ,30,30);
    pop ();

	// line 4 circle
    push ();
    translate(-size/4 - lineOffset/2, 0);
    if (p1 < 180) {
		x = -(size/4 + a) * cos(p1 + 180);
		y = (size/2 + a) * sin(p1 + 180);
		// + 180 so it starts from cloud
		// - x so that it moves in other direction (left to right)
	}
    stroke('#F9D6DF');
    fill('#F9D6DF');
    circle(x, y,80,80);
    stroke('#4B165C');
    fill('#4B165C');
    circle(x, y,30,30);
    pop ();

    push();


    fill ('#CF85A2');
    translate (-size/4 - lineOffset/2,0);
    if (p1<320){
        x1 = -(size/4)*cos(p1+180);
        y1 = (size/2)*sin (p1+180); 
    }
    circle(x1,y1,20,20);
    pop();


    fill ('#CF85A2');
    translate (size/4 - lineOffset/2,0);
    if (p1<320){
        z1 = (size/5)*cos(p1+180);
        e1 = (size/2)*sin (p1+180); 
    }
    circle(z1,e1,20,20);
    pop();


    


    pop ();
    var y_coor = floor(mouseY);
    var x_coor = floor(mouseX);

    fill('white');

    text ('('+x_coor+','+y_coor+')',mouseX, mouseY);

    
    image(img, 132, 61, 180, 100);
}