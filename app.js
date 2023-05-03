let pagina = 1;
let pelicula='';
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

btnSiguiente.addEventListener('click', () => {
	if(pagina < 1000){
		pagina += 1;
		cargarPeliculas();
	}
});

btnAnterior.addEventListener('click', () => {
	if(pagina > 1){
		pagina -= 1;
		cargarPeliculas();
	}
});

const cargarPeliculas = async() => {
	try {
		const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`);

		if(respuesta.status === 200){
			const datos = await respuesta.json();
			
			let peliculas = '';
			datos.results.forEach(pelicula => {
				peliculas += `
					<div class="pelicula">
						<img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
						<h3 class="titulo">${pelicula.title}</h3>
					</div>
				`;
				const pagina=document.querySelector('#numPag')
				pagina.innerHTML=`${datos.page}`
			});

			const pagina=document.querySelector('#numPag')
			pagina.innerHTML=`${datos.page}`

			document.getElementById('contenedor').innerHTML = peliculas;

			let datosPeliculas = JSON.stringify(datos);

			localStorage.setItem('peliculas', datosPeliculas);

		} else if(respuesta.status === 401){
			console.log('Pusiste la llave mal');
		} else if(respuesta.status === 404){
			console.log('La pelicula que buscas no existe');
		} else {
			console.log('Hubo un error y no sabemos que paso');
		}

	} catch(error){
		console.log(error);
	}

}

const cargarSelectGenero = async() => {
	try {
		const respuesta = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=6a6033037b480b67f52b2cb780b8e3a2&language=en-US`);
	
	
		// Si la respuesta es correcta
		if(respuesta.status === 200){
			const datos = await respuesta.json();
			
			const select=document.querySelector('#genero');
			const itemStart= document.createElement('option');
			itemStart.innerHTML='Selecione un item';
			itemStart.selected;
			itemStart.value=0;
			select.appendChild(itemStart);
			console.log(datos);
			datos.genres.forEach(element => {
				const item = document.createElement('option');
           		item.value = element.id;
            	item.innerHTML = element.name
            	select.appendChild(item);
			});

			console.log(pelicula);
			cargarPeliculasGenero();

		} else if(respuesta.status === 401){
			console.log('Pusiste la llave mal');
		} else if(respuesta.status === 404){
			console.log('La pelicula que buscas no existe');
		} else {
			console.log('Hubo un error y no sabemos que paso');
		}

	} catch(error){
		console.log(error);
	}

}


function cargarPeliculasGenero(){
	
	const select=document.querySelector('#genero');
	select.addEventListener('click',(e)=>{
		let pelis='';
		document.getElementById('contenedor').innerHTML='';
		let peliculas=JSON.parse(localStorage.getItem('peliculas'))
		localStorage.setItem('target',e.target.value);
		peliculas.results.forEach(element => {
			if(element.genre_ids.includes(parseInt(localStorage.getItem('target')))){
				console.log(element.title);
				pelis+=`
				<div class="pelicula">
					<img class="poster" src="https://image.tmdb.org/t/p/w500/${element.poster_path}">
					<h3 class="titulo">${element.title}</h3>
				</div>
			`;
			}else if(e.target.value==0){
				cargarPeliculas();
			}
		});		
		document.getElementById('contenedor').innerHTML = pelis;		
	})

}



cargarPeliculasGenero();
cargarSelectGenero();

cargarPeliculas();