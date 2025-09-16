export const elements = {};

elements.btn = {};
elements.input = {};
elements.txt = {};
elements.div = {};

elements.btn.continue = document.querySelector(".btn-continue");
elements.btn.share = document.querySelector(".div-share");

elements.input.guess = document.querySelector(".input-guess");

elements.txt.scrambled_sentence = document.querySelector(".txt-scrambled-sentence");
elements.txt.original_sentence = document.querySelector(".txt-original-sentence");
elements.txt.score = document.querySelector(".txt-score");
elements.txt.timer = document.querySelector(".txt-timer");
elements.txt.highscore = document.querySelector(".txt-highscore");

elements.div.top = document.querySelector(".div-top");
elements.div.above_middle = document.querySelector(".div-above-middle");
elements.div.bottom = document.querySelector(".div-bottom");

elements.div.top.classList.remove("start");
elements.div.above_middle.classList.remove("start");
elements.div.bottom.classList.remove("start");
