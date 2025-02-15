function renderLegend(inscriptions, data, radius, extent) {
    const width = 400;
    const height = 200;
    const l_svg = createLegendSVG(width, height, 1120, 20, {top: 0, bottom: 0, left: 0, right: 0});

    l_svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('fill', 'black')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '15pt')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('class', 'title')
        .text("Legende");

    l_svg.append('text')
        .attr('x', 10)
        .attr('y', 45)
        .attr('fill', 'black')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('dominant-baseline', 'middle')
        .text("Anzahl der Fundorte:");

    l_svg.append('text')
        .attr('x', width - 10)
        .attr('y', 45)
        .attr('fill', 'black')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .text(data['features'].length);


    l_svg.append('text')
        .attr('x', 10)
        .attr('y', 65)
        .attr('fill', 'black')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('dominant-baseline', 'middle')
        .text('Größe der Markierungen (Anzahl der Inschriften)');

    var sizes = getSizes(extent);

    for (var i = 0; i < sizes.length; i++) {
        l_svg.append('circle')
            .attr('cx', ((i + 1) * (width / (sizes.length + 1))))
            .attr('cy', 92.5)
            .attr('r', radius(sizes[i]))
            .attr('fill', 'red')
            .attr('stroke', 'black')
            .attr('class', 'legend')
            .attr('stroke-width', '0.1px');

        l_svg.append('text')
            .attr('x', ((i + 1) * (width / (sizes.length + 1))))
            .attr('y', 117.5)
            .attr('dominant-baseline', 'middle')
            .style('text-anchor', 'middle')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '10pt')
            .text(sizes[i]);
    }


    var spacial = getSpacial(data)
    var legend_data = [
        { name: "Anzahl der Inschriften", number: inscriptions.length, percentage: getPercentage(inscriptions, inscriptions) },
        { name: "mit Koordinaten", number: spacial, percentage: getPercentage(inscriptions, spacial) },
        { name: "ohne Koordinaten", number: inscriptions.length - spacial, percentage: getPercentage(inscriptions, inscriptions.length - spacial) }
    ];

    for (var i = 0; i < legend_data.length; i++) {
        l_svg.append('text')
            .attr('x', 10)
            .attr('y', 145 + (i * 20))
            .attr('fill', 'black')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '12.5pt')
            .attr('dominant-baseline', 'middle')
            .text(legend_data[i]['name']);

        l_svg.append('text')
            .attr('x', width - 10)
            .attr('y', 145 + (i * 20))
            .attr('fill', 'black')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '12.5pt')
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .text("(" + legend_data[i]['percentage'] + "%)");

        l_svg.append('text')
            .attr('x', width - 145)
            .attr('y', 145 + (i * 20))
            .attr('fill', 'black')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '12.5pt')
            .attr('dominant-baseline', 'middle')
            .text(legend_data[i]['number']);
    }
}

function createLegendSVG(width, height, x, y) {
    const l_svg = d3.select('#vis')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .attr('class', 'l_svg')
        .append('g')

    addBorder(l_svg, width, height);

    return l_svg;
}

function addBorder(l_svg, width, height) {
    l_svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('class', 'l_border');
}

function getSizes(extent) {
    if (extent[0] == 1 && extent[1] == 1) {
        return [1];
    } else if (extent[1] < 10) {
        return extent;
    } else {
        return [extent[0], Math.round((extent[1] / 3) * 1), Math.round((extent[1] / 3) * 2), extent[1]];
    }
}

function getSpacial(data) {
    var number = 0
    for (var i = 0; i < data['features'].length; i++) {
        number += data['features'][i]['properties']['inscriptions'].length;
    }
    return number;
}

function getPercentage(max, number) {
    if (number instanceof Array) {
        return Math.round(((number.length / max.length) * 100) * 10) / 10;
    }
    else {
        return Math.round(((number / max.length) * 100) * 10) / 10;
    }
}

function modifyLegend(title, rawData) {
    var element = d3.select('.l_svg').node();
    const width = element.getBoundingClientRect().width;
    const height = element.getBoundingClientRect().height + 20;
    
    var l_svg = d3.select('.l_svg')
        .attr('height', height);

    d3.select('.l_border')
        .remove();
    addBorder(l_svg, width, height)

    l_svg.append('text')
        .attr('x', width/2)
        .attr('y', 205)
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('cursor', 'pointer')
        .text('RETURN')
        .on('click', (event, d) => {
            callRD(rawData);
        });

    d3.select('.title')
        .text(title);
}