var app = new Vue({
  el: '#app',
  data: {
    // Api
    apiFilm: "https://api.themoviedb.org/3/search/movie?",
    apiDettagliFilm: "https://api.themoviedb.org/3/movie/",
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
    paginaAttuale: 0
  },

  mounted: function () {
  this.$nextTick(function () {
    this.ricerca = "fantozzi";
    this.avviaRicerca();
  })},

  computed: {
    // successivamente posso usarla per aggiungere cose all'output
    outputRicerca: function () {
      return [...this.movies,...this.series];
    }
  },

  methods: {

    avviaRicerca: function(){
      if (this.ricerca !== "") {
        // reset di questo campo
        this.pagineTotali = 0;

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
        console.log("Totale risultati: ", risposta.data.total_results);
        console.log("Pagine totali film: ", risposta.data.total_pages);
        console.log("Pagina attuale: ", risposta.data.page);

        this.movies = risposta.data.results;
        // Serve per mostrare il numero maggiore di pagine, fra film e serie
        if (risposta.data.total_pages > this.pagineTotali) {
          this.pagineTotali = risposta.data.total_pages;
        }
        this.paginaAttuale = risposta.data.page;
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
        console.log("Totale risultati: ", risposta.data.total_results);
        console.log("Pagine totali serie: ", risposta.data.total_pages);
        console.log("Pagina attuale: ", risposta.data.page);

        this.series = risposta.data.results;
        // Serve per mostrare il numero maggiore di pagine, fra film e serie
        if (risposta.data.total_pages > this.pagineTotali) {
          this.pagineTotali = risposta.data.total_pages;
        }
        this.paginaAttuale = risposta.data.page;
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
    }

  }
})

/*
getMoviesMoreInfo: function(){
  // DA MODIFICARE AL MOMENTO NON ATTIVA
  // appende le informazioni aggiuntive
  // esempio di richiesta
  // https://api.themoviedb.org/3/movie/741074?api_key=cd471903e138fa6aad2b7a7c8910d06f

  let movieID;
  let queryDettagli;
  this.movies.forEach((movie, i) => {
    movieID = movie.id;
    queryDettagli = `${this.apiDettagliFilm}${movieID}?api_key=${this.apiKey}`;

    axios.get(queryDettagli)
    .then(risposta => {
      // movie.infoAggiuntive = risposta.data;
      this.$set(movie, "infoAggiuntive", risposta.data);
    });
  });
},
*/
