export const utilService = {
    saveToStorage,
    loadFromStorage,
    makeId,
    getRandomColor
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value) || null);
}

function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}

function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


function getRandomColor() {
    let color = '#'
    for (let i = 0; i < 6; i++) {
        const random = Math.random()
        const bit = (random * 16) | 0
        color += bit.toString(16)
    }
    return color
}