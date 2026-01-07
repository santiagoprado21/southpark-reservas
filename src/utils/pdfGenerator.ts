import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReservaReporte {
  id: string;
  fecha: string;
  nombreCliente: string;
  emailCliente: string;
  cancha: {
    nombre: string;
    tipo: string;
  };
  precioTotal: number;
  estado: string;
}

interface DatosReporte {
  fechaInicio: string;
  fechaFin: string;
  reservas: ReservaReporte[];
  totalReservas: number;
  reservasConfirmadas: number;
  ingresosTotales: number;
  ingresosConfirmados: number;
}

export const generarReportePDF = (datos: DatosReporte) => {
  // Crear documento PDF
  const doc = new jsPDF();
  
  // Configuración de colores
  const colorPrimario = [59, 130, 246]; // Azul
  const colorSecundario = [239, 246, 255]; // Azul claro
  
  // Header - Logo y título
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SOUTH PARK', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte de Reservas', 105, 30, { align: 'center' });
  
  // Información del período
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Período:', 14, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${format(new Date(datos.fechaInicio), 'dd/MM/yyyy', { locale: es })} - ${format(new Date(datos.fechaFin), 'dd/MM/yyyy', { locale: es })}`,
    35,
    50
  );
  
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de generación:', 14, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(format(new Date(), "dd/MM/yyyy HH:mm", { locale: es }), 60, 57);
  
  // Resumen de estadísticas
  doc.setFillColor(...colorSecundario);
  doc.roundedRect(14, 65, 182, 30, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  // Columna 1
  doc.text('Total Reservas:', 20, 73);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.totalReservas.toString(), 20, 80);
  
  // Columna 2
  doc.setFont('helvetica', 'bold');
  doc.text('Confirmadas:', 65, 73);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.reservasConfirmadas.toString(), 65, 80);
  
  // Columna 3
  doc.setFont('helvetica', 'bold');
  doc.text('Ingresos Totales:', 110, 73);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${datos.ingresosTotales.toLocaleString('es-CO')}`, 110, 80);
  
  // Columna 4
  doc.setFont('helvetica', 'bold');
  doc.text('Ingresos Confirmados:', 110, 87);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${datos.ingresosConfirmados.toLocaleString('es-CO')}`, 110, 94);
  
  // Tabla de reservas
  const reservasData = datos.reservas.map((reserva) => [
    format(new Date(reserva.fecha), 'dd/MM/yyyy', { locale: es }),
    reserva.nombreCliente,
    reserva.cancha.nombre,
    reserva.cancha.tipo === 'VOLEY_PLAYA' ? 'Voley Playa' : 'Mini Golf',
    `$${reserva.precioTotal.toLocaleString('es-CO')}`,
    reserva.estado,
  ]);
  
  autoTable(doc, {
    startY: 105,
    head: [['Fecha', 'Cliente', 'Cancha', 'Servicio', 'Valor', 'Estado']],
    body: reservasData,
    theme: 'striped',
    headStyles: {
      fillColor: colorPrimario,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Fecha
      1: { cellWidth: 40 }, // Cliente
      2: { cellWidth: 35 }, // Cancha
      3: { cellWidth: 30 }, // Servicio
      4: { cellWidth: 25, halign: 'right' }, // Valor
      5: { cellWidth: 25, halign: 'center' }, // Estado
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    didParseCell: function(data) {
      // Colorear estados
      if (data.column.index === 5 && data.cell.section === 'body') {
        const estado = data.cell.raw as string;
        if (estado === 'CONFIRMADA') {
          data.cell.styles.textColor = [22, 163, 74]; // Verde
          data.cell.styles.fontStyle = 'bold';
        } else if (estado === 'CANCELADA') {
          data.cell.styles.textColor = [220, 38, 38]; // Rojo
        } else if (estado === 'PENDIENTE') {
          data.cell.styles.textColor = [234, 179, 8]; // Amarillo
        }
      }
    },
  });
  
  // Totales al final
  const finalY = (doc as any).lastAutoTable.finalY || 105;
  
  doc.setFillColor(...colorPrimario);
  doc.rect(14, finalY + 10, 182, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL INGRESOS (CONFIRMADOS):', 20, finalY + 20);
  doc.text(
    `$${datos.ingresosConfirmados.toLocaleString('es-CO')}`,
    190,
    finalY + 20,
    { align: 'right' }
  );
  
  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      'South Park - Voley Playa & Mini Golf',
      14,
      290
    );
  }
  
  // Generar nombre del archivo
  const nombreArchivo = `Reporte_SouthPark_${format(new Date(datos.fechaInicio), 'ddMMyyyy')}_${format(new Date(datos.fechaFin), 'ddMMyyyy')}.pdf`;
  
  // Descargar PDF
  doc.save(nombreArchivo);
};

// Función alternativa para generar reporte simple (solo confirmadas)
export const generarReporteSimplePDF = (datos: DatosReporte) => {
  const reservasConfirmadas = datos.reservas.filter(r => r.estado === 'CONFIRMADA');
  
  generarReportePDF({
    ...datos,
    reservas: reservasConfirmadas,
    totalReservas: reservasConfirmadas.length,
  });
};

