# 📊 Control de Activaciones

Sistema de gestión y seguimiento de activaciones comerciales.

## 🚀 Características

- **Registro de activaciones**: Formulario completo para registrar nuevas activaciones
- **Lista de activaciones**: Visualización de todas las activaciones registradas
- **Filtros de búsqueda**: Filtrar por lugar, promotor o producto
- **Estadísticas en tiempo real**: Total de activaciones, muestras y productos
- **Almacenamiento local**: Los datos se guardan en el navegador (localStorage)
- **Diseño responsive**: Funciona en desktop y móviles
- **Listo para Cloudflare Pages**: Sin backend requerido

## 🛠️ Tecnologías

- HTML5
- CSS3 (con Grid y Flexbox)
- JavaScript (Vanilla)
- localStorage para persistencia de datos

## 📦 Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/Toyoenohio/control-de-activaciones.git
```

2. Abrí `index.html` en tu navegador

## 🌐 Despliegue en Cloudflare Pages

1. Conectá tu cuenta de GitHub a Cloudflare Pages
2. Seleccioná este repositorio
3. Configuración de build:
   - **Build command**: (dejar vacío)
   - **Build output directory**: `/` (raíz)
4. Hacé clic en "Deploy"

¡Listo! Tu aplicación estará disponible en `https://control-de-activaciones.pages.dev`

## 📝 Uso

1. **Registrar una activación**:
   - Completá el formulario con los datos de la activación
   - Hacé clic en "Registrar Activación"
   - Los datos se guardarán automáticamente

2. **Buscar activaciones**:
   - Usá el campo de búsqueda para filtrar por lugar o promotor
   - Usá el dropdown para filtrar por producto

3. **Ver estadísticas**:
   - Las estadísticas se actualizan automáticamente
   - Mostramos: total de activaciones, total de muestras, y productos diferentes

## 💾 Backup de datos

Los datos se almacenan en el navegador. Para hacer backup:
- Abrí la consola del navegador
- Ejecutá: `console.log(JSON.stringify(activaciones))`
- Guardá el resultado en un archivo JSON

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado para gestión de activaciones de Old Parr y otras marcas.
