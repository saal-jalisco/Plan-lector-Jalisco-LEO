/* ============================================================
   PLAN LECTOR JALISCO LEO
   demo.js — Modo Demo (instructivo integrado)
   ============================================================ */

const DEMO = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    let pasoDemo = 0;

    const PASOS_DEMO = [
        {
            id: 'bienvenida',
            titulo: '¡Bienvenida al Modo Demo!',
            icono: 'fa-play-circle',
            contenido: `
                <p>Este recorrido te mostrará cómo funciona el <strong>Plan Lector Jalisco LEO</strong>.</p>
                <p>Usaremos un ejemplo completo: la <strong>Escuela Primaria Benito Juárez</strong> (CCT 14DPR0001A), 
                ubicada en Guadalajara, Jalisco. Es una escuela de Primaria Alta (4°, 5° y 6°) con 180 estudiantes.</p>
                <p>Al final del recorrido, podrás <strong>comenzar tu propio Plan Lector</strong> con datos en blanco.</p>
                <div class="caja-info">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Consejo:</strong> Puedes salir del Modo Demo en cualquier momento haciendo clic en 
                    "Comenzar mi Plan Lector".
                </div>
            `
        },
        {
            id: 'momento0',
            titulo: 'Momento 0: Preparación',
            icono: 'fa-clipboard-list',
            contenido: `
                <p>El <strong>Momento 0</strong> sirve para recoger los insumos antes del CTE: 
                resultados de evaluaciones, fichas SAAL, encuestas, etc.</p>
                <p>En el ejemplo, la Primaria Benito Juárez ya tiene sus resultados de Jalisco Avanza 2025 
                y las fichas SAAL de 5° y 6°.</p>
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    Este momento es <strong>autónomo</strong>: se llena antes del CTE.
                </div>
            `
        },
        {
            id: 'momento1',
            titulo: 'Momento 1: Encuadre',
            icono: 'fa-chalkboard',
            contenido: `
                <p>El <strong>Momento 1</strong> es la comprensión compartida de la estrategia Jalisco LEO.</p>
                <p>Se proyecta una presentación HTML con los ejes estratégicos, la Trayectoria Formativa 
                y las 5 Rutas LEO.</p>
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    Este momento es <strong>proyectable</strong>: se usa durante el CTE para nivelar al colectivo.
                </div>
            `
        },
        {
            id: 'momento2',
            titulo: 'Momento 2: Termómetro Lector',
            icono: 'fa-temperature-half',
            contenido: `
                <p>El <strong>Momento 2</strong> es el diagnóstico del ecosistema lector. Se compone de 7 secciones:</p>
                <ol>
                    <li><strong>Identificación</strong> — datos de la escuela, nivel, grados.</li>
                    <li><strong>Línea Base</strong> — resultados de Jalisco Avanza 2025 vs. la escuela.</li>
                    <li><strong>SAAL</strong> — diagnóstico fino por componente (opcional).</li>
                    <li><strong>Voces del Ecosistema</strong> — estudiantes, familias, docentes.</li>
                    <li><strong>Termómetro Visual</strong> — semáforo de 18 dimensiones.</li>
                    <li><strong>Rutas Sugeridas</strong> — motor de recomendación + selección.</li>
                    <li><strong>Acta de Diagnóstico</strong> — producto final del Momento 2.</li>
                </ol>
                <p>En el ejemplo, la Primaria Benito Juárez obtuvo un diagnóstico con 
                <strong>3 dimensiones en 🔴</strong>, <strong>5 en 🟡</strong> y <strong>10 en 🟢</strong>.</p>
                <div class="caja-info">
                    <i class="fas fa-lightbulb"></i>
                    Las rutas sugeridas fueron: <strong>Ruta 1 (LEO para comprender)</strong>, 
                    <strong>Ruta 4 (LEO para crear)</strong> y <strong>Ruta 5 (LEO en comunidad)</strong>.
                </div>
            `
        },
        {
            id: 'momento3',
            titulo: 'Momento 3: Hoja de Ruta Trimestral ★',
            icono: 'fa-route',
            contenido: `
                <p>El <strong>Momento 3</strong> es el <strong>corazón del Plan Lector</strong>. 
                Se compone de 4 sub-secciones:</p>
                <ol>
                    <li><strong>3.1 Selección de Rutas</strong> — elegir mínimo 2, máximo 5 rutas.</li>
                    <li><strong>3.2 Calendarización</strong> — distribuir actividades en sept, oct, nov.</li>
                    <li><strong>3.3 Responsables</strong> — asignar quién hace qué.</li>
                    <li><strong>3.4 Bitácora</strong> — registrar cómo fue cada actividad.</li>
                </ol>
                <p>En el ejemplo, la Primaria Benito Juárez seleccionó <strong>3 rutas</strong> y calendarizó 
                <strong>5 actividades</strong> para el primer trimestre.</p>
                <div class="caja-info">
                    <i class="fas fa-star"></i>
                    Este es el momento más importante: aquí se diseña el Plan Lector que se implementará.
                </div>
            `
        },
        {
            id: 'momento4',
            titulo: 'Momento 4: Cierre y Acuerdos',
            icono: 'fa-handshake',
            contenido: `
                <p>El <strong>Momento 4</strong> define los compromisos y próximos pasos del colectivo.</p>
                <p>Se genera un <strong>Acta de Acuerdos</strong> con firmas del director, ATP y docentes.</p>
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    Este momento se realiza al final del CTE.
                </div>
            `
        },
        {
            id: 'momento5',
            titulo: 'Momento 5: Evaluación y Documentación',
            icono: 'fa-chart-line',
            contenido: `
                <p>El <strong>Momento 5</strong> registra lo realizado y sus resultados.</p>
                <p>Se documentan evidencias, logros, dificultades y aprendizajes. Se realiza en el siguiente CTE.</p>
                <div class="caja-info">
                    <i class="fas fa-info-circle"></i>
                    Este momento cierra el ciclo trimestral y prepara el siguiente.
                </div>
            `
        },
        {
            id: 'faq',
            titulo: 'Preguntas frecuentes',
            icono: 'fa-circle-question',
            contenido: `
                <h4>¿Necesito internet para usar el Plan Lector?</h4>
                <p>No. Una vez cargado, funciona sin conexión. Solo la primera vez necesita internet para 
                cargar fuentes y Font Awesome.</p>

                <h4>¿Se guardan mis datos?</h4>
                <p>Sí, automáticamente en tu navegador (localStorage). También puedes guardar un borrador 
                manual y exportar a JSON.</p>

                <h4>¿Puedo llenarlo entre varias personas?</h4>
                <p>Sí. El Modo de Llenado "Colectivo" está pensado para que se llene colaborativamente 
                durante el CTE.</p>

                <h4>¿Qué pasa si no tengo SAAL?</h4>
                <p>No hay problema. El Termómetro se adapta a 12 dimensiones en lugar de 18, 
                basadas en las Voces del Ecosistema.</p>

                <h4>¿Puedo exportar los productos?</h4>
                <p>Sí. Al final del Momento 3 puedes generar la Hoja de Ruta, las Fichas de Rutas, 
                la Carta para Familias y la Bitácora de Actividades.</p>

                <h4>¿Cómo empiezo mi propio Plan Lector?</h4>
                <p>Haz clic en "Comenzar mi Plan Lector" al final de este recorrido. 
                Se reiniciará el estado y podrás empezar de cero.</p>
            `
        },
        {
            id: 'comenzar',
            titulo: '¡Listo para comenzar!',
            icono: 'fa-rocket',
            contenido: `
                <p>Has completado el recorrido por el <strong>Plan Lector Jalisco LEO</strong>.</p>
                <p>Ahora puedes:</p>
                <ul>
                    <li><strong>Comenzar mi Plan Lector</strong> — reinicia el estado y empieza de cero.</li>
                    <li><strong>Explorar el ejemplo</strong> — carga los datos de la Primaria Benito Juárez 
                    para que veas cómo se ve un Plan Lector completo.</li>
                </ul>
                <div class="caja-info">
                    <i class="fas fa-lightbulb"></i>
                    <strong>Recomendación:</strong> primero explora el ejemplo, luego comienza tu propio Plan Lector.
                </div>
            `
        }
    ];

    /* ========================================================
       INICIAR MODO DEMO
       ======================================================== */
    function iniciar() {
        pasoDemo = 0;
        renderizar();
    }

    /* ========================================================
       RENDERIZAR
       ======================================================== */
    function renderizar() {
        // Crear overlay del demo
        let overlay = document.getElementById('demo-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'demo-overlay';
            overlay.className = 'demo-overlay';
            document.body.appendChild(overlay);
        }

        const paso = PASOS_DEMO[pasoDemo];
        const esUltimo = pasoDemo === PASOS_DEMO.length - 1;

        overlay.innerHTML = `
            <div class="demo-modal">
                <div class="demo-header">
                    <div class="demo-titulo">
                        <i class="fas ${paso.icono}"></i>
                        <h3>${paso.titulo}</h3>
                    </div>
                    <button type="button" class="btn btn-icono btn-secundario" id="demo-cerrar" title="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="demo-progreso">
                    ${PASOS_DEMO.map((p, i) => `
                        <div class="demo-punto ${i === pasoDemo ? 'activo' : ''} ${i < pasoDemo ? 'completado' : ''}"
                             data-paso="${i}" title="${p.titulo}"></div>
                    `).join('')}
                </div>

                <div class="demo-contenido">
                    ${paso.contenido}
                </div>

                <div class="demo-acciones">
                    <button type="button" class="btn btn-secundario" id="demo-anterior"
                            ${pasoDemo === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i> Anterior
                    </button>

                    <div class="demo-indicador">
                        ${pasoDemo + 1} de ${PASOS_DEMO.length}
                    </div>

                    ${esUltimo ? `
                        <div class="flex gap-1">
                            <button type="button" class="btn btn-naranja" id="demo-explorar-ejemplo">
                                <i class="fas fa-eye"></i> Explorar el ejemplo
                            </button>
                            <button type="button" class="btn btn-primario" id="demo-comenzar">
                                <i class="fas fa-rocket"></i> Comenzar mi Plan Lector
                            </button>
                        </div>
                    ` : `
                        <button type="button" class="btn btn-primario" id="demo-siguiente">
                            Siguiente <i class="fas fa-arrow-right"></i>
                        </button>
                    `}
                </div>
            </div>
        `;

        suscribirEventos();
    }

    /* ========================================================
       SUSCRIBIR EVENTOS
       ======================================================== */
    function suscribirEventos() {
        const overlay = document.getElementById('demo-overlay');
        if (!overlay) return;

        // Cerrar
        const btnCerrar = document.getElementById('demo-cerrar');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', cerrar);
        }

        // Cerrar con clic fuera del modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cerrar();
        });

        // Anterior
        const btnAnterior = document.getElementById('demo-anterior');
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                if (pasoDemo > 0) {
                    pasoDemo--;
                    renderizar();
                }
            });
        }

        // Siguiente
        const btnSiguiente = document.getElementById('demo-siguiente');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                if (pasoDemo < PASOS_DEMO.length - 1) {
                    pasoDemo++;
                    renderizar();
                }
            });
        }

        // Puntos de progreso
        overlay.querySelectorAll('.demo-punto').forEach(punto => {
            punto.addEventListener('click', () => {
                const index = parseInt(punto.dataset.paso, 10);
                if (!isNaN(index)) {
                    pasoDemo = index;
                    renderizar();
                }
            });
        });

        // Explorar el ejemplo
        const btnExplorar = document.getElementById('demo-explorar-ejemplo');
        if (btnExplorar) {
            btnExplorar.addEventListener('click', () => {
                cargarEjemplo();
                cerrar();
                APP.mostrarToast('Ejemplo "Primaria Benito Juárez" cargado.', 'exito');
                APP.mostrarMomento('momento2');
            });
        }

        // Comenzar mi Plan Lector
        const btnComenzar = document.getElementById('demo-comenzar');
        if (btnComenzar) {
            btnComenzar.addEventListener('click', () => {
                APP.mostrarModalConfirmacion(
                    'Comenzar mi Plan Lector',
                    'Se reiniciará el estado actual y podrás empezar de cero. ¿Continuar?',
                    () => {
                        ESTADO.reiniciar();
                        cerrar();
                        APP.mostrarToast('¡Listo! Comienza tu Plan Lector.', 'exito');
                        APP.mostrarMomento('momento2');
                    }
                );
            });
        }
    }

    /* ========================================================
       CERRAR MODO DEMO
       ======================================================== */
    function cerrar() {
        const overlay = document.getElementById('demo-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /* ========================================================
       CARGAR EJEMPLO "PRIMARIA BENITO JUÁREZ"
       ======================================================== */
    function cargarEjemplo() {
        const demo = DATOS.demo;

        // Identificación
        ESTADO.actualizarCampo('identificacion', 'region', demo.region);
        ESTADO.actualizarCampo('identificacion', 'municipio', demo.municipio);
        ESTADO.actualizarCampo('identificacion', 'cct', demo.cct);
        ESTADO.actualizarCampo('identificacion', 'nombreEscuela', demo.escuela);
        ESTADO.actualizarCampo('identificacion', 'turno', demo.turno);
        ESTADO.actualizarCampo('identificacion', 'nivel', demo.nivel);
        ESTADO.actualizarCampo('identificacion', 'grados', demo.grados);
        ESTADO.actualizarCampo('identificacion', 'numeroEstudiantes', demo.numeroEstudiantes);
        ESTADO.actualizarCampo('identificacion', 'director', demo.director);
        ESTADO.actualizarCampo('identificacion', 'atp', demo.atp);
        ESTADO.actualizarCampo('identificacion', 'fechaCTE', demo.fechaCTE);
        ESTADO.actualizarCampo('identificacion', 'modoLlenado', demo.modoLlenado);

        // Rutas seleccionadas (Termómetro)
        const rutasSeleccionadas = demo.rutasSeleccionadas.map((rutaId, i) => ({
            rutaId,
            orden: i
        }));
        ESTADO.actualizarCampo('rutas', 'seleccionadas', rutasSeleccionadas);

        // Sincronizar con Momento 3
        ESTADO.sincronizarRutasSeleccionadas();

        // Actividades del Momento 3
        demo.actividades.forEach(act => {
            ESTADO.agregarActividad({
                rutaId: act.rutaId,
                nombre: act.actividad,
                mes: act.mes,
                semana: act.semana,
                tipo: act.tipo,
                estado: act.estado
            });
        });

        // Asignar responsables de ejemplo
        const actividades = ESTADO.obtenerSeccion('momento3').calendarizacion.actividades;
        actividades.forEach((act, i) => {
            const actDemo = demo.actividades[i];
            if (actDemo && actDemo.responsable) {
                ESTADO.asignarResponsable(act.id, 'Docente de grupo', actDemo.responsable);
            }
        });

        // Confirmar selección de rutas
        ESTADO.confirmarSeleccionRutas();
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        iniciar,
        cerrar,
        cargarEjemplo
    };

})();
