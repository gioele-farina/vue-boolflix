var app = new Vue({
  el: '#app',
  data: {
    // Api
    apiFilm: "https://api.themoviedb.org/3/search/movie?",
    apiDettagliFilm: "https://api.themoviedb.org/3/movie/",
    apiKey: "cd471903e138fa6aad2b7a7c8910d06f",
    query: "",
    language: "it-IT",
    // dati
    movies: [],
    // ricerca
    ricerca: "",
    pagineTotali: 0,
    paginaAttuale: 0
  },

  mounted: function () {
  this.$nextTick(function () {


  })},

  methods: {

    avviaRicerca: function(){
      if (this.ricerca !== "") {
        // l'api vuole "+" anzichè gli spazi, quindi li converto
        this.query = this.ricerca.replace(/ /g, "+");
        console.log("Ricerca: ", this.query);
        this.ricerca = "";

        // Interrogo l'Api
        this.getMovies();
      }
    },

    getMovies: function(page){
      /*
      esempio richiesta
      https://api.themoviedb.org/3/search/movie?api_key=cd471903e138fa6aad2b7a7c8910d06f&language=it-IT&query=casa
      */
      if (isNaN(page)) {
        page = 1;
      }

      let queryCompleta = `${this.apiFilm}api_key=${this.apiKey}&language=${this.language}&query=${this.query}&page=${page}`;

      axios.get(queryCompleta)
      .then(risposta => {
        console.log("Totale risultati: ", risposta.data.total_results);
        console.log("Pagine totali: ", risposta.data.total_pages);
        console.log("Pagina attuale: ", risposta.data.page);

        this.movies = risposta.data.results;
        this.pagineTotali = risposta.data.total_pages;
        this.paginaAttuale = risposta.data.page;
        // console.log("Array risultati:", this.movies);

        this.getMoviesMoreInfo();
      });
    },

    getMoviesMoreInfo: function(){
      // appende le informazioni aggiuntive
      /*
      esempio di richiesta
      https://api.themoviedb.org/3/movie/741074?api_key=cd471903e138fa6aad2b7a7c8910d06f
      */
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
    }

  }
})











/*
    getMovieDetails: function(movieID, datoRichiesto){
      esempio di richiesta
      https://api.themoviedb.org/3/movie/741074?api_key=cd471903e138fa6aad2b7a7c8910d06f
      let queryDettagli = `${this.apiDettagliFilm}${movieID}?api_key=${this.apiKey}`;

      axios.get(queryDettagli)
      .then(risposta => {
        // ritorna le lingue sotto forma di stringa
        if (datoRichiesto === "spoken_languages") {
          let lingue = "";
          risposta.data.spoken_languages.forEach((item, i) => {
            lingue += item.name + " ";
          });
          console.log(lingue);
          return lingue;
        // ritorna il dato richiesto
        } else {
          console.log(risposta.data[datoRichiesto]);
          return risposta.data[datoRichiesto];
        }

      });
    },
*/
