function createInfo(data) {
    removeInfo12()

    var i_svg = d3.select('#info2_container')
        .append('svg')
        .attr('width', "100%")
        .attr('height', (100 * data['properties']['inscriptions'].length) + 200)
        .attr('id', 'info2')
        .append('g')
        .attr('transform', 'translate(' + 60 + ', ' + 0 + ')');

    var element = d3.select('#info2').node();
    const width = element.getBoundingClientRect().width - 120;
    const height = (100 * data['properties']['inscriptions'].length) + 100;

    i_svg.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .text('Fundort');

    i_svg.append('text')
        .attr('x', width - 5)
        .attr('y', 20)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .text(data['properties']['place']);

    i_svg.append('text')
        .attr('x', 5)
        .attr('y', 40)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .text('Provinz');

    i_svg.append('text')
        .attr('x', width - 5)
        .attr('y', 40)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .text(data['properties']['inscriptions'][0]['province']);

    var info = [
        { text: 'Koodinaten', info: '[' + data['geometry']['coordinates'] + ']' },
        { text: 'Inschriften', info: '(' + data['properties']['inscriptions'].length + ')' }
    ];

    for (let i = 0; i < info.length; i++) {
        i_svg.append('text')
            .attr('x', 15)
            .attr('y', 65 + (i * 20))
            .attr('dominant-baseline', 'middle')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '12.5pt')
            .text(info[i]['text']);

        i_svg.append('text')
            .attr('x', width - 15)
            .attr('y', 65 + (i * 20))
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'end')
            .attr('font-family', 'Helvetica')
            .attr('font-size', '12.5pt')
            .text(info[i]['info']);
    }

    i_svg.selectAll('.inscriptions')
        .data(data['properties']['inscriptions'])
        .enter()
        .append('text')
        .attr('x', 15)
        .attr('y', (d, i) => 110 + (i * 20))
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('class', 'inscriptions')
        .text((d) => d['EDCSID'])
        .on('click', function(event, d) {
            createAdditionalInformation(d, this, i_svg, width);
        });
}

function createAdditionalInformation(d, element, i_svg, width) {
    var inscription = getInscription(d['inscription']);

    d3.selectAll('.additional-info').remove(); 
    const bbox = element.getBBox();
    const x = bbox.x;
    const y = bbox.y; 
    
    i_svg.append('rect')
        .attr('x', 12.5)
        .attr('y', y - 2.5)
        .attr('width', width - 25)
        .attr('height', 200)
        .attr('class', 'additional-info')
        .attr('fill', '#f0f0f0')
        .attr('stroke', '#ccc'); 
    
    i_svg.append('text')
        .attr('x', x + 2.5)
        .attr('y', y + 10)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('class', 'additional-info')
        .text(d['EDCSID']);

    i_svg.append('rect')
        .attr('x', width - 25)
        .attr('y', y + 5)
        .attr('width', 10)
        .attr('height', 2)
        .attr('fill', 'black')
        .attr('class', 'additional-info')
        .on('click', () => {
            d3.selectAll('.additional-info').remove();
        })

    i_svg.append('text')
        .attr('x', x + 7.5)
        .attr('y', y + 30)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('class', 'additional-info')
        .text('Datierung:');

    i_svg.append('text')
        .attr('x', x + 100)
        .attr('y', y + 30)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('class', 'additional-info')
        .text(d['dating']);

    i_svg.append('text')
        .attr('x', x + 7.5)
        .attr('y', y + 50)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '12.5pt')
        .attr('class', 'additional-info')
        .text('Inschrift:');

    i_svg.selectAll('.inscription')
        .data(inscription)
        .enter()
        .append('text')
        .attr('x', x + width/2)
        .attr('y', (d, i) => (y + 70) + (i * 17.5))
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Helvetica')
        .attr('font-size', '10pt')
        .attr('class', 'additional-info' + ' ' + 'inscription')
        .text((d) => d);
}

function getInscription(inscription) {
    if(inscription.includes(' / ') || inscription.includes(' // ')) {
        inscription = inscription.split(/ \/ | \/\/ /);
    } else {
        inscription = [inscription];
    }
    inscription = inscription.map(d => d.trim()).filter(d => d != '');
    return inscription;
}