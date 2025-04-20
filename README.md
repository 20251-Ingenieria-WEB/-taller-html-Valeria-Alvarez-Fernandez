# -taller-html-Valeria-Alvarez-Fernandez

## 👩‍💻 Autor

- **Nombre:** [Valeria Alvarez Fernandez]
- **Carrera:** Ingeniería de Sistemas / Taller #1
- **Proyecto académico:** Aplicación web usando PokéAPI

---

# 📘 Pokédex Web App

Este proyecto es una mini aplicación web que consume la [PokéAPI](https://pokeapi.co/) para mostrar información de Pokémon de forma dinámica e interactiva.

---

## 🌐 Tecnologías utilizadas

- HTML5
- CSS3 (Flexbox y Grid)
- JavaScript (vanilla)
- Fetch API
- PokéAPI

---

## 🚀 Funcionalidades principales

- Visualización de Pokémon organizados por clase.
- Opción "Todos" para ver todos los Pokémon con paginación para que no sea ostentoso ir biscando el pokemon.
- Buscador para encontrar Pokémon por nombre o número.
- Vista detallada de cada Pokémon con imagen oficial, tipos, habilidades, altura y peso.
- Interfaz responsive para distintos tamaños de pantalla.

---

## 📂 Estructura del proyecto

```
📁 pokedex-app/
├── index.html          # Página principal
├── styles.css          # Estilos visuales
├── app.js              # Lógica de la aplicación
└── README.md           # Documentación del proyecto
```

---

## 🧠 Detalles técnicos destacados

- El diseño inicial muestra solo los botones de tipo.
- Las tarjetas de Pokémon se muestran dinámicamente según el tipo elegido o al hacer clic en "Todos".
- Se utiliza `fetch()` para obtener datos de la PokéAPI.
- El sistema de paginación está implementado tanto para la vista "Todos" como para la vista por tipo.
- El buscador interpreta entradas por nombre o número.
- Se conserva la posición del scroll al ver detalles y volver atrás.

---

## 🔧 Posibles mejoras futuras

- Agregar animaciones al mostrar tarjetas.
- Mejorar el diseño móvil 
- Implementar una opción de favoritos.
- Usar un framework moderno como **React** o **Vue** para una versión avanzada.


