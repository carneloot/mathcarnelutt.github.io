window.onload = function() {
    document.getElementsByTagName('form')[0].onsubmit = gerarLink;
    document.querySelector('#copyButton').onclick = copiarLink;
}

function copiarLink() {
    document.querySelector('#copiadoMsg').style.display = '';

    document.querySelector('#inputResultado').select();
    document.execCommand('copy');
}

function gerarLink() {
    const numero = document.querySelector('#inputNumero').value;
    const texto  = document.querySelector('#inputTexto').value;
    
    const baseLink = 'https://wa.me/';
    
    let numeroFormatado = formatarNumero(numero);
    if (!numeroFormatado.startsWith('55')) {
        numeroFormatado = '55' + numeroFormatado;
    }

    console.log(numeroFormatado);
    
    let link = `${baseLink}${numeroFormatado}`;
    
    if (texto && texto !== '') {
        link += `?text=${formatarTexto(texto)}`;
    }
    
    document.querySelector('#inputResultado').value = link;
    
    // Mostra o resultado
    document.getElementsByClassName('input-group')[0].style.display = '';
    document.querySelector('#copiadoMsg').style.display = 'none';

    // Retorn falso para nao atualizar a pagina
    return false;
}

function formatarNumero(numero) {
    return numero.replace(/[^0-9]/g, '');
}

function formatarTexto(texto) {
    return encodeURIComponent(texto).replace(/\!/g, '%21');
}