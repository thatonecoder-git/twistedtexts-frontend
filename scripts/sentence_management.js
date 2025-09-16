import { chooseRandom, waitForArray } from "./tools.js";
import { getSentencesList } from "./data.js";
import { elements } from "./elements_manager.js";
import { scrambled_sentence } from "./gameplay.js"
//import { sentencesList } from "./index.js";
//import { storageKeys, sentencesList, waitingDone, sentence, sentenceVisible, sentenceElement, scrambledSentence } from "./index.js";

let waitingDone = false;
let sentencesList = [];
let currentSentence = '';
sentencesList = await getSentencesList(false);
sentencesList = await getSentencesList(true);

export function getSentences() { return sentencesList };

export async function getRandomSentence_async() {
    if (!waitingDone) {
        await waitForArray(sentencesList);
        waitingDone = true;
    }

    return chooseRandom(sentencesList);
}

export function scrambleSentence(sentence) {
    const words = sentence.split(' ');
    const total_words = words.length;

    let indexes = Array.from({length: total_words}, (_, i) => i);
    let scrambled_sentence = sentence;
    let solutionMap = [];

    while (sentence.toLowerCase() === scrambled_sentence.toLowerCase()) {
        let scrambled_sentence_words = [];
        solutionMap = [];

        for (let i = 0; i < total_words; i++) {
            let index = chooseRandom(indexes);

            solutionMap.push(index);
            indexes.splice(indexes.indexOf(index), 1);

            scrambled_sentence_words.push(words[index]);
        }

        scrambled_sentence = scrambled_sentence_words.join(' ');
    }

    return [scrambled_sentence, solutionMap];
}

export function getSentenceByDifficulty(sentence_to_scramble) {
    let new_sentence = sentence_to_scramble;
    const words = sentence_to_scramble.split(' ').length;

    if (words <= 7) new_sentence = getFirstWordLower(new_sentence);
    if (words <= 6) new_sentence = new_sentence.toLowerCase();
    if (words <= 5) new_sentence = getWithoutEndingSymbol(new_sentence);

    return new_sentence;
}

export function getFirstWordLower(sentence) {
    let words = sentence.split(' ');
    words[0] = words[0].toLowerCase();

    return words.join(' ');
}

export function getWithoutEndingSymbol(sentence) {
    let new_sentence = sentence;

    if (sentence.length > 1) {
        const ending_symbols = "?!.,";
        let ending_char = new_sentence.slice(-1);

        while ( ending_symbols.includes(ending_char) ) {
            new_sentence = sentence.substring(0, new_sentence.length-1);
            ending_char = new_sentence.slice(-1);
        }
    }

    return new_sentence.trim();
}

export function getWithoutSymbols(wordset) {
    let new_wordset = wordset;

    let isString = false;
    typeof new_wordset == "string" ? isString = true : null;

    isString ? new_wordset = new_wordset.split(' ') : null;

    new_wordset = new_wordset.map(word => {
        return word.replace(/[?!.,'"]/g, '');
    });

    isString ? new_wordset = new_wordset.join(' ') : null;

    return new_wordset;
}

export function allLowerCase(wordset) {
    return wordset.map((word) => {
        return word.toLowerCase();
    });
}

export function trimEach(wordset) {
    let new_wordset = [];

    wordset.split(' ').forEach(word => {
        if (word.length > 0) new_wordset.push(word.trim());
    });

    return new_wordset.join(' ');
}

export function hasEndingSymbol(sentence) {
    const ending_symbols = "?!.";
    let ending_char = sentence.slice(-1);

    if (ending_symbols.includes(ending_char)) return true; else return false;
}

export function getCurrentSentence() { return currentSentence; }

export function getCurrentScrambledSentence() { return scrambled_sentence; }

export function setCurrentSentence(new_sentence) {
    currentSentence = new_sentence;
    elements.txt.original_sentence.innerText = new_sentence;
}


export function setOriginalSentenceVisibility(isVisible = true) {
    elements.txt.original_sentence.innerText = isVisible ? getCurrentSentence() : 'x'.repeat(getCurrentSentence().length);
    isVisible ?
        elements.txt.original_sentence.classList.add('txt-original-sentence-visible') :
        elements.txt.original_sentence.classList.remove('txt-original-sentence-visible');
}
