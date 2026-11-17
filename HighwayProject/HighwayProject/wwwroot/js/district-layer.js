fetch('/Map/GetDistrictGeoJson')

    .then(r => r.json())

    .then(data => {

        districtLayer =
            L.geoJSON(data, {

                style: function () {

                    return {

                        color: '#0039ac',

                        weight: 1,

                        fill: false,      // fill remove
                        fillOpacity: 0    // optional

                    };

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
        <b>District :</b><br>${p.DT_NAME}`);

                    const center = layer.getBounds().getCenter();

                    L.marker(center, {
                        opacity: 0
                    })
                        .addTo(districtLabelGroup)
                        .bindTooltip(p.DT_NAME, {
                            permanent: true,
                            direction: 'center',
                            className: 'district-label'
                        })
                        .openTooltip();

                }
            })
                .addTo(map);

        districtLabelGroup.addTo(map);

        map.fitBounds(districtLayer.getBounds());

        // Checkbox may have been unticked while the fetch was running
        const chk = document.getElementById('chkDistrict');
        if (chk && !chk.checked) {
            map.removeLayer(districtLayer);
            map.removeLayer(districtLabelGroup);
        }

    });

//document
//    .getElementById('districtSearch')
//    .addEventListener('keyup', function () {

//        const text = this.value.toLowerCase();

//        districtLayer.eachLayer(function (layer) {

//            const name =
//                layer.feature.properties.DT_NAME?.toLowerCase();

//            if (name === text) {
//                map.fitBounds(layer.getBounds());
//                layer.openPopup();
//            }

//        });

//    });

function loadExpressway() {

    // Already fetched once: just show it again
    if (expresswayLayer) {
        expresswayLayer.addTo(map);
        map.fitBounds(expresswayLayer.getBounds());
        return;
    }

    fetch('/Map/GetExpresswayGeoJson')
        .then(r => r.json())
        .then(data => {

            expresswayLayer = L.geoJSON(data, {
                pane: 'highwayPane',
                style: {
                    color: '#7B1FA2',
                    weight: 4,
                    opacity: .9
                },
                onEachFeature: function (feature, layer) {
                    layer.bindTooltip(
                        'Purvanchal Expressway — ' + (feature.properties.Name || ''),
                        { sticky: true }
                    );
                }
            });

            // The checkbox may have been unticked while the fetch was running
            if (document.getElementById('chkExpressway').checked) {
                expresswayLayer.addTo(map);
                map.fitBounds(expresswayLayer.getBounds());
            }

        })
        .catch(err => console.error(err));
}

function loadNH() {

    //console.log("loadNH called");

    fetch('/Map/GetNationalHighwayGeoJson')
        .then(r => r.json())
        .then(data => {

            console.log(data);

            nationalHighwayLayer = L.geoJSON(data, {
                pane: 'highwayPane',
                style: {
                    color: 'brown',
                    weight: 1
                }
            }).addTo(map);

            console.log(nationalHighwayLayer);

            map.fitBounds(nationalHighwayLayer.getBounds());

        })
        .catch(err => console.error(err));
}