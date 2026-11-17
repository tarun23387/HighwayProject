function loadDH() {

    if (dhLayer) {
        map.addLayer(dhLayer);
        return;
    }

    fetch('/Map/GetDHGeoJson')
        .then(res => res.json())
        .then(data => {

            dhLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: dhIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header dh-header">
                                🏥 ${p.Facility_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Facility Type</td>
                                    <td>${p.Facility_Type ?? 'DH'}</td>
                                </tr>

                                <tr>
                                    <td>No. of Beds</td>
                                    <td>${p.No_Of_Beds ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Status</td>
                                    <td>${p.Facility_Status ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Contact</td>
                                    <td>${p["CONTACT_NUMBER(CUG)"] ?? '-'}</td>
                                </tr>

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("dhCount")
                .innerText = data.features.length;

        })
        .catch(err => {
            console.error("DH Load Error:", err);
        });

}