const fetchAddr = "https://gnftest001-backend.onrender.com/toc128_api/get_sentences_list";
const fetchAddrTest = "http://127.0.0.1:10000/toc128_api/get_sentences_list/";

export const FETCH_ADDR = fetchAddr; // Change this according to build.

export const storageKeys = {
    SENTENCES_LIST: 'sentences_list_stringified',
    HIGHSCORE: 'highscore_string'
}

export async function getSentencesList(fetch_new = false) {
    let sentencesList;

    let fetchError = false;
    let localError = false;

    if (!fetch_new) {
        // Get sentences from local storage, if available.
        if (localStorage.getItem(storageKeys.SENTENCES_LIST)) {
            sentencesList = JSON.parse(localStorage.getItem(storageKeys.SENTENCES_LIST));
        } else { localError = true; }
    } else {
        // Fetch sentences from backend for up-to-date list.
        let response;

        await fetch(FETCH_ADDR).then(async (resolved_response) => {
            response = await resolved_response.json();
        }).catch(() => {
            return null;
        });

        if (response) {
            sentencesList = response;
            localStorage.setItem(storageKeys.SENTENCES_LIST, JSON.stringify(sentencesList));
        } else {
            sentencesList = JSON.parse(localStorage.getItem(storageKeys.SENTENCES_LIST));
            fetchError = true;
        }
    }

    fetchError ? console.log("Unable to fetch sentence.") : null;

    localError ? console.log("Unable to get sentence, please try again later.") : null;
    
    return sentencesList;
}
