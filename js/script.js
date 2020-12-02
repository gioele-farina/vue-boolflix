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
        console.log(this.ricerca);
        this.ricerca = "";
      }
    },

    getMovies: function(){

/*
      axios.get('')
      .then(risposta => {

      });
*/
    }

  }
})
