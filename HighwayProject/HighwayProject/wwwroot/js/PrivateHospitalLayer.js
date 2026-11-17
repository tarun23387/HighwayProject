function loadPrivateHospital() {

    if (privateHospitalLayer) {
        map.addLayer(privateHospitalLayer );
        return;
    }

    fetch('/Map/GetPrivateHospitalGeoJson')
        .then(res => res.json())
        .then(data => {

            privateHospitalLayer = L.geoJSON(data, {            
                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: PHosIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header sh-header">
                                🏥 ${p.Hospital_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Facility Type</td>
                                    <td>${p.Hospital_Type ?? 'SH'}</td>
                                </tr>

                                <tr>
                                    <td>No. of Beds</td>
                                    <td>${p.Beds ?? '-'}</td>
                                </tr>

                               

                                <tr>
                                    <td>Nodal_Officer</td>
                                    <td>${p.Nodal_Officer ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Contact</td>
                                    <td>${p.Hospital_Contact_Number}</td>
                                </tr>

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("phosCount").innerText =
                data.features.length;

        })
        .catch(err => {
            console.error("PHos Load Error:", err);
        });

}



function loadPmRahat() {

    if (PmRahatLayer) {
        map.addLayer(PmRahatLayer);
        return;
    }

    fetch('/Map/GetPmRahatGeoJson')
        .then(res => res.json())
        .then(data => {

            PmRahatLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: pmrahat
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;

                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header sh-header">
                                🏥 ${p.Hospital_Name ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Facility Type</td>
                                    <td>${p.Hospital_Type ?? 'SH'}</td>
                                </tr>

                                <tr>
                                    <td>No. of Beds</td>
                                    <td>${p.Beds ?? '-'}</td>
                                </tr>

                               

                                <tr>
                                    <td>Nodal_Officer</td>
                                    <td>${p.Nodal_Officer ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Contact</td>
                                    <td>${p.Contact}</td>
                                </tr>

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("PMRahat204").innerText =
                data.features.length;

        })
        .catch(err => {
            console.error("PHos Load Error:", err);
        });

}