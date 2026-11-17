// ==========================
// MAP INIT
// ==========================

const map = L.map('map', {
    zoomControl: false,
    minZoom: 6,
    maxZoom: 18
}).setView([26.85, 80.95], 9);

// ==========================
// ZOOM CONTROL
// ==========================

L.control.zoom({
    position: 'topleft'
}).addTo(map);

// ==========================
// BASEMAPS
// ==========================

const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
);

const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Esri'
    }
);

const terrain = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
        attribution: 'OpenTopoMap'
    }
);

const cartoLight = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    {
        attribution: 'Carto'
    }
);

const cartoDark = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
        attribution: 'Carto'
    }
);

// "Blank" basemap: an empty layer so the white map background shows
const blank = L.layerGroup();

osm.addTo(map);

// ==========================
// SCALE BAR
// ==========================

L.control.scale({
    metric: true,
    imperial: false
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({

    position: 'bottomright',

    draw: {

        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,

        polyline: {
            shapeOptions: {
                color: '#8B5E3C',
                weight: 4
            }
        }

    },

    edit: {
        featureGroup: drawnItems,
        edit: false
    }

});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {

    const layer = e.layer;

    drawnItems.addLayer(layer);

    let distance = 0;

    const latlngs = layer.getLatLngs();

    for (let i = 1; i < latlngs.length; i++) {

        distance += latlngs[i - 1]
            .distanceTo(latlngs[i]);

    }

    layer.bindPopup(
        `Distance: ${(distance / 1000).toFixed(2)} km`
    ).openPopup();

});


// ==========================
// PRINT TOOL
// ==========================

L.control.browserPrint({
    position: 'bottomright',
    title: 'Print Map'
}).addTo(map);

// ==========================
// UTTAR PRADESH BOUNDS
// ==========================

//const upBounds = [
//    [23.80, 77.50],
//    [30.50, 84.80]
//];

//map.setMaxBounds(upBounds);

//map.on('drag', function () {

//    map.panInsideBounds(upBounds, {
//        animate: false
//    });

//});

// ==========================
// LAYER VARIABLES
// ==========================

let districtLayer;
let traumaLayer;
let traumaLayer29;
let chcLayer;
let dhLayer;
let shLayer;    
let privateHospitalLayer;
let PmRahatLayer;
let BloodBankLayer;

let nationalHighwayLayer;
let expresswayLayer;
let districtLabelGroup = L.layerGroup();

// Highway layers (NH, Expressway, Toll Plaza) always draw above everything else
map.createPane('highwayPane');
map.getPane('highwayPane').style.zIndex = 640;
// ==========================
// CLUSTER GROUPS
// ==========================

const chcCluster = L.markerClusterGroup();
const dhCluster = L.markerClusterGroup();
const shCluster = L.markerClusterGroup();

// ==========================
// ICONS
// ==========================

const chcIcon = L.icon({
    iconUrl: '/img/CHC.png',
    iconSize: [18, 32]
});

const dhIcon = L.icon({
    iconUrl: '/img/DH.png',
    iconSize: [18, 32]
});

const shIcon = L.icon({
    iconUrl: '/img/SH.png',
    iconSize: [18, 32]
});
const traumaIcon = L.icon({
    iconUrl: '/img/trauma.png',
    iconSize: [18, 32]
});

const traumaIcon29 = L.icon({
    iconUrl: '/img/traum_29.png',
    iconSize: [18, 32]
});


const pmrahat = L.icon({
    iconUrl: '/img/PM_RAHAT.png',
    iconSize: [18, 32]
});
const PHosIcon = L.icon({
    iconUrl: '/img/PHos.png',
    iconSize: [18, 32]
});

const BloodBankIcon = L.icon({
    iconUrl: '/img/blood_bank_icon.png',
    iconSize: [18, 32]
});

// ==========================
// BASEMAP SWITCHER
// ==========================

document
    .getElementById('basemapSelect')
    .addEventListener('change', function () {

        map.removeLayer(osm);
        map.removeLayer(satellite);
        map.removeLayer(terrain);
        map.removeLayer(cartoLight);
        map.removeLayer(cartoDark);

        switch (this.value) {

            case 'blank':
                blank.addTo(map);
                break;

            case 'osm':
                osm.addTo(map);
                break;

            case 'satellite':
                satellite.addTo(map);
                break;

            case 'terrain':
                terrain.addTo(map);
                break;

            case 'light':
                cartoLight.addTo(map);
                break;

            case 'dark':
                cartoDark.addTo(map);
                break;
        }
    });

// ==========================
// FULLSCREEN
// ==========================

const mapDiv = document.getElementById('map');
document
    .getElementById('fullscreenBtn')
    .addEventListener('click', function () {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    });

// ==========================
// LOADING INDICATOR
// ==========================

map.on('loading', function () {

    document.body.classList.add('loading');

});

map.on('load', function () {

    document.body.classList.remove('loading');

});

// ==========================
// COORDINATE DISPLAY
// ==========================
// ==========================
// COORDINATE DISPLAY
// ==========================

const coordControl = L.control({
    position: 'bottomright'
});

coordControl.onAdd = function () {

    this._div = L.DomUtil.create(
        'div',
        'coordinate-box'
    );

    this._div.innerHTML =
        'Lat: 0 | Lng: 0';

    return this._div;
};

coordControl.addTo(map);

map.on('mousemove', function (e) {

    const coordBox =
        document.querySelector('.coordinate-box');

    if (coordBox) {

        coordBox.innerHTML =
            'Lat: ' +
            e.latlng.lat.toFixed(5) +
            ' | Lng: ' +
            e.latlng.lng.toFixed(5);

    }

});



// ==========================
// MAP CLICK
// ==========================

map.on('click', function (e) {

    console.log(
        e.latlng.lat,
        e.latlng.lng
    );

});

