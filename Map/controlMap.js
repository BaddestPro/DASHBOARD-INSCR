function controlMap(inscriptions, provinces, coastlines) {
        var data = getData(inscriptions);
        var extent = d3.extent(data['features'], (d) => { return d['properties']['inscriptions'].length });
        var radius = createRadius(extent);

        renderMap(data, provinces, coastlines, radius);
        renderLegend(inscriptions, data, radius, extent);
}

function createRadius(extent) {
    if(extent[1] < 10) {
        var radius = d3.scaleLinear()
            .domain(extent)
            .range([2, 5]);
    } else {
        var radius = d3.scaleLinear()
            .domain(extent)
            .range([1.5, 10]);
    }
    return radius;
}