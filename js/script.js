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
    ricerca: ""
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

        this.getMovies();
      }
    },

    getMovies: function(){
      /*
      esempio richiesta
      https://api.themoviedb.org/3/search/movie?api_key=cd471903e138fa6aad2b7a7c8910d06f&language=it-IT&query=casa
      */
      let queryCompleta = `${this.apiFilm}api_key=${this.apiKey}&language=${this.language}&query=${this.query}`;

      axios.get(queryCompleta)
      .then(risposta => {
        console.log("Totale risultati: ", risposta.data.total_results);
        this.movies = risposta.data.results;
        console.log("Array risultati:", this.movies);
      });
    },

    getMovieDetails: function(movieID, datoRichiesto){
      /*
      esempio di richiesta
      https://api.themoviedb.org/3/movie/741074?api_key=cd471903e138fa6aad2b7a7c8910d06f
      */
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

    }
  }
})
