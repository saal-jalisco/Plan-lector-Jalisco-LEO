/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento0.js — Preparación (Insumos para el diagnóstico)
   ============================================================ */

const Momento0 = {

    /* ===== ESTADO LOCAL ===== */
    insumos: {
        documentales: [
            { id: 'ja2025', texto: 'Resultados de Jalisco Avanza 2025 (por grado y UA)', listo: false },
            { id: 'pei', texto: 'Proyecto Educativo de Centro (PEI)', listo: false },
            { id: 'convivencia', texto: 'Plan de Convivencia', listo: false },
            { id: 'curriculum', texto: 'Currículum vigente (Bases Curriculares)', listo: false },
            { id: 'estrategia', texto: 'Estrategia Jalisco LEO (documento estatal)', listo: false }
        ],
        infraestructura: [
            { id: 'biblioteca', texto: 'Estado de la biblioteca escolar', listo: false },
            { id: 'acervos', texto: 'Acervos disponibles (cantidad y diversidad)', listo: false },
            { id: 'espacios', texto: 'Espacios de lectura (aula, patio, biblioteca, digital)', listo: false },
            { id: 'conectividad', texto: 'Conectividad y equipos digitales', listo: false }
        ],
        humanos: [
            { id: 'equipo_lider', texto: 'Equipo líder del Plan Lector (directivos, docentes, bibliotecario)', listo: false },
            { id: 'docentes', texto: 'Docentes de todas las asignaturas dispuestos a participar', listo: false },
            { id: 'familias', texto: 'Familias y apoderados interesados', listo: false },
            { id: 'aliados', texto: 'Aliados externos (bibliotecas públicas, instituciones culturales)', listo: false }
        ],
        pedagogicos: [
            { id: 'diagnostico', texto: 'Diagnóstico inicial de prácticas lectoras del centro', listo: false },
            { id: 'encuesta', texto: 'Encuesta de intereses lectores del alumnado', listo: false },
            { id: 'deteccion', texto: 'Detección temprana de dificultades lectoras', listo: false },
            { id: 'catalogo', texto: 'Catálogo de Actividades Permanentes LEO', listo: false }
        ]
    },

    /* ===== RENDER PRINCIPAL ===== */
    render() {
        const contenedor = document.getElementById('contenido-momento0');
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div class="momento0-contenedor">
                ${this.renderHeader()}
                ${this.renderIntroduccion()}
                ${this.renderListas()}
                ${this.renderAcciones()}
                ${this.renderNotaOrientadora()}
            </div>
        `;

        this.attachEventos();
    },

    /* ===== HEADER ===== */
    renderHeader() {
        return `
            <div class="momento0-header">
                <div class="momento0-badge">MOMENTO 0</div>
                <h1>Preparación</h1>
                <p class="momento0-subtitulo">Reunamos los insumos antes de iniciar el diagnóstico</p>
            </div>
        `;
    },

    /* ===== INTRODUCCIÓN ===== */
    renderIntroduccion() {
        return `
            <div class="caja-destacada momento0-intro">
                <p>
                    Antes de comenzar el diagnóstico y el diseño del Plan Lector, es fundamental
                    que la comunidad educativa reúna los insumos necesarios. Esta preparación
                    permite partir de una base sólida y evita que el proceso se convierta en una
                    suma de actividades aisladas.
                </p>
                <p>
                    <strong>¿Cómo usar esta lista?</strong> Revisen cada insumo en la Fase Intensiva
                    del Consejo Técnico Escolar. Marquen los que ya tienen y prioricen los que
                    faltan por conseguir.
                </p>
            </div>
        `;
    },

    /* ===== LISTAS DE INSUMOS ===== */
    renderListas() {
        const categorias = [
            { key: 'documentales', titulo: '📄 Insumos documentales', icono: '📄' },
            { key: 'infraestructura', titulo: '🏫 Insumos de infraestructura', icono: '🏫' },
            { key: 'humanos', titulo: '👥 Insumos humanos', icono: '👥' },
            { key: 'pedagogicos', titulo: '📚 Insumos pedagógicos', icono: '📚' }
        ];

        return categorias.map(cat => `
            <div class="momento0-categoria">
                <h2>${cat.titulo}</h2>
                <ul class="momento0-lista">
                    ${this.insumos[cat.key].map(item => `
                        <li class="momento0-item ${item.listo ? 'listo' : ''}" data-id="${item.id}" data-categoria="${cat.key}">
                            <label>
                                <input type="checkbox" ${item.listo ? 'checked' : ''} data-id="${item.id}" data-categoria="${cat.key}">
                                <span>${item.texto}</span>
                            </label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    },

    /* ===== ACCIONES ===== */
    renderAcciones() {
        return `
            <div class="momento0-acciones">
                <button class="btn btn-primario" id="btn-guardar-momento0">
                    💾 Guardar estado de preparación
                </button>
                <button class="btn btn-secundario" id="btn-marcar-todo-momento0">
                    ✅ Marcar todo como listo
                </button>
            </div>
        `;
    },

    /* ===== NOTA ORIENTADORA ===== */
    renderNotaOrientadora() {
        return `
            <div class="caja-info momento0-nota">
                <h3>📌 Nota orientadora</h3>
                <p>
                    Esta lista está basada en las guías de elaboración de Planes de Fomento de la
                    Lectura (Primaria y Secundaria) y en la Estrategia Jalisco LEO. No es necesario
                    tener todos los insumos para comenzar, pero sí es importante identificarlos
                    para saber qué priorizar.
                </p>
                <p>
                    Recuerda que el <strong>Catálogo de Actividades Permanentes LEO</strong> y el
                    <strong>Micrositio Jalisco LEO</strong> estarán disponibles durante el primer
                    trimestre del ciclo escolar.
                </p>
            </div>
        `;
    },

    /* ===== EVENTOS ===== */
    attachEventos() {
        // Checkboxes
        document.querySelectorAll('.momento0-item input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const categoria = e.target.dataset.categoria;
                const item = this.insumos[categoria].find(i => i.id === id);
                if (item) {
                    item.listo = e.target.checked;
                    e.target.closest('.momento0-item').classList.toggle('listo', item.listo);
                }
                this.actualizarProgreso();
            });
        });

        // Guardar
        const btnGuardar = document.getElementById('btn-guardar-momento0');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                this.guardarEstado();
                this.mostrarToast('✅ Estado de preparación guardado');
            });
        }

        // Marcar todo
        const btnMarcarTodo = document.getElementById('btn-marcar-todo-momento0');
        if (btnMarcarTodo) {
            btnMarcarTodo.addEventListener('click', () => {
                Object.keys(this.insumos).forEach(cat => {
                    this.insumos[cat].forEach(item => item.listo = true);
                });
                this.render();
                this.actualizarProgreso();
                this.mostrarToast('✅ Todos los insumos marcados como listos');
            });
        }
    },

    /* ===== PROGRESO ===== */
    actualizarProgreso() {
        const total = Object.values(this.insumos).flat().length;
        const listos = Object.values(this.insumos).flat().filter(i => i.listo).length;
        const porcentaje = Math.round((listos / total) * 100);

        // Actualizar barra de progreso si existe
        const barra = document.getElementById('barra-progreso-momento0');
        if (barra) {
            barra.style.width = `${porcentaje}%`;
            barra.textContent = `${porcentaje}%`;
        }

        // Guardar en estado global
        if (window.Estado) {
            Estado.setProgreso('momento0', porcentaje);
        }
    },

    /* ===== GUARDAR ESTADO ===== */
    guardarEstado() {
        if (window.Estado) {
            Estado.setDatos('momento0', this.insumos);
        }
    },

    /* ===== CARGAR ESTADO ===== */
    cargarEstado() {
        if (window.Estado) {
            const datos = Estado.getDatos('momento0');
            if (datos) {
                this.insumos = datos;
            }
        }
    },

    /* ===== TOAST ===== */
    mostrarToast(mensaje) {
        if (window.App && App.mostrarToast) {
            App.mostrarToast(mensaje);
        } else {
            console.log(mensaje);
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    Momento0.cargarEstado();
});
