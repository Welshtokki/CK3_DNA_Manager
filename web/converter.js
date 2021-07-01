import { geneIndex } from './dna.js'

class Converter {

    static convert(dna) {
        let result = ''

        if(dna.type === 'Base64') {
            result = toRulerDesigner(dna.data)
        }
        else {
            result = toBase64(dna.data)
        }

        return result
    }
}

function toBase64(geneArray) {

    let geneArrayString = ''
    for(let i=0; i<geneArray.length; i++) {
        const char = String.fromCharCode(geneArray[i])
        geneArrayString += char
    }

    const result = btoa(geneArrayString) // Encode Base64

    return result
}

function toRulerDesigner(geneArray) {
    const geneKeys = ['hair_color', 'skin_color', 'eye_color'].concat( Object.keys(geneIndex) )

    let result = `ruler_designer_${randomDigits()}={\n`

    result = result + "\tgenes={\n"

    for(let i=0; i<geneArray.length; i=i+4) {
        result = result + `\t\t${geneKeys[i/4]}={ ${geneArray[i]} ${geneArray[i+1]} ${geneArray[i+2]} ${geneArray[i+3]} }\n`
    }

    result = result + '\t}\n}'

    return result
}

function randomDigits() {
    return Math.floor(Math.random() * 9000000000) + 1000000000
}

export {Converter}