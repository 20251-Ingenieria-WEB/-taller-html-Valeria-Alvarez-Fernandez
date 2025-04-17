const API_BASE = 'https://pokeapi.co/api/v2';
const typeButtons = document.getElementById('typeButtons');
const pokemonList = document.getElementById('pokemonList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentPage = 1;
const itemsPerPage = 20;
let allPokemonList = [];

// Generar botones de tipo y 'Todos'
async function loadTypes() {
  const res = await fetch(`${API_BASE}/type`);
  const data = await res.json();

  const allBtn = document.createElement('div');
  allBtn.className = 'type-btn';
  allBtn.innerHTML = `<img src="https://img.icons8.com/color/48/pokeball-2.png"/><span>Todos</span>`;
  allBtn.addEventListener('click', () => {
    currentPage = 1;
    loadAllPokemon();
  });
  typeButtons.appendChild(allBtn);

  data.results.forEach(type => {
    const btn = document.createElement('div');
    btn.className = 'type-btn';
    btn.innerHTML = `<img src="https://img.icons8.com/color/48/${type.name}.png"/><span>${type.name}</span>`;
    btn.addEventListener('click', () => loadByType(type.name));
    typeButtons.appendChild(btn);
  });
}

// Buscar por nombre o número
searchBtn.addEventListener('click', async () => {
  const term = searchInput.value.trim().toLowerCase();
  if (!term) return;

  pokemonList.innerHTML = '<p>Buscando...</p>';
  try {
    const res = await fetch(`${API_BASE}/pokemon/${term}`);
    if (!res.ok) throw new Error();
    const poke = await res.json();
    pokemonList.innerHTML = '';
    renderPokemonCard(poke);
    document.getElementById('pagination-controls').innerHTML = '';
  } catch {
    pokemonList.innerHTML = '<p>Pokémon no encontrado.</p>';
  }
});

// Buscar por nombre o número cuando se presiona Enter
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      searchBtn.click(); // Esto simula un clic en el botón de búsqueda
    }
  });
  

// Mostrar Pokémon por tipo
async function loadByType(type) {
  pokemonList.innerHTML = '<p>Cargando...</p>';
  try {
    const res = await fetch(`${API_BASE}/type/${type}`);
    const data = await res.json();

    const promises = data.pokemon.slice(0, 20).map(p => fetch(p.pokemon.url).then(r => r.json()));
    const results = await Promise.all(promises);

    pokemonList.innerHTML = '';
    results.forEach(poke => renderPokemonCard(poke));
    document.getElementById('pagination-controls').innerHTML = '';
  } catch (error) {
    console.error(error);
    pokemonList.innerHTML = '<p>Error al cargar Pokémon por tipo.</p>';
  }
}

// Mostrar todos con paginación
async function loadAllPokemon() {
  pokemonList.innerHTML = '<p>Cargando Pokémon...</p>';

  try {
    const res = await fetch(`${API_BASE}/pokemon?limit=150`);
    const data = await res.json();

    allPokemonList = data.results;
    renderPokemonPage(currentPage);
  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
    pokemonList.innerHTML = '<p>Error al cargar los Pokémon.</p>';
  }
}

async function renderPokemonPage(page) {
  pokemonList.innerHTML = '<p>Cargando página...</p>';

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const slice = allPokemonList.slice(start, end);

  const details = await Promise.all(
    slice.map(p => fetch(p.url).then(res => res.json()))
  );

  pokemonList.innerHTML = '';
  details.forEach(poke => renderPokemonCard(poke));

  renderPaginationControls();
}

function renderPaginationControls() {
  const container = document.getElementById('pagination-controls');
  container.innerHTML = '';

  const totalPages = Math.ceil(allPokemonList.length / itemsPerPage);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    currentPage--;
    renderPokemonPage(currentPage);
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Siguiente';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    currentPage++;
    renderPokemonPage(currentPage);
  });

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);
}

// Mostrar tarjeta
function renderPokemonCard(poke) {
  const div = document.createElement('div');
  div.className = 'pokemon-card';
  const types = poke.types.map(t => t.type.name).join(', ');

  div.innerHTML = `
    <img src="${poke.sprites.front_default}" alt="${poke.name}">
    <h3>#${poke.id} ${poke.name}</h3>
    <p><strong>Tipo:</strong> ${types}</p>
  `;
  pokemonList.appendChild(div);
}

// Cargar app
loadTypes();


  

  

  