AlgoViz

A step-by-step sorting algorithm visualizer. Pick an algorithm, press Start, and watch it sort an array of bars while a live counter tracks every comparison and swap.

I built this as a small project to understand how basic sorting algorithms actually behave, not just what their Big O looks like on paper.

Features

• Three algorithms: Bubble Sort, Selection Sort and Insertion Sort
• Three speeds: Slow, Medium and Fast (can be changed while a sort is running)
• Random array of 14 numbers between 12 and 95 on every "New Array"
• Distinct colors for unsorted, comparing, swapping and sorted bars
• Live counters for comparisons and swaps
• Best, average and worst case time complexity for the selected algorithm
• A plain-language explanation of every step
• Reset brings the same array back to its starting order, so you can run a different algorithm on identical data

Running it

There is nothing to install. Download or clone the project and open index.html in any modern browser.

git clone https://github.com/YOUR-USERNAME/algoviz.git
cd algoviz

Then double-click index.html. The fonts load from Google Fonts, so an internet connection is needed to see them as designed. Without one, the page falls back to system fonts and still works.

Project structure

algoviz/
  index.html    page structure
  style.css     layout, colors and bar states
  app.js        array generation, sorting steps, metrics
  README.md     this file

How it works

Each algorithm is an async function that does its normal work but pauses after every comparison and swap. At each pause the page redraws the bars, updates the counters and writes a sentence describing what just happened. The pause length comes from the speed selector.

Pressing Reset (or choosing another array) bumps a run id. A sorting function that wakes up and sees a different id than the one it started with stops immediately, which is how a running sort gets cancelled cleanly.

Time complexity

Algorithm
Best
Average
Worst
Bubble Sort
O(n)
O(n^2)
O(n^2)
Selection Sort
O(n^2)
O(n^2)
O(n^2)
Insertion Sort
O(n)
O(n^2)
O(n^2)

Bubble Sort reaches O(n) on an already sorted array because it stops after a pass with no swaps. Selection Sort always scans the full remaining array to find the minimum, so it never gets faster. Insertion Sort is fast on nearly sorted data because each element only moves a short distance.

Design

The look is kept deliberately plain: an off-white background, white cards with thin borders, and one dark accent color for the main button. Fonts are Instrument Serif for the heading, Plus Jakarta Sans for the interface and JetBrains Mono for numbers.

Deploying on GitHub Pages

1. Push the files to a GitHub repository, with index.html in the root folder.
2. Open the repository on GitHub and go to Settings, then Pages.
3. Under Build and deployment, set the source to "Deploy from a branch".
4. Choose the main branch and the / (root) folder, then save.
5. After a minute or two the site is live at https://YOUR-USERNAME.github.io/algoviz/.

Possible next steps

• Merge Sort and Quick Sort
• A slider to change the array size
• Pause and step-forward buttons
• Letting the user type in their own array

Tech

HTML5, CSS3 and vanilla JavaScript. No frameworks, no build step, no external APIs.
