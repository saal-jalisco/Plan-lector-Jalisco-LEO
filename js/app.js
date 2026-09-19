/* ============================================================
   PLAN LECTOR JALISCO LEO
   app.js — Navegación por momentos y utilidades globales
   ============================================================ */

const App = {

    momentoActual: 0,

    /* ===== INICIALIZACIÓN ===== */
    init() {
        console.log('App.init() — Iniciando Plan Lector Jalisco LEO');
        console.log('Módulos disponibles:');
        console.log('   - Momento0:', typeof window.Momento0);
        console.log('   - Momento1:', typeof window.Momento1);

        this.attachNavegacion();
        this.attachAccionesHeader();
        this.attachNavegacionGlobal();  // ← NUEVO: listener global

        this.momentoActual = 0;
        this.cambiarMomento(0);
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

    /* ===== NAVEGACIÓN GLOBAL (Anterior / Siguiente) =====
       Un solo listener en document que atrapa clics en botones
       con id="btn-siguiente-momento" o id="btn-anterior-momento",
       sin importar cuándo se creen. */
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
                this.mostrarToast('Borrador guardado correctamente');
            });
        }

        const btnExportar = document.getElementById('btn-exportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                window.print();
            });
        }

        const btnDemo = document.getElementById('btn-demo');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                this.mostrarToast('Modo Demo próximamente');
            });
        }
    },

    /* ===== TOAST ===== */
    mostrarToast(mensaje) {
        const contenedor = document.getElementById('toast-container');
        if (!contenedor) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = mensaje;
        contenedor.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

/* ===== INICIALIZACIÓN ===== */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
