function limpiarSorteosExpirados() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    let monitoreo = JSON.parse(localStorage.getItem('monitoreoSorteos')) || [];
    
    // Filtramos los sorteos vigentes
    const sorteosVigentes = monitoreo.filter(item => {
        const fechaEvento = new Date(item.date);
        
        // Si la fecha del evento es MENOR que hoy, se elimina
        if (fechaEvento < hoy) {
            console.log(`Eliminando sorteo expirado: ${item.code}`);
            localStorage.removeItem(item.code); // Borra el sorteo real
            
            // Si era el sorteo activo en esta sesión, limpiarlo
            if(localStorage.getItem('lastActiveCode') === item.code)
            localStorage.setItem('lastActiveCode', JSON.stringify(code)); {
                localStorage.removeItem('lastActiveCode');
                localStorage.removeItem('activeEventTitle');
            }
            return false; // No incluir en la nueva lista de monitoreo
        }
        return true; // Mantener en monitoreo
    });

    // Actualizar la lista de monitoreo con solo los que quedan
    localStorage.setItem('monitoreoSorteos', JSON.stringify(sorteosVigentes));
}

// Ejecutar la limpieza al cargar la página
limpiarSorteosExpirados();

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre guardado en LocalStorage
    const usuarioLogueado = localStorage.getItem('userEmail');

    // Verificar si el usuario realmente pasó por el login
    if (!usuarioLogueado) {
        // Si no hay nadie logueado, regresar a login
        alert("Acceso denegado. Por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    // Ver nombre
    const userNameElement = document.getElementById('userName');
    userNameElement.innerText = `¡Hola, ${usuarioLogueado}!`;

    // Cargar datos ficticios del evento
    cargarDatos(usuarioLogueado);

    // Verificar sorteo previo
    verificarSorteoPrevio();

    // Cargar la lista de deseos si ya existía una guardada
    const savedWishlist = localStorage.getItem(`wishlist_${usuarioLogueado}`);
    if (savedWishlist) {
        document.getElementById('wishlistText').value = savedWishlist;
    }
});

// Función para guardar la lista de deseos
function saveWishlist() {
    const usuarioLogueado = localStorage.getItem('userEmail');
    const text = document.getElementById('wishlistText').value;

    if (text.trim() === "") {
        alert("Por favor, escribe algo antes de guardar.");
        return;
    }

    localStorage.setItem(`wishlist_${usuarioLogueado}`, text);
    alert("¡Lista de deseos guardada correctamente!");
}

function cargarDatos() {
    // Buscar el código activo actual
    const code = localStorage.getItem('lastActiveCode');
    const usuarioLogueado = localStorage.getItem('userEmail');

    if (!code) return;

    // Obtener los datos específicos del código actual
    const sorteoRaw = localStorage.getItem(code);
    if (!sorteoRaw) return;

    const sorteoData = JSON.parse(sorteoRaw);

    // Renderizar información
    document.getElementById('eventTitle').innerText = sorteoData.celebration;

    // VALIDACIÓN DE RESULTADOS:
    // Si este objeto tiene "assignments", el sorteo se mantiene guardado
    if (sorteoData.assignments && sorteoData.assignments[usuarioLogueado]) {
        document.getElementById('btnRealizarSorteo').style.display = 'none';
        document.getElementById('resultadoAsignacion').classList.remove('d-none');
        document.getElementById('nombreAsignado').innerText = sorteoData.assignments[usuarioLogueado];
    } else {
        // Si no hay resultados, evaluar si mostrar el botón de sorteo al admin
        document.getElementById('resultadoAsignacion').classList.add('d-none');
        const esAdmin = (usuarioLogueado === sorteoData.organizer);
        document.getElementById('btnRealizarSorteo').style.display = esAdmin ? 'block' : 'none';
    }
    // Obtener datos
    const titulo = localStorage.getItem('activeEventTitle');
    const fecha = localStorage.getItem('activeEventDate');
    const presupuesto = localStorage.getItem('activeEventBudget');
    const organizador = localStorage.getItem('activeEventAdmin');

    // Referencias 
    const txtTitulo = document.getElementById('eventTitle');
    const txtFecha = document.getElementById('eventDate');
    const txtPresupuesto = document.getElementById('eventBudget');
    const txtAdmin = document.getElementById('eventAdmin');

    // Inyectar la información
    if (txtTitulo) txtTitulo.innerText = titulo || "Sorteo Activo";
    if (txtFecha) txtFecha.innerText = fecha || "Por definir";
    if (txtPresupuesto) txtPresupuesto.innerText = presupuesto || "Sin presupuesto";
    if (txtAdmin) txtAdmin.innerText = organizador || "Administrador";

    // Manejo de undefined
    if (txtTitulo) txtTitulo.innerText = (titulo && titulo !== "undefined") ? titulo : "Cargando...";
    if (txtFecha) txtFecha.innerText = (fecha && fecha !== "undefined") ? fecha : "--/--/--";
    if (txtPresupuesto) txtPresupuesto.innerText = (presupuesto && presupuesto !== "undefined") ? presupuesto : "$0.00";
    if (txtAdmin) txtAdmin.innerText = (organizador && organizador !== "undefined") ? organizador : "---";
}

function ejecutarSorteo() {
    // Obtener datos del sorteo desde el código de la URL o LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || localStorage.getItem('lastActiveCode');
    
    if (!code) {
        alert("No se encontró el código del sorteo.");
        return;
    }

    const sorteoData = JSON.parse(localStorage.getItem(code));
    const participantes = sorteoData.includeOrganizer 
        ? [sorteoData.organizer, ...sorteoData.participants] 
        : [...sorteoData.participants];
    
    const exclusiones = sorteoData.exclusions || [];

    // ALGORITMO DE SORTEO CON EXCLUSIONES
    let asignaciones = shuffleSorteo(participantes, exclusiones);

    if (asignaciones) {
        // Guardar el resultado en el objeto del sorteo en LocalStorage
        sorteoData.assignments = asignaciones;
        localStorage.setItem(code, JSON.stringify(sorteoData));
        alert("¡Sorteo realizado con éxito!");
        verificarSorteoPrevio();
    } else {
        alert("Es imposible realizar el sorteo con esas exclusiones. Por favor, elimine algunas reglas.");
    }
}

function shuffleSorteo(participantes, exclusiones) {
    let intentos = 0;
    const maxIntentos = 500;

    while (intentos < maxIntentos) {
        let posiblesRecibidores = [...participantes];
        let resultado = {};
        let exito = true;

        for (let dador of participantes) {
            // Filtrar candidatos
            let candidatos = posiblesRecibidores.filter(receptor => {
                if (receptor === dador) return false;
                const estaExcluido = exclusiones.some(e => e.from === dador && e.to === receptor);
                return !estaExcluido;
            });

            if (candidatos.length === 0) {
                exito = false;
                break;
            }

            let elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
            resultado[dador] = elegido;
            posiblesRecibidores = posiblesRecibidores.filter(p => p !== elegido);
        }

        if (exito) return resultado;
        intentos++;
    }
    return null; 
}

function verificarSorteoPrevio() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || localStorage.getItem('lastActiveCode');
    const usuarioLogueado = localStorage.getItem('userEmail');
    const btnSorteo = document.getElementById('btnRealizarSorteo');

    if (!code || !btnSorteo) return;

    const sorteoData = JSON.parse(localStorage.getItem(code));
    if (!sorteoData) return;

    // Si el sorteo YA SE HIZO, ocultar el botón para todos los participantes
    if (sorteoData.assignments) {
        btnSorteo.style.display = 'none'; 
        
        const asignadoA = sorteoData.assignments[usuarioLogueado];
        if (asignadoA) {
            document.getElementById('resultadoAsignacion').classList.remove('d-none');
            document.getElementById('nombreAsignado').innerText = asignadoA;
        }
    } 
    // Si no se ha hecho, solo mostrarlo al organizador
    else {
        if (usuarioLogueado === sorteoData.organizer) {
            btnSorteo.style.display = 'block';
        } else {
            btnSorteo.style.display = 'none';
        }
    }
}