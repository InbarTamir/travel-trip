'use strict'
import { mapService } from './services/mapService.js';
import { utilService } from './services/util-service.js';

var gMap = null;
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo(35.6895, 139.6917);
})


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

            gMap.addListener('click', e => {
                // console.log(e)
                // console.log('location:', location)
                const name = prompt("Please Enter Location Name")
                const latCoord = e.latLng.lat();
                const lngCoord = e.latLng.lng();
                addMarker({ lat: latCoord, lng: lngCoord });
                mapService.getLocs().then(locs => locs.push({ lat: latCoord, lng: lngCoord, id: utilService.makeId(5), name, createdAt: utilService.getTimeFixed(), updatedAt: utilService.getTimeFixed() }));
                mapService.saveLocations();
                renderLocations();

                // console.log('lat :', e.latLng.lat())
                // console.log('lng :', e.latLng.lng())
            })

            // console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)

    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCGs_6cQ28RFJz2-6FMpA3Q6Uy1FGoScww';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}




function renderLocations() {
    const locations = mapService.getLocs().then((locs) => {
        const elLocationList = document.querySelector('.location-list');
        const strHtmls = locs.map(loc => {
            return `<li class="location-item"> 
                    <span>id:${loc.id}</span>
                    <span>name:${loc.name}</span>
                    <span>coords:(${loc.lat}/${loc.lng})</span>
                    <span>created at:${loc.createdAt}</span>
                    <span>updated at:${loc.updatedAt}</span>
                    <button>Go</button> <button>Delete</button>
                </li>
        `
        })
        elLocationList.innerHTML = strHtmls.join('');
        if (locations.length === 0) elLocationList.innerHTML = '<h1>You have 0 saved locations</h1>'
    })
}

