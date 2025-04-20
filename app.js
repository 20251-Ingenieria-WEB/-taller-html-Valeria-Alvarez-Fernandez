const API_BASE = 'https://pokeapi.co/api/v2';
const pokemonList = document.getElementById('pokemonList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const detailSection = document.getElementById('pokemonDetail');
const detailContent = document.getElementById('detailContent');
const backBtn = document.getElementById('backBtn');

let previousScrollPosition = 0;
let currentPage = 1;
let currentType = '';
const itemsPerPage = 15;
let allPokemonList = [];

// Escucha del botón de búsqueda
searchBtn.addEventListener('click', async () => {
  const term = searchInput.value.trim().toLowerCase();
  if (!term) return;

  pokemonList.innerHTML = '<p>Buscando...</p>';
  try {
    const res = await fetch(`${API_BASE}/pokemon/${term}`);
    if (!res.ok) throw new Error();
    const poke = await res.json();

    pokemonList.innerHTML = '';
    pokemonList.classList.add('single-pokemon');
    renderPokemonCard(poke);
    document.getElementById('pagination-controls').innerHTML = '';
  } catch {
    pokemonList.innerHTML = '<p>Pokémon no encontrado.</p>';
    pokemonList.classList.remove('single-pokemon');
  }
});

// Buscar con Enter
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});

let currentPageType = 1;  // Agregar página para cada tipo de Pokémon

// Mostrar Pokémon por tipo con paginación
async function loadByType(type) {
  pokemonList.innerHTML = '<p>Cargando...</p>';
  pokemonList.classList.remove('single-pokemon');

  try {
    const res = await fetch(`${API_BASE}/type/${type}`);
    const data = await res.json();

    // Guardamos todos los Pokémon de este tipo
    const allPokemonOfType = data.pokemon;
    
    // Calculamos la paginación
    const start = (currentPageType - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slice = allPokemonOfType.slice(start, end);

    // Fetching details of the Pokémon on the current page
    const promises = slice.map(p => fetch(p.pokemon.url).then(r => r.json()));
    const results = await Promise.all(promises);

    pokemonList.innerHTML = ''; // Limpiamos la lista
    results.forEach(poke => renderPokemonCard(poke));  // Renderizamos los Pokémon de la página actual

    renderPaginationControlsType(allPokemonOfType);  // Llamamos a la función de paginación
  } catch (error) {
    console.error(error);
    pokemonList.innerHTML = '<p>Error al cargar Pokémon por tipo.</p>';
  }
  
  pokemonList.scrollIntoView({ behavior: 'auto', block: 'start' });

}

// Función para los controles de paginación en cada tipo
function renderPaginationControlsType(allPokemonOfType) {
  const container = document.getElementById('pagination-controls');
  container.innerHTML = '';

  const totalPages = Math.ceil(allPokemonOfType.length / itemsPerPage);

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Anterior';
  prevBtn.disabled = currentPageType === 1;
  prevBtn.addEventListener('click', () => {
    currentPageType--;
    loadByType(currentType);  // Recargamos el tipo actual
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Siguiente';
  nextBtn.disabled = currentPageType === totalPages;
  nextBtn.addEventListener('click', () => {
    currentPageType++;
    loadByType(currentType);  // Recargamos el tipo actual
  });

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);
  pokemonList.parentNode.insertBefore(container, pokemonList);
}


// Mostrar todos los Pokémon con paginación
async function loadAllPokemon() {
  pokemonList.innerHTML = '<p>Cargando Pokémon...</p>';
  pokemonList.classList.remove('single-pokemon');
  detailSection.classList.remove('active');

  try {
    const res = await fetch(`${API_BASE}/pokemon?limit=1500`);
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
  pokemonList.classList.remove('single-pokemon');
  detailSection.classList.remove('active');

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const slice = allPokemonList.slice(start, end);

  const details = await Promise.all(
    slice.map(p => fetch(p.url).then(res => res.json()))
  );

  pokemonList.innerHTML = '';
  details.forEach(poke => renderPokemonCard(poke));

  renderPaginationControls();

  pokemonList.scrollIntoView({ behavior: 'auto', block: 'start' });

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
  pokemonList.parentNode.insertBefore(container, pokemonList);
}

// Renderizar una tarjeta de Pokémon
function renderPokemonCard(poke) {
  const div = document.createElement('div');
  div.className = 'pokemon-card';
  const types = poke.types.map(t => t.type.name).join(', ');

  div.innerHTML = `
    <img src="${poke.sprites.front_default}" alt="${poke.name}">
    <h3>#${poke.id} ${poke.name}</h3>
    <p><strong>Tipo:</strong> ${types}</p>
  `;

  div.addEventListener('click', () => {
    showPokemonDetail(poke);
  });

  pokemonList.appendChild(div);
}

// Mostrar detalles del Pokémon
function showPokemonDetail(poke) {
  previousScrollPosition = window.scrollY;
  pokemonList.style.display = 'none';
  detailSection.classList.add('active');

  detailContent.innerHTML = `
    <h2>${poke.name.toUpperCase()}</h2>
    <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}" />
    <p><strong>ID:</strong> ${poke.id}</p>
    <p><strong>Altura:</strong> ${poke.height / 10} m</p>
    <p><strong>Peso:</strong> ${poke.weight / 10} kg</p>
    <p><strong>Tipos:</strong> ${poke.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Habilidades:</strong> ${poke.abilities.map(a => a.ability.name).join(', ')}</p>
  `;
}

// Botón de volver
backBtn.addEventListener('click', () => {
  detailSection.classList.remove('active');
  pokemonList.style.display = 'grid';
  window.scrollTo({ top: previousScrollPosition, behavior: 'auto' });
});

// ✅ Agregamos eventos a los botones manuales
document.querySelectorAll('.type-btn').forEach(btn => {
  const type = btn.dataset.type;
  if (type) {
    btn.addEventListener('click', () => {
      currentType = type;  // Guardamos el tipo seleccionado
      currentPageType = 1; // Volvemos a la página 1 cada vez que cambiamos de tipo
      loadByType(type);  // Cargamos los Pokémon por el nuevo tipo seleccionado
    });
  } else if (btn.id === 'allBtn') {
    btn.addEventListener('click', () => {
      currentPage = 1;
      loadAllPokemon();  // Recargamos todos los Pokémon
    });
  }
});





  

  

  