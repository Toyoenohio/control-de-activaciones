# 📦 Control de Activaciones

Sistema de gestión de activaciones comerciales y control de inventario.

## 🚀 Características

### Control de Inventario
- **Select con buscador**: Filtrado de productos en tiempo real mientras escribís
- **Cantidad**: Campo numérico para ingresar la cantidad
- **Entrada/Salida**: Toggle visual para seleccionar el tipo de movimiento
- **Webhook n8n**: Envío automático a `https://n8nciwok-n8n.wz1vdn.easypanel.host/webhook/inventario`
- **Historial local**: Últimos movimientos guardados en el navegador
- **Observaciones**: Campo opcional para notas adicionales

## 🛠️ Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, animaciones)
- JavaScript (Vanilla)
- localStorage para persistencia de datos
- Fetch API para envío de datos

## 📦 Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/Toyoenohio/control-de-activaciones.git
cd control-de-activaciones
```

2. Abrí `index.html` en tu navegador

## 🌐 Despliegue en Cloudflare Pages

1. Conectá tu cuenta de GitHub a Cloudflare Pages
2. Seleccioná este repositorio: `control-de-activaciones`
3. Configuración de build:
   - **Build command**: (dejar vacío)
   - **Build output directory**: `/` (raíz)
4. Hacé clic en "Deploy"

¡Listo! Tu aplicación estará disponible en `https://control-de-activaciones.pages.dev`

## 📝 Uso

### Registrar un movimiento de inventario:

1. **Buscar producto**: Escribí en el campo de búsqueda o seleccioná del dropdown
2. **Cantidad**: Ingresá la cantidad numérica
3. **Tipo**: Seleccioná si es Entrada (📥) o Salida (📤)
4. **Observación**: Opcional, agregá notas si es necesario
5. **Enviar**: Hacé clic en "Registrar Movimiento"

### Características adicionales:

- **Historial**: Los últimos 20 movimientos se muestran en la pantalla
- **Persistencia**: Los datos se guardan en localStorage
- **Responsive**: Funciona en desktop y móviles

## 🔌 Webhook

Los datos se envían al webhook en el siguiente formato:

```json
{
  "producto": "Nombre del producto",
  "cantidad": 10,
  "tipo": "entrada",
  "observacion": "Nota opcional",
  "fecha": "2026-03-30T22:53:00.000Z",
  "timestamp": 1774824780000
}
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para gestión de inventario de activaciones Old Parr y otras marcas.
