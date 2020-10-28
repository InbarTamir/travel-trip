'use strict'
import { storageService } from './storage-service.js';
import { utilService } from './util-service.js';


const STORAGE_LOCS_KEY = 'locationsDB';

var gLocs = [{ lat: 11.22, lng: 22.11, id: utilService.makeId(5), name: "lala land", createdAt:utilService.getTimeFixed() , updatedAt: utilService.getTimeFixed()}]

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



