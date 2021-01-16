const fs = require('fs');
const geneIndex = require('./gene_index');

function loadDnaDb() {

    let json = undefined;

    try {
        let f = fs.readFileSync("./data/CK3_DNA_DB.json");
        json = JSON.parse(f.toString());
    } catch (error) {
        console.log(error);
    }

    if(json) {
        return json.data;
    }

    return undefined;
}

function saveDnaDb(jsonString) {
    try {
        fs.writeFileSync('./data/CK3_DNA_DB.json', jsonString);
    } catch (error) {
        console.log(error);
    }
}

function parseBase64Dna(base64) {
    let hex_string = base64decode(base64);

    let geneArray = [];

    for(let i=0; i< hex_string.length; i=i+2 ) {
        let dec = parseInt( Number(`0x${hex_string.slice(i, i+2)}`) , 10);
        geneArray.push(dec);
    }

    return geneArray;
}

function parseRulerDesignerDna(rulerDesigner) {

    let geneArray = [];

    let geneKeys = ['hair_color', 'skin_color', 'eye_color'].concat( Object.keys(geneIndex) );

    let lines = rulerDesigner.split('\n')
                .map( (e) => { return e.trim().replace(/^\t+/gm, ''); })
                .filter( (e) => { return e.length > 0; });

    for(let gene of geneKeys) {
        let re = new RegExp(`${gene}={\\s*(.+?)\\s+(.+?)\\s+(.+?)\\s+(.+?)\\s*}`);

        for(let line of lines) {
            let r_line = re.exec(line);

            if(r_line != null) {

                let value1 = undefined;
                let value2 = Number(r_line[2]);
                let value3 = undefined;
                let value4 = Number(r_line[4]);


                if( isNaN(Number(r_line[1])) ) {
                    let k = r_line[1].replace(/"/g, '');
                    value1 = geneIndex[gene][k];
                } else {
                    value1 = Number(r_line[1]);
                }


                if( isNaN(Number(r_line[3])) ) {
                    let k = r_line[3].replace(/"/g, '');
                    value3 = geneIndex[gene][k];
                } else {
                    value3 = Number(r_line[3]);
                }

                if( (value1===undefined) || (value2===undefined) || (value3===undefined) || (value4===undefined)) {
                    console.log(`[${arguments.callee.name}] Parsing Error at ${gene} -> ${value1}, ${value2}, ${value3}, ${value4}`);
                }

                geneArray.push(value1);
                geneArray.push(value2);
                geneArray.push(value3);
                geneArray.push(value4);

                break;
            }
        }
    }

    return geneArray;
}

function validateGeneArray(geneArray) {
    let result = {};
    let geneKeys = ['hair_color', 'skin_color', 'eye_color'].concat( Object.keys(geneIndex) );

    result.error = false;
    result.message = "";

    for(let i in geneArray) {
        if(geneArray[i] == undefined) {
            result.error = true;
            result.message += `[${geneKeys[i/4]}] `;
        }
    }

    if(result.error) {
        result.message = "컨버팅 중에 지원하지 않는 항목들이 있습니다.\n" + result.message;
    }

    return result;
}

function mitigateInvalidGeneArray(geneArray) {
    return geneArray.map((e) => { return (e) ? e : 0; });
}

function toRulerDesignerFormat(geneArray) {

    let geneKeys = ['hair_color', 'skin_color', 'eye_color'].concat( Object.keys(geneIndex) );

    let result = `ruler_designer_${randomDigits()}={\n`;

    result = result + "\tgenes={\n"

    for(let i=0; i<geneArray.length; i=i+4) {
        result = result + `\t\t${geneKeys[i/4]}={ ${geneArray[i]} ${geneArray[i+1]} ${geneArray[i+2]} ${geneArray[i+3]} }\n`;
    }

    result = result + '\t}\n}';

    return result;
}

function toBase64Format(geneArray) {
    let geneArrayString = geneArray.map((e) => {
        return e.toString(16).padStart(2, '0');
    }).join('');

	let result = base64encode(geneArrayString);

    return result;
}

function getGeneIndexKeys() {
    return Object.keys(geneIndex);
}

exports.loadDnaDb = loadDnaDb;
exports.saveDnaDb = saveDnaDb;
exports.parseBase64Dna = parseBase64Dna;
exports.parseRulerDesignerDna = parseRulerDesignerDna;
exports.validateGeneArray = validateGeneArray;
exports.mitigateInvalidGeneArray = mitigateInvalidGeneArray;
exports.toRulerDesignerFormat = toRulerDesignerFormat;
exports.toBase64Format = toBase64Format;
exports.getGeneIndexKeys = getGeneIndexKeys;

function base64encode(plaintext){
    return Buffer.from(plaintext, "hex").toString('base64');
}

function base64decode(base64text){
    return Buffer.from(base64text, 'base64').toString('hex');
}

function randomDigits() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}