

var red = "rgb(255,0,0)";
var green = "rgb(0,255,0)";
var blue = "rgb(0,0,255)";
var yellow = "rgb(255,255,0)";
var purple = "rgb(128,0,128)";
var orange = "rgb(255,105,0)";
const list = [red, orange, yellow, green, blue, purple];
let buttonColorindexes = [0, 0, 0, 0];


var heading = document.getElementById('colorValue');

var buttons = document.getElementsByClassName('colorButton');
var body = document.getElementById('background');

function getNextColor(buttonIndex) {
  const color = list[buttonColorindexes[buttonIndex]];
  buttonColorindexes[buttonIndex] = (buttonColorindexes[buttonIndex] + 1) % list.length;
  
  return color;
}
function setButtonColor(button, color){
  button.style.backgroundColor = color;
}
for (var i = 0; i < buttons.length; i++){
  (function(index) {
    buttons[index].addEventListener('click', function(){
      const nextColor = getNextColor(index); 
      setButtonColor(this, nextColor);
  
    }); 
  })(i);
}

setButtonColor(buttons[0], "white");
setButtonColor(buttons[1], "white");
setButtonColor(buttons[2], "white");
setButtonColor(buttons[3], "white");

