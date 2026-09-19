/* ============================================================
   PLAN LECTOR JALISCO LEO
   app.js — Navegación por momentos y utilidades globales
   ============================================================ */

const App = {

    momentoActual: 3, // Momento por defecto (Hoja de Ruta)

    /* ===== INICIALIZACIÓN ===== */
    init() {
        this.attachNavegacion();
        this.attachAccionesHeader();
        this.cargarMomento(this.momentoActual);
        this.attachDemo();
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
        // Actualizar tabs
        document.querySelectorAll('.momento-tab').forEach(tab => {
            tab.classList.toggle('activo', parseInt(tab.dataset.momento, 10) === numero);
        });

        // Ocultar todos los contenidos
        document.querySelectorAll('.momento-contenido').forEach(sec => {
            sec.classList.remove('activo');
        });

        // Mostrar el contenido del momento
        const contenedor = document.getElementById(`contenido-momento${numero}`);
        if (contenedor) {
            contenedor.classList.add('activo');
        }

        // Cargar el momento
        this.cargarMomento(numero);
        this.momentoActual = numero;

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cargarMomento(numero) {
        switch (numero) {
            case 0:
                if (window.Momento0) {
                    Momento0.cargarEstado();
                    Momento0.render();
                }
                break;
            case 1:
                if (window.Momento1) {
                    Momento1.render();
                }
                break;
            case 2:
                if (window.Momento2) {
                    Momento2.render();
                }
                break;
            case 3:
                if (window.Momento3) {
                    Momento3.render();
                }
                break;
            case 4:
                if (window.Momento4) {
                    Momento4.render();
                }
                break;
            case 5:
                if (window.Momento5) {
                    Momento5.render();
                }
                break;
        }
    },

    /* ===== ACCIONES DEL HEADER ===== */
    attachAccionesHeader() {
        // Guardar borrador
        const btnGuardar = document.getElementById('btn-guardar-borrador');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                if (window.Estado) {
                    Estado.guardarBorrador();
                    this.mostrarToast('💾 Borrador guardado correctamente');
                }
            });
        }

        // Exportar PDF
        const btnExportar = document.getElementById('btn-exportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', () => {
                window.print();
            });
        }
    },

    /* ===== MODO DEMO ===== */
    attachDemo() {
        const btnDemo = document.getElementById('btn-demo');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                if (window.Demo) {
                    Demo.iniciar();
                } else {
                    this.mostrarToast('🎬 Modo Demo no disponible');
                }
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
