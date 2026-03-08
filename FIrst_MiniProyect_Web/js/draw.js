// Arreglo de pasos
const steps = [
    "Organizador",
    "Participantes",
    "Exclusiones",
    "Festividad",
    "Fecha",
    "Mensaje",
    "Confirmar"
];

// Variable para cambiar de paso
let currentStep = 0;
let drawGenerated = false;

// Arreglo para guardar los datos del evento
const data = {
    organizer: "",
    includeOrganizer: false,
    participants: [],
    exclusions: [],
    celebration: "",
    date: "",
    budget: "",
    message: ""
};

const stepContainer = document.getElementById("step-container");
const breadcrumb = document.getElementById("breadcrumb");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// Función para seguir los pasos con breadcrumbs
function renderBreadcrumb() {
    breadcrumb.innerHTML = steps.map((step, index) => {
        let classes = "breadcrumb-item";
        
        if(index === currentStep){
            classes += " active";
        }
        return `
            <li class="${classes}">
                ${index !== 0 ? `<i class="fa-solid fa-chevron-right"></i>` : ""}
                ${index < currentStep && !drawGenerated
                    ? `<a href="#" onclick="goToStep(${index})">${step}</a>` : step}
            </li>
        `;      
    }).join("");
}

function goToStep(index) {
    currentStep = index;
    renderStep();
    renderBreadcrumb(); 
}

// Función para visualizar los datos en la página 
function renderStep() {
    let html = "";
    switch(currentStep) {
        case 0: // Organizador 
            html = `
            <div class="container">
                <div class="row justify-content-center">
                        <div class="step-header text-center mb-4">
                            <div class="step-icon mb-3">
                                <i class="fa-solid fa-crown"></i>
                            </div>
                            <h2 class="wizard-title">¿Quién organiza el sorteo?</h2>
                            <p class="text-muted">
                                Esta persona administrará el evento y generará el código.
                            </p>
                        </div>

                        <div class="form-group-custom">
                            <label class="form-label-custom">Nombre del organizador</label>
                            <input type="text" id="organizer" class="form-control form-control-lg minimal-input" placeholder="Ej: Gina Salazar"
                                value="${data.organizer}">
                        </div>

                        <div class="form-check custom-check mt-4 d-flex align-items-center justify-content-start">
                            <input type="checkbox" id="includeOrganizer" class="form-check-input me-4">
                            <label class="form-check-label mb-0" for="includeOrganizer">Incluirme como participante</label>
                        </div>
                </div>
            </div>
            `;
        break;

        case 1: // Participantes 
            html = `
                <div class="step-header text-center mb-4">
                    <div class="step-icon mb-3">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <h2 class="wizard-title">Añade los participantes</h2>
                    <p class="text-muted">Agrega uno por uno. Necesitas al menos 2.</p>
                </div>

                <div class="participant-input-group">
                    <input type="text" id="participantInput" class="form-control form-control-lg" placeholder="Ej: Carlos López">
                    <button class="btn-add" onclick="addParticipant()">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>

                <div class="participant-list mt-4" id="participantList">
                    ${renderParticipants(data.participants)}
                </div>
            `;
        break;

        case 2: // Exclusiones
            const allParticipants = data.includeOrganizer
                ? [data.organizer, ...data.participants]
                : [...data.participants];

            html = `
                <div class="step-header text-center mb-5">
                    <div class="step-icon">
                        <i class="fa-solid fa-user-slash"></i>
                    </div>
                    <h2 class="wizard-title mt-3">
                        Exclusiones
                    </h2>
                    <p class="wizard-subtitle">
                        Define quién no puede regalar a quién
                    </p>
                </div>

                <div class="container">
                    <div class="row justify-content-center align-items-center g-2">

                        <div class="col-12 col-md-4">
                            <select id="fromSelect" class="minimal-select-2 w-100">
                                <option value="">Esta persona</option>
                                ${allParticipants.map(p => `<option>${p}</option>`).join("")}
                            </select>
                        </div>

                        <div class="col-12 col-md-auto text-center">
                            <i class="fa-solid fa-x text-danger text-center"></i>
                        </div>

                        <div class="col-12 col-md-4">
                            <select id="toSelect" class="minimal-select-2 w-100">
                                <option value="">No puede regalar a</option>
                                ${allParticipants.map(p => `<option>${p}</option>`).join("")}
                            </select>
                        </div>

                        <div class="col-12 col-md-auto text-center">
                            <button class="btn-add" onclick="addExclusion()">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>

                    </div>

                    <div class="row justify-content-center">
                        <div class="col-12 col-md-8">
                            <div class="exclusion-list mt-4" id="exclusionList"></div>
                        </div>
                    </div>
                </div>
            `;
        break;

        case 3: // Celebraciones 
            html = `
                <div class="step-header text-center mb-5">
                    
                    <div class="step-icon">
                        <i class="fa-solid fa-cake-candles"></i>
                    </div>

                    <h2 class="wizard-title mt-3">Festividad</h2>
                    <p class="wizard-subtitle">
                        Elige la ocasión para tu sorteo
                    </p>

                </div>

                <div class="celebration-wrapper">
                    <select id="celebration" class="minimal-select mt-3" onchange="checkPersonalizado(this.value)">
                        <option value="">Selecciona</option>
                        <option ${data.celebration==="Navidad" ? "selected":""}>Navidad</option>
                        <option ${data.celebration==="Halloween" ? "selected":""}>Halloween</option>
                        <option ${data.celebration==="Cumpleaños" ? "selected":""}>Cumpleaños</option>
                        <option ${data.celebration==="San Valentín" ? "selected":""}>San Valentín</option>
                        <option ${data.celebration==="Día de la madre" ? "selected":""}>Día de la madre</option>
                        <option ${data.celebration==="Día del padre" ? "selected":""}>Día del padre</option>
                        <option ${data.celebration==="Día del niño" ? "selected":""}>Día del niño</option>
                        <option ${data.celebration==="New Year" ? "selected":""}>Año nuevo</option>
                        <option ${data.celebration==="Personalizado" ? "selected":""}>Personalizado</option>
                    </select>
                </div>
                    <input type="text" id="celebrationCustom" class="form-control mt-3" placeholder="Escribe tu festividad" style="display: ${data.celebration === "Personalizado" ? "block" : "none"};" value="${data.celebrationCustom || ""}">
                </div>
            `;
        break;

        case 4: // Fecha y presupuesto
            html = `
                <div class="step-header text-center mb-5">                   
                    <div class="step-icon">
                        <i class="fa-solid fa-alarm-clock"></i>
                    </div>
                    <h2 class="wizard-title mt-3">
                        Fecha y presupuesto
                    </h2>
                    <p class="wizard-subtitle">
                        Define cuándo será la celebración y cuánto se invertirá en el regalo
                    </p>
                </div>
                <div class="details-grid">
                    <div class="field-group">
                        <label for="date">Fecha</label>
                        <input type="date" id="date" class="minimal-input" value="${data.date}">
                    </div>
                    <div class="field-group">
                        <label for="budget">Presupuesto</label>
                        <input type="number" id="budget" class="minimal-input" placeholder="Ej: $25" value="${data.budget}">
                    </div>
                </div>
            `;
        break;

        case 5: // Mensaje
            if(!data.message) {
                data.message = `¡Hola a todos!

                    Ya está listo nuestro sorteo en Drawly.

                    📅 Fecha de la celebración: ${data.date || "Por definir"}
                    💰 Presupuesto sugerido: ${data.budget ? "$" + data.budget : "Por definir"}

                    Recibirán su asignación de manera privada y anónima.
                    ¡Únete lo antes posible!`;
            }

            html = `
                <div class="step-header text-center mb-5">
                    <div class="step-icon">
                        <i class="fa-solid fa-envelope"></i>
                    </div>

                    <h2 class="wizard-title mt-3"> Mensaje para el grupo </h2>

                    <p class="wizard-subtitle">
                        Personaliza el mensaje que recibirán los participantes
                    </p>
                </div>
                
                <div class="message-wrapper">
                    <textarea id="message" class="m-textarea" rows="8">${data.message}</textarea>
                </div>
            `;
        break;

        case 6: // Confirmar los datos
            const participantsList = data.participants
                .map(p => `<span class="participant-chip">${p}</span>`)
                .join("");

            html = `
                <div class="step-header text-center mb-5">
                    <h2 class="wizard-title">Confirma tu sorteo</h2>
                    <p class="wizard-subtitle">Revisa los detalles antes de generarlo</p>
                </div>

                <div class="confirm-grid">

                    <div class="confirm-card">
                        <h6>Organizador</h6>
                        <p class="confirm-main">${data.organizer}</p>
                        <small class="confirm-note">
                            ${data.includeOrganizer 
                                ? "Participará en el sorteo." 
                                : "Solo administrará el sorteo."}
                        </small>
                    </div>

                    <div class="confirm-card">
                        <h6>Participantes</h6>
                        <div class="participants-container">
                            ${participantsList}
                        </div>
                    </div>

                    <div class="confirm-card">
                        <h6>Celebración</h6>
                        <p class="confirm-main">
                            ${data.celebration || "No definida"}
                        </p>
                    </div>

                    <div class="confirm-card">
                        <h6>Fecha y presupuesto</h6>
                        <p> ${data.date || "No definida"}</p>
                        <p> ${data.budget ? "$"+data.budget : "No definido"}</p>
                    </div>

                    <div class="confirm-card full-width">
                        <h6>Mensaje</h6>
                        <div class="confirm-message">
                            ${data.message 
                                ? data.message.replace(/\n/g,"<br>") 
                                : "Sin mensaje"}
                        </div>
                    </div>

                </div>
            `;

            nextBtn.textContent = "Generar Sorteo!";
        break;
    }

    stepContainer.innerHTML = html;

    // Render para participantes y exclusiones
    if(currentStep === 1) renderParticipants();
    if(currentStep === 2) renderExclusions();
    renderBreadcrumb();
    prevBtn.style.display = currentStep===0 ? "none" : "inline-block";
}

// Guardado automático de inputs
function saveData() {
    switch(currentStep) {
        case 0:
            data.organizer = document.getElementById("organizer").value;
            data.includeOrganizer = document.getElementById("includeOrganizer").checked;
            break;
        case 3:
            const select = document.getElementById("celebration").value;

            if(select === "Personalizado"){
                const custom = document.getElementById("celebrationCustom").value.trim();
                if(custom) {
                    data.celebration = custom; // valor del usuario
                    data.celebrationCustom = custom; 
                } else {
                    data.celebration = ""; // por si no escribe nada
                }
            } else {
                data.celebration = select;
                data.celebrationCustom = "";
            }
            break;

        case 4:
            data.date = document.getElementById("date").value;
            data.budget = document.getElementById("budget").value;
            break;
        case 5:
            const messageInput = document.getElementById("message");
            const defaultMessage = `¡Hola a todos!

                    Ya está listo nuestro sorteo en Drawly.

                    Fecha de la celebración: ${data.date || "Por definir"}
                    Presupuesto sugerido: ${data.budget ? "$" + data.budget : "Por definir"}

                    Recibirán su asignación de manera privada y anónima.
                    ¡Únete lo antes posible!`;

            // Mantener mensaje por defecto
            data.message = messageInput.value.trim() || defaultMessage;
            break;
    }
}

// Validaciones de ingreso de datos en cada paso
function validateStep() {
    switch(currentStep) {
        case 0:
            if(!data.organizer.trim()) {
                alert("Debes ingresar el nombre del organizador.");
                return false;
            }
            return true;

        case 1:
            const totalParticipants = data.includeOrganizer 
                ? data.participants.length + 1 
                : data.participants.length;

            if(totalParticipants < 3) {
                alert("Necesitas al menos 3 participantes.");
                return false;
            }
            return true;

        case 3:
            if(!data.celebration){
                alert("Selecciona una festividad.");
                return false;
            }
            if(data.celebration === "Personalizado" && !data.celebrationCustom){
                alert("Escribe tu festividad personalizada.");
                return false;
            }
            return true;
        case 4:
            if(!data.date) {
                alert("Selecciona una fecha.");
                return false;
            }
            return true;

        case 5:
            if(!data.message.trim()) {
                alert("Escribe un mensaje para el grupo.");
                return false;
            }
            return true;

        default:
            return true;
    }
}

// Función para añadir participantes
function addParticipant() {
    const input = document.getElementById("participantInput");
    const name = input.value.trim();
    if(!name) return;
    if(data.participants.includes(name)){ 
        alert("Este nombre ya fue agregado."); 
        return; 
    }
    data.participants.push(name);
    input.value = "";
    renderParticipants();
}

// Función para eliminar participantes 
function removeParticipant(index){ 
    data.participants.splice(index,1); 
    renderParticipants(); 
}

// Función para poner los participantes en tiempo real en la pantalla
function renderParticipants(){
    const container = document.getElementById("participantList");
    if(!container) return;
    if(data.participants.length===0){
        container.innerHTML = `<p class="text-muted small">Aún no hay participantes añadidos.</p>`;
        return;
    }
    container.innerHTML = data.participants.map((p,i)=>`
        <div class="d-flex justify-content-between align-items-center bg-light rounded-pill px-3 py-2 mb-2">
            <span>${p}</span>
            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="removeParticipant(${i})" style="width:32px;height:32px;">✕</button>
        </div>
    `).join("");
}

// Función para añadir las exclusiones
function addExclusion() {
    const from = document.getElementById("fromSelect").value;
    const to = document.getElementById("toSelect").value;

    if (!from || !to) return;

    if (from === to) {
        alert("Una persona no puede excluirse a sí misma.");
        return;
    }

    const exists = data.exclusions.some(e => 
        e.from === from && e.to === to
    );

    if (exists) {
        alert("Esta exclusión ya existe.");
        return;
    }

    // Depende si el organizador se incluye o no en el arreglo de todos los participantes
    const allParticipants = data.includeOrganizer ? [data.organizer, ...data.participants] : [...data.participants];

    const simulatedExclusions = [
        ...data.exclusions,
        { from, to }
    ];

    const isValid = isValidConfiguration(
        allParticipants,
        simulatedExclusions
    );

    if (!isValid) {
        alert("Esta exclusión haría imposible el sorteo.");
        return;
    }

    data.exclusions.push({ from, to });
    renderExclusions();

    document.getElementById("fromSelect").value = "";
    document.getElementById("toSelect").value = "";
}

// Eliminar una exclusión
function removeExclusion(index) {
    data.exclusions.splice(index, 1);
    renderExclusions();
}

// Mostrar las exclusiones en tiempo real
function renderExclusions() {
    const container = document.getElementById("exclusionList");
    if (!container) return;

    if (data.exclusions.length === 0) {
        container.innerHTML = `
            <p class="text-muted small">
                Aún no hay exclusiones añadidas.
            </p>
        `;
        return;
    }

    container.innerHTML = data.exclusions.map((e, i) => `
        <div class="d-flex justify-content-between align-items-center bg-light rounded-pill px-3 py-2 mb-2">
            
            <div>
                <span class="fw-semibold">${e.from}</span>
                <span class="mx-2 text-danger"><i class="fa-solid fa-x"></i></span>
                <span>${e.to}</span>
            </div>

            <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="removeExclusion(${i})"
                style="width:32px;height:32px;">
                <i class="fa-solid fa-x"></i>
            </button>

        </div>
    `).join("");
}

// Función para validar las exclusiones
function isValidConfiguration(participants, exclusions) {
    //cada persona tiene al menos 1 participante al que le pueda regalar
    for (let giver of participants) {

        const blocked = exclusions
            .filter(e => e.from === giver)
            .map(e => e.to);

        const possibleReceivers = participants.filter(p => 
            p !== giver && !blocked.includes(p)
        );

        if (possibleReceivers.length === 0) {
            return false; // esta persona ya no puede regalar a nadie
        }
    }
    return true;
}

// Botones
nextBtn.addEventListener("click", ()=>{
    saveData();
    if(!validateStep()) return;

    if(currentStep===6){ 
        const code = generateCode();

        // expiracion del evento
        // Guarda la fecha de expiración
    const expiracion = {
        code: code,
        date: data.date
    };
    
    // lista de sorteos activos para monitorear fechas
    let monitoreo = JSON.parse(localStorage.getItem('monitoreoSorteos')) || [];
    monitoreo.push(expiracion);
    localStorage.setItem('monitoreoSorteos', JSON.stringify(monitoreo));

        localStorage.setItem(code,JSON.stringify(data));      
        drawGenerated = true;   //  bloqueo para que ya no se puedan clickear una vez que se terminan los pasos
        
        showSuccessScreen(code);
        renderBreadcrumb();     // actualizar breadcrumbs       
        return;
    }
    currentStep++;
    renderStep();
});

prevBtn.addEventListener("click", ()=>{ currentStep--; renderStep(); });

function checkPersonalizado(value){
    const customInput = document.getElementById("celebrationCustom");
    if(value === "Personalizado"){
        customInput.style.display = "block";
    } else {
        customInput.style.display = "none";
        data.celebrationCustom = ""; 
    }
}

// Código auxiliar para generar el código de sala
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DRW-';
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Función para mostrar el la pantalla del código
function showSuccessScreen(code) {
    document.querySelector(".wizard-buttons").style.display = "none";

    stepContainer.innerHTML = `
        <div class="success-wrapper text-center">
            <div class="confetti-container">
                ${'<div class="confetti"></div>'.repeat(60)}
            </div>
            <h2 class="success-title">¡Sorteo creado con éxito!</h2>
            <p class="success-subtitle">
                Comparte este código con los participantes
            </p>
            <div class="code-box">
                ${code}
            </div>
            <div class="success-actions">
                <button class="btn btn-outline-custom" onclick="copyCode('${code}')">
                    Copiar código
                </button>
                <button class="btn btn-primary-custom" onclick="goToDraw('${code}')">
                    Ir a mi sorteo
                </button>
            </div>
        </div>
    `;
}

// Función para copiar el código al portapapeles
function copyCode(code) {
    navigator.clipboard.writeText(code);
    
    const btn = event.target;
    const original = btn.textContent;
    
    btn.textContent = "¡Copiado!";
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-success");

    setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-primary");
    }, 1500);
}

function goToDraw(code) {
    localStorage.setItem('lastActiveCode', code);

    // Recuperar el sorteo recién creado
    const sorteoRaw = localStorage.getItem(code);
    
    if (sorteoRaw) {
        const sorteoData = JSON.parse(sorteoRaw);

        // Guardar los nombres
        localStorage.setItem('userEmail', sorteoData.organizer); 
        localStorage.setItem('activeEventTitle', sorteoData.celebration || "Sorteo Activo");
        localStorage.setItem('activeEventDate', sorteoData.date || "Por definir");
        
        // Formatea el presupuesto
        const presupuesto = sorteoData.budget ? `$${sorteoData.budget}` : "Sin presupuesto";
        localStorage.setItem('activeEventBudget', presupuesto);
        
        localStorage.setItem('activeEventAdmin', sorteoData.organizer || "Administrador");

        // Redirección
        window.location.href = "/PAGES/perfil.html";
    } else {
        alert("Error al recuperar los datos del sorteo.");
    }
}

renderStep();