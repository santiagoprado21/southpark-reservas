/**
 * Utilidad para generar enlaces y mensajes de WhatsApp
 */

interface ReservaData {
  cancha: { nombre: string; tipo: string };
  fecha: string;
  horaInicio: string;
  horaFin: string;
  nombreCliente: string;
  precioTotal: number;
  cantidadPersonas: number;
  cantidadCircuitos?: number;
  duracionHoras: number;
}

/**
 * Genera el mensaje de WhatsApp con los detalles de la reserva
 */
export function generarMensajeReserva(reserva: ReservaData): string {
  const fecha = new Date(reserva.fecha).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mensaje = `
🎉 *¡Nueva Reserva!*

📌 *${reserva.cancha.nombre}*
📅 *Fecha:* ${fecha}
⏰ *Horario:* ${reserva.horaInicio} - ${reserva.horaFin}

👤 *Cliente:* ${reserva.nombreCliente}
${reserva.cancha.tipo === 'VOLEY_PLAYA' ? `⏱️ *Duración:* ${reserva.duracionHoras} hora(s)` : ''}
${reserva.cancha.tipo === 'MINI_GOLF' ? `🏌️ *Circuitos:* ${reserva.cantidadCircuitos}` : ''}
👥 *Personas:* ${reserva.cantidadPersonas}

💰 *Precio Total:* $${reserva.precioTotal.toLocaleString('es-CO')}
  `.trim();

  return mensaje;
}

/**
 * Genera un enlace de WhatsApp con el mensaje predefinido
 * @param numero - Número de teléfono en formato internacional (ej: 573001234567)
 * @param mensaje - Mensaje a enviar
 */
export function generarEnlaceWhatsApp(numero: string, mensaje: string): string {
  // Limpiar el número (remover espacios, guiones, etc.)
  const numeroLimpio = numero.replace(/[^\d]/g, '');
  
  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);
  
  // Generar enlace wa.me
  return `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
}

/**
 * Abre WhatsApp con un mensaje predefinido
 */
export function abrirWhatsApp(numero: string, mensaje: string): void {
  const enlace = generarEnlaceWhatsApp(numero, mensaje);
  window.open(enlace, '_blank');
}

/**
 * Genera y abre WhatsApp con los datos de la reserva
 */
export function notificarReservaPorWhatsApp(reserva: ReservaData, numero: string): void {
  const mensaje = generarMensajeReserva(reserva);
  abrirWhatsApp(numero, mensaje);
}

/**
 * Genera mensaje para el cliente
 */
export function generarMensajeCliente(reserva: ReservaData): string {
  const fecha = new Date(reserva.fecha).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mensaje = `
¡Hola ${reserva.nombreCliente}! 👋

Tu reserva en *SOUTH PARK* ha sido confirmada:

📌 *${reserva.cancha.nombre}*
📅 *Fecha:* ${fecha}
⏰ *Horario:* ${reserva.horaInicio} - ${reserva.horaFin}
${reserva.cancha.tipo === 'VOLEY_PLAYA' ? `⏱️ *Duración:* ${reserva.duracionHoras} hora(s)` : ''}
${reserva.cancha.tipo === 'MINI_GOLF' ? `🏌️ *Circuitos:* ${reserva.cantidadCircuitos}` : ''}
👥 *Personas:* ${reserva.cantidadPersonas}

💰 *Precio Total:* $${reserva.precioTotal.toLocaleString('es-CO')}

📍 *South Park - Voley Playa & Mini Golf*
🕒 ¡Te esperamos!
  `.trim();

  return mensaje;
}

/**
 * Genera mensaje de confirmación para el cliente
 */
export function generarMensajeConfirmacion(reserva: ReservaData): string {
  const fecha = new Date(reserva.fecha).toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mensaje = `
✅ *¡Reserva Confirmada!*

Hola ${reserva.nombreCliente},

Tu pago ha sido confirmado. Tu reserva está lista:

📌 *${reserva.cancha.nombre}*
📅 *Fecha:* ${fecha}
⏰ *Horario:* ${reserva.horaInicio} - ${reserva.horaFin}

🎉 ¡Todo listo! Te esperamos en South Park.

Cualquier consulta, no dudes en contactarnos.
  `.trim();

  return mensaje;
}

/**
 * Envía notificación automática al crear reserva
 * Abre dos ventanas: una para el negocio y otra para el cliente
 */
export function enviarNotificacionesNuevaReserva(
  reserva: ReservaData,
  numeroNegocio: string,
  telefonoCliente: string
): void {
  // Mensaje para el negocio
  const mensajeNegocio = generarMensajeReserva(reserva);
  
  // Mensaje para el cliente
  const mensajeCliente = generarMensajeCliente(reserva);
  
  // Abrir WhatsApp del negocio (para notificar al admin)
  window.open(generarEnlaceWhatsApp(numeroNegocio, mensajeNegocio), '_blank');
  
  // Abrir WhatsApp del cliente (después de 1 segundo para no bloquear)
  setTimeout(() => {
    window.open(generarEnlaceWhatsApp(telefonoCliente, mensajeCliente), '_blank');
  }, 1000);
}

/**
 * Envía confirmación al cliente
 */
export function enviarConfirmacionCliente(reserva: ReservaData, telefonoCliente: string): void {
  const mensaje = generarMensajeConfirmacion(reserva);
  abrirWhatsApp(telefonoCliente, mensaje);
}

