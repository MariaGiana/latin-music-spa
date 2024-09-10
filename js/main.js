"use strict";
const url_canciones = "https://666474e8932baf9032ab21a1.mockapi.io/canciones";
let contenedor_principal = document.querySelector("main");
let pagina_actual_paginacion = 1;
let anio_filtrar = 0;
//-------------------------------------------------------------------
// modo noche
let tema_pantalla = document.querySelector("#tema_pantalla");
let body_noche = document.querySelector("body");
let tema_pantalla_sol = document.querySelector(".tema_pantalla_sol");
tema_pantalla.addEventListener("click", function () {
  body_noche.classList.add("oscuro");
  tema_pantalla.classList.add("ocultar_luna");
  tema_pantalla_sol.classList.add("mostrar_sol");
});
tema_pantalla_sol.addEventListener("click", function () {
  body_noche.classList.remove("oscuro");
  tema_pantalla.classList.remove("ocultar_luna");
  tema_pantalla_sol.classList.remove("mostrar_sol");
});
//menu hamburgesa
let btn_desplegar = document.querySelector("#menu_hamburgesa");
btn_desplegar.addEventListener("click", desplegar);
let menu_navegar = document.querySelector("nav");
function desplegar() {
  menu_navegar.classList.toggle("menu_desplegado");
}
//funciones de la barra de navegacion
let btn_tablas_home = document.querySelector("#home");
let btn_ampliar_info = document.querySelector("#info_extra");
let btn_formulario_contacto = document.querySelector("#formulario_contacto");
btn_tablas_home.addEventListener("click", cargar_portada);
btn_ampliar_info.addEventListener("click", traer_extra);
btn_formulario_contacto.addEventListener("click", cargar_formulario_contacto);

//-------------------------------------------------------------------
//cargar los distintos html
//traer html portada
async function cargar_portada() {
  anio_filtrar = 0;
  btn_tablas_home.classList.add("nav_seleccionado");
  btn_formulario_contacto.classList.remove("nav_seleccionado");
  btn_ampliar_info.classList.remove("nav_seleccionado");
  contenedor_principal.innerHTML = "Cargando...";
  let res = await fetch("contenedor_principal.html");
  try {
    if (res.ok) {
      let texto = await res.text();
      contenedor_principal.innerHTML = texto;
      //funciones de portada
      cargar_tabla();
      document
        .querySelector("#btn_agregar_varios")
        .addEventListener("click", cargar_varios);
      let agregar_nuevo = document.querySelector("#agregar_nuevo_top");
      agregar_nuevo.addEventListener("click", cargar_canciones);
      botones_filtro();
    } else {
      contenedor_principal.innerHTML = "No se pudo cargar la portada";
    }
  } catch (error) {
    contenedor_principal.innerHTML = "Error de conexión.........";
  }
}
//muestra el html con la informacion expandida
async function traer_extra() {
  btn_tablas_home.classList.remove("nav_seleccionado");
  btn_formulario_contacto.classList.remove("nav_seleccionado");
  btn_ampliar_info.classList.add("nav_seleccionado");
  contenedor_principal.innerHTML = "Cargando...";

  try {
    let res = await fetch("informacion_extendida.html");
    if (res.ok) {
      let texto = await res.text();
      contenedor_principal.innerHTML = texto;
    } else {
      contenedor_principal.innerHTML = "Error al cargar";
    }
  } catch (error) {
    contenedor_principal.innerHTML = "Error del servidor";
  }
}
//trae el html del formulario
async function cargar_formulario_contacto() {
  btn_tablas_home.classList.remove("nav_seleccionado");
  btn_formulario_contacto.classList.add("nav_seleccionado");
  btn_ampliar_info.classList.remove("nav_seleccionado");
  try {
    let res = await fetch("formulario_contacto.html");
    if (res.ok) {
      let texto = await res.text();
      contenedor_principal.innerHTML = texto;
      funciones_formulario_contacto();
    } else {
      contenedor_principal.innerHTML = "No se pudo cargar el formulario";
    }
  } catch (error) {
    contenedor_principal.innerHTML = "Error del servidor";
  }
}
//-------------------------------------------------------------------------------------------
//paginacion
async function botones_filtro() {
  let btn_siguiente = document.querySelector("#ver_siguiente");
  btn_siguiente.addEventListener("click", async function () {
    if (pagina_actual_paginacion < (await calcular_dimension()) / 10) {
      pagina_actual_paginacion++;
      cargar_tabla();
    }
  });
  let btn_anterior = document.querySelector("#ver_anterior");
  btn_anterior.addEventListener("click", function () {
    if (pagina_actual_paginacion > 1) {
      pagina_actual_paginacion--;
      cargar_tabla();
    }
  });
  let form_filtrar = document.querySelector("#filtrar_elementos");
  form_filtrar.addEventListener("submit", function (e) {
    e.preventDefault();
    let data = new FormData(form_filtrar);
    anio_filtrar = Number(data.get("anio_filtrar"));
    pagina_actual_paginacion = 1;
    cargar_tabla(pagina_actual_paginacion);
  });
  document
    .querySelector("#reiniciar_anio_filtrar")
    .addEventListener("click", function (e) {
      e.preventDefault();
      anio_filtrar = 0;
      form_filtrar.reset();
      cargar_tabla();
    });
}
async function calcular_dimension() {
  const url_ = new URL(url_canciones);
  url_.searchParams.append("anio", anio_filtrar);
  let notificacion = document.querySelector("#notificacion");
  let dimension = 0;
  try {
    let res = await fetch(url_);
    if (res.ok) {
      let objeto = await res.json();
      dimension = objeto.length;
    } else {
      notificacion.innerHTML = "Error al calcular dimension";
    }
  } catch (error) {
    notificacion.innerHTML = "Error del servidor";
  }
  limpiar_notifiaciones();
  return dimension;
}
//------------------------------------------------------------------------------------
// crear 3 item automaticos
async function cargar_varios() {
  let notificacion = document.querySelector("#notificacion");
  let agregados = [];
  for (let i = 0; i < 3; i++) {
    agregados.push({
      nombre: generar_nombre_aleatorio(),
      artista: generar_artista_aleatorio(),
      anio: generar_anio_aleatorio(),
    });
  }
  try {
    for (let item of agregados) {
      let res = await fetch(url_canciones, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        notificacion.innerHTML = "Creado con existo";
      } else {
        notificacion.innerHTML = "Error";
      }
    }
  } catch (error) {
    notificacion.innerHTML = "Error";
  }
  cargar_tabla();
  limpiar_notifiaciones();
}
function generar_nombre_aleatorio() {
  const nombres = [
    "Elenor Rugby",
    "Poesia Pura",
    "Jump",
    "Blue Moon",
    "Mystery",
    "La Bamba",
    "Not you, just me",
  ];
  return nombres[Math.floor(Math.random() * nombres.length)];
}
function generar_artista_aleatorio() {
  const artistas = [
    "Maria Carei",
    "Mimi Maura",
    "Los del fuego",
    "Beatles",
    "Queen",
    "Maroon 5",
  ];
  return artistas[Math.floor(Math.random() * artistas.length)];
}
function generar_anio_aleatorio() {
  const anioMin = 1970;
  const anioMax = 2024;
  return Math.floor(Math.random() * (anioMax - anioMin + 1)) + anioMin;
}
//---------------------------------------------------------------------
// generador del captcha
let aleatorio = Math.floor(Math.random() * 3 + 1);
function funciones_formulario_contacto() {
  document.querySelector("#imagen_captcha").src =
    "img/captcha" + aleatorio + ".jpg";
  let formCaptcha = document.querySelector("#mi_formulario");
  formCaptcha.addEventListener("submit", confirmar_captcha);
}
//confirmacion del captcha
function confirmar_captcha(e) {
  e.preventDefault();
  let nodoCaptcha = document.querySelector("#captcha");
  let btnVolver = document.querySelector(".volver_al_home");
  let clave = ["fAn3Bb", "t2h9qa", "dem7nb"];
  let form = document.querySelector("#mi_formulario");
  let formData = new FormData(form);
  let nombre = formData.get("nombre");
  let apellido = formData.get("apellido");
  let telefono = Number(formData.get("telefono"));
  let email = formData.get("email");
  let texto_ingresado = formData.get("texto_img");
  if (texto_ingresado == clave[aleatorio - 1]) {
    document.querySelector("#captcha_error").innerHTML = "";
    nodoCaptcha.innerHTML =
      "FELICIDADES! " +
      nombre +
      " " +
      apellido +
      " su información de contacto: " +
      telefono +
      ", " +
      email +
      " ,fue enviada exitosamente!";
    form.classList.add("ocultar_formulario");
    btnVolver.classList.add("volver_al_home_btn");
    btnVolver.addEventListener("click", cargar_portada);
  } else {
    document.querySelector("#captcha_error").innerHTML =
      "ERROR... vuelve a intentar";
  }
}

//----------------------------------------------------------------------------------------------------------
//muestra la tabla de recomendados por la gente
async function cargar_tabla() {
  let tabla = document.querySelector("#tabla_recomendados");
  tabla.innerHTML = "Cargando...";
  const url_ = new URL(url_canciones);
  url_.searchParams.append("anio", anio_filtrar);
  url_.searchParams.append("page", pagina_actual_paginacion);
  url_.searchParams.append("limit", 10);
  try {
    let response = await fetch(url_);
    if (response.ok) {
      let objeto = await response.json();
      tabla.innerHTML = "";
      for (let item of objeto) {
        tabla.innerHTML += `<tr>
                                        <td>${item.nombre}</td>
                                        <td>${item.artista}</td>
                                        <td>${item.anio}</td> 
                                        <td><img src="img/borrar.svg" id="btn_borrar" alt="editar" ></img></td>
                                        <td><img src="img/editar.svg" id="btn_editar" alt="editar" ></td>
                                    </tr>`;
      }
      funciones_botones(objeto);
    } else {
      tabla.innerHTML =
        "Error al cargar o el año que se desea filtrar no tiene canciones cargadas";
    }
  } catch (error) {
    tabla.innerHTML = "Error en repuesta del servidor";
  }
}
//----------------------------------------------------------------------------------------------------
//funciones que tienen los botones de la tabla recomendados
function funciones_botones(objeto) {
  let formulario_modificar = document.querySelector("#formulario_cargar");
  let btn_borrar = document.querySelectorAll("#btn_borrar");
  for (let pos = 0; pos < objeto.length; pos++) {
    btn_borrar[pos].addEventListener("click", function () {
      borrar_elemento(objeto[pos].id, objeto[pos].nombre);
    });
  }
  let btn_editar = document.querySelectorAll("#btn_editar");
  for (let pos = 0; pos < objeto.length; pos++) {
    btn_editar[pos].addEventListener("click", function () {
      formulario_modificar.classList.remove("form_oculto");
      formulario_modificar.classList.add("mostrar_form");
      editar_elemento(objeto[pos].id, objeto[pos]);
    });
  }
}
// borrar la cancion
async function borrar_elemento(id, nombre) {
  try {
    let res = await fetch(`${url_canciones}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notificacion.innerHTML = "Su cancion: " + nombre + "ha sido ELIMINADA!";
      cargar_tabla();
      limpiar_notifiaciones();
    }
  } catch (error) {
    notificacion.innerHTML = error;
  }
}
// edita el elemento seleccionado
function editar_elemento(id, cancion) {
  let formulario_modificar = document.querySelector("#formulario_cargar");
  formulario_modificar.querySelector("input[name='nombre']").value =
    cancion.nombre;
  formulario_modificar.querySelector("input[name='artista']").value =
    cancion.artista;
  formulario_modificar.querySelector("input[name='anio_creacion']").value =
    cancion.anio;

  formulario_modificar.addEventListener("submit", async function (event) {
    event.preventDefault();
    let data = new FormData(formulario_modificar);
    let item = {
      nombre: data.get("nombre"),
      artista: data.get("artista"),
      anio: Number(data.get("anio_creacion")),
    };
    try {
      let res = await fetch(`${url_canciones}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        notificacion.innerHTML =
          "Su cancion " + item.nombre + " se modifico con exito ";
        formulario_modificar.reset();
        cargar_tabla();
        limpiar_notifiaciones();
        formulario_modificar.classList.remove("mostrar_form");
        formulario_modificar.classList.add("form_oculto");
      }
    } catch (error) {
      notificacion.innerHTML = error;
    }
  });
}
//---------------------------------------------------------------------------------
//cargar una cancion nueva
function cargar_canciones() {
  let formulario_modificar = document.querySelector("#formulario_cargar");
  if (formulario_modificar.classList.contains("form_oculto")) {
    formulario_modificar.classList.remove("form_oculto");
    formulario_modificar.classList.add("mostrar_form");
  } else {
    formulario_modificar.classList.remove("mostrar_form");
    formulario_modificar.classList.add("form_oculto");
  }

  formulario_modificar.addEventListener("submit", async function (event) {
    event.preventDefault();
    let data = new FormData(formulario_modificar);
    let item = {
      nombre: data.get("nombre"),
      artista: data.get("artista"),
      anio: Number(data.get("anio_creacion")),
    };
    try {
      let res = await fetch(`${url_canciones}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        notificacion.innerHTML = "AGREGADO CON EXITO!";
        formulario_modificar.reset();
        cargar_tabla();
        limpiar_notifiaciones();
        formulario_modificar.classList.remove("mostrar_form");
        formulario_modificar.classList.add("form_oculto");
      }
    } catch (error) {
      notificacion.innerHTML = error;
    }
  });
}
//vacia el div que muestra lo que se realizo
function limpiar_notifiaciones() {
  let nodo_intervalo = 4;
  let tiempo = setInterval(function () {
    if (nodo_intervalo === 0) {
      clearInterval(tiempo);
      notificacion.innerHTML = "";
    }
    nodo_intervalo--;
  }, 1000);
}
//llamamos a la funcionesm que se deben cargar automaticamente
cargar_portada();
