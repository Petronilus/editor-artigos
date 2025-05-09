// script.js
let elementos = [];

function adicionarElemento(tipo, paiId = null) {
    const id = Date.now();
    const elemento = { id, tipo, conteudo: '', paiId };
    elementos.push(elemento);

    const conteudoDiv = document.getElementById('conteudo');
    const elementoDiv = document.createElement('div');
    elementoDiv.className = tipo === 'subparagrafo' ? 'elemento subparagrafo' : 'elemento';
    elementoDiv.dataset.id = id;

    const textarea = document.createElement('textarea');
    textarea.placeholder = tipo === 'subparagrafo' ? 'Digite o subparágrafo...' : 'Digite o parágrafo...';
    textarea.oninput = () => {
        elemento.conteudo = textarea.value;
        atualizarVisualizacao();
    };

    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.onclick = () => removerElemento(id);

    elementoDiv.appendChild(textarea);
    elementoDiv.appendChild(botaoRemover);

    if (paiId) {
        const paiElemento = conteudoDiv.querySelector(`[data-id="${paiId}"]`);
        paiElemento.appendChild(elementoDiv);
    } else {
        conteudoDiv.appendChild(elementoDiv);
    }

    atualizarVisualizacao();
}

function removerElemento(id) {
    elementos = elementos.filter(el => el.id !== id && el.paiId !== id);
    const elementoDiv = document.querySelector(`[data-id="${id}"]`);
    if (elementoDiv) elementoDiv.remove();
    atualizarVisualizacao();
}

function atualizarVisualizacao() {
    const artigoDiv = document.getElementById('artigo');
    artigoDiv.innerHTML = '';

    const titulo = document.getElementById('titulo').value;
    if (titulo) {
        const h1 = document.createElement('h1');
        h1.textContent = titulo;
        artigoDiv.appendChild(h1);
    }

    const elementosRaiz = elementos.filter(el => !el.paiId);
    elementosRaiz.forEach(el => renderElemento(el, artigoDiv));
}

function renderElemento(elemento, container) {
    const p = document.createElement('p');
    p.textContent = elemento.conteudo || ' ';
    p.className = elemento.tipo === 'subparagrafo' ? 'subparagrafo' : '';
    container.appendChild(p);

    const subelementos = elementos.filter(el => el.paiId === elemento.id);
    subelementos.forEach(sub => renderElemento(sub, container));
}

function salvarArtigo() {
    const titulo = document.getElementById('titulo').value;
    const artigo = { titulo, elementos };
    const blob = new Blob([JSON.stringify(artigo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artigo.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('conteudo').addEventListener('click', (e) => {
    if (e.target.classList.contains('elemento') || e.target.closest('.elemento')) {
        const elementoDiv = e.target.closest('.elemento');
        const id = elementoDiv.dataset.id;
        if (!elementoDiv.classList.contains('subparagrafo')) {
            adicionarElemento('subparagrafo', id);
        }
    }
});
