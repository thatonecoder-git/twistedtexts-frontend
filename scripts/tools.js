export function chooseRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function waitForArray(array) {
    return new Promise(resolve => {
        const intervalId = setInterval(() => {
            if (array.length > 0) {
                clearInterval(intervalId);
                resolve(array);
            }
        }, 10);
    });
}

function cutValueFromInput(input_element) {
    value = input_element.value;
    input_element.value = "";
    
    return value;
}

export function countOccurrences(array, targetElement) {
  return array.filter(element => element === targetElement).length;
}

export function getIndexesOf(find, array) {
    let indexes = [];
    const arrayLength = array.length;

    for (let i = 0; i < arrayLength; i++) {
        let index = array.indexOf(find);
        !indexes.includes(index) ? indexes.push(array.indexOf(find)) : null;
        array.splice(i, 1);
    }

    return indexes;
}

export function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
        console.log('Text successfully copied to clipboard');
        })
        .catch(err => {
        console.error('Failed to copy text: ', err);
        });
}

export async function shareInfo(info, title, url) {
    if (navigator.share) {
        const shareData = {
            title: title || 'Twisted Texts',
            text: info,
            url: url || 'https://twistedtexts.onrender.com'
        };

        if (navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                console.log('Content shared successfully');
                return true;
            } catch (error) {
                console.error('Error sharing content:', error);
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
