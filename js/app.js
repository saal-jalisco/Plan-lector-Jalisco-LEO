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

        this.momentoActual = 0;
        this.cambiarMomento(0);
    },

    /* ===== NAVEGACIÓN POR MOMENTOS ===== */
    attachNavegacion() {
        document.querySelectorAll('.momento-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const numero = parseInt(e.currentTarget.dataset.momento, 10);
                this.cambiarMomento(numero);
            });
        });
    },

    cambiarMomento(numero) {
        if (numero < 0 || numero > 5) return;

        document.querySelectorAll('.momento-tab').forEach(tab => {
            tab.classList.toggle('activo', parseInt(tab.dataset.momento, 10) === numero);
        });

        document.querySelectorAll('.momento-contenido').forEach(sec => {
            sec.classList.remove('activo');
        });

        const contenedor = document.getElementById(`contenido-momento${numero}`);
        if (contenedor) {
            contenedor.classList.add('activo');
        }

        this.cargarMomento(numero);
        this.momentoActual = numero;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cargarMomento(numero) {
        try {
            switch (numero) {
                case 0:
                    if (window.Momento0 && typeof window.Momento0.render === 'function') {
                        if (typeof window.Momento0.cargarEstado === 'function') {
                            window.Momento0.cargarEstado();
                        }
                        window.Momento0.render();
                    }
                    break;
                case 1:
                    if (window.Momento1 && typeof window.Momento1.render === 'function') {
                        window.Momento1.render();
                    }
                    break;
                case 2:
                    if (window.Momento2 && typeof window.Momento2.render === 'function') {
                        window.Momento2.render();
                    }
                    break;
                case 3:
                    if (window.Momento3 && typeof window.Momento3.render === 'function') {
                        window.Momento3.render();
                    }
                    break;
                case 4:
                    if (window.Momento4 && typeof window.Momento4.render === 'function') {
                        window.Momento4.render();
                    }
                    break;
                case 5:
                    if (window.Momento5 && typeof window.Momento5.render === 'function') {
                        window.Momento5.render();
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
