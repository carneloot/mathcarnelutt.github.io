let podeEncurtar = true;

window.onload = function () {
    document.getElementsByTagName('form')[0].onsubmit = gerarLink;
    document.querySelector('#copyButton').onclick = copiarLink;
    document.querySelector('#shortenButton').onclick = encurtarLink;

    esconderSpinner();
    bloquearEncurtador();
    liberarEncurtador();
}

function copiarLink() {
    document.querySelector('#copiadoMsg').style.display = '';

    document.querySelector('#inputResultado').select();
    document.execCommand('copy');
}

async function encurtarLink() {
    if (!podeEncurtar) {
        return;
    }

    mostrarSpinner();

    const urlLonga = pegarValorFinal();

    const response = await axios.post('/api/shorten', {
        url: urlLonga,
    });

    const encurtado = decodeURIComponent(response.data.url);

    setarValorFinal(encurtado);
    esconderMsgCopiado();

    esconderSpinner();

    bloquearEncurtador();
}

function gerarLink() {
    const numero = document.querySelector('#inputNumero').value;
    const texto = document.querySelector('#inputTexto').value;

    const baseLink = 'https://wa.me/';

    let numeroFormatado = formatarNumero(numero);
    if (!numeroFormatado.startsWith('55')) {
        numeroFormatado = '55' + numeroFormatado;
    }

    let link = `${baseLink}${numeroFormatado}`;

    if (texto && texto !== '') {
        link += `?text=${formatarTexto(texto)}`;
    }

    setarValorFinal(link);

    // Mostra o resultado
    document.getElementsByClassName('input-group')[0].style.display = '';
    esconderMsgCopiado();
    liberarEncurtador();

    // Retorn falso para nao atualizar a pagina
    return false;
}

function setarValorFinal(encurtado) {
    document.querySelector('#inputResultado').value = encurtado;
}

function pegarValorFinal() {
    return document.querySelector('#inputResultado').value;
}

function esconderMsgCopiado() {
    document.querySelector('#copiadoMsg').style.display = 'none';
}

function esconderSpinner() {
    document.querySelector('#loadingSpinner').style.display = 'none';
}

function mostrarSpinner() {
    document.querySelector('#loadingSpinner').style.display = '';
}

function bloquearEncurtador() {
    podeEncurtar = false;
    document.querySelector('#shortenButton').setAttribute('disabled', 'true');
}

function liberarEncurtador() {
    podeEncurtar = true;
    document.querySelector('#shortenButton').removeAttribute('disabled');
}

function formatarNumero(numero) {
    return numero.replace(/[^0-9]/g, '');
}

function formatarTexto(texto) {
    return encodeURIComponent(texto).replace(/\!/g, '%21');
}