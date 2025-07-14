// create page for end game with winner

const BASE_URL = 'https://amazing-crane-ghastly.ngrok-free.app';
const DATA_PATH = '/api/data';
const PLAY_PATH = '/api/play';
const GAME_STATE_PATH = '/api/game_state';
const GUESS_PATH = '/api/guess';
const GUESS_URL = BASE_URL + GUESS_PATH;
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
const gameState = document.getElementById('GameState');

function getNextColor(buttonIndex) {
  const color = list[buttonColorindexes[buttonIndex]];
  buttonColorindexes[buttonIndex] = (buttonColorindexes[buttonIndex] + 1) % list.length;

  return color;
}
function setButtonColor(button, color) {
  button.style.backgroundColor = color;
}
for (var i = 0; i < buttons.length; i++) {
  (function (index) {
    buttons[index].addEventListener('click', function () {
      const nextColor = getNextColor(index);
      setButtonColor(this, nextColor);

    });
  })(i);
}
// Set initial colors for buttons
setButtonColor(buttons[0], "white");
setButtonColor(buttons[1], "white");
setButtonColor(buttons[2], "white");
setButtonColor(buttons[3], "white");

function getColorName(rgbColor) {
  const normalizedColor = rgbColor.replace(/\s/g, '');

  switch (normalizedColor) {
    case r.replace(/\s/g, ''): return 'r';
    case o.replace(/\s/g, ''): return 'o';
    case y.replace(/\s/g, ''): return 'y';
    case g.replace(/\s/g, ''): return 'g';
    case b.replace(/\s/g, ''): return 'b';
    case p.replace(/\s/g, ''): return 'p';
    default: return null;

  }
}
// set to work only if its player 2's turn should be in fetch game state function
document.getElementById('enterButton').addEventListener('click', async () => {
  try {
    const res = await fetch(GAME_STATE_URL, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch game state: ' + res.status);
    }
    const GameState = await res.json();
    console.log("Game State:", GameState);
  
    if (GameState.state === 'READY' || GameState.state === 'PLAY2') {
      const color1 = buttons[0].style.backgroundColor;
      const color2 = buttons[1].style.backgroundColor;
      const color3 = buttons[2].style.backgroundColor;
      const color4 = buttons[3].style.backgroundColor;
      if (color1 == color2 || color1 == color3 || color1 == color4 || color2 == color3 || color2 == color4 || color3 == color4 || color1 == "white" || color2 == "white" || color3 == "white" || color4 == "white") {
        console.log("you have an invalid pattern");
        alert("you have an invalid pattern, please try again")
      } else {
        const colorName1 = getColorName(color1);
        const colorName2 = getColorName(color2);
        const colorName3 = getColorName(color3);
        const colorName4 = getColorName(color4);
        console.log("GUESS:" + colorName1, colorName2, colorName3, colorName4);
        const guess = colorName1 + colorName2 + colorName3 + colorName4;
        await sendGuess(guess);
        setButtonColor(buttons[0], "white");
        setButtonColor(buttons[1], "white");
        setButtonColor(buttons[2], "white");
        setButtonColor(buttons[3], "white");

      }
    } else {
      console.log("Not your turn");
      alert("Not your turn, please wait for the other player to play");
    }
  } catch (err) {
    console.error('Error fetching game state:', err);
  }
});
async function sendGuess(guess) {
  try {
    const url = new URL(GUESS_URL);
    url.searchParams.append('guess', guess);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const data = await res.json();

    // You can use 'data' here if needed
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}
async function fetchData() {
  try {
    const res = await fetch(GAME_STATE_URL, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const data = await res.json();
    const guessElem = document.getElementById('guess');
    const blackElem = document.getElementById('black');
    const whiteElem = document.getElementById('white');

    if (guessElem) {
      // Clear previous content
      guessElem.innerHTML = '';


      // Define colors array based on guess
      const colorMap = { r, o, y, g, b, p };
      const guesses = data.guesses ?? []; // Split guess string into array
      for (let i = 0; i < guesses.length; i++) {
        const guess = guesses[i];
        const guessString = guess.guess ?? '';
        const colors = guessString.split('') ?? []
        const newContainer = document.createElement('div');
        newContainer.className = 'container';
        newContainer.style.width = '100%';
        newContainer.style.display = 'flex';
        newContainer.style.flexWrap = 'wrap';
        newContainer.style.justifyContent = 'center';
        newContainer.style.margin = '0 auto';
        newContainer.style.marginBottom = '10px';
        if (colors.length == 4) {
          for (let i = 0; i < colors.length; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.backgroundColor = colors[i] && colorMap[colors[i]] ? colorMap[colors[i]] : 'white'; // Default to white if no color
            newContainer.appendChild(circle);
          }

          // Extract feedback values safely
          const response = guess.response ?? {};
          const black = response.black ?? 0;
          const white = response.white ?? 0;

          for (let j = 0; j < 4; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            newContainer.appendChild(square);
            //check if #of blacks squares then number of blacks plus whites
            if (j < black) {
              square.style.backgroundColor = "black";
            } else if (j < black + white) {
              square.style.backgroundColor = "white";
            } else {
              square.style.backgroundColor = "gray"; // Neutral color for unused squares
            }
            //Otherwise, leave as default (no color)
          }
          // Create black squares

          // Append the container to the guess element
          guessElem.appendChild(newContainer);
        }
      }
      if (!guessElem) {
        console.error("Element with id 'guess' not found.");
      }

    }

    // Create circles with the specified colors


  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

fetchData();
setInterval(fetchData, 3000); // Refresh every 3 seconds