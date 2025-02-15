function renderMap(data, provinces, coastlines, radius) {
    const v_margin = { top: 100, bottom: 10, left: 10, right: 10 };
    
    var v_svg = d3.select('#vis')
        .append('g')
        .attr('transform', 'translate(' + v_margin.left + ', ' + v_margin.top + ')');

    var element = d3.select('#vis').node();
    const width = element.getBoundingClientRect().width - 20;
    const height = element.getBoundingClientRect().height - 150;
    
    var projection = d3.geoMercator()
        .fitSize([width, height], provinces);

    var geoGenerator = d3.geoPath()
        .projection(projection);

    v_svg.selectAll('.coastlines')
        .data(coastlines['features'])
        .join('path')
        .attr('d', geoGenerator)
        .attr('stroke-width', '0.5px')
        .attr('stroke', 'black')
        .attr('fill', 'lightgrey')
        .attr('opacity', 0.5)
        .attr('class', 'coastlines');

    v_svg.selectAll('.provinces')
        .data(provinces['features'])
        .join('path')
        .attr('d', geoGenerator)
        .attr('stroke-width', '1px')
        .attr('stroke', 'darkgrey')
        .attr('fill', 'darkgrey')
        .attr('class', 'provinces');

    v_svg.selectAll('.places')
        .data(data['features'])
        .enter()
        .append('circle')
        .attr('cx', (d) => { return projection(d['geometry']['coordinates'])[0]; })
        .attr('cy', (d) => { return projection(d['geometry']['coordinates'])[1]; })
        .attr('r', (d) => { return radius(d['properties']['inscriptions'].length); })
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('stroke-width', '0.1px')
        .attr('opacity', 0.75)
        .attr('class', (d) => { return 'places' + ' ' + 'n' + d['properties']['inscriptions'].length; })
        .on('click', (event, d) => {
            createInfo(d);
        });
}