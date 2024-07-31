let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    // Muestra y oculta las secciones
    mostrarSeccion();
    // Cambiar la sección cuando se presionen los tabs
    tabs();
    // Agrega o quita los botones del paginador
    botonesPaginador();
    
    paginaSiguiente();
    paginaAnterior();

    // Consulta la API en el backend de PHP
    consultarAPI();

    nombreCliente(); // Obtener el nombre del cliente y lo añade a cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto
    seleccionarHora(); // Añade la hora de la cita en el objeto

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);

    seccion.classList.add('mostrar');

    // Quita la clase del tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', (e) => {
            paso = +e.target.dataset.paso;
            mostrarSeccion();
            botonesPaginador();
        })
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1) {
        paginaSiguiente.classList.remove('ocultar');
        paginaAnterior.classList.add('ocultar');
    } else if(paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function  paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI() {
    try {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios( servicios );
    } catch (error) {
        console.error(error);
    }
}

function mostrarServicios( servicios ) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = () => seleccionarServicio(servicio);

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio) {
    const divServicio = document.querySelector(`[data-id-servicio="${servicio.id}"]`);

    // Comprobar si un servicio ya fue agregado o quitado
    if(cita.servicios.some(agregado => agregado.id === servicio.id)) {
        // Eliminarlo
        cita.servicios = cita.servicios.filter( agregado => agregado.id !== servicio.id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Agregarlo
        cita.servicios = [...cita.servicios, servicio];    
        divServicio.classList.add('seleccionado');
    }
    // console.log(cita);
}

function nombreCliente() {
    cita.nombre = nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', (e) => {
        const dia = new Date(e.target.value).getUTCDay();
        
        if( [6, 0].includes(dia) ) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':')[0];
        
        if(hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora No Válida', 'error', '.formulario');
        } else {
            const alertaPrevia = document.querySelector('.alerta');
            if(alertaPrevia) {
                alertaPrevia.remove();
            }
            
            cita.hora = e.target.value;
            // console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que se generen más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Crear una alerta de error
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
        // Eliminar la alerta después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        // console.log('Hacen falta datos o servicios');
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);

        return
    }

    // Formatear el Div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios'
    resumen.appendChild(headingServicios)

    // Itenrando y mostrando los servicios
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P')
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })

    // Heading para cita en resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de la Cita'
    resumen.appendChild(headingCita)

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`

    // Formatear la fecha en español
    const fechaObj = new Date(fecha)
    const mes = fechaObj.getMonth()
    const dia = fechaObj.getDate() + 2
    const year = fechaObj.getFullYear()

    const fechaUTC = new Date( Date.UTC( year, mes, dia) )

    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    })

    console.log(fechaFormateada)

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

    // Boton para crear la cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Confirmar Cita';
    botonReservar.onclick = reservarCita

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar)
}

function reservarCita() {
    console.log('reservando la cita')
}