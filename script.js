const combinations = [
    {name: "CIONA", elements: ["DAAH", "PAPCORN", "POOP", "HELLO KITTY"]},
    {name: "MIZI", elements: ["HUH?", "WHAT?", "ME?", "HOW?"]},
    {name: "SAANVI", elements: ["LAME", "STUPID", "DUMBO", "BC"]},
    {name: "KAMYA", elements: ["NEVER", "JUST A FRIEND", "SHAADI", "MACHHAR"]}
];
let attempts = 4;
let selectedElements = [];
let matchedElements = new Set();
let canSelect = true; // Control flag to enable/disable selection

const amazing_sound = new Audio('amazing.mp3'); // Adjust the path as necessary
const loser_sound = new Audio('loser.mp3');
const boo = new Audio('boo.mp3');

function showLoserMessage() {
    const loserMessage = document.getElementById('loserMessage');
    const loserImage = document.getElementById('loserImage');

    // Assuming you have a container for the message and image
    loserImage.style.display='block';
    loserMessage.style.visibility = 'visible'; // Make the loser message visible
    boo.play();
    loser_sound.play();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

function getAllElements() {
    const allElements = [];
    combinations.forEach(combo => {
        combo.elements.forEach(element => {
            if (!allElements.includes(element)) {
                allElements.push(element);
            }
        });
    });
    return allElements;
}

function initializeGame() {
    if(attempts>0){
        const elementsContainer = document.querySelector('.elements');
        const elements = getAllElements();
        shuffleArray(elements);
    
        elements.forEach((elementText, i) => {
            const element = document.createElement('div');
            element.classList.add('element');
            element.textContent = elementText; // Display actual element text
            element.dataset.index = i; // Use a data attribute to store the original index
            element.onclick = function() {
                if (!matchedElements.has(elementText)) toggleSelection(elementText, element); 
            };
            elementsContainer.appendChild(element);
        });
    }
    else if (attempts<=0){
        showLoserMessage();
    }
 }
    

 function toggleSelection(elementText, element) {
    // Determine if the element is already selected
    const indexInSelectedElements = selectedElements.indexOf(elementText);

    // Handle deselection
    if (indexInSelectedElements > -1) {
        // The element is already selected, so remove it from the selection
        selectedElements.splice(indexInSelectedElements, 1);
        element.classList.remove('selected');
    } else if (!matchedElements.has(elementText)) {
        // Only proceed with selection if the limit hasn't been reached and it's not matched
        if (selectedElements.length < 4) {
            selectedElements.push(elementText);
            element.classList.add('selected');
        }
    }
    // This revised logic removes the early return statement and correctly handles both selection and deselection.
}


function checkCombination() {
    if (selectedElements.length === 4) {
        let combinationFound = false;
        combinationsLoop:
        for (let combo of combinations) {
            if (combo.elements.length === selectedElements.length && combo.elements.every(element => selectedElements.includes(element))) {
                amazing_sound.play();
                alert(`${combo.name} matched!`);
                combinationFound = true;
                // Mark matched elements
                selectedElements.forEach(element => matchedElements.add(element));
                // Update elements to show they are matched
                document.querySelectorAll('.element').forEach(el => {
                    if (selectedElements.includes(el.textContent)) {
                        el.classList.add('matched'); // You might need to define this class in your CSS
                        el.classList.remove('selected');
                    }
                });
                break combinationsLoop;
            }
        }

        if (!combinationFound) {
            attempts = attempts - 1;
            alert("Try again.");
            if(attempts<=0){
                showLoserMessage();
            }
        }
        updateScore();
        resetGame(combinationFound);
    } else {
        alert("Please select exactly 4 elements.");
    }
}

function updateScore() {
    document.getElementById('attempts').textContent = `Remaining attempts: ${attempts}`;
}

function resetGame() {
    // Reset the game for another attempt
    if(attempts>0){
        selectedElements = [];
        canSelect = true; // Re-enable selection for the next round
        document.querySelectorAll('.element').forEach(el => el.classList.remove('selected'));
    }
    else if (attempts<=0){
        initializeGame();
    }
}

document.getElementById('submit').onclick = checkCombination;

initializeGame();
