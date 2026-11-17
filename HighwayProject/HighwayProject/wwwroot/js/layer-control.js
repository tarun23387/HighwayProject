document.getElementById('chkCHC')
    .addEventListener('change', function () {

        if (this.checked) {

            loadCHC();

            document.getElementById('selectedLayer')
                .innerText = 'CHC Centers';
        }
        else {

            if (chcLayer)
                map.removeLayer(chcLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });


document.getElementById('chkDH')
    .addEventListener('change', function () {

        if (this.checked) {

            loadDH();

            document.getElementById('selectedLayer')
                .innerText = ' District Hospitals';
        }
        else {

            if (dhLayer)
                map.removeLayer(dhLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });

document.getElementById('chkDistrict')
    .addEventListener('change', function () {

        if (this.checked) {
            if (districtLayer) districtLayer.addTo(map);
            districtLabelGroup.addTo(map);
        }
        else {
            if (districtLayer) map.removeLayer(districtLayer);
            map.removeLayer(districtLabelGroup);
        }

    });

document.getElementById('chkNH')
    .addEventListener('change', function () {

        if (this.checked)
            loadNH();
        else if (nationalHighwayLayer)
            map.removeLayer(nationalHighwayLayer);

    });
document.getElementById('chkExpressway')
    .addEventListener('change', function () {

        if (this.checked)
            loadExpressway();
        else if (expresswayLayer)
            map.removeLayer(expresswayLayer);

    });

document.getElementById('chkSH')
    .addEventListener('change', function () {

        if (this.checked) {

            loadSH();

            document.getElementById('selectedLayer')
                .innerText = ' Special Hospitals';
        }
        else {

            if (shLayer)
                map.removeLayer(shLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });

document.getElementById('chkTrauma')
    .addEventListener('change', function () {

        if (this.checked) {

            loadTrauma();

            document.getElementById('selectedLayer')
                .innerText = 'Trauma Centers';
        }
        else {

            if (traumaLayer)
                map.removeLayer(traumaLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });

document.getElementById('chkTrauma29')
    .addEventListener('change', function () {

        if (this.checked) {

            loadTrauma29();

            document.getElementById('selectedLayer')
                .innerText = 'Trauma Centers29';
        }
        else {

            if (traumaLayer29)
                map.removeLayer(traumaLayer29);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });

document.getElementById('chkPrivateHospital')
    .addEventListener('change', function () {

        if (this.checked) {

            loadPrivateHospital();

            document.getElementById('selectedLayer')
                .innerText = 'Private Hospitals';
        }
        else {

            if (privateHospitalLayer)
                map.removeLayer(privateHospitalLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });


document.getElementById('chkPmRahat')
    .addEventListener('change', function () {

        if (this.checked) {

            loadPmRahat();

            document.getElementById('selectedLayer')
                .innerText = 'PmRahat';
        }
        else {

            if (PmRahatLayer)
                map.removeLayer(PmRahatLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });



document.getElementById('chkBloodBank')
    .addEventListener('change', function () {

        if (this.checked) {
            
            loadBloodBank();

            document.getElementById('selectedLayer')
                .innerText = 'BloodBank';
        }
        else {

            if (BloodBankLayer)
                map.removeLayer(BloodBankLayer);

            document.getElementById('selectedLayer')
                .innerText = 'Uttar Pradesh';
        }

    });