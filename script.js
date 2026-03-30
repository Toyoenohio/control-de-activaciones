// Control de Activaciones - Script Principal

// Almacenamiento local para las activaciones
let activaciones = [];

// Cargar activaciones guardadas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarActivaciones();
    renderizarActivaciones();
    actualizarEstadisticas();
    
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = hoy;
});

// Manejar el envío del formulario
document.getElementById('activacionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevaActivacion = {
        id: Date.now(),
        fecha: document.getElementById('fecha').value,
        lugar: document.getElementById('lugar').value.trim(),
        promotor: document.getElementById('promotor').value.trim(),
        producto: document.getElementById('producto').value,
        tipo: document.getElementById('tipo').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        observaciones: document.getElementById('observaciones').value.trim(),
        registradoEn: new Date().toISOString()
    };
    
    // Agregar al array
    activaciones.unshift(nuevaActivacion);
    
    // Guardar en localStorage
    guardarActivaciones();
    
    // Renderizar y actualizar
    renderizarActivaciones();
    actualizarEstadisticas();
    
    // Resetear formulario
    this.reset();
    document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
    
    // Mostrar mensaje de éxito
    mostrarNotificacion('¡Activación registrada exitosamente!', 'success');
});

// Función para guardar en localStorage
function guardarActivaciones() {
    localStorage.setItem('activaciones', JSON.stringify(activaciones));
}

// Función para cargar desde localStorage
function cargarActivaciones() {
    const guardadas = localStorage.getItem('activaciones');
    if (guardadas) {
        activaciones = JSON.parse(guardadas);
    }
}

// Función para renderizar la lista de activaciones
function renderizarActivaciones(filtroTexto = '', filtroProducto = '') {
    const contenedor = document.getElementById('activacionesList');
    
    // Filtrar activaciones
    let activacionesFiltradas = activaciones;
    
    if (filtroTexto) {
        const texto = filtroTexto.toLowerCase();
        activacionesFiltradas = activacionesFiltradas.filter(act => 
            act.lugar.toLowerCase().includes(texto) ||
            act.promotor.toLowerCase().includes(texto)
        );
    }
    
    if (filtroProducto) {
        activacionesFiltradas = activacionesFiltradas.filter(act => 
            act.producto === filtroProducto
        );
    }
    
    if (activacionesFiltradas.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">
                    ${activaciones.length === 0 
                        ? 'No hay activaciones registradas aún. ¡Comenzá a registrar!' 
                        : 'No se encontraron activaciones con los filtros seleccionados.'}
                </div>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = activacionesFiltradas.map(act => `
        <div class="activacion-item">
            <div class="activacion-header">
                <div class="activacion-title">📍 ${act.lugar}</div>
                <div class="activacion-date">${formatearFecha(act.fecha)}</div>
            </div>
            <div class="activacion-details">
                <div class="detail-item">
                    <span class="detail-label">Promotor/a:</span>
                    <span class="detail-value">${act.promotor}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Producto:</span>
                    <span class="detail-value">${act.producto}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">${act.tipo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Muestras:</span>
                    <span class="detail-value">${act.cantidad}</span>
                </div>
            </div>
            ${act.observaciones ? `
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; font-size: 13px; color: #666;">
                    <strong>Observaciones:</strong> ${act.observaciones}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const totalActivaciones = activaciones.length;
    const totalMuestras = activaciones.reduce((sum, act) => sum + act.cantidad, 0);
    const productosUnicos = new Set(activaciones.map(act => act.producto)).size;
    
    document.getElementById('totalActivaciones').textContent = totalActivaciones;
    document.getElementById('totalMuestras').textContent = totalMuestras;
    document.getElementById('productosDiferentes').textContent = productosUnicos;
}

// Función para formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Agregar estilos para animaciones de notificación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Manejar filtros de búsqueda
document.getElementById('searchInput').addEventListener('input', function(e) {
    const filtroProducto = document.getElementById('filterProduct').value;
    renderizarActivaciones(e.target.value, filtroProducto);
});

document.getElementById('filterProduct').addEventListener('change', function(e) {
    const filtroTexto = document.getElementById('searchInput').value;
    renderizarActivaciones(filtroTexto, e.target.value);
});

// Función para exportar datos (útil para backup)
function exportarDatos() {
    const dataStr = JSON.stringify(activaciones, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `activaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Función para importar datos
function importarDatos(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datosImportados = JSON.parse(e.target.result);
            if (Array.isArray(datosImportados)) {
                activaciones = [...datosImportados, ...activaciones];
                guardarActivaciones();
                renderizarActivaciones();
                actualizarEstadisticas();
                mostrarNotificacion('¡Datos importados exitosamente!', 'success');
            } else {
                throw new Error('Formato inválido');
            }
        } catch (error) {
            mostrarNotificacion('Error al importar datos. Verificá el archivo.', 'error');
        }
    };
    reader.readAsText(file);
}
