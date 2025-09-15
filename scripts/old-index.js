// Import Tools
import { chooseRandom, waitForArray } from "./tools.js";

const sentenceElement = document.getElementById("sentence");
const scrambledSentenceElement = document.getElementById("scambled-sentence");
const userGuessInputElement = document.getElementById("user-guess");
const getButton = document.getElementById('getButton');
getButton.addEventListener('click', showSentence);

const fetchAddr = "https://gnftest001-backend.onrender.com/toc128_api/get_sentences_list";
const fetchAddrTest = "http://127.0.0.1:10000/toc128_api/get_sentences_list/";

let addrFetch = fetchAddrTest; // Change this according to build.

let scrambled_sentence = [];
let sentences = [];
let wait_done = false;
let sentenceVisible = true;
let sentence = '';

const storageKeys = {
    SENTENCES: 'sentences_list_stringified'
}

async function fetchSentences() {
    // Get sentences from local storage, if available.
    if (localStorage.getItem(storageKeys.SENTENCES)) {
        sentences = JSON.parse(localStorage.getItem(storageKeys.SENTENCES));
    }
    
    // Fetch sentences from backend for up-to-date list.
    let response;
    await fetch(addrFetch).then(async (resolved_response) => {
        response = await resolved_response.json();
    }).catch(() => {
        return null;
    });

    if (response) {
        sentences = response;
        localStorage.setItem(storageKeys.SENTENCES, JSON.stringify(sentences));
    }
}

async function getRandomSentence() {
    if (!wait_done) {
        await waitForArray(sentences);
        wait_done = true;
    }

    return chooseRandom(sentences);
}

async function showSentence() {
    console.log("called");
    //toggleOriginalSentenceVisibility();
    sentenceVisible ? toggleOriginalSentenceVisibility() : null;
    userGuessInputElement.value = "";
    sentenceElement.innerText = "Loading...";
    scrambledSentenceElement.innerText = "Server is down, please wait or try again later...";

    sentence = await getRandomSentence();
    
    sentenceElement.innerText = `Sentence: ${sentence}${
        !(sentence.slice(-1).includes('.') || 
        sentence.slice(-1).includes('?') || 
        sentence.slice(-1).includes('!')) ? '.' : ''}`; // Display the topic & sentence`
    
    scrambled_sentence = scrambleSentence(sentence);
    scrambledSentenceElement.innerText = `Scramabled Sentence: ${scrambled_sentence.split(' ').length <= 5 ? scrambled_sentence.toLowerCase() : scrambled_sentence}`;
}

function scrambleSentence(sentence) {
    sentence = sentence.substring(0, sentence.length-1);

    const words = sentence.split(' ');
    const wordsLength = words.length;

    let scrambled_sentence = sentence;

    while (sentence.toLowerCase() === scrambled_sentence.toLowerCase()) {
        scrambled_sentence = [];

        for (let _ = 0; _ < wordsLength; _++) {
            const index = Math.floor(Math.random()*words.length);

            scrambled_sentence.push(words[index]);
            words.splice(index, 1);
        }

        scrambled_sentence = scrambled_sentence.join(' ');
    }

    return scrambled_sentence;
}

function toggleOriginalSentenceVisibility() {
    let guessed = true;
    sentenceElement.style.opacity = sentenceVisible ? 0 : 1;
    sentenceVisible = !sentenceVisible;

    const user_words = userGuessInputElement.value.toLowerCase().split(' ');
    const words = sentence.toLowerCase().split(' ');

    user_words.forEach((user_word, index) => {
        user_word.substring(user_word.length-1, user_word.length) === '.' ? user_word = user_word.substring(0, user_word.length-1) : user_word;
        words[index].substring(words[index].length-1, words[index].length) === '.' ? words[index] = words[index].substring(0, words[index].length-1) : words[index];

        if (user_word !== words[index]) {
            guessed = false;
        }
    });

    guessed ? sentenceElement.style.color = 'green' : sentenceElement.style.color = 'red';
}

function checkGuess(event) {
    if (event.key === 'Enter') {
        if (!sentenceVisible) {
            toggleOriginalSentenceVisibility();
        } else {
            showSentence();
        }
    }
}

userGuessInputElement.addEventListener('keydown', checkGuess);

fetchSentences();

showSentence();
