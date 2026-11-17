function loadTrauma() {

    if (traumaLayer) {
        map.addLayer(traumaLayer);
        return;
    }

    fetch('/Map/GetTraumaGeoJson')
        .then(res => res.json())
        .then(data => {

            traumaLayer = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: traumaIcon
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;
                    //console.log(feature.properties);
                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header trauma-header">
                                🚑 ${p.Name_of_Hospital_Trauma_Care_facility ?? '-'}
                            </div>

                            <table class="popup-table">

                                <tr>
                                    <td>District</td>
                                    <td>${p.District ?? '-'}</td>
                                </tr>
                                   <tr>
                                    <td>Located</td>
                                    <td>${p.Located ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td>Facility Code</td>
                                    <td>${p.Facility_Code ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Contact Person</td>
                                    <td>${p.Name ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Designation</td>
                                    <td>${p.Designation ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Mobile</td>
                                    <td>${p.Mobile_Number ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Email</td>
                                    <td>${p.Mail_ID ?? '-'}</td>
                                </tr>

                         

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("traumaCount")
                .innerText = data.features.length;

        })
        .catch(err => {
            console.error("Trauma Load Error:", err);
        });

}








function loadTrauma29() {

    if (traumaLayer29) {
        map.addLayer(traumaLayer29);
        return;
    }

    fetch('/Map/GetTraumaGeoJson29')
        .then(res => res.json())
        .then(data => {

            traumaLayer29 = L.geoJSON(data, {

                pointToLayer: function (feature, latlng) {

                    return L.marker(latlng, {
                        icon: traumaIcon29
                    });

                },

                onEachFeature: function (feature, layer) {

                    const p = feature.properties;
                    console.log(feature.properties);
                    layer.bindPopup(`
                        <div class="popup-card">

                            <div class="popup-header trauma-header">
                                🚑 ${p.Medical_College ?? '-'}
                            </div>

                            <table class="popup-table">

                                

                                <tr>
                                    <td>Type_of_Medical_College</td>
                                    <td>${p.Type_of_Medical_College ?? '-'}</td>
                                </tr>

                                

                                <tr>
                                    <td>Nodal_Officer</td>
                                    <td>${p.Nodal_Officer ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Mobile</td>
                                    <td>${p.Contact_No ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Email</td>
                                    <td>${p.Email ?? '-'}</td>
                                </tr>

                                <tr>
                                    <td>Trauma_Centre_Type</td>
                                    <td>${p.Trauma_Centre_Type ?? '-'}</td>
                                </tr>

                            </table>

                        </div>
                    `);

                }

            }).addTo(map);

            document.getElementById("traumaCount")
                .innerText = data.features.length;

        })
        .catch(err => {
            console.error("Trauma Load Error:", err);
        });

}