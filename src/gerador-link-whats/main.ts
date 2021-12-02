import axios from 'axios';

let podeEncurtar = true;

const copiadoMsg = document.querySelector<HTMLParagraphElement>('#copiadoMsg')!;
const inputResultado = document.querySelector<HTMLInputElement>('#inputResultado')!;
const loadingSpinner = document.querySelector<HTMLDivElement>('#loadingSpinner')!;
const shortenButton = document.querySelector<HTMLButtonElement>('#shortenButton')!;
const copyButton = document.querySelector<HTMLButtonElement>('#copyButton')!;
const form = document.querySelector<HTMLFormElement>('#form')!;

function copiarLink() {
    copiadoMsg.style.display = '';

    inputResultado.select();
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

function gerarLink(ev: SubmitEvent) {
    ev.preventDefault();

    const numero = document.querySelector<HTMLInputElement>('#inputNumero')!.value;
    const texto = document.querySelector<HTMLInputElement>('#inputTexto')!.value;

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
    document.querySelector<HTMLDivElement>('.input-group')!.style.display = '';
    esconderMsgCopiado();
    liberarEncurtador();

    // Retorn falso para nao atualizar a pagina
    return false;
}

function setarValorFinal(encurtado: string) {
    inputResultado.value = encurtado;
}

function pegarValorFinal() {
    return inputResultado.value;
}

function esconderMsgCopiado() {
    copiadoMsg.style.display = 'none';
}

function esconderSpinner() {
    loadingSpinner.style.display = 'none';
}

function mostrarSpinner() {
    loadingSpinner.style.display = '';
}

function bloquearEncurtador() {
    podeEncurtar = false;
    shortenButton.setAttribute('disabled', 'true');
}

function liberarEncurtador() {
    podeEncurtar = true;
    shortenButton.removeAttribute('disabled');
}

function formatarNumero(numero: string) {
    return numero.replace(/[^0-9]/g, '');
}

function formatarTexto(texto: string) {
    return encodeURIComponent(texto).replace(/\!/g, '%21');
}

function setup() {
    form.addEventListener('submit', gerarLink);
    copyButton.addEventListener('click', copiarLink);
    shortenButton.addEventListener('click', encurtarLink);

    esconderSpinner();
    bloquearEncurtador();
    liberarEncurtador();
}

setup();
