function renderSearch(rawData) {
    var data = getSubplot3Data(rawData);

    var i1_svg = d3.select('#info1_container')
        .append('svg')
        .attr('width', "100%")
        .attr('height', '100%')
        .attr('id', 'info1')
        .append('g')
        .attr('transform', 'translate(' + 60 + ', ' + 59 + ')');
    
    var i2_svg = d3.select('#info2_container')
        .append('svg')
        .attr('width', "100%")
        .attr('height', 25 * data.length)
        .attr('id', 'info2')
        .append('g')
        .attr('transform', 'translate(' + 60 + ', ' + 5 + ')');
    
    var element = d3.select('#info2').node();
    const width = element.getBoundingClientRect().width - 255;
    const height = 25 * data.length;

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['inscriptions'].length)])
        .range([width, 0])

    var xAxis = i1_svg.append('g')
        .attr('class', 'x-axis')
        .call(d3.axisTop(xScale));

    var yScale = d3.scaleBand()
        .domain(data.map((d) => { return d['formula']; }))
        .range([height, 0])
        .padding(0.125);

    var yAxis = i2_svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + width + ', 0)')
        .call(d3.axisRight(yScale));

    i2_svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d['inscriptions'].length))
        .attr('y', (d) => yScale(d['formula']))
        .attr('width', (d) => width - xScale(d['inscriptions'].length))
        .attr('height', yScale.bandwidth())
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .style('cursor', 'pointer')
        .attr('stroke-width', '0.5px')
        .on('mouseover', function(event, d) { 
            d3.select(this)
                .attr('fill', 'darkblue'); 
        })
        .on('mouseout', function(event, d) { 
            d3.select(this)
                .attr('fill', 'red'); 
        })
        .on('click', function(event, d) {
            console.log(d);
            getSelectionMap(d, rawData);
        });

    i1_svg.append('text')
        .attr('x', width / 2)
        .attr('y', -25)
        .attr('font-size', '12.5pt')
        .attr('font-family', 'Helvetica')
        .attr('text-anchor', 'middle')
        .text('Anzahl der Inschriften')

    i2_svg.append('text')
        .attr('x', -height / 2)
        .attr('y', width+185)
        .attr('font-size', '12.5pt')
        .attr('font-family', 'Helvetica')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Formel');

    i2_svg.append('line')
        .attr('x1', width + 0.5)
        .attr('y1', 0)
        .attr('x2', width + 0.5)
        .attr('y2', -5)
        .attr('stroke', 'black')
        .attr('stroke-width', 'px');
}

function getSubplot3Data(rawData) {
    var formulas = getFormulas(rawData);
    
    for(let i1 = 0; i1 < formulas.length; i1++) {
        var inscriptions = [];
        for(let i2 = 0; i2 < rawData.length; i2++) {
            if(rawData[i2]['search'].includes(formulas[i1])) {
                inscriptions.push(rawData[i2]);
            }
        }
        formulas[i1] = { formula: formulas[i1], inscriptions: inscriptions };
    }
    formulas.sort((a, b) => a['inscriptions'].length - b['inscriptions'].length);

    return formulas;
}

function getFormulas(rawData) {
    var formulas = [];

    for(let i1 = 0; i1 < rawData.length; i1++) {
        for(let i2 = 0; i2 < rawData[i1]['search'].length; i2++) {
            if(!formulas.includes(rawData[i1]['search'][i2])) {
                formulas.push(rawData[i1]['search'][i2]);
            }
        }
    }

    return formulas;
}


function getPData(inscriptions) {
    var data = createItem(getNotations(inscriptions, getSearchTerms(inscriptions)));

    for(let i1 = 0; i1 < inscriptions.length; i1++) {
        for(let i2 = 0; i2 < inscriptions[i1]['search'].length; i2++) {
            if(inscriptions[i1]['search'][i2]['search_term'].length != 1) {
                for(let i = 0; i < data[data.length-1].length; i++) {
                    if(inscriptions[i1]['search'][i2]['result'] == data[data.length-1][i]['notation']) {
                        data[data.length-1][i]['inscriptions'].push(inscriptions[i1]);
                    }
                }
            } else {
                for(let i = 0; i < data[inscriptions[i1]['search'][i2]['search_term'][0]].length; i++) {
                    if(inscriptions[i1]['search'][i2]['result'] == data[inscriptions[i1]['search'][i2]['search_term'][0]][i]['notation']) {
                        data[inscriptions[i1]['search'][i2]['search_term'][0]][i]['inscriptions'].push(inscriptions[i1]);
                    }
                }
            }
        }
    }
    
    return data;
}

function getSearchTerms(inscriptions) {
    var search_terms = [];
    var data = [];

    for(let i1 = 0; i1 < inscriptions.length; i1++) {
        for(let i2 = 0; i2 < inscriptions[i1]['search'].length; i2++) {
            for(let i3 = 0; i3 < inscriptions[i1]['search'][i2]['search_term'].length; i3++) {
                if(!search_terms.includes(inscriptions[i1]['search'][i2]['search_term'][i3])) {
                    search_terms.push(inscriptions[i1]['search'][i2]['search_term'][i3]);
                    data.push([]);
                }
            }
        }
    }
    data.push([]);
    
    return data;
}

function getNotations(inscriptions, data) {
    for(let i1 = 0; i1 < inscriptions.length; i1++) {
        for(let i2 = 0; i2 < inscriptions[i1]['search'].length; i2++) {
            if(inscriptions[i1]['search'][i2]['search_term'].length == 1) {
                if(!data[inscriptions[i1]['search'][i2]['search_term'][0]].includes(inscriptions[i1]['search'][i2]['result'])) {
                    data[inscriptions[i1]['search'][i2]['search_term'][0]].push(inscriptions[i1]['search'][i2]['result']);
                }
            } else {
                if(!data[data.length-1].includes(inscriptions[i1]['search'][i2]['result'])) {
                    data[data.length-1].push(inscriptions[i1]['search'][i2]['result']);
                }
            }
        }
    }

    return data;
}

function createItem(data) {
    for(let i1 = 0; i1 < data.length; i1++) {
        for(let i2 = 0; i2 < data[i1].length; i2++) {
            data[i1][i2] = { notation: data[i1][i2], inscriptions: [] };
        }
    }

    return data;
}