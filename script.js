// Control de Inventario - Script Principal

// Webhook URL
const WEBHOOK_URL = 'https://n8nciwok-n8n.wz1vdn.easypanel.host/webhook/inventario';

// Almacenamiento local para movimientos
let movimientos = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
    renderizarMovimientos();
    setupBuscadorProductos();
});

// Configurar buscador de productos
function setupBuscadorProductos() {
    const searchInput = document.getElementById('productoSearch');
    const select = document.getElementById('producto');
    const options = Array.from(select.options);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        options.forEach(option => {
            if (option.value === '') {
                option.style.display = 'block';
                return;
            }
            
            const matches = option.text.toLowerCase().includes(searchTerm);
            option.style.display = matches ? 'block' : 'none';
        });
        
        // Si hay un solo resultado visible, seleccionarlo automáticamente
        const visibleOptions = options.filter(opt => opt.style.display !== 'none' && opt.value !== '');
        if (visibleOptions.length === 1 && searchTerm.length > 0) {
            select.value = visibleOptions[0].value;
        }
    });
    
    // Limpiar búsqueda al seleccionar
    select.addEventListener('change', () => {
        searchInput.value = '';
    });
}

// Manejar envío del formulario
document.getElementById('inventarioForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Deshabilitar botón y mostrar loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
    
    // Recopilar datos del formulario
    const data = {
        producto: document.getElementById('producto').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        tipo: document.querySelector('input[name="tipo"]:checked').value,
        observacion: document.getElementById('observacion').value.trim(),
        fecha: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    try {
        // Enviar al webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            // Guardar movimiento localmente
            movimientos.unshift(data);
            guardarMovimientos();
            
            // Mostrar mensaje de éxito
            mostrarExito();
            
            // Resetear formulario
            this.reset();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudo conectar con el servidor. Verificá tu conexión a internet.');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
});

// Función para guardar en localStorage
function guardarMovimientos() {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Función para cargar desde localStorage
function cargarMovimientos() {
    const guardados = localStorage.getItem('movimientos');
    if (guardados) {
        movimientos = JSON.parse(guardados);
    }
}

// Función para renderizar la lista de movimientos
function renderizarMovimientos() {
    const contenedor = document.getElementById('movimientosList');
    
    if (movimientos.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No hay movimientos recientes</div>
            </div>
        `;
        return;
    }
    
    // Mostrar solo los últimos 20 movimientos
    const recientes = movimientos.slice(0, 20);
    
    contenedor.innerHTML = recientes.map(mov => `
        <div class="movimiento-item ${mov.tipo}">
            <div class="movimiento-header">
                <div class="movimiento-producto">${mov.producto}</div>
                <div class="movimiento-tipo ${mov.tipo}">${mov.tipo}</div>
            </div>
            <div class="movimiento-details">
                <div class="movimiento-cantidad">${mov.tipo === 'entrada' ? '+' : '-'}${mov.cantidad}</div>
                <div class="movimiento-fecha">${formatearFecha(mov.fecha)}</div>
            </div>
            ${mov.observacion ? `<div style="margin-top: 8px; font-size: 12px; color: #666; font-style: italic;">📝 ${mov.observacion}</div>` : ''}
        </div>
    `).join('');
}

// Función para formatear fecha
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return fecha.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Función para mostrar mensaje de éxito
function mostrarExito() {
    document.getElementById('inventarioForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    
    // Actualizar lista de movimientos
    renderizarMovimientos();
}

// Función para resetear formulario
function resetForm() {
    document.getElementById('inventarioForm').reset();
    document.getElementById('inventarioForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('productoSearch').value = '';
}

// Función para mostrar error
function mostrarError(mensaje) {
    document.getElementById('errorText').textContent = mensaje;
    document.getElementById('inventarioForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}

// Función para ocultar error
function hideError() {
    document.getElementById('inventarioForm').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

// Función para exportar datos (backup)
function exportarDatos() {
    const dataStr = JSON.stringify(movimientos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Función para limpiar historial
function limpiarHistorial() {
    if (confirm('¿Estás seguro de que querés borrar todo el historial de movimientos? Esta acción no se puede deshacer.')) {
        movimientos = [];
        guardarMovimientos();
        renderizarMovimientos();
    }
}
