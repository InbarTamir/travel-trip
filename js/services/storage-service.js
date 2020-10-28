'use strict'

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

export const storageService = {
    loadFromStorage,
    saveToStorage
};