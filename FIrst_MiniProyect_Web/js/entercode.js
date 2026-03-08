function validarCodigo() {
    const codeInput = document.getElementById('drawCode').value.trim().toUpperCase();
    const select = document.getElementById('participantSelect');
    const enterBtn = document.getElementById('enterDrawBtn');

    // BUSCAR EN LOCALSTORAGE
    const sorteoRaw = localStorage.getItem(codeInput);

    if (sorteoRaw) {
        const sorteoData = JSON.parse(sorteoRaw);
        
        // Habilitar controles
        select.disabled = false;
        enterBtn.disabled = false;
        
        // Limpiar y llenar el select
        select.innerHTML = '<option value="">Selecciona tu nombre...</option>';
        
        // Combinar organizador y participantes si es necesario
        const listaCompleta = sorteoData.includeOrganizer 
            ? [sorteoData.organizer, ...sorteoData.participants] 
            : [...sorteoData.participants];

        listaCompleta.forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            option.textContent = p;
            select.appendChild(option);
        });

        alert("¡Código validado!");
        
        // Guardar temporalmente el código y los datos para el siguiente paso
        sessionStorage.setItem('currentDrawCode', codeInput);
        sessionStorage.setItem('currentDraw', JSON.stringify(sorteoData));

    } else {
        alert("El código " + codeInput + " no existe.");
        select.disabled = true;
        enterBtn.disabled = true;
    }
}

// Entrar al sorteo
document.getElementById('enterDrawBtn').addEventListener('click', () => {
    const selectedName = document.getElementById('participantSelect').value;
    const sorteoDataRaw = sessionStorage.getItem('currentDraw');

    if (!selectedName || !sorteoDataRaw) {
        alert("Por favor, selecciona tu nombre.");
        return;
    }

    const sorteoData = JSON.parse(sorteoDataRaw);
    

    // Guardar el nombre del usuario logueado
    localStorage.setItem('userEmail', selectedName); 
    
    localStorage.setItem('activeEventTitle', sorteoData.celebration || "Sorteo Activo");
    localStorage.setItem('activeEventDate', sorteoData.date || "Por definir");
    localStorage.setItem('activeEventBudget', sorteoData.budget ? `$${sorteoData.budget}` : "Sin presupuesto");
    localStorage.setItem('activeEventAdmin', sorteoData.organizer || "Administrador");

    // Redirigir al perfil
    window.location.href = "/PAGES/perfil.html";
});
