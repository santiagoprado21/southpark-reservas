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
  montoSena: number;
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
💵 *Seña (30%):* $${reserva.montoSena.toLocaleString('es-CO')}

_Para confirmar tu reserva, por favor abona la seña._
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

