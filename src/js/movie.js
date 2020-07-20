let movieId = sessionStorage.getItem('movieId');

document.addEventListener('DOMContentLoaded', ()=>{
   const user = sessionActive(); 
   if (user){
      findMovieId(movieId);
   } else{
      location.href = 'login.html';
   } 
});   

// // Verifica que exista una sesion activa y valida
const sessionActive = () => {
   const currentURL = location;
   let sessionActive = sessionStorage.getItem('sessionActive') || 0;
   if ((currentURL.pathname === '/movie.html') && (sessionActive !== 0)) {
         return sessionActive;
   } else {
      return false;
   }
}

const findMovieId = (id)=> {

   const url = `http://www.omdbapi.com/?i=${id}&apikey=c52b4a65`;
     fetch(url)
      .then(response => response.json())
      .then(data => {
        showMovies((data));
      })
      .catch(err => console.log('se produjo un error ', err))
}


const showMovies = (movie)=>{
   const movieSelected = document.getElementById('movie-selected')
   const movieInfo = document.getElementById('movie-info')
   const posterDefault = '/assets/img/no-image-available.png'
   const posterShow = movie.Poster !== 'N/A'? movie.Poster : posterDefault;
   movieSelected.innerHTML = ` <img src="${posterShow}" alt="">`;
   movieInfo.innerHTML  = `
               <ul>
                  <li class="movie-detail-item">Titulo: <span class="movie-title">${movie.Title}</span></li>
                  <li class="movie-detail-item">Año: <span>${movie.Year}</span></li>
                  <li class="movie-detail-item">Clasificación: <span>${movie.Rated}</span></li>
                  <li class="movie-detail-item">Extrenp: <span>${movie.Released}</span></li>
                  <li class="movie-detail-item">Duración: <span>${movie.Runtime}</span></li>
                  <li class="movie-detail-item">Genero: <span>${movie.Gender}</span></li>
                  <li class="movie-detail-item">Director: <span>${movie.Director}</span></li>
                  <li class="movie-detail-item">Guionista: <span>${movie.Writer}</span></li>
                  <li class="movie-detail-item">Trama: <span>${movie.Plot}</span></li>
               </ul>`
}

const goBack = document.getElementById('goback');

goBack.addEventListener('click', (e) =>{
   e.preventDefault();
   location.href = 'index.html';
})

/* --------------------------------------------
   Si el usuario presione el boton de logout 
---------------------------------------------*/

const logout = document.getElementById('logout');
logout.addEventListener('click', (e) =>{
   e.preventDefault();
   sessionStorage.removeItem('sessionActive');
   sessionStorage.removeItem('lastFindDo');
   location.href = 'login.html';
});


/*-----------------------------------------------------------------
   Responsive Menu para la animacion y vista del main-nav en movil
-------------------------------------------------------------------*/
const toggleMenu = document.getElementById('toggle-menu');
const mainNav = document.getElementById('main-nav');
toggleMenu.addEventListener('click', ()=>{
   mainNav.classList.toggle('main-nav--show');
   toggleMenu.classList.toggle('toggle-menu--open');
})