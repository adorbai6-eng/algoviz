const ARRAY_SIZE = 14;
const MIN_VALUE = 12;
const MAX_VALUE = 95;

const speedDelays = {
  slow: 900,
  medium: 450,
  fast: 150
};

const complexityTable = {
  bubble: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
  selection: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
  insertion: { best: "O(n)", average: "O(n²)", worst: "O(n²)" }
};

const algorithmNames = {
  bubble: "Bubble sort",
  selection: "Selection sort",
  insertion: "Insertion sort"
};

const stage = document.getElementById("stage");
const algorithmSelect = document.getElementById("algorithm-select");
const speedSelect = document.getElementById("speed-select");
const newArrayBtn = document.getElementById("new-array-btn");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const comparisonCount = document.getElementById("comparison-count");
const swapCount = document.getElementById("swap-count");
const explanation = document.getElementById("explanation");

let numbers = [];
let originalNumbers = [];
let sortedIndexes = new Set();
let comparisons = 0;
let swaps = 0;
let isRunning = false;
let isFinished = false;
let runId = 0;

function generateRandomArray() {
  const result = [];
  for (let i = 0; i < ARRAY_SIZE; i++) {
    const value = Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
    result.push(value);
  }
  return result;
}

function drawBars(comparing = [], swapping = []) {
  stage.innerHTML = "";

  numbers.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = (value / MAX_VALUE) * 100 + "%";

    if (sortedIndexes.has(index)) bar.classList.add("sorted");
    if (comparing.includes(index)) bar.classList.add("comparing");
    if (swapping.includes(index)) bar.classList.add("swapping");

    const label = document.createElement("span");
    label.className = "bar-value";
    label.textContent = value;

    bar.appendChild(label);
    stage.appendChild(bar);
  });
}

function updateMetrics() {
  comparisonCount.textContent = comparisons;
  swapCount.textContent = swaps;
}

function updateComplexity() {
  const info = complexityTable[algorithmSelect.value];
  document.getElementById("complexity-best").textContent = info.best;
  document.getElementById("complexity-average").textContent = info.average;
  document.getElementById("complexity-worst").textContent = info.worst;
}

function setExplanation(text) {
  explanation.textContent = text;
}

function setRunningState(running) {
  isRunning = running;
  startBtn.disabled = running;
  newArrayBtn.disabled = running;
  algorithmSelect.disabled = running;
}

function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, speedDelays[speedSelect.value]);
  });
}

// Each step redraws the bars, writes the explanation, then pauses.
// If Reset was pressed in the meantime the run id no longer matches and we stop.
async function showStep(currentRun, comparing, swapping, text) {
  if (currentRun !== runId) throw new Error("stopped");
  drawBars(comparing, swapping);
  updateMetrics();
  setExplanation(text);
  await wait();
  if (currentRun !== runId) throw new Error("stopped");
}

function swapValues(i, j) {
  const temp = numbers[i];
  numbers[i] = numbers[j];
  numbers[j] = temp;
  swaps++;
}

async function runBubbleSort(currentRun) {
  const n = numbers.length;

  for (let pass = 0; pass < n - 1; pass++) {
    let swappedInPass = false;

    for (let j = 0; j < n - pass - 1; j++) {
      comparisons++;
      await showStep(
        currentRun,
        [j, j + 1],
        [],
        "Comparing " + numbers[j] + " and " + numbers[j + 1] + " next to each other."
      );

      if (numbers[j] > numbers[j + 1]) {
        const left = numbers[j];
        const right = numbers[j + 1];
        swapValues(j, j + 1);
        swappedInPass = true;
        await showStep(
          currentRun,
          [],
          [j, j + 1],
          left + " is bigger than " + right + ", so they trade places."
        );
      }
    }

    sortedIndexes.add(n - pass - 1);

    if (!swappedInPass) break;
  }

  for (let i = 0; i < n; i++) sortedIndexes.add(i);
}

async function runSelectionSort(currentRun) {
  const n = numbers.length;

  for (let i = 0; i < n - 1; i++) {
    let smallest = i;

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      await showStep(
        currentRun,
        [smallest, j],
        [],
        "Looking for the smallest value. Comparing " + numbers[j] + " with the current smallest, " + numbers[smallest] + "."
      );

      if (numbers[j] < numbers[smallest]) {
        smallest = j;
      }
    }

    if (smallest !== i) {
      const first = numbers[i];
      const second = numbers[smallest];
      swapValues(i, smallest);
      await showStep(
        currentRun,
        [],
        [i, smallest],
        "The smallest value is " + second + ". Swapping it with " + first + " at position " + (i + 1) + "."
      );
    }

    sortedIndexes.add(i);
  }

  for (let i = 0; i < n; i++) sortedIndexes.add(i);
}

async function runInsertionSort(currentRun) {
  const n = numbers.length;
  sortedIndexes.add(0);

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0) {
      comparisons++;
      await showStep(
        currentRun,
        [j - 1, j],
        [],
        "Comparing " + numbers[j] + " with " + numbers[j - 1] + " to find where it fits in the sorted part."
      );

      if (numbers[j - 1] > numbers[j]) {
        const moving = numbers[j];
        const bigger = numbers[j - 1];
        swapValues(j - 1, j);
        await showStep(
          currentRun,
          [],
          [j - 1, j],
          bigger + " is larger than " + moving + ", so " + moving + " moves one place to the left."
        );
        j--;
      } else {
        break;
      }
    }

    for (let k = 0; k <= i; k++) sortedIndexes.add(k);
  }
}

function finishRun() {
  isFinished = true;
  setRunningState(false);
  drawBars();
  updateMetrics();
  setExplanation(
    "Sorted. " + algorithmNames[algorithmSelect.value] + " finished with " +
    comparisons + " comparisons and " + swaps + " swaps."
  );
}

async function startSorting() {
  if (isRunning) return;

  if (isFinished) restoreOriginalArray();

  runId++;
  const currentRun = runId;
  setRunningState(true);

  const algorithms = {
    bubble: runBubbleSort,
    selection: runSelectionSort,
    insertion: runInsertionSort
  };

  try {
    await algorithms[algorithmSelect.value](currentRun);
    if (currentRun === runId) finishRun();
  } catch (error) {
    if (error.message !== "stopped") throw error;
  }
}

function restoreOriginalArray() {
  runId++;
  numbers = originalNumbers.slice();
  sortedIndexes = new Set();
  comparisons = 0;
  swaps = 0;
  isFinished = false;
  setRunningState(false);
  drawBars();
  updateMetrics();
  setExplanation("Press Start to begin sorting the array.");
}

function createNewArray() {
  originalNumbers = generateRandomArray();
  restoreOriginalArray();
}

algorithmSelect.addEventListener("change", () => {
  updateComplexity();
  if (isFinished) restoreOriginalArray();
});

newArrayBtn.addEventListener("click", createNewArray);
startBtn.addEventListener("click", startSorting);
resetBtn.addEventListener("click", restoreOriginalArray);

updateComplexity();
createNewArray();
