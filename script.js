const container = document.getElementById("container");
const difficulty = document.getElementById("difficulty");
const diffVal = document.getElementById("difficulty-value");
const btn = document.getElementById("startbutton");
const settings = document.getElementById("settings");
const flipcard = new Audio("flipcard.mp3");
const match = new Audio("match.mp3");
const youwin = new Audio("win.mp3");
const ybtn = document.getElementById("yesButton");
const nbtn = document.getElementById("noButton");

const apiUrl = "https://api.unsplash.com/photos/random";
let clickCount = 0;
let firstCard, secondCard;

difficulty.addEventListener("input", (e) => {
  const value = +e.target.value;

  const range_width = getComputedStyle(e.target).getPropertyValue("width");

  const num_width = +range_width.substring(0, range_width.length - 2);

  const max = +e.target.max;
  const min = +e.target.min;

  // Position the span based on where the value falls on the range, proportionately.
  let left = ((value - min) / (max - min)) * num_width;

  // Tweak the position a little more so the span is centered over the thumb.
  left = left - scale(value, min, max, 8, 18);

  console.log(left);

  diffVal.style.left = `${left}px`;

  diffVal.innerHTML = value * 2;
});

// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

btn.addEventListener("click", makeGame);

container.addEventListener("click", function (e) {
  if (clickCount === 0) {
    flipcard.play();
    e.target.firstChild.style.visibility = "visible";
    firstCard = e.target.firstChild;
    clickCount++;
  } else if (clickCount === 1) {
    flipcard.play();
    e.target.firstChild.style.visibility = "visible";
    secondCard = e.target.firstChild;
    clickCount++;
    setTimeout(() => {
      testMatch(firstCard, secondCard);
      clickCount = 0;
    }, "1000");
  } else if (clickCount > 1) {
    return;
  }
});

function makeGame() {
  settings.parentNode.removeChild(settings);

  fetch(`${apiUrl}?count=${difficulty.value}&ar=2:3&fit=fill&w200&h300`, {
    headers: {
      Authorization: "Client-ID xCtD02h7_OX2hHqf9WiFZLLQRMNrMEjZtAkze3U4ljk",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (i = 0; i < data.length; i++) {
        let imageURL = data[i].urls.regular;
        let card = document.createElement("div");
        card.classList.add("card");
        let copy = card.cloneNode(true);
        let cardImg = document.createElement("img");
        cardImg.classList.add([i]);
        cardImg.src = imageURL;
        let imgCopy = cardImg.cloneNode(true);
        container.appendChild(card);
        card.appendChild(cardImg);
        container.appendChild(copy);
        copy.appendChild(imgCopy);
      }
      const cards = document.getElementsByClassName("card");
      let cardsArr = Array.from(cards);
      shuffle(cardsArr);
    });
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  for (i = 0; i < array.length; i++) {
    container.appendChild(array[i]);
  }
}

function testMatch(a, b) {
  if (a.classList.item(0) === b.classList.item(0)) {
    match.play();
    a.parentNode.style.opacity = ".2";
    b.parentNode.style.opacity = ".2";
    a.style.visibility = "hidden";
    b.style.visibility = "hidden";
    a.classList.add("matched");
    b.classList.add("matched");
    testWin();
  } else {
    console.log("try again");
    a.style.visibility = "hidden";
    b.style.visibility = "hidden";
  }
}

function testWin() {
  const images = document.querySelectorAll("img");
  console.log(images);
  for (i = 0; i < images.length; i++) {
    if (!images[i].classList.contains("matched")) {
      return;
    }
  }
  youwin.play();
  playAgain();
}

function playAgain() {
  container.innerHTML = "";
  document.getElementById("playAgain").style.visibility = "visible";
}

ybtn.addEventListener("click", () => {
  location.reload();
});

nbtn.addEventListener("click", () => {
  document.getElementById("playAgain").innerHTML = "Thank you for playing!";
});
