function renderPlaces(rawData) {
    const v_margin = { top: 100, bottom: 100, left: 100, right: 100 };
    const container = d3.select('#vis').node();
    const width = container.getBoundingClientRect().width - v_margin.left - v_margin.right;
    const height = container.getBoundingClientRect().height - v_margin.top - v_margin.bottom;

    var v_svg = d3.select('#vis')
        .append('g')
        .attr('transform', 'translate(' + v_margin.left + ', ' + v_margin.top + ')');

    var data = getSubplot1Data(rawData);


    var xScale = d3.scaleBand()
        .domain(data.map((d) => { return d['n']; }))
        .range([width, 0])
        .padding(0.125);

    var xAxis = v_svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(90)')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start');;

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => { return d['amount']; })])
        .range([height, 0]);

    var yAxis = v_svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));


    v_svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d['n']))
        .attr('y', (d) => yScale(d['amount']))
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d['amount']))
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('stroke-width', '0.5px')
        .on('mouseover', function (event, d) {
            d3.select(this)
                .attr('fill', 'darkblue');
        })
        .on('mouseout', function (event, d) {
            d3.select(this)
                .attr('fill', 'red');
        });

    v_svg.append('text')
        .attr('x', height / 2)
        .attr('y', 0 + 60)
        .attr('font-size', '12.5pt')
        .attr('font-family', 'Helvetica')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(90)')
        .text('Anzahl der Fundorte');

    v_svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 60)
        .attr('font-size', '12.5pt')
        .attr('font-family', 'Helvetica')
        .attr('text-anchor', 'middle')
        .text('Anzahl der Inschriften');
}

function getSubplot1Data(rawData) {
    var data = [...new Set(rawData['features'].map(d => d['properties']['inscriptions'].length))];

    for (let i1 = 0; i1 < data.length; i1++) {
        var counter = 0;
        for (let i2 = 0; i2 < rawData['features'].length; i2++) {
            if (rawData['features'][i2]['properties']['inscriptions'].length == data[i1]) {
                counter += 1;
            }
        }
        data[i1] = { n: data[i1], amount: counter };
    }
    data.sort((a, b) => a['amount'] - b['amount']);

    return data;
}