function decimalToOctal(decimal) {
    let dec = Number(decimal);
    let oct = [];


    while (dec > 0) {
        oct.push(Math.floor(dec % 8));
        dec = Math.floor(dec / 8);
    }

    document.querySelector('#dec-to-oct').innerHTML = oct.reverse().join('');
}

function decimalToBinario(decimal) {
    let dec = Number(decimal);
    let bin = [];


    while (dec > 0) {
        bin.push(Math.floor(dec % 2));
        dec = Math.floor(dec / 2);
    }

    document.querySelector('#dec-to-bin').innerHTML = bin.reverse().join('');
}

function hexadecimalToDecimal(hexadecimal) {
    let hex = hexadecimal.toString(16);
    let dec = parseInt(hex, 16);

    document.querySelector('#hex-to-dec').innerHTML = dec;
}

function decimalToHexadecimal(decimal) {
    let dec = Number(decimal);
    let hex = dec.toString(16);

    document.querySelector('#dec-to-hex').innerHTML = hex;
}

function octalToDecimal(octal) {
    let oct = octal.split('');
    let dec = [];
    oct = oct.reverse();

    for (let i = 0; i < oct.length; i++) {
        dec.push(Number(oct[i]) * Math.pow(8, i));
    }

    dec = dec.reduce((prev, cur) => {
        return prev + cur;
    });

    document.querySelector('#oct-to-dec').innerHTML = dec;
}

function binarioToDecimal(binario) {
    let bin = binario.split('');
    let dec = [];
    bin = bin.reverse();

    for (let i = 0; i < bin.length; i++) {
        dec.push(Number(bin[i]) * Math.pow(2, i));
    }

    dec = dec.reduce((prev, cur) => {
        return prev + cur;
    });

    document.querySelector('#bin-to-dec').innerHTML = dec;
}
