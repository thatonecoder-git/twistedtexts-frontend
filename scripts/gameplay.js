// Import Modules
import { elements } from "./elements_manager.js";
import { addScore, getScore } from "./score_management.js";
import { getRandomSentence_async, getSentenceByDifficulty, getWithoutSymbols, scrambleSentence, setOriginalSentenceVisibility, getCurrentSentence, setCurrentSentence, allLowerCase, getCurrentScrambledSentence} from "./sentence_management.js";
import { copyToClipboard, shareInfo } from "./tools.js";

// Creating Variables
let sentenceRevealed = true;
let isSentenceCorrect = true;
let startTime, endTime, timeTaken;
let gameRunning = false;
export let scrambled_sentence, solution_map;
let gameTimer;

// Add event listeners
elements.btn.continue.addEventListener("click", revealOrNextSentence);
elements.btn.share.addEventListener("click", share);
elements.input.guess.addEventListener("keyup", checkPlayerGuess);
document.body.addEventListener("keydown", handleKeyDownAnywhere);

function startTimer() {
    elements.txt.timer.innerText = "Timer: 0";

    gameTimer = setInterval(() => {
        if (!gameRunning) clearInterval(gameTimer);
        else {
            elements.txt.timer.innerText = `Timer: ${Math.floor((new Date().getTime()-startTime)/1000)}`;
        }
    }, 1000);
}

async function showNextScrambledSentence_async() {
    elements.input.guess.value = "";
    elements.txt.scrambled_sentence.innerText = "Server is down, please wait or try again later...";
    
    setCurrentSentence(await getRandomSentence_async());
    
    let sentence_to_scramble = getSentenceByDifficulty(getCurrentSentence());
    [scrambled_sentence, solution_map]  = scrambleSentence(sentence_to_scramble);
    elements.txt.scrambled_sentence.innerText = scrambled_sentence;
    
    setOriginalSentenceVisibility(false);
}

function checkPlayerGuess() {
    let player_words = elements.input.guess.value.toLowerCase().split(' ');
    let scrambled_words = scrambled_sentence.toLowerCase().split(' ');
    let styled_scrambled_words =  scrambled_sentence.split(' ');

    let styled_scrambled_text = styled_scrambled_words.join(' ');
    elements.txt.scrambled_sentence.innerHTML = styled_scrambled_text;
    
    player_words.forEach((player_word) => {
        const index = allLowerCase(getWithoutSymbols(styled_scrambled_words)).indexOf(getWithoutSymbols(player_word.trim()));

        if (index > -1) {
            const classes = elements.txt.scrambled_sentence.classList.toString();
            styled_scrambled_words[index] = `<span class="${classes} txt-scrambled-sentence-used">${styled_scrambled_words[index]}</span>`;
        }
    });

    styled_scrambled_text = styled_scrambled_words.join(' ');
    elements.txt.scrambled_sentence.innerHTML = styled_scrambled_text;
}

function handleKeyDownAnywhere(event) {
    if (event.key === 'Enter') {
        revealOrNextSentence();
    }
}

function revealOrNextSentence() {
    if (!sentenceRevealed) {
        /* Original Sentence is Revealed. */
        endTime = new Date().getTime();
        
        checkSentence();
        setOriginalSentenceVisibility(true);
        elements.input.guess.disabled = true;
        elements.btn.continue.innerText = "Next Sentence";
        elements.btn.continue.classList.remove('btn-continue-reveal');
        elements.txt.timer.classList.add('txt-timer-stopped');
        sentenceRevealed = true;
        gameRunning = false;

        timeTaken = (endTime-startTime)/1000;
        isSentenceCorrect ? addScore(timeTaken, getCurrentSentence().length) : null;
    } else {
        /* Next Scrambled Sentence is Given. */
        showNextScrambledSentence_async();
        elements.input.guess.disabled = false;
        elements.input.guess.style.background_color = 'white';
        elements.input.guess.focus();
        elements.btn.continue.innerText = "Reveal Sentence";
        elements.btn.continue.classList.add('btn-continue-reveal');
        elements.txt.timer.classList.remove('txt-timer-stopped');
        sentenceRevealed = false;

        gameRunning = true;
        startTimer();
        startTime = new Date().getTime();
    }
}

function checkSentence() {
    getWithoutSymbols(getCurrentSentence().trim().toLowerCase()) !== getWithoutSymbols(elements.input.guess.value.toLowerCase()) ? 
        isSentenceCorrect = false : 
        isSentenceCorrect = true;

    if (isSentenceCorrect) {
        elements.txt.original_sentence.classList.add('txt-original-sentence-correct');
    } else {
        elements.txt.original_sentence.classList.remove('txt-original-sentence-correct');
    }
}

function share() {
    const message = sentenceRevealed ?
        `I just unscrambled "${getCurrentSentence()}" in ${timeTaken.toFixed(2)} seconds! (on twistedtext.onrender.com)\nBTW, my score is ${getScore()}!\nTry it out, it's really fun! I guess...` :
        `I'm unscrambling "${getCurrentScrambledSentence()}" on twistedtext.onrender.com\nBTW, my score is ${getScore()}!\nTry it out, it's really fun! I guess...`;

    !shareInfo(message) ?
        alert("Unable to share.\nMessage copied to clipboard, thanks for sharing!") : null;

    copyToClipboard(message);
}

revealOrNextSentence();
elements.input.guess.focus();
