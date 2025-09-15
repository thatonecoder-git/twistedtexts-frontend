import { storageKeys } from "./data.js";
import { elements } from "./elements_manager.js";
import { getCurrentSentence, hasEndingSymbol } from "./sentence_management.js";

let score = 0;

export function getScore() {
    return score;
}

export function addScore(time_took, length, multiplier = 100) {
    score += Math.max(20, Math.floor((length / (time_took)) * multiplier) +
    (((getCurrentSentence() === elements.input.guess.value)) ? 50 : 0));
    
    setScore(score);
}

export function setScore(score_to_set) {
    score = score_to_set;
    (score > getHighScore()) ? setHighScore(score) : null;
    elements.txt.score.innerText = `${(score >= getHighScore()) ? "[New] " : ""}Score: ${score}`;
}

export function getHighScore() {
    elements.txt.highscore.innerText = `Highscore: ${localStorage.getItem(storageKeys.HIGHSCORE) || 0}`;
    return Number(localStorage.getItem(storageKeys.HIGHSCORE) || 0);
}

/*export function addScore(time_took, length, multiplier = 100) {
    score += Math.max(20, Math.floor((length / (time_took)) * multiplier) +
    (((getCurrentSentence() === elements.input.guess.value)) ? 50 : 0));
    
    elements.txt.score.innerText = `Score: ${score}`;
    console.log(score);
}*/

export function setHighScore(score_to_set) {
    localStorage.setItem(storageKeys.HIGHSCORE, score_to_set);
    elements.txt.highscore.innerText = `Highscore: ${score_to_set}`;
}

getHighScore();