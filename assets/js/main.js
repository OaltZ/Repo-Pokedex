// Arquivo: main.js
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
    return pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
        return pokemons; // Retornar os Pokémon carregados
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

function openPokemonDetails(pokemon) {
    // Redirecionar para a página de detalhes do Pokémon
    window.open(`pokemon-detail.html?number=${pokemon.number}`, '_blank');
}

pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {
        const pokemonNumber = clickedPokemon.querySelector('.number').textContent.slice(1); // Remova o '#' do número
        loadPokemonItems(0, maxRecords).then((pokemons) => { // Carregar todos os Pokémon para encontrar o clicado
            const pokemon = pokemons.find(p => p.number === parseInt(pokemonNumber));
            if (pokemon) {
                openPokemonDetails(pokemon);
            }
        });
    }
});

// Função para lidar com o clique em um card de Pokémon
function handlePokemonClick(pokemon) {
    // Obtém os detalhes do Pokémon clicado
    pokeApi.getPokemonDetail(pokemon)
        .then((detailedPokemon) => {
            // Cria uma URL para os detalhes do Pokémon
            const pokemonDetailURL = `/pokemon-detail.html?number=${detailedPokemon.number}`;
            // Abre uma nova guia com os detalhes do Pokémon
            window.open(pokemonDetailURL, '_blank');
        })
        .catch((error) => {
            console.error('Erro ao carregar os detalhes do Pokémon:', error);
        });
}

// Função para adicionar evento de clique a cada card de Pokémon
function addClickEventToPokemonCards() {
    const pokemonCards = document.querySelectorAll('.pokemon');
    pokemonCards.forEach((card) => {
        card.addEventListener('click', () => {
            // Obtém o número do Pokémon clicado
            const pokemonNumber = parseInt(card.querySelector('.number').innerText.slice(1), 10);
            // Cria um objeto Pokémon com o número
            const pokemon = new Pokemon();
            pokemon.number = pokemonNumber;
            // Manipula o clique no card de Pokémon
            handlePokemonClick(pokemon);
        });
    });
}

// Chama a função para adicionar evento de clique a cada card de Pokémon
addClickEventToPokemonCards();