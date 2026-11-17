document.getElementById('chkCHC')
    .addEventListener('change', function () {

        if (this.checked)
            loadCHC();
        else if (chcLayer)
            map.removeLayer(chcLayer);

    });

document.getElementById('chkNH')
    .addEventListener('change', function () {

        if (this.checked)
        loadNH();
        else if (nationalHighwayLayer)
            map.removeLayer(nationalHighwayLayer);

    });

document.getElementById('chkDH')
    .addEventListener('change', function () {

        if (this.checked)
            loadDH();
        else if (dhLayer)
            map.removeLayer(dhLayer);

    });

document.getElementById('chkSH')
    .addEventListener('change', function () {

        if (this.checked)
            loadSH();
        else if (shLayer)
            map.removeLayer(shLayer);

    });

document.getElementById('chkTrauma')        
    .addEventListener('change', function () {
        alert(1);
        if (this.checked)
            loadTrauma();
        else if (traumaLayer)
            map.removeLayer(traumaLayer);

    });