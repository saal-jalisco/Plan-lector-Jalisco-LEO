/* ============================================================
   PLAN LECTOR JALISCO LEO
   app.js — Navegación por momentos y utilidades globales
   ============================================================ */

const App = {

    momentoActual: 0,

    /* ===== INICIALIZACIÓN ===== */
    init() {
        console.log('🚂 App.init() — Iniciando Plan Lector Jalisco LEO');
        console.log('📦 Módulos disponibles:');
        console.log('   - Estado:', typeof window.Estado);
        console.log('   - Datos:', typeof window.Datos);
        console.log('   - Momento0:', typeof window.Momento0);
        console.log('   - Momento1:', typeof window.Momento1);
        console.log('   - Momento2:', typeof window.Momento2);
        console.log('   - Momento3:', typeof window.Momento3);

        this.attachNavegacion();
        this.attachAccionesHeader();
        this.attachDemo();

        // Cargar el momento inicial SIEMPRE como 0
        this.momentoActual = 0;
        this.cambiarMomento(0);
    },

    /* ===== NAVEGACIÓN POR MOMENTOS ===== */
    attachNavegacion() {
        const tabs = document.querySelectorAll('.momento-tab');
        console.log(`🔗 ${tabs.length} pestañas de momento encontradas`);

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const numero = parseInt(e.currentTarget.dataset.momento, 10);
                console.log(`👉 Cambiando a Momento ${numero}`);
                this.cambiarMomento(numero);
            });
        });
    },

    cambiarMomento(numero) {
        console.log(`🔄 cambiarMomento(${numero})`);

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
        } else {
            console.error(`❌ No se encontró #contenido-momento${numero}`);
            return;
        }

        // Cargar el momento
        this.cargarMomento(numero);
        this.momentoActual = numero;

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cargarMomento(numero) {
        console.log(`🔄 Cargando Momento ${numero}...`);

        try {
            switch (numero) {
                case 0:
                    if (window.Momento0 && typeof Momento0.render === 'function') {
                        if (typeof Momento0.cargarEstado === 'function') {
                            Momento0.cargarEstado();
                        }
                        Momento0.render();
                        console.log('✅ Momento 0 renderizado');
                    } else {
                        console.error('❌ Momento0 no está definido o no tiene render()');
                    }
                    break;
                case 1:
                    if (window.Momento1 && typeof Momento1.render === 'function') {
                        Momento1.render();
                        console.log('✅ Momento 1 renderizado');
                    } else {
                        console.error('❌ Momento1 no está definido o no tiene render()');
                    }
                    break;
                case 2:
                    if (window.Momento2 && typeof Momento2.render === 'function') {
                        Momento2.render();
                        console.log('✅ Momento 2 renderizado');
                    } else {
                        console.warn('⚠️ Momento2 no implementado aún');
                    }
                    break;
                case 3:
                    if (window.Momento3 && typeof Momento3.render === 'function') {
                        Momento3.render();
                        console.log('✅ Momento 3 renderizado');
                    } else {
                        console.warn('⚠️ Momento3 no implementado aún');
                    }
                    break;
                case 4:
                    if (window.Momento4 && typeof Momento4.render === 'function') {
                        Momento4.render();
                        console.log('✅ Momento 4 renderizado');
                    } else {
                        console.warn('⚠️ Momento4 no implementado aún');
                    }
                    break;
                case 5:
                    if (window.Momento5 && typeof Momento5.render === 'function') {
                        Momento5.render();
                        console.log('✅ Momento 5 renderizado');
                    } else {
                        console.warn('⚠️ Momento5 no implementado aún');
                    }
                    break;
            }
        } catch (error) {
            console.error(`❌ Error al cargar Momento ${numero}:`, error);
        }
    },

    /* ===== ACCIONES DEL HEADER ===== */
    attachAccionesHeader() {
        const btnGuardar = document.getElementById('btn-guardar-borrador');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', () => {
                if (window.Estado && typeof Estado.guardarBorrador === 'function') {
                    Estado.guardarBorrador();
                    this.mostrarToast('💾 Borrador guardado correctamente');
                } else {
                    this.mostrarToast('⚠️ Función de guardado no disponible');
                }
            });
        }

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
