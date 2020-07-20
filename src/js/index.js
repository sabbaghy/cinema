/*----------------------------------------------
   Variables Generales (Globales)
------------------------------------------------*/
const currentYear = new Date().getFullYear();
let lastFind = {'title' : '','year' : '','page' :'1'};
let arrayErrors = [];

document.addEventListener('DOMContentLoaded', ()=>{
   const user = sessionActive(); 
   if (user){
      showUserInfo(user);
      showInitialMovies();
   } else{
      location.href = 'login.html';
   } 
});   

// // Verifica que exista una sesion activa y valida
const sessionActive = () => {
   const currentURL = location;
   let sessionActive = sessionStorage.getItem('sessionActive') || 0;
   if ((currentURL.pathname === '/' || currentURL.pathname === '/index.html') && (sessionActive !== 0)) {
         return sessionActive;
   } else {
      return false;
   }
}

const showUserInfo = (user) => {
   const userInfo =  JSON.parse(localStorage.getItem('user-'+user));

   if(userInfo.userFav.length > 0 ){
      const favTitle = document.getElementById('fav-title')
      favTitle.innerHTML = `Las películas favoritas de ${user}`
      showFavSection(true);
      showMoviesFav(userInfo.userFav);
   } else {
      showFavSection(false);
   }
}

const showInitialMovies = () =>{

   const defaultFind = {'title' : '','year' : '','page' :'1'};

   if(JSON.parse(sessionStorage.getItem('lastFindDo') !== null)){
      lastFind = JSON.parse(sessionStorage.getItem('lastFindDo'));
   }

   if (lastFind.title === ''){
      const initialMovies = ['superman', 'batman', 'star', 'harry', 'speed', 'hard', 'avengers', 'rocky','lego'];
      const i = Math.floor((Math.random() * initialMovies.length));
      lastFind.title = initialMovies[i];
      sessionStorage.setItem('lastFindDo', JSON.stringify(lastFind));
   }
   
   processMovies(lastFind.title, lastFind.year, lastFind.page);
}

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

/*---------------------------------------------------------------------
Al dar click en buscar hace el querry a la app
----------------------------------------------------------------------*/
const searchForm = document.getElementById('search-form');
const searchTitle = document.getElementById ('search-title');
const searchYear = document.getElementById ('search-year'); 
const msgError = document.getElementById ('msg-error'); 
searchForm.addEventListener('submit', (e) =>{
   e.preventDefault();
   arrayErrors = [];
   msgError.innerHTML='';
   msgError.className = 'msg-error';
   
   checkInputsSearch();
   
   if (arrayErrors.length === 0){
      lastFind.title = searchTitle.value.trim();
      lastFind.year = searchYear.value.trim();
      lastFind.page = '1';

      sessionStorage.setItem('lastFindDo', JSON.stringify(lastFind));
      
      processMovies(lastFind.title,lastFind.year,lastFind.page) 

   } else{
         msgError.classList.add('msg-error--show');
         arrayErrors.forEach(error => {
         msgError.innerHTML += `<p>${error}</p>`;
      });
   };
});

/*----------------------------------------------------------------------------------------
   Funcion que busca las peliculas por titulo y otros criterios indicados en la busqueda
----------------------------------------------------------------------------------------*/

let current;
let result;
const amountMovies = document.getElementById('amount-movies');
const currentPages = document.getElementById('current-page');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

const processMovies = (title,year,page) => {
   current = page;

   const buscar = `?s=${title}&type=movie&y=${year}&page=${page}`
   const url = `http://www.omdbapi.com/${buscar}&apikey=c52b4a65`;
   
   findMovies(url).then( (cant) => {
      result = cant;
      if(result === 0 ){
         msgError.classList.add('msg-error--show');
         msgError.innerHTML = `<p> No hay registros para el criterio de busqueda indicado</p>`;
      }
      else {
         amountMovies.innerHTML = `hay ${result} movie `
         currentPages.innerHTML = ` Estas en la paginas ${page} `
      }
   })
}

const findMovies = (url) => {
   return new Promise((resolve, reject) => {
      fetch(url)
         .then(resFetch => resFetch.json())
         .then(data => {
            if(data.Response === 'True') {
               showMovies((data.Search));
               resolve(data.totalResults)
            } else {
               resolve(0)
            }
         // .catch {
         //    reject(console.log('No hay peliculas con ese criterio de busqueda'))
         // }
      })
            // .catch(console.log(` no hay peliculas`))
   })
}

/*---------------------------------------------------------------------------
   Busca una pelicual por el ID ( Esta funcion se en la ventana de detallemo)
----------------------------------------------------------------------------*/
const findMovieId = (id)=> {
   const url = `http://www.omdbapi.com/?i=${id}&apikey=c52b4a65`;
     fetch(url)
      .then(response => response.json())
      .then(data => {
         document.getElementById('modal-fav').innerHTML = `
               <h3> ${data.Title} se agregó a la lista de favoritos</h3>`
      })
      .catch(err => console.log('se produjo un error ', err))
}

/*-----------------------------------------------------------------------
   Muestar las peliculas en las tarjetas (resultado de la busqueda)
------------------------------------------------------------------------*/
const showMovies = (movies)=>{
   const movieList = document.getElementById('movies')
   const posterDefault = '/assets/img/no-image-available.png'
   let posterShow = '/assets/img/no-image-available.png'
   movieList.innerHTML ='';
   movies.forEach(movie => {
      posterShow = movie.Poster !== 'N/A'? movie.Poster : posterDefault;
      movieList.innerHTML  += `
         <div class="movies-card">
            <img src="${posterShow}" alt="" class="movie-img">
            <div class="movie-info">
               <div class="action-btn">
                  <a onclick="movieSelected('${movie.imdbID}')" class=" btn btn-detail" href="movie.html">Ver Detalle</a>
                  <p onclick="addFav('${movie.imdbID}')" class=" btn btn-fav">Add <i class="far fa-heart"></i></p>
               </div>
            </div>
         </div>`
   });
}

/*-------------------------------------------------------------------------
   Busca y muestra las pelicula del arreglo de favoritos del usuario
--------------------------------------------------------------------------*/
const showMoviesFav = (movies)=>{
   const movieList = document.getElementById('fav-movies')
   const posterDefault = '/assets/img/no-image-available.png'
   let posterShow = '/assets/img/no-image-available.png'

   movieList.innerHTML ='';
   movies.forEach(movie => {
      const url = `http://www.omdbapi.com/?i=${movie}&apikey=c52b4a65`;
      fetch(url)
         .then(response => response.json())
         .then(data => {
            posterShow = data.Poster !== 'N/A'? data.Poster : posterDefault;
            movieList.innerHTML  += `
               <div class="movies-card">
                  <img src="${posterShow}" alt="" class="movie-img">
                   <div class="movie-info">
                     <div class="action-btn">
                        <a onclick="movieSelected('${data.imdbID}')" class=" btn btn-detail" href="movie.html">Ver Detalle</a>
                     </div>
                  </div>
               </div>`
         })
         .catch(err => console.log('se produjo un error ', err))
   })
}

/*-----------------------------------------------------------------
 Cuando se presiona en el boton de agregar a favorito o en detalle
 ----------------------------------------------------------------*/
const movieSelected = (id)=>{
   sessionStorage.setItem('movieId', id); 
}

/*-----------------------------------------------------
   agregar a favoritos
------------------------------------------------------*/
const addFav = (id)=>{
   const user = sessionActive();
   const userInfo =  JSON.parse(localStorage.getItem('user-'+user));
   userInfo.userFav.push(id);
   localStorage.setItem(`user-${userInfo.username}`,JSON.stringify(userInfo));
   
   const favTitle = document.getElementById('fav-title')
   favTitle.innerHTML = `Las películas favoritas de ${userInfo.username}`
   showMoviesFav(userInfo.userFav);

   findMovieId(id); 
   const modalFav = document.getElementById('modal-fav');
   modalFav.classList.add('modal-fav--show');

   modalFav.addEventListener('click', (e)=>{

      if((e.target.classList.contains('modal-fav'))){
         modalFav.classList.remove('modal-fav--show');
         showFavSection(true);
      }
   });
}

// // si no hay favoritos no se debe mostrar la section favorite
const showFavSection = (switchSection)=>{

   const favSection = document.getElementById('favorite')
      switchSection ? favSection.classList.add('fav-show') : favSection.classList.remove('fav-show')
}

/* ----------------------------------------------------------------
   valida los datos de la busqueda
-------------------------------------------------------------------*/
const checkInputsSearch = () =>{
   const searchTitleValue = searchTitle.value.trim();
   const searchYearValue = searchYear.value.trim();

   if(searchTitleValue === null || searchTitleValue.length === 0 ){
      arrayErrors.push('Debe de indicar el Titulo de la pelicula');
   }
   
   if(searchYearValue.length > 0){
      if(isNaN(searchYearValue)  || !(/^\d{4}$/.test(searchYearValue))) {
         arrayErrors.push('el año debe ser numero entero > 999');
      } else {
         if(searchYearValue > currentYear){
            arrayErrors.push(`el año debe ser menor o igual a ${currentYear}`);
         }
      }
   }
}

/*-----------------------------------------------------------------
   Responsive Menu para la animacion y vista del main-nav en movil
-------------------------------------------------------------------*/
const toggleMenu = document.getElementById('toggle-menu');
const mainNav = document.getElementById('main-nav');
toggleMenu.addEventListener('click', ()=>{
   mainNav.classList.toggle('main-nav--show');
   toggleMenu.classList.toggle('toggle-menu--open');
})

prev.addEventListener('click', () => {
   lastFind = JSON.parse(sessionStorage.getItem('lastFindDo'))
   current = lastFind.page;
   current--;
   if( current > 0 ){
      lastFind.page = current;
      sessionStorage.setItem('lastFindDo', JSON.stringify(lastFind));
      processMovies(lastFind.title,lastFind.year,lastFind.page) 

   }
})

next.addEventListener('click', (e) => {
   lastFind = JSON.parse(sessionStorage.getItem('lastFindDo'))
   current = lastFind.page;
   if( current * 10 < result ){
      current++;
      lastFind.page = current;
      sessionStorage.setItem('lastFindDo', JSON.stringify(lastFind));
      processMovies(lastFind.title,lastFind.year,lastFind.page) 

   }
})