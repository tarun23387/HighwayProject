// CHCs lying within 2 km / 5 km of the Purvanchal Expressway.
// The 5 km set includes the 2 km set.

const chcExpresswayLayers = {};

function loadChcExpressway(km) {

    if (chcExpresswayLayers[km]) {
        chcExpresswayLayers[km].addTo(map);
        map.fitBounds(chcExpresswayLayers[km].getBounds().pad(.2));
        return;
    }

    fetch('/Map/GetChcExpresswayGeoJson?km=' + km)
        .then(res => res.json())
        .then(data => {

            const layer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: chcIcon });
                },

                onEachFeature: function (feature, marker) {

                    const p = feature.properties;

                    marker.bindPopup(`
                        <div class="popup-card">
                            <div class="popup-header chc-header">
                                🏥 ${p.Facility_Name ?? '-'}
                            </div>
                            <table class="popup-table">
                                <tr><td>District</td><td>${p.District ?? '-'}</td></tr>
                                <tr><td>Tehsil</td><td>${p.Tehsil ?? '-'}</td></tr>
                                <tr><td>Block</td><td>${p.Block ?? '-'}</td></tr>
                                <tr><td>Type</td><td>${p.Classification ?? '-'}</td></tr>
                                <tr><td>Status</td><td>${p.Facility_Status ?? '-'}</td></tr>
                                <tr><td>From Expressway</td><td>${p.Distance_km} km</td></tr>
                            </table>
                        </div>
                    `);
                }
            });

            chcExpresswayLayers[km] = layer;

            // The checkbox may have been unticked while the fetch was running
            if (document.getElementById('chkChc' + km + 'km').checked) {
                layer.addTo(map);
                map.fitBounds(layer.getBounds().pad(.2));
            }

        })
        .catch(err => console.error('CHC ' + km + ' km load error:', err));
}

[2, 5].forEach(function (km) {

    document.getElementById('chkChc' + km + 'km')
        .addEventListener('change', function () {

            if (this.checked)
                loadChcExpressway(km);
            else if (chcExpresswayLayers[km])
                map.removeLayer(chcExpresswayLayers[km]);

        });

});
