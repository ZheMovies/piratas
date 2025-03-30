document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const type = urlParams.get("type");

  if (!id || !type) {
    alert("ID ou Tipo de mídia não encontrado.");
    return;
  }

  const apiKey = '6fef90efb83322056c9bf84cdde87872';
  const mediaContainer = document.getElementById("media-details");

  async function fetchMediaDetails(id, type) {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR`);
      const data = await response.json();

      if (data.errors) {
        console.error('Erro ao buscar dados:', data.errors);
        alert("Não foi possível encontrar a mídia. Verifique o ID.");
        return null;
      }

      return {
        title: data.title || data.name,
        image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`,
        description: data.overview,
        releaseDate: data.release_date || data.first_air_date,
        voteAverage: data.vote_average,
        genres: data.genres.map(g => g.name).join(', '),
        runtime: data.runtime ? `${data.runtime} min` : 'Não disponível',
        seasons: data.seasons || []
      };
    } catch (error) {
      console.error("Erro ao fazer a requisição à API:", error);
      alert("Erro ao conectar à API. Verifique a conexão.");
      return null;
    }
  }

  async function populateDetails() {
    const mediaDetails = await fetchMediaDetails(id, type);

    if (!mediaDetails) {
      console.error("Não foi possível obter os detalhes para o media id:", id);
      return;
    }

    document.getElementById("media-title").textContent = mediaDetails.title;
    document.getElementById("media-description").textContent = mediaDetails.description;
    document.getElementById("media-release-date").textContent = mediaDetails.releaseDate;
    document.getElementById("media-vote-average").textContent = mediaDetails.voteAverage;
    document.getElementById("media-genres").textContent = mediaDetails.genres;
    document.getElementById("media-runtime").textContent = mediaDetails.runtime;
    document.getElementById("media-poster").src = mediaDetails.image;
    document.getElementById("media-backdrop").src = mediaDetails.backdrop;

    const watchButton = document.getElementById("media-watch-btn");
    watchButton.onclick = () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://drive.google.com/file/d/${id}/preview`;
      iframe.width = "100%";
      iframe.height = "500";
      iframe.frameBorder = "0";
      iframe.allowFullScreen = true;
      iframe.style.aspectRatio = "16/9";
      iframe.style.borderRadius = "10px";
      iframe.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      iframe.style.padding = "10px";
      document.body.appendChild(iframe);
    };

    if (mediaDetails.seasons.length > 0) {
      const seasonsContainer = document.getElementById("seasons");
      mediaDetails.seasons.forEach((season, index) => {
        const seasonButton = document.createElement("button");
        seasonButton.classList.add("season-btn");
        seasonButton.textContent = `Temporada ${season.season}`;
        seasonButton.onclick = () => {
          window.location.href = `detalhes.html?id=${id}&season=${season.season}&type=${type}`;
        };
        seasonsContainer.appendChild(seasonButton);
      });
    } else {
      document.getElementById("seasons").style.display = 'none';
    }
  }

  populateDetails();
});
