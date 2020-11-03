'use strict'
import { storageService } from './storage-service.js';
import { utilService } from './util-service.js';


const STORAGE_LOCS_KEY = 'locationsDB';

var gLocs = loadLocs();

function createLoc(name, latCoord, lngCoord) {
    return {
        lat: latCoord,
        lng: lngCoord,
        id: utilService.makeId(5),
        name,
        createdAt: utilService.getTimeFixed(),
        updatedAt: utilService.getTimeFixed()
    }
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function saveLocs() {
    storageService.saveToStorage(STORAGE_LOCS_KEY, gLocs);
}

function loadLocs() {
    return storageService.loadFromStorage(STORAGE_LOCS_KEY) || [];
}

export const mapService = {
    // loadLocs,
    createLoc,
    getLocs,
    saveLocs
}



