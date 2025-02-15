function searchInscriptions(inscriptions, formulas, words) {
    inscriptions = removeSearch(inscriptions);
    
    inscriptions = extractFormulas(prepareInscriptions(inscriptions, formulas, words), getAllFormulas(formulas));
    console.log(inscriptions);

    return inscriptions;
}

function prepareInscriptions(inscriptions, formulas, words) {
    var words = prepareWords(words, formulas);

    for(let i = 0; i < inscriptions.length; i++) {
        inscriptions[i]['reduced - cleared inscription'] = createRCI(inscriptions[i], words);
    }
    
    inscriptions = inscriptions.filter(inscription => inscription['reduced - cleared inscription'] != null);
    inscriptions = inscriptions.filter(inscription => inscription['reduced - cleared inscription'].trim() != '');

    return inscriptions;
}

function prepareWords(words, formulas) {
    if(words == '') {
        words = [... new Set(formulas.join(' ').replaceAll(',', '').split(' '))];
    } else {
        words = words + ' ' + (formulas.join(' ').replaceAll(',', ''));
        words = [... new Set(words.split(' '))];
    }
    words.push(' ');

    return words;
}

function createRCI(inscription, words) {
    var regex = new RegExp(`\\b(${words.join("|")})\\b`, 'gi');
    var match = inscription['cleared inscription'].toLowerCase().match(regex);
    match = match != null ? match.join(' ').trim() : null;

    return match;
}

function getAllFormulas(f) {
    var formulas = []
    for(var i = 0; i < f.length; i++) {
        formulas.push(prepareFormulas(f[i]));
    }
    console.log(formulas);
    return formulas;
}

function prepareFormulas(formula) {
    formula = formula.split(',').map(d => d.trim()).map(d => d.split(' '));
    let result = [];

    function combine(prefix, index) {
        if (index === formula.length) {
            result.push(prefix);
            return;
        }
        for (let i = 0; i < formula[index].length; i++) {
            combine(prefix + ' ' + formula[index][i], index + 1);
        } 
    }
    combine('', 0);

    return result.map(d => d.trim()).map(d => d.split(' '));
}

function extractFormulas(inscriptions, formulas) {
    for(let i1 = 0; i1 < inscriptions.length; i1++) {
        if(!inscriptions[i1]['reduced - cleared inscription'].includes('    ')) {
            let search = extractSingle(inscriptions[i1]['reduced - cleared inscription'], formulas);
            if(search['result'] != null && search['search_term'] != null) {
                inscriptions[i1]['search'] = [search];
            }
        } else {
            let search = extractMultiple(inscriptions[i1]['reduced - cleared inscription'], formulas);
            if(search.length != 0) {
                inscriptions[i1]['search'] = search;
            }
        }
    }
    inscriptions = inscriptions.filter(d => d.hasOwnProperty('search'));

    return inscriptions;
}

function extractSingle(RCI, formulas) {
    RCI = RCI.replaceAll('   ', ' ');
    var includes = [];

    for(let i1 = 0; i1 < formulas.length; i1++) {
        for(let i2 = 0; i2 < formulas[i1].length; i2++) {
            if(formulas[i1][i2].every(word => RCI.includes(word))) {
                includes.push({ index: i1, formula: formulas[i1][i2] });
            }
        }
    }

    return controlIncludes(RCI, includes);
}

function extractMultiple(RCI, formulas) {
    var search = [];
    RCI = RCI.split('    ').map(d => d.trim()).filter(d => d != "").map(d => d.replaceAll('   ', ' '));
    
    if(RCI.every(instance => instance == RCI[0])) {
        let includes = [];
        for(let i1 = 0; i1 < formulas.length; i1++) {
            for(let i2 = 0; i2 < formulas[i1].length; i2++) {
                if(formulas[i1][i2].every(word => RCI[0].includes(word))) {
                    includes.push({ index: i1, formula: formulas[i1][i2] });
                }
            }
        }
        var s = controlIncludes(RCI[0], includes);
        if(s['result'] != null && s['search_term'] != null) {
            search.push(s);
        }
    } else {
        for(let i1 = 0; i1 < RCI.length; i1++) {
            var includes = [];
            for(let i2 = 0; i2 < formulas.length; i2++) {
                for(let i3 = 0; i3 < formulas[i2].length; i3++) {
                    if(formulas[i2][i3].every(word => RCI[i1].includes(word))) {
                        includes.push({ index: i2, formula: formulas[i2][i3] });
                    }
                }
            }
            var s = controlIncludes(RCI[i1], includes);
            if(s['result'] != null && s['search_term'] != null) {
                search.push(s);
            }
        }
    }

    return search;
}

function controlIncludes(RCI, includes) {
    if(includes.length != 0) {
        if(includes.length > 1) {
            if(includes.every(formula => formula['formula'].length == includes[0]['formula'].length)) {
                return { result: RCI, search_term: [... new Set(includes.map(d => d['index']))] };
            } else {
                var formulas = [... new Set(includes.map(d => d['formula'].join(' ')))];
                var index = oneStringIncludesAllOthers(formulas);
                if (index != -1) {
                    return { result: RCI, search_term: [includes[index]['index']] };
                } else {
                    return { result: RCI, search_term: [... new Set(includes.map(d => d['index']))] };
                }
            }
        } else {
            return { result: RCI, search_term: [includes[0]['index']] };
        }
    } else {
        return { result: null, search_term: [null] };
    }
}

function oneStringIncludesAllOthers(arr) {
    for (let i = 0; i < arr.length; i++) {
        let includesAll = true;
        for (let j = 0; j < arr.length; j++) {
            if (i !== j && !arr[i].includes(arr[j])) {
                includesAll = false;
                break;
            }
        }
        if (includesAll) {
            return i;
        }
    }
    return -1;
}