function updateStatistics() {

    document
        .getElementById(
            "chcCount"
        )
        .innerHTML =
        chcLayer ?
            chcLayer.getLayers().length
            : 0;

    document
        .getElementById(
            "dhCount"
        )
        .innerHTML =
        dhLayer ?
            dhLayer.getLayers().length
            : 0;

    document
        .getElementById(
            "shCount"
        )
        .innerHTML =
        shLayer ?
            shLayer.getLayers().length
            : 0;
}