/* ============================================================
   PLAN LECTOR JALISCO LEO
   app.js — Navegación por momentos y utilidades globales
   v2.0 — Toast con tipos + Modo Demo + window.App expuesto
   ============================================================ */

const App = {

    momentoActual: 0,

    /* ===== INICIALIZACIÓN ===== */
    init() {
        console.log('App.init() — Iniciando Plan Lector Jalisco LEO');
        console.log('Módulos disponibles:');
        console.log('   - Momento0:', typeof window.Momento0);
        console.log('   - Momento1:', typeof window.Momento1);
        console.log('   - Momento2:', typeof window.Momento2);
        console.log('   - Momento3:', typeof window.Momento3);
        console.log('   - Momento4:', typeof window.Momento4);
        console.log('   - Momento5:', typeof window.Momento5);
        console.log('   - PRODUCTOS:', typeof window.PRODUCTOS);
        console.log('   - DEMO:', typeof window.DEMO);

        this.attachNavegacion();
        this.attachAccionesHeader();
        this.attachNavegacionGlobal();

        this.momentoActual = 0;
        this.cambiarMomento(0);

        // Marcar el botón demo si ya estábamos en modo demo
        this.actualizarBotonDemo();
    },

    /* ===== NAVEGACIÓN POR PESTAÑAS ===== */
    attachNavegacion() {
        document.querySelectorAll('.momento-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const numero = parseInt(e.currentTarget.dataset.momento, 10);
                this.cambiarMomento(numero);
            });
        });
    },

    /* ===== NAVEGACIÓN GLOBAL (Anterior / Siguiente) ===== */
    attachNavegacionGlobal() {
        document.addEventListener('click', (e) => {
            const btnSiguiente = e.target.closest('#btn-siguiente-momento');
            const btnAnterior = e.target.closest('#btn-anterior-momento');

            if (btnSiguiente) {
                e.preventDefault();
                console.log(`👉 Siguiente desde Momento ${this.momentoActual}`);
                if (this.momentoActual < 5) {
                    this.cambiarMomento(this.momentoActual + 1);
                }
            }

            if (btnAnterior) {
                e.preventDefault();
                console.log(`👈 Anterior desde Momento ${this.momentoActual}`);
                if (this.momentoActual > 0) {
                    this.cambiarMomento(this.momentoActual - 1);
                }
            }
        });
    },

    /* ===== CAMBIAR DE MOMENTO ===== */
    cambiarMomento(numero) {
        if (numero < 0 || numero > 5) return;

        console.log(`🔄 Cambiando a Momento ${numero}`);

        document.querySelectorAll('.momento-tab').forEach(tab => {
            tab.classList.toggle('activo', parseInt(tab.dataset.momento, 10) === numero);
        });

        document.querySelectorAll('.momento-contenido').forEach(sec => {
            sec.classList.remove('activo');
        });

        const contenedor = document.getElementById(`contenido-momento${numero}`);
        if (contenedor) {
            contenedor.classList.add('activo');
        } else {
            console.error(`No se encontró #contenido-momento${numero}`);
            return;
        }

        this.momentoActual = numero;
        this.cargarMomento(numero);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /* ===== CARGAR MOMENTO ===== */
    cargarMomento(numero) {
        try {
            switch (numero) {
                case 0:
                    if (window.Momento0 && typeof window.Momento0.render === 'function') {
                        if (typeof window.Momento0.cargarEstado === 'function') {
                            window.Momento0.cargarEstado();
                        }
                        window.Momento0.render();
                        console.log('✅ Momento 0 renderizado');
                    } else {
                        console.error('❌ Momento0 no disponible');
                    }
                    break;
                case 1:
                    if (window.Momento1 && typeof window.Momento1.render === 'function') {
                        window.Momento1.render();
                        console.log('✅ Momento 1 renderizado');
                    } else {
                        console.error('❌ Momento1 no disponible');
                    }
                    break;
                case 2:
                    if (window.Momento2 && typeof window.Momento2.render === 'function') {
                        window.Momento2.render();
                        console.log('✅ Momento 2 renderizado');
                    } else {
                        console.warn('⚠️ Momento2 no implementado aún');
                    }
                    break;
                case 3:
                    if (window.Momento3 && typeof window.Momento3.render === 'function') {
                        window.Momento3.render();
                        console.log('✅ Momento 3 renderizado');
                    } else {
                        console.warn('⚠️ Momento3 no implementado aún');
                    }
                    break;
                case 4:
                    if (window.Momento4 && typeof window.Momento4.render === 'function') {
                        window.Momento4.render();
                        console.log('✅ Momento 4 renderizado');
                    } else {
                        console.warn('⚠️ Momento4 no implementado aún');
                    }
                    break;
                case 5:
                    if (window.Momento5 && typeof window.Momento5.render === 'function') {
                        window.Momento5.render();
                        console.log('✅ Momento 5 renderizado');
                    } else {
                        console.warn('⚠️ Momento5 no implementado aún');
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error al cargar Momento ${numero}:`, error);
        }
    },

    /* ===== ACCIONES DEL HEADER ===== */
    attachAccionesHeader() {
        const btnGuardar = document.getElementById('btn-guardar-borrador');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                if (typeof ESTADO !== 'undefined' && typeof ESTADO.guardarBorradorManual === 'function') {
                    const ok = ESTADO.guardarBorradorManual();
                    if (ok) {
                        this.mostrarToast('Borrador guardado correctamente.', 'exito');
                    } else {
                        this.mostrarToast('No se pudo guardar el borrador.', 'error');
                    }
                } else {
                    this.mostrarToast('Borrador guardado correctamente.', 'exito');
                }
            });
        }

        const btnExportar = document.getElementById('btn-exportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                this.mostrarToast('Usa los botones de cada momento para exportar productos específicos.', 'info');
            });
        }

        const btnDemo = document.getElementById('btn-demo');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => this.manejarBotonDemo());
        }
    },

    /* ===== MODO DEMO ===== */
    manejarBotonDemo() {
        const enDemo = this.estaEnModoDemo();

        if (enDemo) {
            // Salir del modo demo → limpiar
            if (confirm('Esto va a borrar los datos de demo y dejar la app en blanco.\n\n¿Continuar?')) {
                if (typeof DEMO !== 'undefined' && typeof DEMO.limpiar === 'function') {
                    DEMO.limpiar();
                } else if (typeof ESTADO !== 'undefined' && typeof ESTADO.reiniciar === 'function') {
                    ESTADO.reiniciar();
                }
                this.actualizarBotonDemo();
                this.cambiarMomento(0);
                this.mostrarToast('Modo demo desactivado. La app está en blanco.', 'info');
            }
        } else {
            // Cargar demo
            if (confirm('Esto va a reemplazar los datos actuales con datos de ejemplo.\n\n¿Continuar?')) {
                if (typeof DEMO !== 'undefined' && typeof DEMO.cargar === 'function') {
                    const ok = DEMO.cargar();
                    if (ok) {
                        this.actualizarBotonDemo();
                        this.cambiarMomento(2); // Llévalo al termómetro, que es vistoso
                        this.mostrarToast('Modo demo activado. Explora la app con datos de ejemplo.', 'exito');
                    } else {
                        this.mostrarToast('No se pudo cargar el modo demo.', 'error');
                    }
                } else {
                    this.mostrarToast('El módulo DEMO aún no está disponible.', 'error');
                }
            }
        }
    },

    estaEnModoDemo() {
        try {
            return localStorage.getItem('plan_lector_jalisco_leo_demo_mode') === 'true';
        } catch (e) {
            return false;
        }
    },

    actualizarBotonDemo() {
        const btn = document.getElementById('btn-demo');
        if (!btn) return;

        if (this.estaEnModoDemo()) {
            btn.innerHTML = '<i class="fas fa-times-circle"></i> Salir del modo demo';
            btn.classList.remove('btn-secundario');
            btn.classList.add('btn-naranja');
        } else {
            btn.innerHTML = '<i class="fas fa-play-circle"></i> Modo Demo';
            btn.classList.remove('btn-naranja');
            btn.classList.add('btn-secundario');
        }
    },

    /* ===== TOAST ===== */
    /* Acepta un segundo parámetro opcional: 'exito' | 'error' | 'info' | 'warning'
       (también funciona con 'success' y 'danger' por compatibilidad) */
    mostrarToast(mensaje, tipo) {
        const contenedor = document.getElementById('toast-container');
        if (!contenedor) {
            console.log(`[Toast ${tipo || 'info'}] ${mensaje}`);
            return;
        }

        // Normalizar tipo
        let tipoNorm = tipo || 'info';
        if (tipoNorm === 'success') tipoNorm = 'exito';
        if (tipoNorm === 'danger')  tipoNorm = 'error';

        const iconos = {
            exito:   'fa-check-circle',
            error:   'fa-exclamation-circle',
            info:    'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        const icono = iconos[tipoNorm] || iconos.info;

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + tipoNorm;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <i class="fas ${icono} toast-icono"></i>
            <span class="toast-mensaje">${this.escaparHTML(mensaje)}</span>
        `;

        contenedor.appendChild(toast);

        // Animación de entrada
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // Auto-cierre
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    escaparHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
};

/* ============================================================
   EXPOSICIÓN A WINDOW
   Los módulos llaman a "APP.mostrarToast(...)" pero también
   funcionan con "App.mostrarToast(...)". Exponemos ambos alias.
   ============================================================ */
if (typeof window !== 'undefined') {
    window.App = App;
    window.APP = App;  // alias para los módulos que usan APP (mayúsculas)
    console.log('✅ App expuesto en window (con alias APP)');
}

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
