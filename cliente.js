// cliente.js - VERSIÓN DEFINITIVA CORREGIDA (ZONA HORARIA)
let bookedAppointments = [];
let selectedPackage = null;
let existingCustomers = new Set();

// CONFIGURACIÓN EMAILJS - NO MODIFICAR
const EMAILJS_CONFIG = {
  serviceId: 'service_rong6tn',
  templateId: 'template_sbdqjap', 
  publicKey: 't3KP6mW1OcCJ04m8Z'
};

const EMAIL_ADMIN = 'everafotografia@gmail.com';
let currentAppointmentData = null;

// FECHA MÍNIMA - CORREGIDA PARA ZONA HORARIA
const FECHA_INICIO = '2025-11-25'; // Usar string en formato YYYY-MM-DD

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Sistema de reservaciones inicializado');
  
  loadAppointmentsAndCustomers();

  document.querySelectorAll('.package').forEach(pkg => {
    pkg.addEventListener('click', () => {
      selectPackage(pkg);
    });
  });

  document.getElementById('date').addEventListener('change', updateAvailableTimes);
  document.getElementById('date').addEventListener('input', validarFechaEnTiempoReal);
  document.getElementById('btn-register').addEventListener('click', registrarCita);
  document.getElementById('name').addEventListener('blur', checkExistingCustomer);

  document.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('modal-ok').addEventListener('click', resetAndCloseModal);

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
      closeModal();
    }
  });

  // CONFIGURAR FECHA MÍNIMA
  configurarFechaMinima();
});

// FUNCIÓN MEJORADA: Configurar fecha mínima
function configurarFechaMinima() {
  const dateInput = document.getElementById('date');
  dateInput.min = FECHA_INICIO; // 2025-11-25
  dateInput.value = '';
  
  console.log('📅 Fecha mínima configurada:', FECHA_INICIO);
}

// FUNCIÓN SIMPLIFICADA Y CONFIABLE: Validar fecha
function validateSelectedDate(selectedDate) {
  if (!selectedDate) return false;
  
  // Comparación directa de strings YYYY-MM-DD (evita problemas de zona horaria)
  return selectedDate >= FECHA_INICIO;
}

// FUNCIÓN MEJORADA: Validar fecha en tiempo real
function validarFechaEnTiempoReal() {
  const dateInput = document.getElementById('date');
  const selectedDate = dateInput.value;
  
  if (!selectedDate) return;
  
  const esValida = validateSelectedDate(selectedDate);
  const validationMessage = document.getElementById('date-validation-message');
  
  if (!esValida) {
    dateInput.style.borderColor = '#ef4444';
    dateInput.style.backgroundColor = '#fef2f2';
    if (validationMessage) {
      validationMessage.style.display = 'block';
    }
    
    // BLOQUEO EN MÓVILES: Limpiar inmediatamente si es inválida
    dateInput.value = '';
    showNotification('❌ Solo puedes agendar a partir del 25 de noviembre de 2025', 'error');
  } else {
    dateInput.style.borderColor = '';
    dateInput.style.backgroundColor = '';
    if (validationMessage) {
      validationMessage.style.display = 'none';
    }
  }
}

// FUNCIÓN PARA ENVIAR NOTIFICACIÓN POR EMAIL AL ADMINISTRADOR - NO MODIFICAR
// FUNCIÓN ACTUALIZADA: Enviar notificación por email al administrador
async function enviarNotificacionEmail(datosCita) {
  const { name, phone, people, date, time, package: pkg, regularPrice, salePrice, discount, finalPrice, appointmentId } = datosCita;
  
  const mensajeWhatsapp = generarMensajeWhatsappCliente(name, date, time, pkg, people, regularPrice, salePrice, discount, finalPrice);
  
  // USAR LA FUNCIÓN CORREGIDA PARA LA FECHA EN EL EMAIL
  const fechaFormateada = formatDateCorrecta(date);
  
  const templateParams = {
    to_email: EMAIL_ADMIN,
    client_name: name,
    client_phone: phone,
    people: people,
    date: fechaFormateada, // ← Usar la fecha formateada correctamente
    time: time,
    package: pkg,
    regular_price: regularPrice,
    sale_price: salePrice,
    discount: discount,
    final_price: finalPrice,
    appointment_id: appointmentId,
    whatsapp_message: mensajeWhatsapp
  };

  try {
    console.log('📧 Intentando enviar email...');
    console.log('📅 Fecha que se enviará en el email:', fechaFormateada);
    
    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId, 
      EMAILJS_CONFIG.templateId, 
      templateParams
    );
    
    console.log('✅ Email enviado exitosamente');
    return { success: true, message: 'Email enviado correctamente' };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { 
      success: false, 
      message: 'Error de conexión con el servicio de email'
    };
  }
}

// FUNCIÓN CORREGIDA: Generar mensaje de WhatsApp (FIX ZONA HORARIA)
function generarMensajeWhatsappCliente(name, date, time, package, people, regularPrice, salePrice, discount, finalPrice) {
  const formattedDate = formatDateCorrecta(date); // Usar función corregida
  
  return `📅 *CONFIRMACIÓN DE CITA* 📅

¡Hola ${name}! 

Tu cita ha sido confirmada exitosamente:

📅 *Fecha:* ${formattedDate}
⏰ *Hora:* ${time}
🎁 *Paquete:* ${package}
👥 *Personas:* ${people}

💰 *Desglose de pago:*
Total: $${regularPrice}
Descuento: -$${discount}
*Subtotal: $${salePrice}*

💳 *Métodos de pago aceptados:*
• Efectivo
• Transferencia bancaria  
• Tarjetas de crédito/débito

📍 *Ubicación:*
Cll. Niebla-#117, Fracc. Villas de la Cantera. Ags.

💎 *Recomendaciones:*
• Llegar 10 minutos antes
• Vestimenta cómoda

📞 *Para cualquier cambio o cancelación:*
4494126536

¡Te esperamos! 🎉`;
}

// FUNCIÓN NUEVA: Formatear fecha CORRECTAMENTE (sin problemas de zona horaria)
function formatDateCorrecta(dateString) {
  // Dividir la fecha YYYY-MM-DD y crear fecha en zona horaria local
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

function openModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
}

function loadAppointmentsAndCustomers() {
  db.collection('appointments').onSnapshot(snapshot => {
    bookedAppointments = [];
    existingCustomers.clear();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status !== 'CANCELADA') {
        bookedAppointments.push({ date: data.date, time: data.time });
      }
      if (data.name) {
        existingCustomers.add(data.name.toLowerCase().trim());
      }
    });
  }, error => {
    showNotification('Error cargando datos: ' + error.message, 'error');
  });
}

function selectPackage(pkg) {
  document.querySelectorAll('.package').forEach(p => p.classList.remove('selected'));
  pkg.classList.add('selected');
  selectedPackage = pkg.dataset.pkg;
  
  document.getElementById('form-container').style.opacity = '0';
  document.getElementById('form-container').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('form-container').style.opacity = '1';
  }, 50);
  
  updateAvailableTimes();
  showNotification(`Paquete ${selectedPackage} seleccionado`, 'success');
  scrollToForm();
}

function scrollToForm() {
  const formContainer = document.getElementById('form-container');
  const formPosition = formContainer.getBoundingClientRect().top + window.pageYOffset - 20;
  
  window.scrollTo({
    top: formPosition,
    behavior: 'smooth'
  });
  
  setTimeout(() => {
    document.getElementById('name').focus();
  }, 500);
}

function checkExistingCustomer() {
  const nameInput = document.getElementById('name');
  const name = nameInput.value.trim().toLowerCase();
  
  if (name && existingCustomers.has(name)) {
    showNotification('⚠️ Este nombre ya tiene una cita registrada. Por favor verifica tus datos.', 'warning');
    nameInput.style.borderColor = '#f59e0b';
  } else {
    nameInput.style.borderColor = '';
  }
}

function updateAvailableTimes() {
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const selectedDate = dateInput.value;

  console.log('🔍 Fecha seleccionada:', selectedDate);

  if (!selectedDate) {
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">Selecciona una fecha primero</option>';
    return;
  }

  // Validación inmediata y consistente
  if (!validateSelectedDate(selectedDate)) {
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">Fecha no disponible</option>';
    showNotification('❌ Solo puedes agendar a partir del 25 de noviembre de 2025', 'error');
    dateInput.value = ''; // Limpiar inmediatamente
    return;
  }

  // Validar que no sea fecha pasada
  const today = new Date().toISOString().split('T')[0]; // Usar YYYY-MM-DD
  if (selectedDate < today) {
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">No puedes seleccionar fechas pasadas</option>';
    showNotification('Por favor selecciona una fecha futura', 'warning');
    dateInput.value = ''; // Limpiar inmediatamente
    return;
  }

  timeSelect.disabled = false;
  timeSelect.innerHTML = '<option value="">Cargando horarios disponibles...</option>';

  setTimeout(() => {
    // CORRECCIÓN: Crear fecha en zona horaria local para el cálculo del día de la semana
    const [year, month, day] = selectedDate.split('-');
    const date = new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
    const dayOfWeek = date.getDay();

    let hours = [];

    // Lunes a Viernes (1-4)
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      hours = ['6:30pm', '8:00pm', '9:30pm'];
    } 
    // Viernes (5)
    else if (dayOfWeek === 5) {
      hours = ['3:30pm', '5:00pm', '6:30pm', '8:00pm', '9:30pm'];
    } 
    // Sábado (6)
    else if (dayOfWeek === 6) {
      hours = ['9:00am', '10:30am', '12:00pm', '1:30pm', '3:00pm', '4:30pm', '6:00pm', '7:30pm', '9:00pm'];
    }
    // Domingo (0) - AGREGADO
    else if (dayOfWeek === 0) {
      hours = ['9:00am', '10:30am', '12:00pm', '1:30pm', '3:00pm', '4:30pm', '6:00pm', '7:30pm', '9:00pm'];
    }

    const bookedTimes = bookedAppointments
      .filter(app => app.date === selectedDate)
      .map(app => app.time);

    timeSelect.innerHTML = '<option value="">Selecciona una hora</option>';
    
    let availableSlots = 0;
    
    hours.forEach(hour => {
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = hour;
      
      if (bookedTimes.includes(hour)) {
        option.disabled = true;
        option.textContent += ' (❌ Ocupado)';
        option.classList.add('disabled');
      } else {
        availableSlots++;
        option.textContent += ' (✅ Disponible)';
      }
      timeSelect.appendChild(option);
    });

    if (availableSlots === 0) {
      timeSelect.innerHTML = '<option value="">No hay horarios disponibles para esta fecha</option>';
      timeSelect.disabled = true;
      showNotification('No hay horarios disponibles para esta fecha. Por favor selecciona otra.', 'warning');
    } else {
      showNotification(`Hay ${availableSlots} horarios disponibles para esta fecha`, 'success');
    }
  }, 500);
}

// FUNCIÓN PRINCIPAL - VALIDACIÓN DEFINITIVA
async function registrarCita() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const people = document.getElementById('people').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!name || !phone || !people || !date || !time || !selectedPackage) {
    showNotification('Por favor, completa todos los campos.', 'error');
    return;
  }

  // VALIDACIÓN DEFINITIVA - Usar misma lógica que en updateAvailableTimes
  if (!validateSelectedDate(date)) {
    showNotification('❌ Solo puedes agendar a partir del 25 de noviembre de 2025', 'error');
    return;
  }

  // Validar que no sea fecha pasada
  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    showNotification('No puedes agendar fechas pasadas', 'error');
    return;
  }

  if (people < 1 || people > 10) {
    showNotification('Por favor, ingresa un número válido de personas (1-10).', 'error');
    return;
  }

  if (existingCustomers.has(name.toLowerCase())) {
    if (!confirm('⚠️ Ya existe una cita registrada con este nombre. ¿Estás seguro de que quieres continuar?')) {
      return;
    }
  }

  const btn = document.getElementById('btn-register');
  const originalText = btn.textContent;
  btn.textContent = 'Registrando...';
  btn.disabled = true;

  const regularPrice = getRegularPrice(selectedPackage);
  const salePrice = getSalePrice(selectedPackage);
  const discount = regularPrice - salePrice;
  const finalPrice = salePrice;

  // GUARDAR LA FECHA EXACTA QUE SELECCIONÓ EL USUARIO
  currentAppointmentData = {
    name,
    phone,
    people: parseInt(people),
    date: date, // Guardar exactamente lo que seleccionó (YYYY-MM-DD)
    time,
    package: selectedPackage,
    regularPrice,
    salePrice,
    discount,
    finalPrice,
    appointmentId: generateAppointmentId()
  };

  console.log('📝 Datos a guardar:', currentAppointmentData);

  try {
    // Guardar en Firestore
    await db.collection('appointments').add({
      ...currentAppointmentData,
      status: 'PENDIENTE',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Cita guardada en Firestore exitosamente');

    // Mostrar confirmación
    mostrarModalConfirmacionSimplificada(currentAppointmentData);

    // Email en segundo plano
    setTimeout(() => {
      enviarNotificacionEmail(currentAppointmentData)
        .then(resultado => {
          if (resultado.success) {
            console.log('✅ Email enviado en segundo plano');
          }
        })
        .catch(error => {
          console.error('Error en email en segundo plano:', error);
        });
    }, 2000);
    
  } catch (e) {
    console.error('Error guardando cita:', e);
    showNotification('Error al registrar la cita: ' + e.message, 'error');
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// FUNCIÓN CORREGIDA: Mostrar modal de confirmación (FIX ZONA HORARIA)
function mostrarModalConfirmacionSimplificada(data) {
  const { name, date, time, package, people, finalPrice, appointmentId } = data;
  
  document.getElementById('modal-text').innerHTML = `
    <div class="success-animation">🎉</div>
    <h1>¡Gracias ${name}!</h1>
    <p>Tu cita ha sido registrada exitosamente</p>
    
    <div class="success-message">
      ✅ Cita registrada correctamente<br>
      <small>Hemos enviado una notificación al administrador</small>
    </div>
    
    <div class="appointment-details">
      <p><strong>ID de Cita:</strong> ${appointmentId}</p>
      <p><strong>Fecha:</strong> ${formatDateCorrecta(date)}</p> <!-- Usar función corregida -->
      <p><strong>Hora:</strong> ${time}</p>
      <p><strong>Paquete:</strong> ${package}</p>
      <p><strong>Personas:</strong> ${people}</p>
      <p><strong>Total:</strong> $${finalPrice.toLocaleString()}</p>
    </div>

    <!-- NUEVA SECCIÓN: Métodos de pago -->
    <div class="payment-methods">
      <h4>💳 Métodos de Pago</h4>
      <h4>Puedes realizar el pago mediante:</h4>
      <ul>
        <li>💰 <strong>Efectivo</strong></li>
        <li>🏦 <strong>Transferencia bancaria</strong></li>
        <li>💳 <strong>Tarjeta de crédito/débito</strong> (aceptamos todas las TDC)</li>
      </ul>
      <p class="payment-note"><small>El pago se realiza el día de tu sesión</small></p>
    </div>
    
    <div class="whatsapp-notification">
      <h4>📱 Confirmación por WhatsApp</h4>
      <p>En seguida recibirás un mensaje de WhatsApp con la confirmación oficial de tu cita.</p>
      <p><strong>Por favor mantente atento a tu teléfono.</strong></p>
    </div>

    <div class="contact-info">
      <p>Si no recibes el mensaje en los próximos minutos, contáctanos al:</p>
      <p class="contact-phone">📞 4494126536</p>
    </div>
  `;
  openModal();
}

// FUNCIÓN AUXILIAR: Generar ID único para la cita
function generateAppointmentId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `RES-${timestamp}-${random}`.toUpperCase();
}

function resetAndCloseModal() {
  resetForm();
  closeModal();
  currentAppointmentData = null;
}

function resetForm() {
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('people').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').innerHTML = '<option value="">Selecciona una fecha primero</option>';
  document.getElementById('time').disabled = true;
  
  document.querySelectorAll('.package').forEach(p => p.classList.remove('selected'));
  selectedPackage = null;
  
  document.getElementById('form-container').classList.add('hidden');
}

function getRegularPrice(pkg) {
  const prices = {
    "NOCHE BUENA": 1600,
    "UVA": 2000,
    "BRINDIS": 2400
  };
  return prices[pkg] || 0;
}

function getSalePrice(pkg) {
  const prices = {
    "NOCHE BUENA": 1400,
    "UVA": 1800,
    "BRINDIS": 2200
  };
  return prices[pkg] || 0;
}

// FUNCIÓN ANTIGUA (mantener por compatibilidad, pero no usarla)
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', options);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Efectos Navideños Dinámicos
function initChristmasEffects() {
    console.log('🎄 Iniciando efectos navideños...');
    
    // Crear overlay navideño
    createChristmasOverlay();
    
    // Crear nieve
    createSnowfall();
    
    // Agregar decoraciones flotantes
    createFloatingDecorations();
    
    // Agregar luces navideñas
    createChristmasLights();
    
    // Aplicar estilos navideños a elementos existentes
    applyChristmasStyles();
}

function createChristmasOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'christmas-overlay';
    document.body.appendChild(overlay);
}

function createSnowfall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'christmas-effects';
    snowContainer.id = 'snow-container';
    document.body.appendChild(snowContainer);

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄', '❉', '❊';
        
        // Posición aleatoria
        const startPosition = Math.random() * 100;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 5;
        const size = 0.5 + Math.random() * 1.5;
        
        snowflake.style.left = `${startPosition}vw`;
        snowflake.style.fontSize = `${size}em`;
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;
        
        snowContainer.appendChild(snowflake);
        
        // Remover el copo de nieve después de que caiga
        setTimeout(() => {
            if (snowflake.parentElement) {
                snowflake.remove();
            }
        }, (duration + delay) * 1000);
    }

    // Crear múltiples copos de nieve
    for (let i = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 300);
    }
    
    // Continuar creando nieve
    setInterval(createSnowflake, 500);
}

function createChristmasLights() {
    const lights = document.createElement('div');
    lights.className = 'christmas-lights';
    document.body.appendChild(lights);
}

// Función para hacer el modal navideño
function makeModalChristmas() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('christmas-modal');
    }
}

// Inicializar efectos navideños cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Tu código existente se mantiene igual...
    
    // Agregar efectos navideños después de un pequeño delay
    setTimeout(initChristmasEffects, 500);
});

// Modificar la función openModal para versión navideña
const originalOpenModal = openModal;
openModal = function() {
    originalOpenModal();
    makeModalChristmas();
};