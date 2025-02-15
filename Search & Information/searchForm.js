var NoI = 1;

function showSearchForm() {
    document.getElementById('search').innerHTML = `
        <h2 class="title">Suche</h2>
        <h3 class="sub_title">Formel</h3>

        <div id="${NoI}_container" class="formula_container">
            <label for="formel${NoI}" id="formula_label${NoI}" class="formula_label">${NoI}</label>
            <div id="inputremove_container${NoI}" class="inputremove_container">
                <input id="formula${NoI}" class="formula_input" name="formel${NoI}" type="text">
                <button id="remove${NoI}" class="remove" type="button" onclick="removeInput(${NoI})">-</button>
            </div>
        </div>

        <button id="add" type="button" onclick="addInput()">+</button>
            
        <h3 class="sub_title">Wörter</h3>
        <textarea id="words" name="wort1" rows="4"></textarea>

        <h3 class="sub_title">Einstellungen</h3>
            
        <button id="submit" type="button" onclick="testSubmit(${NoI})">suchen</button>
    `;
}

function addInput() {
    NoI++;

    var container = document.createElement('div')
    container.id = NoI + '_container';
    container.className = 'formula_container';
    container.innerHTML = `
        <label for="formel${NoI}" id="formula_label${NoI}" class="formula_label">${NoI}</label>
        <div id="inputremove_container${NoI}" class="inputremove_container">
            <input id="formula${NoI}" class="formula_input" name="formel${NoI}" type="text">
            <button id="remove${NoI}" class="remove" type="button" onclick="removeInput(${NoI})">-</button>
        </div>
    `;

    document.getElementById('add').insertAdjacentHTML('beforebegin', container.outerHTML);
    document.getElementById('submit').setAttribute('onclick', `submit(${NoI})`);
}

function removeInput(number) {
    document.getElementById(number + '_container').remove();
    if(number == NoI) {
        NoI--;
    } else {
        for(let i = number+1; i <= NoI; i++) {
            var newNumber = i - 1;
            
            var container = document.getElementById(i + '_container');
            container.id = newNumber + '_container';
            
            var formulaLabel = document.getElementById('formula_label' + i);
            formulaLabel.innerText = newNumber;
            formulaLabel.id = 'formula_label' + newNumber;

            var inputremove_container = document.getElementById('inputremove_container' + i);
            inputremove_container.id = 'inputremove_container' + newNumber;

            var formula = document.getElementById('formula' + i)
            formula.id = 'formula' + newNumber;
            formula.name = 'formel' + newNumber;

            var remove = document.getElementById('remove' + i)
            remove.id = 'remove' + newNumber;
            remove.setAttribute('onclick', `removeInput(${newNumber})`);
        }
        NoI--;
    }

    document.getElementById('submit').setAttribute('onclick', `submit(${NoI})`);
}

function submit(NoT) {
    var formulas = [];
    
    for(let i = 1; i <= NoT; i++) {
        var formula = document.getElementById('formula' + i).value.trim()
        if(formula != '') {
            formulas.push(formula);
        }
    }

    var words = document.getElementById('words').value.trim()

    processSearch(formulas, words);
}