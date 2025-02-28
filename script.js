document.addEventListener("DOMContentLoaded", () => {
    const mediaList = {
        series: [
            {
                id: 1399, // ID da série
                type: 'tv', // Tipo (tv ou movie)
                driveLink: "https://t.me/yourserieslink", // Link do Telegram da série inteira
                seasons: [
                    {
                        season: 1,
                        episodes: [
                            { episode: 1, driveLink: "https://t.me/yourseason1episode1" }, // Episódio 1
                            { episode: 2, driveLink: "https://t.me/yourseason1episode2" }  // Episódio 2
                        ]
                    },
                    {
                        season: 2,
                        episodes: [
                            { episode: 1, driveLink: "https://t.me/yourseason2episode1" }, // Episódio 1
                        ]
                    }
                ]
            }
        ],
        movies: [
            {
                id: 12345, // ID do filme
                type: 'movie', // Tipo (tv ou movie)
                driveLink: "https://t.me/yourmovieLink", // Link do Telegram do filme
            }
        ]
    };

    const mediaContainer = document.getElementById("media-list");
    if (!mediaContainer) {
        console.error("Elemento 'media-list' não encontrado!");
        return;
    }

    // Função para buscar as informações do filme ou série via API
    async function fetchMediaDetails(id, type) {
        try {
            const apiKey = '6fef90efb83322056c9bf84cdde87872'; // Substitua pela sua chave da API
            const response = await fetch(https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=pt-BR);
            const data = await response.json();

            if (data.errors) {
                console.error('Erro ao buscar dados:', data.errors);
                return null;
            }

            return {
                title: data.title || data.name,
                image: https://image.tmdb.org/t/p/w500${data.poster_path},
                backdrop: https://image.tmdb.org/t/p/w1280${data.backdrop_path},
                description: data.overview,
                releaseDate: data.release_date || data.first_air_date,
                voteAverage: data.vote_average,
                genres: data.genres.map(g => g.name).join(', '),
                runtime: data.runtime ? ${data.runtime} min : 'Não disponível'
            };
        } catch (error) {
            console.error("Erro ao fazer a requisição à API:", error);
            return null;
        }
    }

    // Função para criar um card de filme ou série
    async function createMediaCard(media) {
        const mediaDetails = await fetchMediaDetails(media.id, media.type);

        if (!mediaDetails) {
            console.error("Não foi possível obter os detalhes para o media id:", media.id);
            return;
        }

        const card = document.createElement("div");
        card.classList.add("card");

        const img = document.createElement("img");
        img.src = mediaDetails.image;
        card.appendChild(img);

        const info = document.createElement("div");
        info.classList.add("card-info");

        const title = document.createElement("h3");
        title.innerText = mediaDetails.title;
        info.appendChild(title);

        const button = document.createElement("button");
        button.innerText = "Assistir";
        button.onclick = function () {
            window.location.href = detalhe.html?id=${media.id}&type=${media.type};
        };
        info.appendChild(button);

        card.appendChild(info);
        mediaContainer.appendChild(card);
    }

    // Criar cards para séries
    mediaList.series.forEach(series => {
        createMediaCard(series);
    });

    // Criar cards para filmes
    mediaList.movies.forEach(movie => {
        createMediaCard(movie);
    });
});