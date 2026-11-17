// Purvanchal Expressway toll plazas (point data)

let tollPlazaLayer;

function loadTollPlaza() {

    if (tollPlazaLayer) {
        tollPlazaLayer.addTo(map);
        map.fitBounds(tollPlazaLayer.getBounds().pad(.1));
        return;
    }

    fetch('/Map/GetTollPlazaGeoJson')
        .then(res => res.json())
        .then(data => {

            tollPlazaLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    const isMain = /main/i.test(feature.properties.Plaza_Type || '');

                    return L.circleMarker(latlng, {
                        pane: 'highwayPane',
                        radius: isMain ? 9 : 6,
                        color: '#7B1FA2',
                        weight: 2,
                        fillColor: isMain ? '#FF6B00' : '#FFC107',
                        fillOpacity: 1
                    });
                },

                onEachFeature: function (feature, marker) {

                    const p = feature.properties;

                    marker.bindTooltip(p.Name, { direction: 'top' });

                    marker.bindPopup(`
                        <div class="popup-card">
                            <div class="popup-header toll-header">
                                🚧 ${p.Name ?? '-'} Toll Plaza
                            </div>
                            <table class="popup-table">
                                <tr><td>Expressway</td><td>${p.Expressway ?? '-'}</td></tr>
                                <tr><td>Plaza Type</td><td>${p.Plaza_Type ?? '-'}</td></tr>
                                <tr><td>Chainage</td><td>${p.Chainage ?? '-'}</td></tr>
                            </table>
                        </div>
                    `);
                }
            });

            // The checkbox may have been unticked while the fetch was running
            if (document.getElementById('chkTollPlaza').checked) {
                tollPlazaLayer.addTo(map);
                map.fitBounds(tollPlazaLayer.getBounds().pad(.1));
            }

        })
        .catch(err => console.error('Toll plaza load error:', err));
}

document.getElementById('chkTollPlaza')
    .addEventListener('change', function () {

        if (this.checked)
            loadTollPlaza();
        else if (tollPlazaLayer)
            map.removeLayer(tollPlazaLayer);

    });
