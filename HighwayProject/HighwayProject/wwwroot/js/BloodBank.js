function loadBloodBank() {

    if (BloodBankLayer) {
        map.addLayer(BloodBankLayer);
        return;
    }

    fetch('/Map/GetBloodBankGeoJson')
        .then(res => res.json())
        .then(data => {

           BloodBankLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: BloodBankIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header chc-header">
                                🏥 ${p.Center_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>Center Name</td>
                                    <td>${p.Center_Name ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Address</td>
                                    <td>${p.Full_Address ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                               


                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("BloodBankCount").innerText =
                data.features.length;

        })
        .catch(err => {
            console.error("Blood Bank Load Error:", err);
        });

}