var app = new Vue({
  el: '#app',
  data: {
    // Api
    apiFilm: "https://api.themoviedb.org/3/search/movie?",
    apiDettagliFilm: "https://api.themoviedb.org/3/movie/",
    apiDettagliSerie: "https://api.themoviedb.org/3/tv/",
    apiSerie: "https://api.themoviedb.org/3/search/tv?",
    apiKey: "cd471903e138fa6aad2b7a7c8910d06f",
    query: "",
    language: "it-IT",
    // dati
    movies: [],
    series: [],
    // ricerca
    ricerca: "",
    pagineTotali: 0,
    paginaAttuale: 0,
    //info aggiuntive on hover
    cast: [],
    generi: [],
    // elenco generi
    moviesGeneri: [],
    seriesGeneri: [],
    // menu a tendina
    esploraMovies: false,
    esploraSeries: false,
    // valori menu a tendina
    moviesCheckboxes: {
      allSelected: false,
      noSelected: false
    },
    seriesCheckboxes: {
      allSelected: false,
      noSelected: false
    }
  },

  mounted: function () {
  this.$nextTick(function () {
      // Recupero elenco dei generi

      // Movies
      axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&${this.language}`)
      .then(risposta => {
        this.moviesGeneri = risposta.data.genres;
        // console.log("Generi film: ", this.moviesGeneri);

        // Aggiungo i generi a moviesCheckboxes o seriesCheckboxes
        this.moviesGeneri.forEach((genere, i) => {
          this.$set(this.moviesCheckboxes, genere.name, true);
        });
      });

      // Series
      axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${this.apiKey}&${this.language}`)
      .then(risposta => {
        this.seriesGeneri = risposta.data.genres;
        // console.log("Generi serie: ", this.seriesGeneri);

        // Aggiungo i generi a moviesCheckboxes o seriesCheckboxes
        this.seriesGeneri.forEach((genere, i) => {
          this.$set(this.seriesCheckboxes, genere.name, true);
        });
      });
  })},

  computed: {
    // Gestione output
    outputRicerca: function () {
      // Risultati non filtrati
      // return [...this.movies,...this.series];

      let moviesFiltred =
      this.movies.filter((movie) => {
        // se è selezionata la spunta escludi film
        if (this.moviesCheckboxes.noSelected) {
          return false;
        } else {
          // ottiene la lista generi numerica dei generi selezionati
          let lista = this.moviesGeneri.map((genere) =>{
            // se il genere ha la spunta su true lo mette nella lista
            if (this.moviesCheckboxes[genere.name]) {
              return genere.id;
            }
          });
          // ritorna l'item solo se almeno uno dei suoi generi è nella lista
          let corrispondenza = false;
          movie.genre_ids.forEach((genere, i) => {
            if (lista.includes(genere)) {
              corrispondenza = true;
            }
          });
          return corrispondenza === true || movie.genre_ids.length === 0;
        }

      });

      let seriesFiltred =
      this.series.filter((serie) => {
        // se è selezionata la spunta escludi serie Tv
        if (this.seriesCheckboxes.noSelected) {
          return false;
        } else {
          // ottiene la lista generi numerica dei generi selezionati
          let lista = this.seriesGeneri.map((genere) =>{
            // se il genere ha la spunta su true lo mette nella lista
            if (this.seriesCheckboxes[genere.name]) {
              return genere.id;
            }
          });
          // ritorna l'item solo se almeno uno dei suoi generi è nella lista
          let corrispondenza = false;
          serie.genre_ids.forEach((genere, i) => {
            if (lista.includes(genere)) {
              corrispondenza = true;
            }
          });
          return corrispondenza === true || serie.genre_ids.length === 0;
        }
      });

      return [...moviesFiltred,...seriesFiltred];

    }
  },

  methods: {

    avviaRicerca: function(){
      if (this.ricerca !== "") {
        // reset di questi campi
        this.pagineTotali = 0;
        this.paginaAttuale = 0;
        this.esploraMovies = false;
        this.esploraSeries = false;

        // l'api vuole "+" anzichè gli spazi, quindi li converto
        this.query = this.ricerca.replace(/ /g, "+");
        console.log("Ricerca: ", this.query);
        this.ricerca = "";

        // Interrogo l'Api (movies, series ecc)
        this.getMovies();
        this.getSeries();
      }
    },

    getMovies: function(page){

      // Se il parametro pagina non è specificato, mette 1 di default
      if (isNaN(page)) {
        page = 1;
      }

      axios.get(this.apiFilm, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        query: this.query,
        page: page
      }
      })
      .then(risposta => {
        console.log("Totale risultati film: ", risposta.data.total_results);
        console.log("Pagine totali film: ", risposta.data.total_pages);
        console.log("-------------------------------------------------");

        // Aggiunto la proprietà film o serie ai dati
        risposta.data.results.forEach((movie, i) => {
          this.$set(movie, "categoria", "movie");
        });

        this.paginaAttuale = page;
        if (risposta.data.total_pages > this.pagineTotali) {
          this.pagineTotali = risposta.data.total_pages;
        }
        this.movies = risposta.data.results;
      });

    },

    getSeries: function(page){
      // Se il parametro pagina non è specificato, mette 1 di default
      if (isNaN(page)) {
        page = 1;
      }

      axios.get(this.apiSerie, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        query: this.query,
        page: page
      }
      })
      .then(risposta => {
        console.log("Totale risultati serie: ", risposta.data.total_results);
        console.log("Pagine totali serie: ", risposta.data.total_pages);
        console.log("-------------------------------------------------");

        // Aggiunto la proprietà film o serie ai dati
        risposta.data.results.forEach((movie, i) => {
          this.$set(movie, "categoria", "serie");
        });

        this.paginaAttuale = page;
        if (risposta.data.total_pages > this.pagineTotali) {
          this.pagineTotali = risposta.data.total_pages;
        }
        this.series = risposta.data.results;
      });

    },

    nextPage: function() {
      if (this.paginaAttuale < this.pagineTotali) {
        this.getMovies(this.paginaAttuale + 1);
        this.getSeries(this.paginaAttuale + 1);
      }
    },

    prePage: function() {
      if (this.paginaAttuale > 1) {
        this.getMovies(this.paginaAttuale - 1);
        this.getSeries(this.paginaAttuale - 1);
      }
    },

    rating: function(rated) {
      let stars = 5 * (rated / 10);
      if (stars === 0) {
        return stars;
      } else {
        return Math.ceil(stars);
      }
    },

    showMoreInfo: function(movieDATA){
      // console.log("ID:", movieDATA.id);
      // console.log("Tipo", movieDATA.categoria);
      queryDettagliFilm = `${this.apiDettagliFilm}${movieDATA.id}?api_key=${this.apiKey}&${this.language}&append_to_response=credits`;
      queryDettagliSerie = `${this.apiDettagliSerie}${movieDATA.id}?api_key=${this.apiKey}&${this.language}&append_to_response=credits`;

      let indirizzo;

      if (movieDATA.categoria === "movie") {
        indirizzo = queryDettagliFilm;
      } else if (movieDATA.categoria === "serie") {
        indirizzo = queryDettagliSerie;
      }

      axios.get(indirizzo)
      .then(risposta => {
        // Estrapolo i generi
        let generi = risposta.data.genres.map((genere) => {
          return genere.name;
        });
        this.generi = generi;
        // console.log("Generi: ", this.generi);
        // estrapolo il cast
        let cast = risposta.data.credits.cast.map((attore) => {
          if (attore.known_for_department === "Acting") {
            return attore.name;
          }
        });
        this.cast = cast;
        // console.log("Cast: ", this.cast);
      });

    },

    menuGeneri: function(target){
      if (target === "buttonEsploraMovies") {
        this.esploraMovies = !(this.esploraMovies);
        if (this.esploraSeries) {
          this.esploraSeries = false;
        }
      } else if (target === "buttonEsploraSeries") {
        this.esploraSeries = !(this.esploraSeries);
        if (this.esploraMovies) {
          this.esploraMovies = false;
        }
      }
    },

    chiudiMenu: function(){
      this.esploraSeries = false;
      this.esploraMovies = false;
    },

    filtroGeneri: function(moviesOrSeries, target){
        let selezione;
        let listaGeneri;
        if (moviesOrSeries === "movies") {
          selezione = this.moviesCheckboxes;
          listaGeneri = this.moviesGeneri;
        } else if (moviesOrSeries === "series") {
          selezione = this.seriesCheckboxes;
          listaGeneri = this.seriesGeneri;
        }

        // seleziona tutte le spunte solo se clicco sulla casella mostra tutti i film/series
        if ((target === "allMovies" || target === "allSeries") && selezione.allSelected === true) {
          // Setto true tutte le spunte
          listaGeneri.forEach((genere) => {
            selezione[genere.name] = true;
          });
          // Setto false "Escludi film/serie"
          selezione.noSelected = false;
        }
        // deseleziono tutte le spunte solo se clicco su escludi film/serie
        if ((target === "noMovies" || target === "noSeries") && selezione.noSelected === true) {
          // Setto false tutte le spunte
          listaGeneri.forEach((genere) => {
            selezione[genere.name] = false;
          });
          // Setto false "Tutti i film/serie"
          selezione.allSelected = false;
        }
    }

  }
})

// APPUNTI RICEZIONE DETERMINATI DATI DA API.
// DEVO SAPERE IN ANTICIPO SE L'ID APPARTIENE AD UN FILM O UNA SERIE

// MOVIES

// Esempio richiesta cast per movie
// https://api.themoviedb.org/3/movie/105/credits?api_key=cd471903e138fa6aad2b7a7c8910d06f&language=it-IT

// Richiesta dettagli + il cast in aggiunta
// https://api.themoviedb.org/3/movie/105?api_key=cd471903e138fa6aad2b7a7c8910d06f&language=it-IT&append_to_response=credits
// Attenzione che gli attori hanno la proprietà known_for_department": "Acting"

// TV
// Richiesta dettagli + il cast in aggiunta
// https://api.themoviedb.org/3/tv/4745?api_key=cd471903e138fa6aad2b7a7c8910d06f&language=it-IT&append_to_response=credits
