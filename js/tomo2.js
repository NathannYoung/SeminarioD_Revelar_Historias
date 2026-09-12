/**
 * ============================================================================
 * TOMO II: MEMORIAS ANCLADAS A PERSONAS
 * Módulo interactivo del Tomo II (Recortes Familiares de Archivo)
 * ============================================================================
 */

window.Tomo2 = (function() {

  // Catálogo base de combinaciones de personas (14 combinaciones)
  const BASE_CUTOUT_DEFS = [
    // 1 persona
    { base: '1J', count: 1, chars: ['J'], name: 'Juanca' },
    { base: '1M', count: 1, chars: ['M'], name: 'Mamá' },
    { base: '1P', count: 1, chars: ['P'], name: 'Papá' },
    { base: '1Y', count: 1, chars: ['Y'], name: 'Yo' },
    // 2 personas
    { base: '2MJ', count: 2, chars: ['M', 'J'], name: 'Mamá y Juanca' },
    { base: '2MP', count: 2, chars: ['M', 'P'], name: 'Mamá y Papá' },
    { base: '2MY', count: 2, chars: ['M', 'Y'], name: 'Mamá y Yo' },
    { base: '2PJ', count: 2, chars: ['P', 'J'], name: 'Papá y Juanca' },
    { base: '2PY', count: 2, chars: ['P', 'Y'], name: 'Papá y Yo' },
    { base: '2YJ', count: 2, chars: ['Y', 'J'], name: 'Yo y Juanca' },
    // 3 personas
    { base: '3MPJ', count: 3, chars: ['M', 'P', 'J'], name: 'Mamá, Papá y Juanca' },
    { base: '3MPY', count: 3, chars: ['M', 'P', 'Y'], name: 'Mamá, Papá y Yo' },
    { base: '3MYJ', count: 3, chars: ['M', 'Y', 'J'], name: 'Mamá, Yo y Juanca' },
    { base: '3PYJ', count: 3, chars: ['P', 'Y', 'J'], name: 'Papá, Yo y Juanca' }
  ];

  const VARIANTS = ['_00', '_01', '_02', '_03', '_04'];

  // Catálogo completo de 70 recortes fijados permanentemente
  const PERSON_CUTOUTS = [];
  BASE_CUTOUT_DEFS.forEach(def => {
    VARIANTS.forEach(variant => {
      const id = `${def.base}${variant}`;
      PERSON_CUTOUTS.push({
        id: id,
        base: def.base,
        variant: variant,
        count: def.count,
        chars: def.chars,
        name: def.name,
        src: `FOTOS/RECORTES/${id}.png`,
        fallbackSrc: def.base === '1M' ? 'FOTOS/RECORTES/1M_01.png' : `FOTOS/RECORTES/${def.base}.png`
      });
    });
  });

  // Mezcla determinista fija para que los recortes queden armónicamente mezclados siempre en la misma posición exacta
  function shuffleCutoutsDeterministic() {
    let seed = 421984; // Semilla constante para orden fijo garantizado
    function pseudoRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
    for (let i = PERSON_CUTOUTS.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom() * (i + 1));
      const temp = PERSON_CUTOUTS[i];
      PERSON_CUTOUTS[i] = PERSON_CUTOUTS[j];
      PERSON_CUTOUTS[j] = temp;
    }
  }
  shuffleCutoutsDeterministic();

  // Inclinaciones y leves desplazamientos fijos y consistentes para cada celda
  const SLOT_TRANSFORMS = [
    // Página izquierda: 4 posiciones
    { rotate: -2.6, x: -2, y: -4 },  // Arriba-izq: sutil a la izq, un poco más arriba
    { rotate: 3.1,  x: 2,  y: 3 },   // Arriba-der: a la derecha, un poco más abajo
    { rotate: 1.8,  x: -2, y: 2 },   // Abajo-izq: sutil derecha
    { rotate: -3.2, x: 2,  y: -3 },  // Abajo-der: a la izquierda, un poco más arriba
    // Página derecha: 4 posiciones
    { rotate: 2.4,  x: -2, y: 3 },   // Arriba-izq: a la derecha, un poco más abajo
    { rotate: -2.8, x: 2,  y: -4 },  // Arriba-der: a la izquierda, un poco más arriba
    { rotate: -1.7, x: 2,  y: 2 },   // Abajo-izq: sutil izquierda
    { rotate: 3.2,  x: -2, y: -2 }   // Abajo-der: a la derecha
  ];

  let tomo2Wrapper = null;
  let tomo2FrontCover = null;
  let tomo2BackCover = null;
  let tomo2SpreadContainer = null;
  let tomo2LeftPaperContent = null;
  let tomo2RightPaperContent = null;
  let tomo2FlippingLeaf = null;
  let tomo2LeafFront = null;
  let tomo2LeafBack = null;
  let tomo2LeafHighlight = null;
  let tomo2LeafShadow = null;
  let tomo2UnderLeafShadow = null;
  let detachedPhotoCutouts = null;

  let spreadIndex = 0;
  let isTurning = false;

  // Calcula el estado actual de asignación de personajes
  function getAssignedState() {
    const selectedIds = window.AppDesk.selectedCutoutIds || [];
    const assignedChars = new Set();
    let totalCount = 0;

    selectedIds.forEach(id => {
      const item = PERSON_CUTOUTS.find(c => c.id === id);
      if (item) {
        totalCount += item.count;
        item.chars.forEach(ch => assignedChars.add(ch));
      }
    });

    return {
      selectedIds,
      assignedChars,
      totalCount,
      remainingCount: Math.max(0, 4 - totalCount),
      isComplete: totalCount === 4 && assignedChars.size === 4
    };
  }

  // Número fijo de pliegos: Pliego 0 (portadilla), Pliegos 1 a 9 (70 recortes), Pliego 10 (cortesía en blanco)
  function getMaxSpreadIndex() {
    return 10;
  }

  // Renderiza las 4 siluetas de líneas punteadas flotando por encima del libro (sin letras, más grandes y espaciadas)
  function getDottedTrackerHTML() {
    const { assignedChars } = getAssignedState();

    const charDefs = [
      {
        key: 'M',
        name: 'Mamá',
        path: 'M 19 4 C 13 4 9 10 9 18 C 9 24 11 31 10 38 C 12 40 15 42 19 42 C 23 42 26 40 28 38 C 27 31 29 24 29 18 C 29 10 25 4 19 4 Z M 11 40 C 7 43 3 46 2 50 L 36 50 C 35 46 31 43 27 40 Z'
      },
      {
        key: 'P',
        name: 'Papá',
        path: 'M 19 5 C 13 5 11 11 11 18 C 11 26 14 32 19 34 C 24 32 27 26 27 18 C 27 11 25 5 19 5 Z M 12 36 C 7 40 3 44 2 50 L 36 50 C 35 44 31 40 26 36 Z'
      },
      {
        key: 'Y',
        name: 'Yo',
        path: 'M 19 6 C 13 6 12 12 12 18 C 12 25 15 30 19 31 C 23 30 26 25 26 18 C 26 12 25 6 19 6 Z M 13 34 C 8 38 4 43 2 50 L 36 50 C 34 43 30 38 25 34 Z'
      },
      {
        key: 'J',
        name: 'Juanca',
        path: 'M 19 8 C 14 8 13 13 13 18 C 13 24 15 28 19 29 C 23 28 25 24 25 18 C 25 13 24 8 19 8 Z M 14 32 C 10 36 5 42 3 50 L 35 50 C 33 42 28 36 24 32 Z'
      }
    ];

    return `
      <div class="tomo2-floating-tracker" id="tomo2FloatingTracker">
        ${charDefs.map(def => {
          const isAssigned = assignedChars.has(def.key);
          return `
            <div class="tomo2-dashed-char-icon ${isAssigned ? 'assigned' : 'pending'}" 
                 data-char-key="${def.key}" 
                 role="button" 
                 tabindex="0" 
                 title="${def.name}: ${isAssigned ? 'Asignado (clic para liberar)' : 'Pendiente'}">
              <svg viewBox="0 0 38 52" xmlns="http://www.w3.org/2000/svg">
                <path class="char-path" d="${def.path}" />
              </svg>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Dibuja en el lugar de la foto que desaparece una silueta con líneas punteadas
  function getDashedGhostSVG(item) {
    if (!item || !item.chars) return '';
    const chars = item.chars;
    const paths = {
      M: 'M 19 4 C 13 4 9 10 9 18 C 9 24 11 31 10 38 C 12 40 15 42 19 42 C 23 42 26 40 28 38 C 27 31 29 24 29 18 C 29 10 25 4 19 4 Z M 11 40 C 7 43 3 46 2 50 L 36 50 C 35 46 31 43 27 40 Z',
      P: 'M 19 5 C 13 5 11 11 11 18 C 11 26 14 32 19 34 C 24 32 27 26 27 18 C 27 11 25 5 19 5 Z M 12 36 C 7 40 3 44 2 50 L 36 50 C 35 44 31 40 26 36 Z',
      Y: 'M 19 6 C 13 6 12 12 12 18 C 12 25 15 30 19 31 C 23 30 26 25 26 18 C 26 12 25 6 19 6 Z M 13 34 C 8 38 4 43 2 50 L 36 50 C 34 43 30 38 25 34 Z',
      J: 'M 19 8 C 14 8 13 13 13 18 C 13 24 15 28 19 29 C 23 28 25 24 25 18 C 25 13 24 8 19 8 Z M 14 32 C 10 36 5 42 3 50 L 35 50 C 33 42 28 36 24 32 Z'
    };

    if (chars.length === 1) {
      const p = paths[chars[0]] || paths['M'];
      return `
        <svg viewBox="0 0 38 52" class="ghost-silhouette-svg single-ghost">
          <path d="${p}" class="ghost-path" />
        </svg>
      `;
    } else if (chars.length === 2) {
      const p1 = paths[chars[0]] || paths['M'];
      const p2 = paths[chars[1]] || paths['P'];
      return `
        <svg viewBox="0 0 74 52" class="ghost-silhouette-svg double-ghost">
          <g transform="translate(4, 0)">
            <path d="${p1}" class="ghost-path" />
          </g>
          <g transform="translate(32, 0)">
            <path d="${p2}" class="ghost-path" />
          </g>
        </svg>
      `;
    } else {
      const p1 = paths[chars[0]] || paths['M'];
      const p2 = paths[chars[1]] || paths['P'];
      const p3 = paths[chars[2]] || paths['Y'];
      return `
        <svg viewBox="0 0 96 52" class="ghost-silhouette-svg triple-ghost">
          <g transform="translate(2, 0)">
            <path d="${p1}" class="ghost-path" />
          </g>
          <g transform="translate(28, 0)">
            <path d="${p2}" class="ghost-path" />
          </g>
          <g transform="translate(54, 0)">
            <path d="${p3}" class="ghost-path" />
          </g>
        </svg>
      `;
    }
  }

  // Renderiza una celda individual fija respetando la inclinación y posición
  function getSlotHTML(item, slotIdx = 0) {
    if (!item) {
      return `<div class="tomo2-cutout-slot empty-slot"></div>`;
    }

    const st = SLOT_TRANSFORMS[slotIdx % SLOT_TRANSFORMS.length];
    const slotTransform = `transform: rotate(${st.rotate}deg) translate(${st.x}px, ${st.y}px);`;

    const { selectedIds, assignedChars, remainingCount, isComplete } = getAssignedState();
    const isSelected = selectedIds.includes(item.id);
    const sharesAssigned = item.chars.some(ch => assignedChars.has(ch));
    const exceedsCount = item.count > remainingCount;

    // Si ya está seleccionada: se muestra limpia con la misma inclinación
    if (isSelected) {
      return `
        <div class="tomo2-cutout-slot slot-selected" data-cutout-id="${item.id}" role="button" tabindex="0" title="Seleccionada (clic para quitar)">
          <div class="tomo2-cutout-img-wrapper selected" style="${slotTransform}">
            <img src="${item.src}" 
                 onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${item.fallbackSrc}';}" 
                 alt="${item.name}" 
                 class="tomo2-cutout-only-img" />
          </div>
        </div>
      `;
    }

    // Si está excluida: en su lugar exacto se dibuja una silueta sutil en líneas punteadas respetando inclinación y posición
    if (sharesAssigned || exceedsCount || isComplete) {
      return `
        <div class="tomo2-cutout-slot slot-dashed-placeholder" aria-hidden="true" title="Personaje ya asignado">
          <div class="tomo2-dashed-ghost-wrap" style="${slotTransform}">
            ${getDashedGhostSVG(item)}
          </div>
        </div>
      `;
    }

    // Si está disponible: recorte PNG limpio con su inclinación y posición fija
    return `
      <div class="tomo2-cutout-slot" data-cutout-id="${item.id}" role="button" tabindex="0" title="Seleccionar recorte">
        <div class="tomo2-cutout-img-wrapper" style="${slotTransform}">
          <img src="${item.src}" 
               onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${item.fallbackSrc}';}" 
               alt="${item.name}" 
               class="tomo2-cutout-only-img" />
        </div>
      </div>
    `;
  }

  // Cuadrícula fija de 4 posiciones por página (2x2) con índice base
  function getPageFixedGridHTML(slotItems, baseSlotIdx = 0) {
    return `
      <div class="tomo2-fixed-photos-grid">
        ${slotItems.map((item, i) => getSlotHTML(item, baseSlotIdx + i)).join('')}
      </div>
    `;
  }

  // Contenido de la página izquierda
  function getLeftHTML(idx) {
    const texNum = ((idx * 2) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png');"></div>`;

    // Spread 0: Dedicatoria vacía
    if (idx === 0) {
      return `${texHTML}<div class="empty-left-page"></div>`;
    }

    // Spread final: Cortesía en blanco
    if (idx >= 10) {
      return `${texHTML}<div class="empty-left-page"></div>`;
    }

    const leftFolio = String(idx * 2).padStart(2, '0');
    const startIdx = (idx - 1) * 8;
    const pageItems = [
      PERSON_CUTOUTS[startIdx],
      PERSON_CUTOUTS[startIdx + 1],
      PERSON_CUTOUTS[startIdx + 2],
      PERSON_CUTOUTS[startIdx + 3]
    ];

    return `
      ${texHTML}
      <div class="tomo2-clean-page-layout">
        ${getPageFixedGridHTML(pageItems, 0)}
        <div class="folio-left">${leftFolio}</div>
      </div>
    `;
  }

  // Contenido de la página derecha
  function getRightHTML(idx) {
    const texNum = ((idx * 2 + 1) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png');"></div>`;

    // Spread 0: Portadilla con título y cita de Roland Barthes
    if (idx === 0) {
      return `
        ${texHTML}
        <div class="tomo2-frontispiece-right">
          <h2 class="tomo2-frontispiece-title">Memorias ancladas a personas.</h2>
          <p class="tomo2-frontispiece-subtitle">Registro de mi círculo familiar cercano.</p>
          <div class="tomo2-frontispiece-divider"></div>
          <blockquote class="tomo2-frontispiece-quote">
            «La fotografía repite mecánicamente lo que nunca más podrá repetirse existencialmente.»
          </blockquote>
          <span class="tomo2-frontispiece-author">Roland Barthes</span>
        </div>
      `;
    }

    // Spread final: Cortesía en blanco
    if (idx >= 10) {
      return `${texHTML}<div class="empty-left-page"></div>`;
    }

    const rightFolio = String(idx * 2 + 1).padStart(2, '0');
    const startIdx = (idx - 1) * 8 + 4;
    const pageItems = [
      PERSON_CUTOUTS[startIdx],
      PERSON_CUTOUTS[startIdx + 1],
      PERSON_CUTOUTS[startIdx + 2],
      PERSON_CUTOUTS[startIdx + 3]
    ];

    return `
      ${texHTML}
      <div class="tomo2-clean-page-layout">
        ${getPageFixedGridHTML(pageItems, 4)}
        <div class="folio-right">${rightFolio}</div>
      </div>
    `;
  }

  // Renderiza el pliego activo y enlaza los eventos de clic
  function renderSpread(index) {
    if (tomo2LeftPaperContent) tomo2LeftPaperContent.innerHTML = getLeftHTML(index);
    if (tomo2RightPaperContent) tomo2RightPaperContent.innerHTML = getRightHTML(index);

    // Renderizar o actualizar las 4 siluetas punteadas por encima del libro
    updateFloatingTracker();

    // Eventos de selección y deselección sobre las imágenes del libro
    [tomo2LeftPaperContent, tomo2RightPaperContent].forEach(container => {
      if (!container) return;

      container.querySelectorAll('.tomo2-cutout-slot:not(.slot-hidden):not(.empty-slot)').forEach(slot => {
        slot.addEventListener('click', (e) => {
          e.stopPropagation();
          const cutoutId = slot.getAttribute('data-cutout-id');
          if (slot.classList.contains('slot-selected')) {
            deselectCutout(cutoutId);
          } else {
            selectCutout(cutoutId);
          }
        });
      });
    });

    applyCutoutsToDeskPhoto();
  }

  // Actualiza o inserta el rastreador de siluetas punteadas por encima del libro
  function updateFloatingTracker() {
    if (!tomo2SpreadContainer) return;

    let trackerEl = document.getElementById('tomo2FloatingTracker');
    if (!trackerEl) {
      const trackerWrap = document.createElement('div');
      trackerWrap.innerHTML = getDottedTrackerHTML();
      trackerEl = trackerWrap.firstElementChild;
      tomo2SpreadContainer.appendChild(trackerEl);
    } else {
      trackerEl.outerHTML = getDottedTrackerHTML();
      trackerEl = document.getElementById('tomo2FloatingTracker');
    }

    if (trackerEl) {
      trackerEl.querySelectorAll('.tomo2-dashed-char-icon.assigned').forEach(icon => {
        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          const charKey = icon.getAttribute('data-char-key');
          deselectByChar(charKey);
        });
      });
    }
  }

  // Selecciona un recorte
  function selectCutout(id) {
    const selected = window.AppDesk.selectedCutoutIds || [];
    if (selected.includes(id)) return;

    selected.push(id);
    window.AppDesk.selectedCutoutIds = selected;

    const state = getAssignedState();
    applyCutoutsToDeskPhoto();
    renderSpread(spreadIndex);

    if (state.isComplete) {
      // Tras completar los 4 personajes, breve pausa y cierre cinemático desbloqueando la cámara
      setTimeout(() => {
        closeToLeft();
        if (tomo2Wrapper) {
          tomo2Wrapper.classList.remove('pulse-glow');
        }
        window.Camara.unlockMechanics();
      }, 750);
    }
  }

  // Deselecciona un recorte
  function deselectCutout(id) {
    const selected = window.AppDesk.selectedCutoutIds || [];
    const idx = selected.indexOf(id);
    if (idx >= 0) {
      selected.splice(idx, 1);
      window.AppDesk.selectedCutoutIds = selected;
      applyCutoutsToDeskPhoto();
      renderSpread(spreadIndex);
    }
  }

  // Deselecciona buscando la foto que asignó a un personaje en particular
  function deselectByChar(charKey) {
    const selected = window.AppDesk.selectedCutoutIds || [];
    const targetId = selected.find(id => {
      const item = PERSON_CUTOUTS.find(c => c.id === id);
      return item && item.chars.includes(charKey);
    });
    if (targetId) {
      deselectCutout(targetId);
    }
  }

  // Distribuye los recortes en el paisaje según una de las 3 opciones aleatorias (left, center, right)
  // con borde inferior fijado (bottom: 0%) y solapamiento estrecho e íntimo entre figuras
  function getCutoutLayout(selectedIds, alignment) {
    const N = selectedIds.length;
    if (N === 0) return [];

    const alignMode = alignment || window.AppDesk.cutoutAlignment || 'center';

    // Configuraciones de posiciones según alineación ('left', 'center', 'right')
    // con solapamiento estrecho (distancia menor que el ancho para solaparse):
    const layoutConfigs = {
      left: {
        1: { lefts: [18], width: 30, height: 56 },
        2: { lefts: [10, 24], width: 30, height: 56 },
        3: { lefts: [6, 18, 30], width: 28, height: 54 },
        4: { lefts: [4, 14, 24, 34], width: 26, height: 52 }
      },
      center: {
        1: { lefts: [35], width: 30, height: 56 },
        2: { lefts: [26, 42], width: 30, height: 56 },
        3: { lefts: [21, 34, 47], width: 28, height: 54 },
        4: { lefts: [16, 27, 38, 49], width: 26, height: 52 }
      },
      right: {
        1: { lefts: [54], width: 30, height: 56 },
        2: { lefts: [46, 60], width: 30, height: 56 },
        3: { lefts: [42, 54, 66], width: 28, height: 54 },
        4: { lefts: [38, 48, 58, 68], width: 26, height: 52 }
      }
    };

    const modeConfig = layoutConfigs[alignMode] || layoutConfigs['center'];
    const cfg = modeConfig[N] || modeConfig[Math.min(4, Math.max(1, N))];

    return selectedIds.map((id, index) => {
      const item = PERSON_CUTOUTS.find(c => c.id === id) || { name: id, count: 1 };
      const leftPercent = cfg.lefts[index] !== undefined ? cfg.lefts[index] : (cfg.lefts[0] + index * 11);

      return {
        id,
        item,
        left: `${leftPercent}%`,
        bottom: '0%',
        width: `${cfg.width}%`,
        height: `${cfg.height}%`,
        zIndex: index + 1
      };
    });
  }

  // Aplica los recortes fotográficos sobre la foto del paisaje en la mesa
  function applyCutoutsToDeskPhoto() {
    if (!detachedPhotoCutouts) return;
    const selectedIds = window.AppDesk.selectedCutoutIds || [];
    const alignment = window.AppDesk.cutoutAlignment || 'center';
    const layout = getCutoutLayout(selectedIds, alignment);

    detachedPhotoCutouts.innerHTML = layout.map(pos => `
      <div class="placed-cutout" style="left:${pos.left}; bottom:${pos.bottom}; width:${pos.width}; height:${pos.height}; z-index:${pos.zIndex};">
        <img src="FOTOS/RECORTES/${pos.id}.png" 
             onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${pos.item.fallbackSrc || ''}';}" 
             alt="${pos.item.name || pos.id}" 
             class="placed-cutout-img" />
      </div>
    `).join('');
  }

  let isTransitioning = false;

  function setState(newState) {
    if (!tomo2Wrapper) return;
    const STATES = window.AppDesk.STATES;
    tomo2Wrapper.classList.remove(STATES.STACKED, STATES.OPEN, STATES.CLOSED_LEFT);
    tomo2Wrapper.classList.add(newState);
    window.AppDesk.tomo2State = newState;
  }

  function open(targetIndex = 0) {
    if (!window.AppDesk.activeLandscapeSpread || !window.AppDesk.isTomo2Unlocked || isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    const prevState = window.AppDesk.tomo2State;

    if (prevState === STATES.OPEN) {
      spreadIndex = targetIndex;
      renderSpread(spreadIndex);
      return;
    }

    if (window.AppDesk.tomo1State === STATES.OPEN) window.Tomo1.closeToLeft();
    if (window.AppDesk.tomo3State === STATES.OPEN) window.Tomo3.closeToStack();

    if (tomo2Wrapper) {
      tomo2Wrapper.classList.remove('pulse-glow', 'book-closing-in-center-to-stack', 'book-closing-in-center-to-left');
    }

    isTransitioning = true;
    spreadIndex = targetIndex;

    if (prevState === STATES.CLOSED_LEFT) {
      // FASE 1: El Tomo 2 cerrado viaja desde la izquierda hacia arriba/centro con contratapa visible
      tomo2Wrapper.classList.add('traveling-closed-left-to-center');
      setTimeout(() => {
        tomo2Wrapper.classList.remove('traveling-closed-left-to-center');
        // FASE 2: Estando arriba en el centro, se abre por la mitad hacia la derecha
        setState(STATES.OPEN);
        renderSpread(spreadIndex);
        tomo2Wrapper.classList.add('book-opening-in-center-from-left');
        setTimeout(() => {
          tomo2Wrapper.classList.remove('book-opening-in-center-from-left');
          isTransitioning = false;
        }, 460);
      }, 440);
    } else {
      // FASE 1: El Tomo 2 cerrado viaja desde la pila de la derecha hacia arriba/centro con portada visible
      tomo2Wrapper.classList.add('traveling-closed-to-center');
      setTimeout(() => {
        tomo2Wrapper.classList.remove('traveling-closed-to-center');
        // FASE 2: Estando arriba en el centro, se abre por la mitad hacia la izquierda (revelando el interior)
        setState(STATES.OPEN);
        renderSpread(spreadIndex);
        tomo2Wrapper.classList.add('book-opening-in-center-from-stack');
        setTimeout(() => {
          tomo2Wrapper.classList.remove('book-opening-in-center-from-stack');
          isTransitioning = false;
        }, 460);
      }, 440);
    }
  }

  function closeToStack() {
    if (isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo2State === STATES.OPEN && tomo2Wrapper) {
      isTransitioning = true;
      tomo2Wrapper.classList.remove('book-opening-in-center-from-stack', 'book-opening-in-center-from-left');
      // FASE 1: Se cierra por la mitad hacia la derecha en el centro ("arriba")
      tomo2Wrapper.classList.add('book-closing-in-center-to-stack');

      setTimeout(() => {
        tomo2Wrapper.classList.remove('book-closing-in-center-to-stack');
        tomo2Wrapper.classList.add('closed-at-center');
        setState(STATES.STACKED);
        void tomo2Wrapper.offsetWidth;

        // FASE 2: Desliza cerrado desde el centro hacia la pila de la derecha
        requestAnimationFrame(() => {
          tomo2Wrapper.classList.remove('closed-at-center');
          setTimeout(() => {
            isTransitioning = false;
            if (window.AppDesk.isTomo2Unlocked && tomo2Wrapper) {
              tomo2Wrapper.classList.add('pulse-glow');
            }
          }, 460);
        });
      }, 420);
      return;
    }
    setState(STATES.STACKED);
  }

  function closeToLeft() {
    if (isTransitioning) return;
    if (!window.AppDesk.activeLandscapeSpread) {
      closeToStack();
      return;
    }
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo2State === STATES.OPEN && tomo2Wrapper) {
      isTransitioning = true;
      tomo2Wrapper.classList.remove('book-opening-in-center-from-stack', 'book-opening-in-center-from-left');
      // FASE 1: Se cierra por la mitad hacia la izquierda en el centro ("arriba")
      tomo2Wrapper.classList.add('book-closing-in-center-to-left');

      setTimeout(() => {
        tomo2Wrapper.classList.remove('book-closing-in-center-to-left');
        tomo2Wrapper.classList.add('closed-left-at-center');
        setState(STATES.CLOSED_LEFT);
        void tomo2Wrapper.offsetWidth;

        // FASE 2: Desliza cerrado hacia la izquierda de la mesa
        requestAnimationFrame(() => {
          tomo2Wrapper.classList.remove('closed-left-at-center');
          setTimeout(() => {
            isTransitioning = false;
          }, 460);
        });
      }, 420);
      return;
    }
    setState(STATES.CLOSED_LEFT);
  }

  function unlock() {
    window.AppDesk.isTomo2Unlocked = true;
    if (tomo2Wrapper) {
      tomo2Wrapper.classList.add('pulse-glow');
      tomo2Wrapper.setAttribute('title', 'Tomo II desbloqueado: Haz clic para elegir a las personas');
    }
  }

  function lock() {
    window.AppDesk.isTomo2Unlocked = false;
    window.AppDesk.selectedCutoutIds = [];
    if (tomo2Wrapper) {
      tomo2Wrapper.classList.remove('pulse-glow');
      tomo2Wrapper.setAttribute('title', 'Tomo II: Elige un paisaje en el Tomo I primero');
    }
    if (detachedPhotoCutouts) detachedPhotoCutouts.innerHTML = '';
  }

  function flipForward() {
    if (isTurning || spreadIndex >= getMaxSpreadIndex()) return;

    isTurning = true;
    const nextIndex = spreadIndex + 1;

    tomo2LeafFront.innerHTML = getRightHTML(spreadIndex);
    tomo2LeafBack.innerHTML = getLeftHTML(nextIndex);

    tomo2FlippingLeaf.className = 'flipping-leaf animate-forward';
    tomo2UnderLeafShadow.className = 'under-leaf-shadow active shadow-turn-forward';

    setTimeout(() => {
      spreadIndex = nextIndex;
      renderSpread(spreadIndex);
      tomo2FlippingLeaf.className = 'flipping-leaf';
      tomo2FlippingLeaf.style.transform = '';
      tomo2UnderLeafShadow.className = 'under-leaf-shadow';
      tomo2UnderLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function flipBackward() {
    if (isTurning || spreadIndex <= 0) return;

    isTurning = true;
    const prevIndex = spreadIndex - 1;

    tomo2LeafFront.innerHTML = getRightHTML(prevIndex);
    tomo2LeafBack.innerHTML = getLeftHTML(spreadIndex);

    tomo2FlippingLeaf.className = 'flipping-leaf animate-backward';
    tomo2UnderLeafShadow.className = 'under-leaf-shadow active shadow-turn-backward';

    setTimeout(() => {
      spreadIndex = prevIndex;
      renderSpread(spreadIndex);
      tomo2FlippingLeaf.className = 'flipping-leaf';
      tomo2FlippingLeaf.style.transform = '';
      tomo2UnderLeafShadow.className = 'under-leaf-shadow';
      tomo2UnderLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function init() {
    tomo2Wrapper = document.getElementById('tomo2BookWrapper');
    tomo2FrontCover = document.getElementById('tomo2FrontCover');
    tomo2BackCover = document.getElementById('tomo2BackCover');
    tomo2SpreadContainer = document.getElementById('tomo2SpreadContainer');
    tomo2LeftPaperContent = document.getElementById('tomo2LeftPaperContent');
    tomo2RightPaperContent = document.getElementById('tomo2RightPaperContent');
    tomo2FlippingLeaf = document.getElementById('tomo2FlippingLeaf');
    tomo2LeafFront = document.getElementById('tomo2LeafFront');
    tomo2LeafBack = document.getElementById('tomo2LeafBack');
    tomo2LeafHighlight = document.getElementById('tomo2LeafHighlight');
    tomo2LeafShadow = document.getElementById('tomo2LeafShadow');
    tomo2UnderLeafShadow = document.getElementById('tomo2UnderLeafShadow');
    detachedPhotoCutouts = document.getElementById('detachedPhotoCutouts');

    window.AppDesk.initInteractiveBookDrag({
      container: tomo2SpreadContainer,
      leftContent: tomo2LeftPaperContent,
      rightContent: tomo2RightPaperContent,
      leaf: tomo2FlippingLeaf,
      leafFront: tomo2LeafFront,
      leafBack: tomo2LeafBack,
      leafHighlight: tomo2LeafHighlight,
      underLeafShadow: tomo2UnderLeafShadow,
      getSpreadIndex: () => spreadIndex,
      setSpreadIndex: (idx) => { spreadIndex = idx; },
      getMaxSpreadIndex: () => getMaxSpreadIndex(),
      getLeftHTML: getLeftHTML,
      getRightHTML: getRightHTML,
      renderSpread: renderSpread,
      isBookOpen: () => window.AppDesk.tomo2State === window.AppDesk.STATES.OPEN,
      isTurning: () => isTurning,
      setTurning: (val) => { isTurning = val; },
      flipForward: flipForward,
      flipBackward: flipBackward,
      excludeSelectors: ['.tomo2-floating-tracker']
    });

    function handleStackedClick(e) {
      if (window.AppDesk.tomo2State !== window.AppDesk.STATES.STACKED) return;
      e.stopPropagation();

      if (!window.AppDesk.activeLandscapeSpread || !window.AppDesk.isTomo2Unlocked) {
        if (tomo2Wrapper) {
          tomo2Wrapper.classList.add('tomo-shake');
          setTimeout(() => tomo2Wrapper.classList.remove('tomo-shake'), 420);
        }
        return;
      }

      open(0);
    }

    if (tomo2Wrapper) {
      tomo2Wrapper.addEventListener('click', (e) => {
        if (window.AppDesk.tomo2State === window.AppDesk.STATES.STACKED) {
          handleStackedClick(e);
        } else if (window.AppDesk.tomo2State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken) {
            e.stopPropagation();
            window.AppDesk.resetExperienceToStart();
          }
        }
      });
    }

    if (tomo2FrontCover) {
      tomo2FrontCover.addEventListener('click', handleStackedClick);
    }

    if (tomo2BackCover) {
      tomo2BackCover.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AppDesk.tomo2State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken) {
            window.AppDesk.resetExperienceToStart();
            return;
          }
          open(spreadIndex || 1);
        }
      });
    }

    renderSpread(0);
  }

  return {
    init,
    open,
    closeToStack,
    closeToLeft,
    unlock,
    lock,
    flipForward,
    flipBackward,
    applyCutoutsToDeskPhoto,
    getCutoutLayout,
    shuffleCutouts: shuffleCutoutsDeterministic,
    PERSON_CUTOUTS,
    getSpreadIndex: () => spreadIndex
  };

})();
