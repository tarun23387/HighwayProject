function loadCHC() {

    if (chcLayer) {
        map.addLayer(chcLayer);
        return;
    }

    fetch('/Map/GetCHCGeoJson')
        .then(res => res.json())
        .then(data => {

            chcLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: chcIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header chc-header">
                                🏥 ${p.Facility_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>Nodal Name</td>
                                    <td>${p.MOIC_Nodel_Name ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Phone</td>
                                    <td>${p.Number ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Distance</td>
                                    <td>${p["Distance_(in_KM)"] ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Nearby ALS</td>
                                    <td>${p.Near_By_ALS ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Base Location</td>
                                    <td>${p.Base_Location ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Facility Type</td>
                                    <td>${p.Facility_Type ?? 'CHC'}</td>
                                </tr>

                                <tr>
                                    <td>No. of Beds</td>
                                    <td>${p.No_Of_Beds ?? '-'}</td>
                                </tr>

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            // Stats card is currently removed from the sidebar
            const chcCountEl = document.getElementById("chcCount");
            if (chcCountEl)
                chcCountEl.innerText = data.features.length;

        })
        .catch(err => {
            console.error("CHC Load Error:", err);
        });

}