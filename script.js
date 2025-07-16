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
const colorNames = ['r', 'o', 'y', 'g', 'b', 'p'];
let buttonColorindexes = [0, 0, 0, 0];

var buttons = document.getElementsByClassName('colorButton');
const gameStateElem = document.getElementById('GameState');
let gameEnded = false; // Track game end

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

// Set initial colors
Array.from(buttons).forEach(btn => setButtonColor(btn, "white"));

function getColorName(rgbColor) {
  const normalized = rgbColor.replace(/\s/g, '');
  switch (normalized) {
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
  try {
    const res = await fetch(GAME_STATE_URL, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const GameState = await res.json();

    if (GameState.state === 'READY' || GameState.state === 'PLAY2') {
      const color1 = buttons[0].style.backgroundColor;
      const color2 = buttons[1].style.backgroundColor;
      const color3 = buttons[2].style.backgroundColor;
      const color4 = buttons[3].style.backgroundColor;

      if (new Set([color1, color2, color3, color4]).size !== 4 ||
        [color1, color2, color3, color4].includes("white")) {
        alert("You have an invalid pattern, please try again.");
        return;
      }

      const guess = [
        getColorName(color1),
        getColorName(color2),
        getColorName(color3),
        getColorName(color4)
      ].join('');

      await sendGuess(guess);
      setButtonColor(buttons[0], "white");
      setButtonColor(buttons[1], "white");
      setButtonColor(buttons[2], "white");
      setButtonColor(buttons[3], "white");

      // 🔁 Reset the color indexes so next click starts at red
      buttonColorindexes = [0, 0, 0, 0];
    } else {
      alert("Not your turn, please wait for the other player to play.");
    }
  } catch (err) {
    console.error('Error during enterButton click:', err);
  }
});

async function sendGuess(guess) {
  try {
    const url = new URL(GUESS_URL);
    url.searchParams.append('guess', guess);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();
    console.log("Guess submitted:", data);
  } catch (err) {
    console.error('Error sending guess:', err);
  }
}

async function fetchData() {
  try {
    const res = await fetch(GAME_STATE_URL, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();
    console.log('DEBUG GAME STATE DATA:', data);

    // Show winner if game ended
    if (data.state === 'ENDED' && !gameEnded) {
      gameEnded = true;
      gameStateElem.textContent = "🎉 Game Over! Winner: " + (data.winner ?? "Unknown");
      gameStateElem.style.color = "white";
      gameStateElem.style.fontSize = "2em";
      gameStateElem.style.textAlign = "center";
      gameStateElem.style.marginTop = "20px";

      const tp = data.secret_pattern ?? data.TRUE_PATTERN;
      const tpElem = document.getElementById('truePattern');
      if (tpElem && tp) {
        tpElem.textContent = "Secret Pattern: " + tp.split('').join(', ');
        tpElem.style.color = "white";
        tpElem.style.fontSize = "1.5em";
        tpElem.style.textAlign = "center";
        tpElem.style.marginTop = "10px";
        tpElem.style.marginBottom = "20px";
      }
    }

    const guessElem = document.getElementById('guess');
    if (!guessElem) return;

    guessElem.innerHTML = ''; // Clear previous guesses

    const colorMap = { r, o, y, g, b, p };
    const guesses = data.guesses ?? [];

    guesses.forEach(guess => {
      const guessString = guess.guess ?? '';
      const colors = guessString.split('');
      const container = document.createElement('div');
      container.className = 'container';
      container.style.cssText = "width:100%; display:flex; flex-wrap:wrap; justify-content:center; margin-bottom:10px;";

      // Circles for guess colors
      colors.forEach(char => {
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.style.backgroundColor = colorMap[char] || 'white';
        container.appendChild(circle);
      });

      // Squares for feedback
      const response = guess.response ?? {};
      const black = response.black ?? 0;
      const white = response.white ?? 0;
      for (let j = 0; j < 4; j++) {
        const square = document.createElement('div');
        square.className = 'square';
        if (j < black) square.style.backgroundColor = 'black';
        else if (j < black + white) square.style.backgroundColor = 'white';
        else square.style.backgroundColor = 'gray';
        container.appendChild(square);
      }

      guessElem.appendChild(container);
    });

  } catch (err) {
    console.error('Error fetching game state:', err);

    // ✅ Handle connection failure with visible message
    if (gameStateElem) {
      gameStateElem.textContent = "❌ Other player not found. Please try again later.";
      gameStateElem.style.color = "red";
      gameStateElem.style.fontSize = "1.5em";
      gameStateElem.style.textAlign = "center";
      gameStateElem.style.marginTop = "20px";
    }
  }
}

fetchData();
setInterval(fetchData, 3000); // Refresh every 3s
