/* ============================================================
   PLAN LECTOR JALISCO LEO
   app.js — Navegación por momentos y control general
   ============================================================ */

const APP = (function() {

    /* ========================================================
       CONSTANTES
       ======================================================== */
    const TOTAL_PASOS_TERMOMETRO = 7;
    const MOMENTOS = ['momento0', 'momento1', 'momento2', 'momento3', 'momento4', 'momento5'];

    let momentoActual = 'momento3'; // Por defecto, el corazón
    let pasoTermometro = 1;

    /* ========================================================
       INICIALIZACIÓN
       ======================================================== */
    function init() {
        // Cargar estado
        ESTADO.init();

        // Suscribir a eventos del estado
        ESTADO.suscribir(manejarEventoEstado);

        // Configurar botones
        configurarBotones();

        // Configurar pestañas de momentos
        configurarMomentos();

        // Configurar sub-pasos del Termómetro
        configurarPasosTermometro();

        // Restaurar momento y paso actual
        const meta = ESTADO.obtener().meta;
        momentoActual = meta.momentoActual || 'momento3';
        pasoTermometro = meta.pasoActual || 1;

        // Mostrar momento actual
        mostrarMomento(momentoActual, false);

        // Si es Momento 3, inicializarlo
        if (momentoActual === 'momento3' && typeof MOMENTO3 !== 'undefined') {
            MOMENTO3.init();
        }

        // Notificar
        console.log('🚂 Plan Lector Jalisco LEO iniciado. Momento:', momentoActual);
    }

    /* ========================================================
       CONFIGURAR BOTONES
       ======================================================== */
    function configurarBotones() {
        // Volver (Termómetro)
        const btnVolver = document.getElementById('btn-volver');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                if (pasoTermometro > 1) {
                    mostrarPasoTermometro(pasoTermometro - 1);
                }
            });
        }

        // Continuar (Termómetro)
        const btnContinuar = document.getElementById('btn-continuar');
        if (btnContinuar) {
            btnContinuar.addEventListener('click', () => {
                if (validarPasoTermometro()) {
                    if (pasoTermometro < TOTAL_PASOS_TERMOMETRO) {
                        mostrarPasoTermometro(pasoTermometro + 1);
                    } else {
                        ESTADO.marcarCompletado();
                        mostrarToast('¡Diagnóstico completado! 🎉', 'exito');
                    }
                }
            });
        }

        // Guardar borrador
        const btnGuardar = document.getElementById('btn-guardar-borrador');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                if (ESTADO.guardarBorradorManual()) {
                    mostrarToast('Borrador guardado correctamente.', 'exito');
                } else {
                    mostrarToast('Error al guardar borrador.', 'error');
                }
            });
        }

        // Cargar borrador
        const btnCargar = document.getElementById('btn-cargar-borrador');
        if (btnCargar) {
            btnCargar.addEventListener('click', () => {
                mostrarModalConfirmacion(
                    'Cargar borrador',
                    '¿Cargar el último borrador guardado? Se reemplazará el estado actual.',
                    () => {
                        if (ESTADO.cargarBorradorManual()) {
                            mostrarToast('Borrador cargado correctamente.', 'exito');
                            // Recargar el momento actual
                            mostrarMomento(momentoActual, false);
                            if (momentoActual === 'momento3' && typeof MOMENTO3 !== 'undefined') {
                                MOMENTO3.init();
                            }
                        } else {
                            mostrarToast('No hay borrador guardado.', 'error');
                        }
                    }
                );
            });
        }

        // Reiniciar
        const btnReiniciar = document.getElementById('btn-reiniciar');
        if (btnReiniciar) {
            btnReiniciar.addEventListener('click', () => {
                mostrarModalConfirmacion(
                    'Reiniciar todo',
                    '¿Estás segura? Se borrarán todos los datos del Plan Lector actual.',
                    () => {
                        ESTADO.reiniciar();
                        mostrarToast('Plan Lector reiniciado.', 'info');
                        mostrarMomento('momento3', false);
                        if (typeof MOMENTO3 !== 'undefined') {
                            MOMENTO3.init();
                        }
                    }
                );
            });
        }

        // Modo Demo
        const btnDemo = document.getElementById('btn-modo-demo');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                if (typeof DEMO !== 'undefined' && DEMO.iniciar) {
                    DEMO.iniciar();
                } else {
                    mostrarToast('Modo Demo en desarrollo. Estará disponible pronto.', 'info');
                }
            });
        }
    }

    /* ========================================================
       CONFIGURAR PESTAÑAS DE MOMENTOS
       ======================================================== */
    function configurarMomentos() {
        document.querySelectorAll('#lista-momentos .momento').forEach(li => {
            li.addEventListener('click', () => {
                const momentoId = li.dataset.momento;
                mostrarMomento(momentoId);
            });
        });
    }

    /* ========================================================
       MOSTRAR MOMENTO
       ======================================================== */
    function mostrarMomento(momentoId, guardar = true) {
        if (!MOMENTOS.includes(momentoId)) return;

        momentoActual = momentoId;

        // Ocultar todos los momentos
        document.querySelectorAll('.momento-contenido').forEach(m => m.classList.remove('activo'));

        // Mostrar el momento correspondiente
        const momentoEl = document.getElementById(momentoId);
        if (momentoEl) {
            momentoEl.classList.add('activo');
        }

        // Actualizar pestañas
        document.querySelectorAll('#lista-momentos .momento').forEach(li => {
            li.classList.toggle('activo', li.dataset.momento === momentoId);
        });

        // Actualizar barra de progreso global
        actualizarProgresoGlobal();

        // Guardar momento actual
        if (guardar) {
            ESTADO.setMomentoActual(momentoId);
        }

        // Inicializar el momento si es necesario
        if (momentoId === 'momento3' && typeof MOMENTO3 !== 'undefined') {
            MOMENTO3.init();
        }

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ========================================================
       ACTUALIZAR PROGRESO GLOBAL
       ======================================================== */
    function actualizarProgresoGlobal() {
        const momentosCompletados = calcularMomentosCompletados();
        const porcentaje = (momentosCompletados / MOMENTOS.length) * 100;

        const relleno = document.getElementById('barra-progreso-relleno');
        if (relleno) {
            relleno.style.width = `${porcentaje}%`;
        }
    }

    /* ========================================================
       CALCULAR MOMENTOS COMPLETADOS
       ======================================================== */
    function calcularMomentosCompletados() {
        let completados = 0;

        // Momento 0: Preparación (placeholder, siempre cuenta como 0)
        // Momento 1: Encuadre (placeholder, siempre cuenta como 0)

        // Momento 2: Termómetro Lector (7 secciones)
        let seccionesTermometro = 0;
        for (let i = 1; i <= 7; i++) {
            if (ESTADO.seccionCompleta(i)) seccionesTermometro++;
        }
        if (seccionesTermometro >= 6) completados++; // Consideramos completo si al menos 6 de 7

        // Momento 3: Hoja de Ruta Trimestral
        if (typeof MOMENTO3 !== 'undefined') {
            const validaciones = ESTADO.momento3Completo();
            if (validaciones.completo) completados++;
        }

        // Momento 4: Cierre y Acuerdos (placeholder, siempre cuenta como 0)
        // Momento 5: Evaluación y Documentación (placeholder, siempre cuenta como 0)

        return completados;
    }

    /* ========================================================
       CONFIGURAR PASOS DEL TERMÓMETRO (SUB-PESTAÑAS)
       ======================================================== */
    function configurarPasosTermometro() {
        document.querySelectorAll('#lista-pasos .paso').forEach(li => {
            li.addEventListener('click', () => {
                const paso = parseInt(li.dataset.paso, 10);
                if (paso <= pasoTermometro) {
                    mostrarPasoTermometro(paso);
                } else {
                    let puedeAvanzar = true;
                    for (let i = pasoTermometro; i < paso; i++) {
                        if (!validarPasoTermometro(i)) {
                            puedeAvanzar = false;
                            mostrarToast(`Completa primero el paso ${i}.`, 'info');
                            mostrarPasoTermometro(i);
                            break;
                        }
                    }
                    if (puedeAvanzar) {
                        mostrarPasoTermometro(paso);
                    }
                }
            });
        });
    }

    /* ========================================================
       MOSTRAR PASO DEL TERMÓMETRO
       ======================================================== */
    function mostrarPasoTermometro(nuevoPaso, guardar = true) {
        if (nuevoPaso < 1 || nuevoPaso > TOTAL_PASOS_TERMOMETRO) return;

        pasoTermometro = nuevoPaso;

        // Ocultar todas las secciones
        document.querySelectorAll('.seccion-termometro').forEach(s => s.classList.remove('activa'));

        // Mostrar la sección correspondiente
        const seccion = document.querySelector(`.seccion-termometro[data-seccion="${nuevoPaso}"]`);
        if (seccion) {
            seccion.classList.add('activa');
        }

        // Actualizar barra de progreso del Termómetro
        actualizarProgresoTermometro();

        // Actualizar botones
        actualizarBotonesTermometro();

        // Guardar paso actual
        if (guardar) {
            ESTADO.setPasoActual(nuevoPaso);
        }

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ========================================================
       ACTUALIZAR PROGRESO DEL TERMÓMETRO
       ======================================================== */
    function actualizarProgresoTermometro() {
        document.querySelectorAll('#lista-pasos .paso').forEach(li => {
            const paso = parseInt(li.dataset.paso, 10);
            li.classList.remove('activo', 'completado');

            if (paso === pasoTermometro) {
                li.classList.add('activo');
            } else if (paso < pasoTermometro) {
                li.classList.add('completado');
            } else {
                if (ESTADO.seccionCompleta(paso)) {
                    li.classList.add('completado');
                }
            }
        });

        const pasoActualEl = document.getElementById('paso-actual');
        const pasoTotalEl = document.getElementById('paso-total');
        if (pasoActualEl) pasoActualEl.textContent = pasoTermometro;
        if (pasoTotalEl) pasoTotalEl.textContent = TOTAL_PASOS_TERMOMETRO;
    }

    /* ========================================================
       ACTUALIZAR BOTONES DEL TERMÓMETRO
       ======================================================== */
    function actualizarBotonesTermometro() {
        const btnVolver = document.getElementById('btn-volver');
        const btnContinuar = document.getElementById('btn-continuar');

        if (btnVolver) {
            btnVolver.disabled = pasoTermometro === 1;
        }

        if (btnContinuar) {
            if (pasoTermometro === TOTAL_PASOS_TERMOMETRO) {
                btnContinuar.innerHTML = '<i class="fas fa-check"></i> Completar diagnóstico';
            } else {
                btnContinuar.innerHTML = 'Guardar y continuar <i class="fas fa-arrow-right"></i>';
            }
        }
    }

    /* ========================================================
       VALIDAR PASO DEL TERMÓMETRO
       ======================================================== */
    function validarPasoTermometro(numero) {
        const paso = numero || pasoTermometro;
        switch (paso) {
            case 1: return typeof SECCION1 !== 'undefined' ? SECCION1.validar() : true;
            case 2: return typeof SECCION2 !== 'undefined' ? SECCION2.validar() : true;
            case 3: return typeof SECCION3 !== 'undefined' ? SECCION3.validar() : true;
            case 4: return typeof SECCION4 !== 'undefined' ? SECCION4.validar() : true;
            case 5: return typeof SECCION5 !== 'undefined' ? SECCION5.validar() : true;
            case 6: return typeof SECCION6 !== 'undefined' ? SECCION6.validar() : true;
            case 7: return true; // Acta siempre válida
            default: return true;
        }
    }

    /* ========================================================
       MANEJAR EVENTOS DEL ESTADO
       ======================================================== */
    function manejarEventoEstado(evento, datos) {
        switch (evento) {
            case 'guardado':
                if (datos && datos.exito === false) {
                    mostrarToast('Error al guardar. Verifica el espacio de almacenamiento.', 'error');
                }
                break;

            case 'borradorGuardado':
                if (datos && datos.exito) {
                    mostrarToast('Borrador guardado.', 'exito');
                }
                break;

            case 'borradorCargado':
                if (datos && datos.exito === false) {
                    mostrarToast('No se pudo cargar el borrador.', 'error');
                }
                break;

            case 'reiniciado':
                mostrarToast('Plan Lector reiniciado.', 'info');
                break;

            case 'completado':
                mostrarToast('¡Diagnóstico completado! 🎉', 'exito');
                break;

            case 'momento3SeleccionConfirmada':
                mostrarToast('Selección de rutas confirmada.', 'exito');
                break;
        }
    }

    /* ========================================================
       TOASTS
       ======================================================== */
    function mostrarToast(mensaje, tipo = 'info', duracion = 3500) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const iconos = {
            exito: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <i class="fas ${iconos[tipo] || iconos.info}"></i>
            <span>${mensaje}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('saliendo');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duracion);
    }

    /* ========================================================
       MODAL DE CONFIRMACIÓN
       ======================================================== */
    function mostrarModalConfirmacion(titulo, mensaje, onAceptar) {
        const modal = document.getElementById('modal-confirmacion');
        const tituloEl = document.getElementById('modal-titulo');
        const mensajeEl = document.getElementById('modal-mensaje');
        const btnAceptar = document.getElementById('modal-aceptar');
        const btnCancelar = document.getElementById('modal-cancelar');

        if (!modal || !tituloEl || !mensajeEl) return;

        tituloEl.textContent = titulo;
        if (typeof mensaje === 'string') {
            mensajeEl.textContent = mensaje;
        } else {
            mensajeEl.innerHTML = '';
            mensajeEl.appendChild(mensaje);
        }

        const nuevoAceptar = btnAceptar.cloneNode(true);
        const nuevoCancelar = btnCancelar.cloneNode(true);
        btnAceptar.replaceWith(nuevoAceptar);
        btnCancelar.replaceWith(nuevoCancelar);

        modal.style.display = 'flex';

        nuevoCancelar.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        nuevoAceptar.addEventListener('click', () => {
            modal.style.display = 'none';
            if (typeof onAceptar === 'function') {
                onAceptar();
            }
        });

        const cerrarConEsc = (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.removeEventListener('keydown', cerrarConEsc);
            }
        };
        document.addEventListener('keydown', cerrarConEsc);
    }

    /* ========================================================
       ATAJOS DE TECLADO
       ======================================================== */
    function configurarAtajos() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S → Guardar borrador
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                ESTADO.guardarBorradorManual();
                mostrarToast('Borrador guardado.', 'exito');
            }
        });
    }

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        mostrarMomento,
        mostrarPasoTermometro,
        mostrarToast,
        mostrarModalConfirmacion,
        validarPasoTermometro,
        getMomentoActual: () => momentoActual,
        getPasoTermometro: () => pasoTermometro
    };

})();

// ============================================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
    configurarAtajosAPP();

    setTimeout(() => {
        APP.mostrarToast('¡Bienvenida al Plan Lector Jalisco LEO! 🧡', 'info', 4000);
    }, 800);
});

// ============================================================
// ATAJOS GLOBALES (fuera del módulo para evitar conflictos)
// ============================================================
function configurarAtajosAPP() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
            e.preventDefault();
            if (APP.getMomentoActual() === 'momento2') {
                if (APP.validarPasoTermometro() && APP.getPasoTermometro() < 7) {
                    APP.mostrarPasoTermometro(APP.getPasoTermometro() + 1);
                }
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
            e.preventDefault();
            if (APP.getMomentoActual() === 'momento2') {
                if (APP.getPasoTermometro() > 1) {
                    APP.mostrarPasoTermometro(APP.getPasoTermometro() - 1);
                }
            }
        }
    });
}
