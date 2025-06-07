let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                    console.log(datos)
                    let tags = '';
    
                    datos.genres.forEach((genre, index) => {
                        if (index > 2) {
                            return
                        }
                        tags += `${genre.name},`          

                    });

                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
                        <li>
                        <a href="#!" class="episode" 
                        option-1-lang="Lat"
                        option-1-server="HD"
                        option-1-url=""
                        >
                        <div class="episode__img">
                        <img src="https://image.tmdb.org/t/p/w300${episode.still_path}" onerror="this.style='display:none';">
                        <div class="episode__no-image"><i class="fa-regular fa-circle-play"></i></div>
                        </div>
                        <div class="epsiode__info">
                        <h4 class="episode__info__title">${episode.episode_number} - ${episode.name}</h4>
                        <div class="episode__info__duration">${runtime}</div>
                        </div>
                        </a>
                        </li>
                        `
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = ``;
                    
                    let seasonOnly = `
                    <ul class="caps-grid hide" id="season-${seasonNumber}">
                    ${episodeList}
                    </ul><!--Siguiente temporada debajo-->
    
    
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                let tags = '';
                console.log(datos)


                datos.genres.forEach((genre, index) => {
                    if (index > 2) {
                        return
                    }
                    tags += `${genre.name},`          

                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${datos.title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  rel="stylesheet"
/>
<style>
  body {
    background: url('https://image.tmdb.org/t/p/w500/${datos.backdrop_path}')
      no-repeat center center fixed;
    background-size: cover;
  }
  .overlay {
    background-color: rgba(18, 18, 18, 0.85);
  }
</style>
</head>
<body class="text-white font-sans">
  <div class="overlay min-h-screen">
    <div class="max-w-4xl mx-auto p-4">
      <!-- Iframe Video -->
      <div
        class="rounded-md overflow-hidden relative aspect-video bg-black"
      >
        <iframe
          class="w-full h-full"
          src="__URL__"
          title="Video"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Movie Info Section -->
      <div
        class="flex space-x-4 mt-4 bg-[#1a1a1a] p-4 rounded-md"
      >
        <img
          alt="${datos.title}"
          class="rounded-lg flex-shrink-0"
          height="140"
          src="https://image.tmdb.org/t/p/w500/${datos.poster_path}"
          width="100"
        />
        <div class="flex-1 text-white">
          <h3 class="text-xl font-semibold">${datos.title}</h3>
          <p class="text-gray-300 italic text-sm">Publicado: Lz-1</p>
          <div
            class="flex flex-wrap items-center space-x-2 text-xs text-gray-400 mt-1"
          >
            ${datos.production_countries
              .map(
                (c) =>
                  `<span>${c.name}</span>`
              )
              .join(' ')}
            <span id="info-hours"></span>
            <span id="info-minutes">Mnts: ${datos.runtime}</span>
            <span>Año: ${datos.release_date.slice(0, 4)}</span>
          </div>

          <!-- Rating -->
          <div class="flex items-center mt-3 space-x-3">
            <div
              id="rating-value"
              class="bg-[#2a2a2a] rounded-md px-3 py-1 text-lg font-semibold text-white"
            >
              ${datos.vote_average.toFixed(1)}
            </div>
            <div
              id="star-container"
              class="flex space-x-1 text-yellow-400 text-lg"
            ></div>
          </div>

          <!-- Genres -->
          <div class="flex space-x-6 text-xs text-gray-400 mt-3">
            <span>${tags}</span>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex space-x-2 mt-4 relative">
        <!-- Botón Info -->
        <button
          id="info-btn"
          class="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold"
          type="button"
        >
          Info
        </button>

        <!-- Botón Reparto -->
        <button
          id="reparto-btn"
          class="bg-gray-700 text-gray-400 px-4 py-2 rounded text-sm font-semibold"
          type="button"
        >
          Reparto
        </button>

        <!-- Botón Favoritos -->
        <button
          id="fav-btn"
          class="bg-yellow-500 text-black px-4 py-2 rounded text-sm font-semibold"
          type="button"
        >
          Agregar a Favoritos
        </button>
      </div>

      <!-- Sinopsis -->
      <div
        id="sinopsis"
        class="mt-4 bg-[#1a1a1a] p-4 rounded-md"
      >
        <h4 class="text-white text-lg font-semibold mb-2">Sinopsis</h4>
        <p class="text-gray-300 text-sm leading-relaxed">
          ${datos.overview}
        </p>
      </div>

      <!-- Reparto (oculto inicialmente) -->
      <div
        id="reparto-section"
        class="mt-4 bg-[#1a1a1a] p-4 rounded-md hidden"
      >
        <h4 class="text-white text-lg font-semibold mb-2">Reparto</h4>
        <!-- Aquí deberías insertar el reparto dinámicamente -->
        <p class="text-gray-300 text-sm">Reparto no disponible.</p>
      </div>
    </div>
  </div>

  <!-- JS para estrellas dinámicas -->
  <script>
    const rating = ${datos.vote_average.toFixed(1)};
    const starContainer = document.getElementById('star-container');
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;

    for (let i = 0; i < 5; i++) {
      const star = document.createElement('i');
      if (i < fullStars) {
        star.className = 'fas fa-star text-yellow-400';
      } else if (i === fullStars && halfStar) {
        star.className = 'fas fa-star-half-alt text-yellow-400';
      } else {
        star.className = 'fas fa-star text-gray-400';
      }
      starContainer.appendChild(star);
    }

    document.getElementById('rating-value').innerText = rating.toFixed(1);

    const infoBtn = document.getElementById('info-btn');
    const repartoBtn = document.getElementById('reparto-btn');
    const sinopsis = document.getElementById('sinopsis');
    const repartoSection = document.getElementById('reparto-section');

    function setActive(button) {
      infoBtn.classList.remove('bg-red-600', 'text-white');
      infoBtn.classList.add('bg-gray-700', 'text-gray-400');

      repartoBtn.classList.remove('bg-red-600', 'text-white');
      repartoBtn.classList.add('bg-gray-700', 'text-gray-400');

      button.classList.remove('bg-gray-700', 'text-gray-400');
      button.classList.add('bg-red-600', 'text-white');
    }

    infoBtn.addEventListener('click', () => {
      setActive(infoBtn);
      sinopsis.classList.remove('hidden');
      repartoSection.classList.add('hidden');
    });

    repartoBtn.addEventListener('click', () => {
      setActive(repartoBtn);
      sinopsis.classList.add('hidden');
      repartoSection.classList.remove('hidden');
    });

    // Botón Favoritos (con toggle)
    const favBtn = document.getElementById('fav-btn');
    const favKey = 'fav-' + '${datos.title}'.replace(/\s+/g, '_') + '-video-page';
    const favData = {
      id: favKey,
      title: '${datos.title}',
      year: ${datos.release_date.slice(0, 4)},
      poster: 'https://image.tmdb.org/t/p/w500/${datos.poster_path}',
      rating: ${datos.vote_average.toFixed(1)},
    };

    function updateFavButton() {
      const isFav = localStorage.getItem(favKey) !== null;
      if (isFav) {
        favBtn.innerText = 'Quitar de Favoritos';
        favBtn.classList.remove('bg-yellow-500', 'text-black');
        favBtn.classList.add('bg-red-600', 'text-white');
      } else {
        favBtn.innerText = 'Agregar a Favoritos';
        favBtn.classList.remove('bg-red-600', 'text-white');
        favBtn.classList.add('bg-yellow-500', 'text-black');
      }
    }

    // Cargar estado inicial
    updateFavButton();

    // Evento para alternar favorito
    favBtn.addEventListener('click', () => {
      const isFav = localStorage.getItem(favKey) !== null;
      if (isFav) {
        localStorage.removeItem(favKey);
      } else {
        localStorage.setItem(favKey, JSON.stringify(favData));
      }
      updateFavButton();
    });
  </script>

  <!-- Script separado para guardar la película en categorías -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const movieData = {
        titulo: '${datos.title}',
        poster: 'https://image.tmdb.org/t/p/w500/${datos.poster_path}',
        link: window.location.href,
        tipo: 'Movie',
        generos: ${JSON.stringify(datos.genres.map((g) => g.name))},
        rating: ${datos.vote_average.toFixed(1)},
      };

      let categorias =
        JSON.parse(localStorage.getItem('peliculasPorCategoria')) || {};

      movieData.generos.forEach((genero) => {
        if (!categorias[genero]) {
          categorias[genero] = [];
        }

        const yaExiste = categorias[genero].some(
          (p) => p.titulo === movieData.titulo
        );
        if (!yaExiste) {
          categorias[genero].push(movieData);
        }
      });

      localStorage.setItem('peliculasPorCategoria', JSON.stringify(categorias));
    });
  </script>
</body>
</html>
 

`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



