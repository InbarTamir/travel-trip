'use strict';
import { mapService } from './services/mapService.js';
import { utilService } from './services/util-service.js';

var gMap = null;
var gMarkers = [];
var gUserPos;
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs));

window.onload = () => {
    initMap()
        .then(() => {
            getPosition()
                .then(pos => {
                    gUserPos = pos.coords;
                    addPosition(null, 'Current Location');
                    panTo({ lat: gUserPos.latitude, lng: gUserPos.longitude });
                    // console.log('User position is:', pos.coords);
                })
                .catch(err => {
                    console.log('err!!!', err);
                });
        })
        .catch(console.log('INIT MAP ERROR'));

};

export function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });

            gMap.addListener('click', e => {
                addPosition(e);
            });
        });
}

function addMarker(name, loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: name
    });
    gMarkers.push(marker);
    return marker;
}

function removeMarker(pos) {
    const markerIdx = gMarkers.findIndex(marker => marker.position.lat() === pos.lat && marker.position.lng() === pos.lng);
    if (markerIdx < 0) return;
    var marker = gMarkers.splice(markerIdx, 1)[0];
    marker.setMap(null);
    marker = null;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function addPosition(e, locName = '') {
    const name = (locName) ? locName : prompt("Please Enter Location Name");
    const latCoord = (locName) ? gUserPos.latitude : e.latLng.lat();
    const lngCoord = (locName) ? gUserPos.longitude : e.latLng.lng();
    addMarker(name, { lat: latCoord, lng: lngCoord });

    mapService.getLocs()
        .then(locs => {
            locs.push(mapService.createLoc(name, latCoord, lngCoord));
            mapService.saveLocs();
            renderLocations();
        });
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyCGs_6cQ28RFJz2-6FMpA3Q6Uy1FGoScww';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function renderLocations() {
    mapService.getLocs()
        .then(locs => {
            const elLocationList = document.querySelector('.location-list');
            const strHtmls = locs.map(loc => {
                return `<li class="location-item"> 
                            <span>id:${loc.id}</span>
                            <span>name:${loc.name}</span>
                            <span class="coords">coords:(${loc.lat}/${loc.lng})</span>
                            <span>created at:${loc.createdAt}</span>
                            <span>updated at:${loc.updatedAt}</span>
                            <button class="go-btn" data-id="${loc.id}">Go</button>
                            <button class="del-btn" data-id="${loc.id}">Delete</button>
                        </li>`;
            });
            elLocationList.innerHTML = strHtmls.join('');

            // Event Listeners
            document.querySelectorAll('.go-btn').forEach(elBtn => {
                elBtn.addEventListener('click', (ev) => {
                    const id = ev.target.dataset.id;
                    const { lat, lng } = locs.find(loc => loc.id === id);
                    panTo(lat, lng);
                });
            });
            document.querySelectorAll('.del-btn').forEach(elBtn => {
                elBtn.addEventListener('click', (ev) => {
                    const id = ev.target.dataset.id;
                    const locIdx = locs.findIndex(loc => loc.id === id);
                    if (locIdx >= 0) {
                        let currLoc = locs.splice(locIdx, 1)[0];
                        removeMarker({lat: currLoc.lat, lng: currLoc.lng});
                    }
                    renderLocations();
                });
            });
        });
}

// document.querySelector('.go-btn').addEventListener('click', (ev) => {
//     console.log('Go!', ev.target);
//     // panTo(35.6895, 139.6917);
// });

// document.querySelector('.del-btn').addEventListener('click', (ev) => {
//     console.log('Delete!', ev.target);
//     // panTo(35.6895, 139.6917);
// });