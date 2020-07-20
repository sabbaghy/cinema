/*----------------------------------------------
   Variables Generales (Globales)
------------------------------------------------*/
const currentYear = new Date().getFullYear();
let lastFind = {'title' : '','year' : '','page' :'1'};
let arrayErrors = [];

document.addEventListener('DOMContentLoaded', ()=>{
   showInitialMovies();
});

const showInitialMovies = () =>{
   const initialMovies = ['superman', 'batman', 'star', 'harry', 'speed', 'hard', 'avengers', 'rocky','lego'];
   const i = Math.floor((Math.random() * initialMovies.length));
   lastFind.title = initialMovies[i];

   findMovies(lastFind.title, lastFind.year, lastFind.page);
}

/*----------------------------------------------------------------------------------------
   Funcion que busca las peliculas por titulo 
----------------------------------------------------------------------------------------*/
const findMovies = (name,year,page) => {
   const buscar = `?s=${name}&type=movie&y=${year}&page=${page}`
   const url = `http://www.omdbapi.com/${buscar}&apikey=c52b4a65`;

   fetch(url)
      .then(response => response.json())
      .then(data => {
         if (data.Response === 'True'){
            if (data.totalResults > 0) {
               showMovies((data.Search));
            }
         }
      })
      .catch(err => console.log('se produjo un error ', err));
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
         </div>`
   });
}

// validar correo
const validateEmail = (email) => {
   const emailRegex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

   if(emailRegex.test(email)){return true;}
   else{return false;}
}

/*--------------------------------------------------------------------------------
   Al hacer click en login o registrarse o el el texto se activa la ventana modal
----------------------------------------------------------------------------------*/
// muestra la ventana de registor (modal)
const users = document.getElementById('users'); // es el ul con las opciones de login - logout - register
const linkLogin = document.getElementById('link-login');  // es el texto intermitente donde se invita a ingresar
const main = document.getElementById('main');  //es toda la pantalla modal

// si hace click en alguno de los iconos de ingreso o registro
users.addEventListener('click', ()=>{
   main.classList.add('main--show');
});

// si hace click eel texto intermitente donde se invita a ingresar
linkLogin.addEventListener('click', (e)=>{
   e.preventDefault();
   main.classList.add('main--show');
});

// si hace click para salir de la ventana modal
main.addEventListener('click', (e)=>{
   if(e.target.classList.contains('main')){
      main.classList.remove('main--show');
   }
});

/*   Fin de la ventana  modal  */


/*-----------------------------------------------------------------------
   Seccion donde se hace el swich entre login y registro
------------------------------------------------------------------------*/

const signUpBtn = document.getElementById('sign-up');
const signInBtn = document.getElementById('sign-in');
const signUpContainer = document.getElementById('sign-up-container');
const signInContainer = document.getElementById('sign-in-container');
const overlayLeft = document.getElementById('overlay-left');
const overlayRight = document.getElementById('overlay-right');

signUpBtn.addEventListener('click', ()=>{
   signInContainer.classList.remove('active');  //quita la capa de la derecha
   signUpContainer.classList.add('active');  //agrega la capa de la izquierda
   overlayLeft.classList.add('active');  //agrega la capa de la izquierda
   overlayRight.classList.remove('active');  //quita la capa de la izquierda
});

signInBtn.addEventListener('click', ()=>{
   signInContainer.classList.add('active');  //quita la capa de la derecha
   signUpContainer.classList.remove('active');  //agrega la capa de la izquierda
   overlayLeft.classList.remove('active');  //agrega la capa de la izquierda
   overlayRight.classList.add('active');  //quita la capa de 
});

/* fin Seccion donde se hace el swich entre login y registro */

/*------------------------------------------------------------------
   En la seccion Login -- Se valida que el usuario exista y 
   se carga la pagina inicial del usuario cuando es valido
-------------------------------------------------------------------*/
// validar ingreso de usuario
const signLogin = document.getElementById('signin-form');
const nameLogin = document.getElementById ('name-signin');
const passLogin = document.getElementById ('password-signin'); 

// valida la informacion del usuario para hacer el login
signLogin.addEventListener('submit', (e) =>{
   e.preventDefault();
      noErrors = true;
      checkInputsLogin();
      if (noErrors){
         sessionStorage.setItem('sessionActive', nameLogin.value.trim());
         signLogin.reset();
         location.href = 'index.html';
      };
});


/*-----------------------------------------------------------------------------------
   En la seccion registrar un nuevo usuario Login -- Se valida que la informacion 
   para crear un nuevo usuario y se carga la pagina inicial del usuario
-------------------------------------------------------------------------------------*/
// validar creacion de un de usuario
const signUp = document.getElementById('signup-form');
const nameSignUp = document.getElementById ('name-signup');
const emailSignUp = document.getElementById ('email-signup');
const passSignUp = document.getElementById ('password-signup'); 
const passConf = document.getElementById ('passconf-signup'); 
let noErrors;

signUp.addEventListener('submit', (e) =>{
   e.preventDefault();
   noErrors = true;
   checkInputs();
   if (noErrors){
      const userInfo = {
      "userID": 0,
      "username": nameSignUp.value,
      "userEmail": emailSignUp.value,
      "userPass": passSignUp.value,
      "userFav" : [],
      };
      
      addUser(userInfo);
      sessionStorage.setItem('sessionActive', nameSignUp.value);
      signUp.reset();
      location.href = 'index.html';
   }
});

const checkInputs = () =>{
   const nameSignUpValue = nameSignUp.value.trim();
   const emailSignUpValue = emailSignUp.value.trim();
   const passSignUpValue = passSignUp.value.trim();
   const passConfValue = passConf.value.trim();

   if(nameSignUpValue === null || nameSignUpValue.length === 0 || /^\s+$/.test(nameSignUpValue)){
      noErrors = false;
      setErrorFor(nameSignUp, 'Debe de indicar el nombre');
   } else{
      setSuccessFor(nameSignUp);
   }
   if(!validateEmail(emailSignUpValue)){
      noErrors = false;
      setErrorFor(emailSignUp, 'Debe de indicar un correo valido');
   } else{
      setSuccessFor(emailSignUp);
   }
   if(passSignUpValue === null || passSignUpValue.length === 0 || /^\s+$/.test(passSignUpValue)){
      noErrors = false;
      setErrorFor(passSignUp, 'La clave no es valida');
   } else{
      setSuccessFor(passSignUp);
   }
   if(passSignUpValue !== passConfValue){
      noErrors = false;
      setErrorFor(passConf, 'Las claves no coinciden');
   } else{
      setSuccessFor(passConf);
   }
}

const checkInputsLogin = () =>{
   const nameLoginValue = nameLogin.value.trim();
   const passLoginValue = passLogin.value.trim();

    if(nameLoginValue === null || nameLoginValue.length === 0 || /^\s+$/.test(nameLoginValue)){
      noErrors = false;
      setErrorFor(nameLogin, 'Debe de indicar el nombre');
   } else {
      const a = findUserId(nameLoginValue);
      if (!a) {
         noErrors = false;
         setErrorFor(nameLogin, 'Usuario No esta registrado');
      } else {
         setSuccessFor(nameLogin);
         if(a.userPass !== passLoginValue){
            noErrors = false;
            setErrorFor(passLogin, 'Credenciales no invalidas');
         } else{
            setSuccessFor(passLogin);
         }
      }
   }
}

const setErrorFor = (input, msg)=>{
   const formCtrl = input.parentElement;
   const span = formCtrl.querySelector('span');
   formCtrl.className = 'form-control warning';
   span.innerText =  msg;
}

const setSuccessFor = (input)=>{
   const formCtrl = input.parentElement;
   const span = formCtrl.querySelector('span');
   formCtrl.className ='form-control success';
}

//agrega el usuario a la base de datos (localstorage)
const addUser = (userInfo)=>{``
   // find next userID from local storage
   let nextUserId = localStorage.getItem('nextUserId') || 0 ;
   nextUserId ++;
   userInfo.userID = nextUserId;
   localStorage.setItem(`user-${userInfo.username}`,JSON.stringify(userInfo));
   localStorage.setItem('nextUserId', nextUserId);

}

const findUserId = (user) => {
   // busca el usuario en la bd (localstorage)
   // localStorage.setItem(`user-${user}`, JSON.stringify(array));
   // const a = JSON.parse(localStorage.getItem(`user-${user}`));
   return JSON.parse(localStorage.getItem(`user-${user}`));
}