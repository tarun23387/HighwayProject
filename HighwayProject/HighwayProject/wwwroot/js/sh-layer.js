function loadSH() {

    if (shLayer) {
        map.addLayer(shLayer);
        return;
    }

    fetch('/Map/GetSHGeoJson')
        .then(res => res.json())
        .then(data => {

            shLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: shIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header sh-header">
                                🏥 ${p.Facility_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Facility Type</td>
                                    <td>${p.Facility_Type ?? 'SH'}</td>
                                </tr>

                                <tr>
                                    <td>No. of Beds</td>
                                    <td>${p.No_Of_Beds ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Urban/Rural</td>
                                    <td>${p.Urban_Rural ?? '-'}</td>
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

            document.getElementById("shCount").innerText =
                data.features.length;

        })
        .catch(err => {
            console.error("SH Load Error:", err);
        });

}