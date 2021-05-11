var canvas;
var ctx;
var matrix;
var font_size;
var drops;

function initialiseAnimation() {

  canvas = document.getElementById("backgroundAnimationCanvas");
  ctx = canvas.getContext("2d");

  //making the canvas full screen
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  //chinese characters - taken from the unicode charset
  matrix = "01";
  //matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
//converting the string into an array of single characters
  matrix = matrix.split("");

  font_size = 32;
  var columns = canvas.width / font_size; //number of columns for the rain
  //an array of drops - one per column
  drops = [];
  //x below is the x coordinate
  //1 = y co-ordinate of the drop(same for every drop initially)
  for (var x = 0; x < columns; x++)
    drops[x] = 1;
}

//drawing the characters
function draw()
{
  //Black BG for the canvas
  //translucent BG to show trail
  ctx.fillStyle = "rgba(203, 203, 203, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(171, 171, 171)";
  ctx.font = font_size + "px arial";
  //looping over drops
  for(var i = 0; i < drops.length; i++)
  {
    //a random chinese character to print
    var text = matrix[Math.floor(Math.random()*matrix.length)];
    //x = i*font_size, y = value of drops[i]*font_size
    ctx.fillText(text, i*font_size, drops[i]*font_size);

    //sending the drop back to the top randomly after it has crossed the screen
    //adding a randomness to the reset to make the drops scattered on the Y axis
    if(drops[i]*font_size > canvas.height && Math.random() > 0.95)
      drops[i] = 0;

    if((i === Math.round((drops.length/2)-6) || i === Math.round((drops.length/2)+6)) && drops[i] > 17)
      drops[i] = -1*(Math.trunc(Math.random()*100));

    if(i > (drops.length/2)-6 && i < (drops.length/2)+6 && drops[i] > 16)
      drops[i] = -1*(Math.trunc(Math.random()*100));

    //incrementing Y coordinate
    drops[i]++;
  }
}
