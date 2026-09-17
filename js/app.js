/* ============================================================
   TERMÓMETRO LECTOR · JALISCO LEO
   app.js — Navegación, wizard y guardado
   ============================================================ */

const APP = (function() {

    /* ========================================================
       REFERENCIAS
       ======================================================== */
    const TOTAL_PASOS = 7;
    let pasoActual = 1;

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

        // Configurar pasos clickeables
        configurarPasos();

        // Restaurar paso actual
        const estado = ESTADO.obtener();
        pasoActual = estado.meta.pasoActual || 1;

        // Mostrar paso
        mostrarPaso(pasoActual, false);

        // Notificar
        console.log('🚂 Termómetro Lector iniciado. Paso:', pasoActual);
    }

    /* ========================================================
       CONFIGURAR BOTONES
       ======================================================== */
    function configurarBotones() {
        // Volver
        const btnVolver = document.getElementById('btn-volver');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                if (pasoActual > 1) {
                    mostrarPaso(pasoActual - 1);
                }
            });
        }

        // Continuar
        const btnContinuar = document.getElementById('btn-continuar');
        if (btnContinuar) {
            btnContinuar.addEventListener('click', () => {
                if (validarPasoActual()) {
                    if (pasoActual < TOTAL_PASOS) {
                        mostrarPaso(pasoActual + 1);
                    } else {
                        // Estamos en el Acta: marcar como completado
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
                            const nuevoPaso = ESTADO.getPasoActual();
                            mostrarPaso(nuevoPaso, false);
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
                    '¿Estás segura? Se borrarán todos los datos del diagnóstico actual.',
                    () => {
                        ESTADO.reiniciar();
                        mostrarToast('Diagnóstico reiniciado.', 'info');
                        mostrarPaso(1, false);
                    }
                );
            });
        }
    }

    /* ========================================================
       CONFIGURAR PASOS CLICKEABLES
       ======================================================== */
    function configurarPasos() {
        document.querySelectorAll('#lista-pasos .paso').forEach(li => {
            li.addEventListener('click', () => {
                const paso = parseInt(li.dataset.paso, 10);
                // Solo permitir ir a pasos anteriores o al actual
                // (no saltar hacia adelante sin validar)
                if (paso <= pasoActual) {
                    mostrarPaso(paso);
                } else {
                    // Validar todos los pasos intermedios
                    let puedeAvanzar = true;
                    for (let i = pasoActual; i < paso; i++) {
                        if (!validarPaso(i)) {
                            puedeAvanzar = false;
                            mostrarToast(`Completa primero el paso ${i}.`, 'info');
                            mostrarPaso(i);
                            break;
                        }
                    }
                    if (puedeAvanzar) {
                        mostrarPaso(paso);
                    }
                }
            });
        });
    }

    /* ========================================================
       MOSTRAR PASO
       ======================================================== */
    function mostrarPaso(nuevoPaso, guardar = true) {
        if (nuevoPaso < 1 || nuevoPaso > TOTAL_PASOS) return;

        pasoActual = nuevoPaso;

        // Ocultar todas las secciones
        document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));

        // Mostrar la sección correspondiente
        const seccion = document.getElementById(`seccion-${nuevoPaso}`);
        if (seccion) {
            seccion.classList.add('activa');
        }

        // Actualizar barra de progreso
        actualizarProgreso();

        // Actualizar botones
        actualizarBotones();

        // Guardar paso actual
        if (guardar) {
            ESTADO.setPasoActual(nuevoPaso);
        }

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ========================================================
       ACTUALIZAR PROGRESO
       ======================================================== */
    function actualizarProgreso() {
        // Marcar pasos
        document.querySelectorAll('#lista-pasos .paso').forEach(li => {
            const paso = parseInt(li.dataset.paso, 10);
            li.classList.remove('activo', 'completado');

            if (paso === pasoActual) {
                li.classList.add('activo');
            } else if (paso < pasoActual) {
                li.classList.add('completado');
            } else {
                // Verificar si está completo aunque sea futuro
                if (ESTADO.seccionCompleta(paso)) {
                    li.classList.add('completado');
                }
            }
        });

        // Barra de relleno
        const relleno = document.getElementById('barra-progreso-relleno');
        if (relleno) {
            const porcentaje = (pasoActual / TOTAL_PASOS) * 100;
            relleno.style.width = `${porcentaje}%`;
        }

        // Indicador de paso
        const pasoActualEl = document.getElementById('paso-actual');
        const pasoTotalEl = document.getElementById('paso-total');
        if (pasoActualEl) pasoActualEl.textContent = pasoActual;
        if (pasoTotalEl) pasoTotalEl.textContent = TOTAL_PASOS;
    }

    /* ========================================================
       ACTUALIZAR BOTONES
       ======================================================== */
    function actualizarBotones() {
        const btnVolver = document.getElementById('btn-volver');
        const btnContinuar = document.getElementById('btn-continuar');

        if (btnVolver) {
            btnVolver.disabled = pasoActual === 1;
        }

        if (btnContinuar) {
            if (pasoActual === TOTAL_PASOS) {
                btnContinuar.innerHTML = '<i class="fas fa-check"></i> Completar diagnóstico';
            } else {
                btnContinuar.innerHTML = 'Guardar y continuar <i class="fas fa-arrow-right"></i>';
            }
        }
    }

    /* ========================================================
       VALIDAR PASO ACTUAL
       ======================================================== */
    function validarPasoActual() {
        return validarPaso(pasoActual);
    }

    function validarPaso(numero) {
        switch (numero) {
            case 1: return SECCION1.validar();
            case 2: return SECCION2.validar();
            case 3: return SECCION3.validar(); // opcional
            case 4: return SECCION4.validar(); // opcional
            case 5: return SECCION5.validar();
            case 6: return SECCION6.validar();
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
                mostrarToast('Diagnóstico reiniciado.', 'info');
                break;

            case 'completado':
                mostrarToast('¡Diagnóstico completado! 🎉', 'exito');
                break;
        }
    }

    /* ========================================================
       TOASTS (notificaciones)
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
        mensajeEl.textContent = mensaje;

        // Limpiar listeners previos clonando
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

        // Cerrar con ESC
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

            // Ctrl/Cmd + → → Siguiente paso
            if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
                e.preventDefault();
                if (validarPasoActual() && pasoActual < TOTAL_PASOS) {
                    mostrarPaso(pasoActual + 1);
                }
            }

            // Ctrl/Cmd + ← → Paso anterior
            if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
                e.preventDefault();
                if (pasoActual > 1) {
                    mostrarPaso(pasoActual - 1);
                }
            }
        });
    }

    /* ========================================================
       INICIALIZACIÓN AUTOMÁTICA
       ======================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        init();
        configurarAtajos();

        // Mostrar toast de bienvenida
        setTimeout(() => {
            mostrarToast('¡Bienvenida al Termómetro Lector! 🧡', 'info', 4000);
        }, 800);
    });

    /* ========================================================
       API PÚBLICA
       ======================================================== */
    return {
        init,
        mostrarPaso,
        mostrarToast,
        validarPaso,
        getPasoActual: () => pasoActual
    };

})();