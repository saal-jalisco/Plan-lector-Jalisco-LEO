/* ============================================================
   PLAN LECTOR JALISCO LEO
   momento1.js — Encuadre (Nuestro marco común)
   ============================================================ */

window.Momento1 = {

    /* ===== ESTADO LOCAL ===== */
    completado: false,
    presentacionAbierta: false,

    /* ===== CONTENIDO DEL ENCUADRE ===== */
    secciones: [
        {
            {
    id: 'que-es-leer',
    titulo: '¿Qué es leer?',
    icono: 'fa-book-open',
    ...
}
            contenido: `
                <p>La lectura, antes que todo, es una <strong>práctica social</strong>. Leemos en la calle, en el camión,
                en la cocina, en el parque, en el trabajo o donde sea que estemos. Leer forma parte de la vida
                cotidiana, a veces se realiza automáticamente, otras veces resulta de una acción planificada,
                en función de un propósito específico.</p>
                <p>Leer implica la <strong>comprensión integral</strong> y la posibilidad de usar activa y efectivamente
                lo que se lee, valorando y comprometiéndose con su contenido. Es una actividad <strong>cognitiva</strong>
                (interactuamos con el texto para construir sentido), <strong>afectiva</strong> (leer para sentir) y
                <strong>social</strong> (se construye en comunidad).</p>
                <p class="cita">"El significado no existe de antemano en el texto o en el lector, sino que se despierta
                o adquiere entidad durante la transacción entre el lector y el texto." — Louise Rosenblatt</p>
            `
        },
        {
            id: 'para-que-leemos',
            titulo: '¿Para qué se lee en la comunidad educativa?',
            icono: '🎯',
            contenido: `
                <p>Leemos por muchas razones: para aprender, para informarnos, para trabajar, para realizar una tarea,
                para tener un momento de ocio o, simplemente, para disfrutar.</p>
                <p>En la comunidad educativa, los propósitos típicos de la lectura son:</p>
                <ul>
                    <li><strong>Leer para aprender</strong> en todas las asignaturas (leer para estudiar).</li>
                    <li><strong>Leer para aprender a leer</strong> (claves para leer estratégicamente).</li>
                    <li><strong>Leer para aprender a disfrutar</strong> de la lectura (lectura libre y autónoma).</li>
                </ul>
                <p>Pero también leemos para participar en la sociedad, para interactuar, para saciar la curiosidad,
                para distraernos. El Plan Lector debe integrar todos estos propósitos.</p>
            `
        },
        {
            id: 'que-es-plan-lector',
            titulo: '¿Qué es un Plan Lector?',
            icono: '📋',
            contenido: `
                <p>Un Plan Lector es un <strong>proyecto</strong> que busca formar más y mejores lectoras y lectores.
                No es solo un listado de libros ni una serie de actividades aisladas.</p>
                <p>Existe una visión restringida y una visión amplia:</p>
                <table class="tabla-comparativa">
                    <thead>
                        <tr><th>Visión restringida</th><th>Visión amplia</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Repertorio de lecturas obligatorias.</td>
                            <td>Proyecto que involucra a todos los estudiantes y prácticas diversas.</td>
                        </tr>
                        <tr>
                            <td>Desarrollo de habilidades del lenguaje.</td>
                            <td>Formación de lectores; integración de prácticas espontáneas y escolares.</td>
                        </tr>
                        <tr>
                            <td>Responsabilidad solo del docente de Lengua.</td>
                            <td>Responsabilidad de toda la comunidad educativa.</td>
                        </tr>
                        <tr>
                            <td>Se realiza principalmente en el domicilio.</td>
                            <td>Se realiza en el aula, la biblioteca, el patio, el hogar y el entorno digital.</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>Nuestro Plan Lector se construye desde la visión amplia.</strong></p>
            `
        },
        {
            id: 'logica-fractal',
            titulo: 'La lógica fractal',
            icono: '🌀',
            contenido: `
                <p>Un fractal es un patrón que se repite a distintas escalas. En la naturaleza lo vemos en los árboles,
                los ríos, las nubes. En la lectura, la lógica fractal significa que <strong>lo que ocurre con cada lector
                debe ocurrir también a escala de aula, biblioteca, escuela, familia y comunidad</strong>.</p>
                <p>El Plan Lector de una comunidad educativa reúne dentro de sí múltiples espacios donde se desarrollan
                acciones de lectura. No se espera homogeneizar las actividades, sino <strong>respetar la diversidad</strong>
                y darle continuidad en torno al gran propósito: formar lectores.</p>
                <p class="cita">"El todo no solo contiene a cada una de sus partes, sino que cada parte mantiene la
                estructura y aspecto del todo."</p>
            `
        },
        {
            id: 'ecosistema-lector',
            titulo: 'El Ecosistema Lector',
            icono: '🌐',
            contenido: `
                <p>El Ecosistema Lector es la red dinámica de personas, recursos, instituciones y prácticas que
                interactúan para que la lectura ocurra, se profundice y se celebre en todos los espacios de vida
                de las y los estudiantes.</p>
                <p>Considera cuatro entornos de actuación complementarios:</p>
                <ul>
                    <li><strong>Escuela:</strong> principal espacio de formación, mediación y encuentro con los textos.</li>
                    <li><strong>Familia:</strong> entorno que amplía las oportunidades de conversación y lectura compartida.</li>
                    <li><strong>Comunidad:</strong> ámbito de participación, recuperación de saberes y circulación de producciones.</li>
                    <li><strong>Espacio digital:</strong> entorno para acceder a recursos y ampliar las comunidades lectoras.</li>
                </ul>
                <p>La competencia lectora se construye en la <strong>interacción</strong>, no en la acumulación.</p>
            `
        },
        {
            id: 'formacion-caracter',
            titulo: 'La Formación del Carácter',
            icono: '🌟',
            contenido: `
                <p>La Formación del Carácter se incorpora como un componente transversal que orienta las experiencias
                de lectura, escritura, diálogo y participación. Se resume en la premisa:</p>
                <p class="frase-destacada">"Leemos para aprender, leemos para ser."</p>
                <p>Cada acción lectora es también una oportunidad para formar el carácter:</p>
                <ul>
                    <li>Al leer juntos practicamos la <strong>empatía</strong> y construimos vínculo.</li>
                    <li>Al esforzarnos con textos difíciles desarrollamos <strong>perseverancia</strong>.</li>
                    <li>Al argumentar con respeto ejercitamos la <strong>escucha</strong> y el <strong>autocontrol</strong>.</li>
                </ul>
                <p>No son dos programas: es una sola formación.</p>
            `
        },
        {
            id: 'lectura-experiencia',
            titulo: 'La lectura como experiencia',
            icono: '✨',
            contenido: `
                <p>Siguiendo a Jorge Larrosa, la experiencia es <strong>lo que nos pasa</strong>, lo que nos afecta,
                nos produce afectos, nos deja huellas.</p>
                <p>En un mundo donde nunca han pasado tantas cosas, la experiencia es cada vez más rara. La información
                no deja lugar para la experiencia.</p>
                <p>Jalisco LEO busca que la lectura no sea solo un acto de información, sino una <strong>auténtica
                experiencia</strong> que nos forma, nos transforma y nos constituye como sujetos.</p>
                <p class="cita">"La experiencia de la lectura es como un viaje: el sujeto de la experiencia, como el
                viajero, se expone atravesando un espacio indeterminado y peligroso." — Jorge Larrosa</p>
            `
        },
        {
            id: 'plan-lector-guia',
            titulo: 'El Plan Lector como guía',
            icono: '🧭',
            contenido: `
                <p>Un Plan Lector es el documento en el que se incorpora el conjunto de objetivos, metodologías y
                actividades que se desarrollan en el centro educativo para garantizar la adquisición de la
                competencia lectora.</p>
                <p>La estrategia Jalisco LEO propone que este proyecto de mediación lectora en cada centro educativo
                sea <strong>el hilo que teje la red</strong> del ecosistema lector.</p>
                <p>El Plan Lector debe ser:</p>
                <ul>
                    <li><strong>Participativo:</strong> involucra a distintas personas de la comunidad.</li>
                    <li><strong>Dialogado:</strong> se construye mediante la interacción dialógica.</li>
                    <li><strong>Contextualizado:</strong> responde a las necesidades y realidades locales.</li>
                    <li><strong>Evaluable:</strong> incluye procedimientos de seguimiento y mejora.</li>
                </ul>
            `
        }
    ],

    /* ===== DATOS JALISCO AVANZA 2025 ===== */
    datosJaliscoAvanza: {
        primaria: [
            { grado: '2°', lectura: 67.8, atencion: 6.9, progreso: 52.3, deseable: 40.8 },
            { grado: '3°', lectura: 59.5, atencion: 6.2, progreso: 67.5, deseable: 26.3 },
            { grado: '4°', lectura: 44.5, atencion: 17.9, progreso: 76.9, deseable: 5.2 },
            { grado: '5°', lectura: 47.8, atencion: 11.6, progreso: 79.5, deseable: 8.9 },
            { grado: '6°', lectura: 45.4, atencion: 19.2, progreso: 69.6, deseable: 11.2 }
        ],
        secundaria: [
            { grado: '1°', lectura: 49.3, atencion: 12.4, progreso: 77.4, deseable: 10.2 },
            { grado: '2°', lectura: 51.1, atencion: 9.5, progreso: 81.3, deseable: 9.2 },
            { grado: '3°', lectura: 49.5, atencion: 11.4, progreso: 79.9, deseable: 8.7 }
        ]
    },

    /* ===== RENDER PRINCIPAL ===== */
    render() {
        const contenedor = document.getElementById('contenido-momento1');
        if (!contenedor) return;

        contenedor.innerHTML = `
            <div class="momento1-contenedor">
                ${this.renderHeader()}
                ${this.renderIntroduccion()}
                ${this.renderDatosJaliscoAvanza()}
                ${this.renderSecciones()}
                ${this.renderAcciones()}
            </div>
        `;

        this.attachEventos();
    },

    /* ===== HEADER ===== */
    renderHeader() {
        return `
            <div class="momento1-header">
                <div class="momento1-badge">MOMENTO 1</div>
                <h1>Encuadre</h1>
                <p class="momento1-subtitulo">Nuestro marco común: ¿qué es leer y por qué un Plan Lector?</p>
            </div>
        `;
    },

    /* ===== INTRODUCCIÓN ===== */
    renderIntroduccion() {
        return `
            <div class="caja-destacada momento1-intro">
                <p>
                    Antes de diseñar acciones, necesitamos construir un <strong>marco común</strong>.
                    ¿Qué entendemos por lectura? ¿Para qué leemos? ¿Qué es un Plan Lector y qué no lo es?
                    Este encuadre nos permite alinear miradas y evitar que el Plan Lector se reduzca a una
                    lista de libros obligatorios.
                </p>
                <p>
                    Te invitamos a recorrer las secciones de este encuadre. Al final, podrás abrir la
                    <strong>presentación HTML</strong> para compartirla con tu comunidad educativa.
                </p>
            </div>
        `;
    },

    /* ===== DATOS JALISCO AVANZA 2025 ===== */
    renderDatosJaliscoAvanza() {
        const renderTabla = (datos, titulo) => `
            <div class="tabla-wrapper momento1-tabla">
                <h3>${titulo}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Grado</th>
                            <th>Media Global Lectura</th>
                            <th>Atención Prioritaria</th>
                            <th>En Progreso</th>
                            <th>Deseable</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(d => `
                            <tr>
                                <td><strong>${d.grado}</strong></td>
                                <td>${d.lectura}%</td>
                                <td class="semaforo-rojo">${d.atencion}%</td>
                                <td class="semaforo-amarillo">${d.progreso}%</td>
                                <td class="semaforo-verde">${d.deseable}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        return `
            <div class="momento1-datos">
                <h2>📊 ¿Por qué actuar? Los datos de Jalisco Avanza 2025</h2>
                <p>
                    Los resultados de la prueba Jalisco Avanza 2025 en Lectura nos muestran un panorama
                    que exige acción. Observa los datos por grado:
                </p>
                ${renderTabla(this.datosJaliscoAvanza.primaria, 'Primaria')}
                ${renderTabla(this.datosJaliscoAvanza.secundaria, 'Secundaria')}
                <div class="caja-alerta momento1-alerta">
                    <p>
                        <strong>Reflexión:</strong> En 4° de primaria, solo el <strong>5.2%</strong> de los estudiantes
                        alcanza el nivel <strong>Deseable</strong> en Lectura. En 1° de secundaria, el <strong>12.4%</strong>
                        está en <strong>Atención Prioritaria</strong>. Estos datos nos muestran la urgencia de construir
                        un Plan Lector que forme lectores autónomos, críticos y creativos.
                    </p>
                </div>
            </div>
        `;
    },

    /* ===== SECCIONES DEL ENCUADRE ===== */
    renderSecciones() {
        return `
            <div class="momento1-secciones">
                <h2>🧭 Nuestro marco común</h2>
                <div class="acordeon">
                    ${this.secciones.map((sec, index) => `
                        <div class="acordeon-item ${index === 0 ? 'abierto' : ''}" data-id="${sec.id}">
                            <button class="acordeon-header" data-id="${sec.id}">
                                <span class="acordeon-icono">${sec.icono}</span>
                                <span class="acordeon-titulo">${sec.titulo}</span>
                                <span class="acordeon-flecha">▼</span>
                            </button>
                            <div class="acordeon-contenido">
                                ${sec.contenido}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /* ===== ACCIONES ===== */
    renderAcciones() {
        return `
            <div class="momento1-acciones">
                <button class="btn btn-primario" id="btn-presentacion-momento1">
                    📽️ Abrir presentación HTML
                </button>
                <button class="btn btn-secundario" id="btn-completar-momento1">
                    ✅ He comprendido el encuadre
                </button>
            </div>
        `;
    },

    /* ===== EVENTOS ===== */
    attachEventos() {
        // Acordeón
        document.querySelectorAll('.acordeon-header').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.currentTarget.closest('.acordeon-item');
                const id = item.dataset.id;
                const estaAbierto = item.classList.contains('abierto');

                // Cerrar todos
                document.querySelectorAll('.acordeon-item').forEach(i => i.classList.remove('abierto'));

                // Abrir el seleccionado si no estaba abierto
                if (!estaAbierto) {
                    item.classList.add('abierto');
                }
            });
        });

        // Presentación
        const btnPresentacion = document.getElementById('btn-presentacion-momento1');
        if (btnPresentacion) {
            btnPresentacion.addEventListener('click', () => {
                this.abrirPresentacion();
            });
        }

        // Completar
        const btnCompletar = document.getElementById('btn-completar-momento1');
        if (btnCompletar) {
            btnCompletar.addEventListener('click', () => {
                this.completado = true;
                if (window.Estado) {
                    Estado.setProgreso('momento1', 100);
                }
                this.mostrarToast('✅ Encuadre completado');
                btnCompletar.textContent = '✅ Encuadre completado';
                btnCompletar.disabled = true;
            });
        }
    },

    /* ===== PRESENTACIÓN HTML ===== */
    abrirPresentacion() {
        const overlay = document.createElement('div');
        overlay.className = 'presentacion-overlay';
        overlay.innerHTML = `
            <div class="presentacion-contenedor">
                <button class="presentacion-cerrar" id="cerrar-presentacion">✕</button>
                <div class="presentacion-diapositivas" id="presentacion-diapositivas">
                    ${this.renderDiapositivas()}
                </div>
                <div class="presentacion-controles">
                    <button class="btn btn-secundario" id="diapositiva-anterior">← Anterior</button>
                    <span class="presentacion-contador" id="presentacion-contador">1 / ${this.totalDiapositivas()}</span>
                    <button class="btn btn-primario" id="diapositiva-siguiente">Siguiente →</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        this.diapositivaActual = 0;
        this.attachEventosPresentacion();
        this.mostrarDiapositiva(0);
    },

    renderDiapositivas() {
        const diapositivas = [
            {
                titulo: 'Plan Lector Jalisco LEO',
                subtitulo: 'Encuadre · Nuestro marco común',
                contenido: `
                    <div class="diapositiva-portada">
                        <h1>Plan Lector Jalisco LEO</h1>
                        <p>Leer, escribir y expresarnos en comunidad</p>
                        <p class="diapositiva-fecha">Encuadre · Momento 1</p>
                    </div>
                `
            },
            {
                titulo: '¿Qué es leer?',
                contenido: `
                    <p>La lectura es una <strong>práctica social</strong>, <strong>cognitiva</strong> y <strong>afectiva</strong>.</p>
                    <p>Leer implica comprender, usar activamente lo que se lee y comprometerse con su contenido.</p>
                    <p class="cita">"El significado se despierta durante la transacción entre el lector y el texto." — Rosenblatt</p>
                `
            },
            {
                titulo: '¿Para qué leemos?',
                contenido: `
                    <ul>
                        <li>Leer para <strong>aprender</strong> en todas las asignaturas.</li>
                        <li>Leer para <strong>aprender a leer</strong> estratégicamente.</li>
                        <li>Leer para <strong>disfrutar</strong> y crear hábitos lectores.</li>
                        <li>Leer para <strong>participar</strong> en la sociedad.</li>
                    </ul>
                `
            },
            {
                titulo: '¿Qué es un Plan Lector?',
                contenido: `
                    <p>Es un <strong>proyecto</strong> que busca formar más y mejores lectores.</p>
                    <p>No es solo un listado de libros ni una serie de actividades aisladas.</p>
                    <p>Es una <strong>responsabilidad compartida</strong> de toda la comunidad educativa.</p>
                `
            },
            {
                titulo: 'La lógica fractal',
                contenido: `
                    <p>Lo que ocurre con cada lector debe ocurrir también a escala de <strong>aula, biblioteca, escuela, familia y comunidad</strong>.</p>
                    <p>El Plan Lector respeta la diversidad y da continuidad en torno a un gran propósito: <strong>formar lectores</strong>.</p>
                `
            },
            {
                titulo: 'El Ecosistema Lector',
                contenido: `
                    <p>Cuatro entornos complementarios:</p>
                    <ul>
                        <li><strong>Escuela:</strong> formación y mediación.</li>
                        <li><strong>Familia:</strong> conversación y lectura compartida.</li>
                        <li><strong>Comunidad:</strong> participación y circulación.</li>
                        <li><strong>Espacio digital:</strong> recursos y conexión.</li>
                    </ul>
                `
            },
            {
                titulo: 'La Formación del Carácter',
                contenido: `
                    <p class="frase-destacada">"Leemos para aprender, leemos para ser."</p>
                    <p>Cada acción lectora forma el carácter: empatía, perseverancia, escucha, autocontrol.</p>
                `
            },
            {
                titulo: 'La lectura como experiencia',
                contenido: `
                    <p>La lectura no es solo información. Es <strong>experiencia</strong>: lo que nos pasa, lo que nos transforma.</p>
                    <p class="cita">"La experiencia de la lectura es como un viaje." — Jorge Larrosa</p>
                `
            },
            {
                titulo: 'Los datos nos interpelan',
                contenido: `
                    <p>Jalisco Avanza 2025 · Lectura:</p>
                    <ul>
                        <li>4° primaria: solo <strong>5.2%</strong> en nivel Deseable.</li>
                        <li>1° secundaria: <strong>12.4%</strong> en Atención Prioritaria.</li>
                        <li>3° secundaria: <strong>11.4%</strong> en Atención Prioritaria.</li>
                    </ul>
                    <p>El Plan Lector es nuestra respuesta.</p>
                `
            },
            {
                titulo: 'El Plan Lector como guía',
                contenido: `
                    <p>Es el documento que incorpora objetivos, metodologías y actividades para garantizar la competencia lectora.</p>
                    <p>Es <strong>participativo</strong>, <strong>dialogado</strong>, <strong>contextualizado</strong> y <strong>evaluable</strong>.</p>
                    <p>Es el hilo que teje la red del ecosistema lector.</p>
                `
            }
        ];

        return diapositivas.map((d, i) => `
            <div class="diapositiva ${i === 0 ? 'activa' : ''}" data-index="${i}">
                <h2>${d.titulo}</h2>
                <div class="diapositiva-contenido">
                    ${d.contenido}
                </div>
            </div>
        `).join('');
    },

    totalDiapositivas() {
        return document.querySelectorAll('.diapositiva').length;
    },

    attachEventosPresentacion() {
        const cerrar = document.getElementById('cerrar-presentacion');
        if (cerrar) {
            cerrar.addEventListener('click', () => this.cerrarPresentacion());
        }

        const anterior = document.getElementById('diapositiva-anterior');
        if (anterior) {
            anterior.addEventListener('click', () => this.cambiarDiapositiva(-1));
        }

        const siguiente = document.getElementById('diapositiva-siguiente');
        if (siguiente) {
            siguiente.addEventListener('click', () => this.cambiarDiapositiva(1));
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.cerrarPresentacion();
            if (e.key === 'ArrowLeft') this.cambiarDiapositiva(-1);
            if (e.key === 'ArrowRight') this.cambiarDiapositiva(1);
        });
    },

    mostrarDiapositiva(index) {
        const diapositivas = document.querySelectorAll('.diapositiva');
        if (!diapositivas.length) return;

        diapositivas.forEach(d => d.classList.remove('activa'));
        if (diapositivas[index]) {
            diapositivas[index].classList.add('activa');
        }

        this.diapositivaActual = index;

        const contador = document.getElementById('presentacion-contador');
        if (contador) {
            contador.textContent = `${index + 1} / ${diapositivas.length}`;
        }
    },

    cambiarDiapositiva(direccion) {
        const total = this.totalDiapositivas();
        let nuevoIndex = this.diapositivaActual + direccion;

        if (nuevoIndex < 0) nuevoIndex = 0;
        if (nuevoIndex >= total) nuevoIndex = total - 1;

        this.mostrarDiapositiva(nuevoIndex);
    },

    cerrarPresentacion() {
        const overlay = document.querySelector('.presentacion-overlay');
        if (overlay) {
            overlay.remove();
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
    // Nada que cargar por ahora
});
