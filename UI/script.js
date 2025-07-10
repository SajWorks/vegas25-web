const BASE_URL = 'https://amazing-crane-ghastly.ngrok-free.app';
const DATA_PATH = '/api/data';
const PLAY_PATH = '/api/play';
const GAME_STATE_PATH = '/api/game_state';
const DATA_URL = BASE_URL + DATA_PATH;
const PLAY_URL = BASE_URL + PLAY_PATH;
const GAME_STATE_URL = BASE_URL + GAME_STATE_PATH;


var r = "rgb(255,0,0)";
var g = "rgb(0,255,0)";
var b = "rgb(0,0,255)";
var y = "rgb(255,255,0)";
var p = "rgb(128,0,128)";
var o = "rgb(255,105,0)";
const list = [r, o, y, g, b, p];
const colorNames = ['r', 'o', 'y', 'g', 'b', 'p']
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

function getColorName(rgbColor) {
    const normalizedColor = rgbColor.replace(/\s/g, '');

    switch(normalizedColor) {
        case r.replace(/\s/g, ''): return 'r';
        case o.replace(/\s/g, ''): return 'o';
        case y.replace(/\s/g, ''): return 'y';
        case g.replace(/\s/g, ''): return 'g';
        case b.replace(/\s/g, ''): return 'b';
        case p.replace(/\s/g, ''): return 'p';
        default: return null;

    }
}

document.getElementById('enterButton').addEventListener('click', async () => {
    const color1 = buttons[0].style.backgroundColor;
    const color2 = buttons[1].style.backgroundColor;
    const color3 = buttons[2].style.backgroundColor;
    const color4 = buttons[3].style.backgroundColor;
    if (color1 == color2 || color1 == color3 || color1 == color4 || color2 == color3 || color2 ==color4 || color3 == color4 || color1 == "white" || color2 == "white" || color3 == "white" || color4 == "white"){
        console.log("you have an invalid pattern");
        alert("you have an invalid pattern, please try again")
    } else{
        const colorName1 = getColorName(color1);
        const colorName2 = getColorName(color2);
        const colorName3 = getColorName(color3);
        const colorName4 = getColorName(color4);
        console.log("GUESS:" + colorName1, colorName2, colorName3, colorName4);

    }
});

//async function fetchData() {
    //try {
    //const res = await fetch(GAME_STATE_URL, {
       // headers: {
            //'ngrok-skip-browser-warning': 'true'
        //}
    //});
    //const data = await res.json();
    //document.getElementById('tempF').textContent = data.state ?? '--';
    //document.getElementById('tempC').textContent = data.tempC ?? '--';
    //document.getElementById('hum').textContent = data.humidity ?? '--';
  //  } catch (err) {
            //console.error('Error fetching data:', err);
            //}
        //}

       // document.getElementById('enterButton').addEventListener('click', async () => {
         //   try {
            //await fetch(PLAY_URL, {
                //method: 'POST',
                //headers: {
                //'ngrok-skip-browser-warning': 'true'
               // }
            //});
            //} catch (err) {
            //console.error('Error calling PLAY endpoint:', err);
            //}
        //});

//fetchData();
//setInterval(fetchData, 3000); // Refresh every 3 seconds