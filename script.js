let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

let events = {
  mouse: { down: "mousedown", move: "mousemove", up: "mouseup" },
  touch: { down: "touchstart", move: "touchmove", up: "touchend" },
};

let deviceType = "";
let draw = false;
let erase = false;

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

isTouchDevice();

// Function to maintain higher width than height
const adjustWidth = () => {
  let height = parseInt(gridHeight.value);
  let minWidth = Math.ceil(height * 1.5); // Maintain a minimum 1.5:1 ratio
  if (gridWidth.value < minWidth) {
    gridWidth.value = minWidth;
    widthValue.innerHTML = minWidth < 10 ? `0${minWidth}` : minWidth;
  }
};

// Listen for height changes to adjust width
gridHeight.addEventListener("input", adjustWidth);

// Create Grid
gridButton.addEventListener("click", () => {
  container.innerHTML = "";
  let count = 0;
  for (let i = 0; i < gridHeight.value; i++) {
    count += 2;
    let div = document.createElement("div");
    div.classList.add("gridRow");
    for (let j = 0; j < gridWidth.value; j++) {
      count += 2;
      let col = document.createElement("div");
      col.classList.add("gridCol");
      col.setAttribute("id", `gridCol${count}`);

      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        col.style.backgroundColor = erase ? "transparent" : colorButton.value;
      });

      col.addEventListener(events[deviceType].move, (e) => {
        let elementId = document.elementFromPoint(
          !isTouchDevice() ? e.clientX : e.touches[0].clientX,
          !isTouchDevice() ? e.clientY : e.touches[0].clientY
        )?.id;
        checker(elementId);
      });

      col.addEventListener(events[deviceType].up, () => {
        draw = false;
      });

      div.appendChild(col);
    }
    container.appendChild(div);
  }
});

// Function to check and apply colors
function checker(elementId) {
  document.querySelectorAll(".gridCol").forEach((element) => {
    if (elementId === element.id) {
      element.style.backgroundColor = draw
        ? erase
          ? "transparent"
          : colorButton.value
        : element.style.backgroundColor;
    }
  });
}

// Clear Grid
clearGridButton.addEventListener("click", () => {
  container.innerHTML = "";
});

// Erase & Paint Mode
eraseBtn.addEventListener("click", () => (erase = true));
paintBtn.addEventListener("click", () => (erase = false));

// Update width/height labels
gridWidth.addEventListener("input", () => {
  widthValue.innerHTML = gridWidth.value.padStart(2, "0");
});
gridHeight.addEventListener("input", () => {
  heightValue.innerHTML = gridHeight.value.padStart(2, "0");
});

// Set default values
window.onload = () => {
  gridWidth.value = 15;
  gridHeight.value = 10;
  adjustWidth();
};
