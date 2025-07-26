// Carrega categorias e itens dos arquivos JSON separados
const categoryListUrl = 'categories/categories.json';
const categoriesDir = 'categories/';

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Mapeamento manual para nomes de arquivos das categorias
const categoryFileMap = {
    'ATUALIDADES': 'atualidades.json',
    'FILME': 'filme.json',
    'SÉRIE': 'serie.json',
    'DIGITAL': 'digital.json',
    'LUGAR': 'lugar.json',
    'COISA': 'coisa.json',
    'PESSOA': 'pessoa.json'
};

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao carregar ${url}`);
    return response.json();
}

async function getAllCategories() {
    const categoryNames = await fetchJson(categoryListUrl);
    const categories = {};
    for (const name of categoryNames) {
        const fileName = categoriesDir + (categoryFileMap[name] || name.toLowerCase() + '.json');
        try {
            categories[name] = await fetchJson(fileName);
        } catch (e) {
            console.warn(`Arquivo não encontrado para categoria: ${name}`);
        }
    }
    return categories;
}

function showCard(category, item) {
    document.getElementById('categoryTitle').textContent = 'Categoria';
    document.getElementById('category').textContent = category;
    document.getElementById('answerTitle').textContent = 'Resposta';
    document.getElementById('answer').textContent = item.name;
    const cluesDisplay = document.getElementById('cluesDisplay');
    cluesDisplay.innerHTML = '';
    item.clues.forEach((clue, idx) => {
        const li = document.createElement('li');
        li.className = 'clue-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `clue-check-${idx}`;
        checkbox.className = 'clue-checkbox';
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.innerHTML = `<span class='clue-number'>${idx + 1}.</span> ${clue}`;
        li.appendChild(checkbox);
        li.appendChild(label);
        cluesDisplay.appendChild(li);
    });
}

let loadedCategories = null;

async function newCard() {
    if (!loadedCategories) {
        loadedCategories = await getAllCategories();
    }
    const categoryNames = Object.keys(loadedCategories).filter(cat => loadedCategories[cat]?.items?.length);
    if (categoryNames.length === 0) {
        alert('Nenhuma categoria disponível!');
        return;
    }
    const chosenCategory = pickRandom(categoryNames);
    const items = loadedCategories[chosenCategory].items;
    const chosenItem = pickRandom(items);
    showCard(chosenCategory, chosenItem);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('new-card-button').addEventListener('click', newCard);
    newCard();
});
