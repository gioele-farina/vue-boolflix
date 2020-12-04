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
    risultatiTotali: 0,
    //info aggiuntive on hover
    cast: [],
    generi: []
  },

  mounted: function () {
  this.$nextTick(function () {
    this.ricerca = "ritorno+al+futuro";
    this.avviaRicerca();
  })},

  computed: {
    // Gestione output
    outputRicerca: function () {
      return [...this.movies,...this.series];
    }
  },

  methods: {

    avviaRicerca: function(){
      if (this.ricerca !== "") {
        // reset di questi campi
        this.pagineTotali = 0;
        this.risultatiTotali = 0;
        this.movies = [];
        this.series = [];

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

      let pagineTotaliRicerca = 0;

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

        pagineTotaliRicerca = risposta.data.total_pages;
        this.movies = [...this.movies,...risposta.data.results];
        this.risultatiTotali += risposta.data.results.length;

        // Interrogo tutte le pagine per quella query
        for (let i = 1; i < pagineTotaliRicerca; i++) {
          console.log("chiamata ausiliaria", i+1);
          page++;
          axios.get(this.apiFilm, {
          params: {
            api_key: this.apiKey,
            language: this.language,
            query: this.query,
            page: page
          }
          })
          .then(risposta => {
            // Aggiunto la proprietà film o serie ai dati
            risposta.data.results.forEach((movie, i) => {
              this.$set(movie, "categoria", "movie");
            });

            this.movies = [...this.movies,...risposta.data.results];
            this.risultatiTotali += risposta.data.results.length;
          });
        }

      });

    },

    getSeries: function(page){
      // Se il parametro pagina non è specificato, mette 1 di default
      if (isNaN(page)) {
        page = 1;
      }

      let pagineTotaliRicerca = 0;

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

        pagineTotaliRicerca = risposta.data.total_pages;
        this.series = [...this.series,...risposta.data.results];
        this.risultatiTotali += risposta.data.results.length;

        // Interrogo tutte le pagine per quella query
        for (let i = 1; i < pagineTotaliRicerca; i++) {
          console.log("chiamata ausiliaria", i+1);
          page++;
          axios.get(this.apiFilm, {
          params: {
            api_key: this.apiKey,
            language: this.language,
            query: this.query,
            page: page
          }
          })
          .then(risposta => {
            // Aggiunto la proprietà film o serie ai dati
            risposta.data.results.forEach((movie, i) => {
              this.$set(movie, "categoria", "serie");
            });

            this.series = [...this.series,...risposta.data.results];
            this.risultatiTotali += risposta.data.results.length;
          });
        }

      });

    },

    nextPage: function() {
      if (this.paginaAttuale < this.pagineTotali) {
        console.log("pagina successiva");
        this.getMovies(this.paginaAttuale + 1);
      }
    },

    prePage: function() {
      if (this.paginaAttuale > 1) {
        console.log("pagina precedente");
        this.getMovies(this.paginaAttuale - 1);
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
      console.log("ID:", movieDATA.id);
      console.log("Tipo", movieDATA.categoria);
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
        console.log("Generi: ", this.generi);
        // estrapolo il cast
        let cast = risposta.data.credits.cast.map((attore) => {
          if (attore.known_for_department === "Acting") {
            return attore.name;
          }
        });
        this.cast = cast;
        console.log("Cast: ", this.cast);
      });

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
