'use strict'


var locs = [{ lat: 11.22, lng: 22.11 }]
var gCurrLoc;
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

export const mapService = {
    getLocs,
}



