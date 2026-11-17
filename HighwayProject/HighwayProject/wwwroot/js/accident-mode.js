// ==========================
// ACCIDENT MODE
// ==========================

let accidentMode = false;
let accidentMarker = null;
let routeLayers = [];

// --- Haversine Distance (km) ---
function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Collect all loaded facilities ---
function getAllFacilities() {
    const facilities = [];

    if (traumaLayer) {
        traumaLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Name_of_Hospital_Trauma_Care_facility || '-',
                type: 'Trauma DGMH',
                phone: p.Mobile_Number || '-',
                status: p.Functional_Non_Functional || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }

    if (chcLayer) {
        chcLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Facility_Name || '-',
                type: 'CHC',
                phone: p.Number || '-',
                status: p.Facility_Status || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }

    if (dhLayer) {
        dhLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Facility_Name || '-',
                type: 'DH',
                phone: p['CONTACT_NUMBER(CUG)'] || '-',
                status: p.Facility_Status || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }

    if (shLayer) {
        shLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Facility_Name || '-',
                type: 'SH',
                phone: p['CONTACT_NUMBER(CUG)'] || '-',
                status: p.Facility_Status || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }
    if (traumaLayer29) {
        shLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Type_of_Medical_College || '-',
                type: 'DGME Trauma',
                phone: p.Contact_No || '-',
                Email: p.Email || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }
    if (PmRahatLayer) {
        shLayer.eachLayer(function (marker) {
            const p = marker.feature.properties;
            const ll = marker.getLatLng();
            facilities.push({
                name: p.Hospital_Name || '-',
                type: 'PM Rahat',
                phone: p.Contact || '-',
                Nodal_Officer: p.Nodal_Officer || '-',
                district: p.District || '-',
                lat: ll.lat, lng: ll.lng, latlng: ll
            });
        });
    }
    if (privateHospitalLayer) {
        privateHospitalLayer.eachLayer(function (marker) {

            const p = marker.feature.properties;
            const ll = marker.getLatLng();

            facilities.push({
                name: p.Hospital_Name || '-',
                type: 'Private Hospital',
                phone: p.Hospital_Contact_Number || '-',
                status: p.Nodal_Officer || '-',
                district: p.District || '-',
                lat: ll.lat,
                lng: ll.lng,
                latlng: ll,

                layer: marker   // IMPORTANT
            });

        });
    }

    return facilities;
}

// --- Clear previous routes ---
function clearRoutes() {
    routeLayers.forEach(function (l) { map.removeLayer(l); });
    routeLayers = [];
}

// --- Draw route via OSRM ---
function drawRoute(fromLat, fromLng, toLat, toLng, color, index) {
    const url =
        'https://router.project-osrm.org/route/v1/driving/' +
        fromLng + ',' + fromLat + ';' +
        toLng + ',' + toLat +
        '?overview=full&geometries=geojson';

    fetch(url)
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (!data.routes || data.routes.length === 0) return;

            const routeGeo = data.routes[0].geometry;
            const distanceKm = (data.routes[0].distance / 1000).toFixed(1);
            const durationMin = Math.round(data.routes[0].duration / 60);

            const routeLine = L.geoJSON(routeGeo, {
                style: {
                    color: color,
                    weight: 4,
                    opacity: 0.85,
                    dashArray: index === 0 ? null : '8 6'
                }
            }).addTo(map);

            const coords = routeGeo.coordinates;
            const mid = coords[Math.floor(coords.length / 2)];
            const label = L.marker([mid[1], mid[0]], {
                icon: L.divIcon({
                    className: 'route-label',
                    html: '<div class="route-badge" style="background:' + color + '">' +
                        distanceKm + ' km &bull; ' + durationMin + ' min</div>',
                    iconAnchor: [40, 12]
                }),
                interactive: false
            }).addTo(map);

            routeLayers.push(routeLine);
            routeLayers.push(label);
        })
        .catch(function (err) { console.warn('OSRM route error:', err); });
}

// --- Type colors ---
const typeColors = {
    'Trauma': '#C0392B',
    'CHC': '#1B8C54',
    'DH': '#1B72E8',
    'SH': '#F07A1A'
};

// --- Show results panel ---
function showNearestPanel(results, clickLatLng) {
    const panel = document.getElementById('accidentResultPanel');
    const list = document.getElementById('nearestList');

    if (results.length === 0) {
        list.innerHTML =
            '<div class="no-layer-msg">No facility layer is loaded.<br>' +
            'Turn on a Trauma / CHC / DH / SH layer from the sidebar first.</div>';
        panel.classList.add('visible');
        return;
    }

    list.innerHTML = '';
    const routeColors = ['#E74C3C', '#2E86C1', '#27AE60'];

    results.forEach(function (facility, i) {
        const color = typeColors[facility.type] || '#555';
        const routeColor = routeColors[i] || '#888';

        const isFunctional =
            facility.status &&
            facility.status.toLowerCase().includes('functional') &&
            !facility.status.toLowerCase().includes('non');

        const phoneHtml = facility.phone !== '-'
            ? '<a href="tel:' + facility.phone + '" class="call-btn">📞 ' + facility.phone + '</a>'
            : '<span class="no-phone">Phone N/A</span>';

        const card = document.createElement('div');
        card.className = 'nearest-card';
        card.innerHTML =
            '<div class="nearest-rank" style="background:' + routeColor + '">#' + (i + 1) + '</div>' +
            '<div class="nearest-info">' +
            '<div class="nearest-name">' + facility.name + '</div>' +
            '<div class="nearest-meta">' +
            '<span class="type-badge" style="background:' + color + '">' + facility.type + '</span>' +
            '<span class="nearest-dist">' + facility.distKm.toFixed(1) + ' km</span>' +
            '<span class="status-dot ' + (isFunctional ? 'functional' : 'non-functional') + '"></span>' +
            '<span class="status-text">' + facility.status + '</span>' +
            '</div>' +
            '<div class="nearest-district">📍 ' + facility.district + '</div>' +
            phoneHtml +
            '</div>';

        card.addEventListener('click', function () {

            map.setView(facility.latlng, 16);

            if (facility.layer) {
                facility.layer.openPopup();
            }

        });

        list.appendChild(card);
        drawRoute(clickLatLng.lat, clickLatLng.lng,
            facility.lat, facility.lng, routeColor, i);
    });

    panel.classList.add('visible');
}

// --- KEY FIX: district layer clicks toggle karo ---
function setDistrictLayerInteractive(enabled) {
    if (!districtLayer) return;
    districtLayer.eachLayer(function (layer) {
        if (enabled) {
            layer.on('click', function (e) {
                // normal popup behavior — Leaflet handles this automatically
            });
            layer.options.interactive = true;
            // Re-enable click by restoring pointer events
            if (layer._path) layer._path.style.pointerEvents = '';
            if (layer._layers) {
                Object.values(layer._layers).forEach(function (l) {
                    if (l._path) l._path.style.pointerEvents = '';
                });
            }
        } else {
            // Accident mode ON — district clicks silently blocked
            if (layer._path) layer._path.style.pointerEvents = 'none';
            if (layer._layers) {
                Object.values(layer._layers).forEach(function (l) {
                    if (l._path) l._path.style.pointerEvents = 'none';
                });
            }
        }
    });
}

// --- Map click handler ---
map.on('click', function (e) {
    if (!accidentMode) return;

    if (accidentMarker) map.removeLayer(accidentMarker);
    clearRoutes();

    accidentMarker = L.marker(e.latlng, {
        icon: L.divIcon({
            className: 'accident-marker-icon',
            html: '<div class="accident-pulse"><div class="accident-dot">⚠</div></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    }).addTo(map);

    accidentMarker.bindTooltip('Accident Location', {
        permanent: false,
        className: 'accident-tooltip'
    });

    // AI chat ko location sync karo
    if (typeof syncChatLocation === 'function') {
        syncChatLocation(e.latlng.lat, e.latlng.lng);
        var chatBtnEl = document.getElementById('chatBtn');
        if (chatBtnEl) chatBtnEl.classList.add('location-ready');
    }

    const facilities = getAllFacilities();

    facilities.forEach(function (f) {
        f.distKm = haversineDistance(e.latlng.lat, e.latlng.lng, f.lat, f.lng);
    });

    facilities.sort(function (a, b) { return a.distKm - b.distKm; });

    showNearestPanel(facilities.slice(0, 3), e.latlng);
});

// --- Toggle ---
function toggleAccidentMode() {
    accidentMode = !accidentMode;
    const btn = document.getElementById('accidentModeBtn');
    const mapEl = document.getElementById('map');

    if (accidentMode) {
        btn.classList.add('active');
        btn.innerHTML = '⚠️ Accident Mode ON &mdash; Map pe click karo';
        mapEl.style.cursor = 'crosshair';
        map.closePopup();
        // CRITICAL FIX: district layer ke clicks band karo
        setDistrictLayerInteractive(false);
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '⚠️ Accident Mode';
        mapEl.style.cursor = '';
        // District layer wapas enable karo
        setDistrictLayerInteractive(true);
        if (accidentMarker) { map.removeLayer(accidentMarker); accidentMarker = null; }
        clearRoutes();
        document.getElementById('accidentResultPanel').classList.remove('visible');
    }
}

// --- Close panel ---
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('closeAccidentPanel')
        .addEventListener('click', function () {
            document.getElementById('accidentResultPanel').classList.remove('visible');
            if (accidentMarker) { map.removeLayer(accidentMarker); accidentMarker = null; }
            clearRoutes();
            accidentMode = false;
            const btn = document.getElementById('accidentModeBtn');
            btn.classList.remove('active');
            btn.innerHTML = '⚠️ Accident Mode';
            document.getElementById('map').style.cursor = '';
            setDistrictLayerInteractive(true);
        });
});


// ==========================
// MY LOCATION BUTTON
// ==========================

function findNearestFromMyLocation() {
    const btn = document.getElementById('myLocationBtn');

    if (!navigator.geolocation) {
        alert('Aapka browser GPS support nahi karta.');
        return;
    }

    // Loading state
    btn.disabled = true;
    btn.innerHTML = '⏳ Location le raha hai...';

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng = L.latLng(lat, lng);

            // Reset button
            btn.disabled = false;
            btn.innerHTML = '📍 My Location';

            // Map center karo
            map.setView(latlng, 12);

            // Purana marker aur routes hataao
            if (accidentMarker) map.removeLayer(accidentMarker);
            clearRoutes();

            // Location marker lagao
            accidentMarker = L.marker(latlng, {
                icon: L.divIcon({
                    className: 'accident-marker-icon',
                    html: '<div class="accident-pulse my-loc-pulse"><div class="accident-dot my-loc-dot">📍</div></div>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                })
            }).addTo(map);

            accidentMarker.bindTooltip('Aapki Location', {
                permanent: false,
                className: 'accident-tooltip'
            }).openTooltip();

            // Nearest dhundho
            const facilities = getAllFacilities();

            if (facilities.length === 0) {
                showNearestPanel([], latlng);
                return;
            }

            facilities.forEach(function (f) {
                f.distKm = haversineDistance(lat, lng, f.lat, f.lng);
            });

            facilities.sort(function (a, b) { return a.distKm - b.distKm; });

            showNearestPanel(facilities.slice(0, 3), latlng);
        },
        function (error) {
            btn.disabled = false;
            btn.innerHTML = '📍 My Location';

            const msgs = {
                1: 'Location permission denied hai.\nBrowser settings mein allow karo.',
                2: 'GPS signal nahi mila. Thodi der baad try karo.',
                3: 'Location fetch mein time lag gaya. Dobara try karo.'
            };
            alert(msgs[error.code] || 'Location nahi mili.');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}
