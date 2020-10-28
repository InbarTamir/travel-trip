'use strict'
import {storageService} from './storage-service.js';

const STORAGE_LOCS_KEY = 'locationsDB';

var gLocs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 2000)
    });
}

function saveLocations() {
    storageService.saveToStorage(STORAGE_LOCS_KEY, gLocs);
}

export const mapService = {
    getLocs,
    saveLocations
}



