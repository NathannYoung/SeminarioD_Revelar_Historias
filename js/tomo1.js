/**
 * ============================================================================
 * TOMO I: RECUERDOS ANCLADOS AL ESPACIO
 * Módulo interactivo del Tomo I (Libro de Paisajes)
 * ============================================================================
 */

window.Tomo1 = (function() {

  // --- DATOS DE LOS SPREADS (0 = DEDICATORIA, 1..16 = PAISAJES, 17 = PÁGINAS EN BLANCO) ---
  const SPREADS_DATA = [
    // Spread 0: Portadilla y Cita de Ernesto Sabato
    {
      isIntro: true,
      left: { empty: true },
      right: {
        title: "Memorias ancladas al espacio.",
        subtitle: "Registros de paisajes donde buscaba algo.",
        quote: "«Siempre es levemente siniestro volver a los lugares que han sido testigos de un instante de perfección.»",
        author: "Ernesto Sabato"
      }
    },
    // Spread 1 (Entrada 01)
    {
      id: 1,
      numStr: "01",
      entryLabel: "Entrada 01:",
      title: "El Cauce y la Cortadera.",
      location: "San Luis (El Trapiche)",
      date: "14 de Enero, 1999",
      text: "El agua fresca corre mansa sorteando los cantos rodados del arroyo. A la orilla, los penachos blancos de las cortaderas se mecen con el aire serrano, guardando el silencio de una tarde que se resiste a terminar.",
      leftFolio: "02",
      rightFolio: "03",
      palette: ["#2b332b", "#62705e", "#a3a88a", "#e4e5d8"]
    },
    // Spread 2 (Entrada 02)
    {
      id: 2,
      numStr: "02",
      entryLabel: "Entrada 02:",
      title: "Escarcha en las Alturas.",
      location: "San Luis (Comechingones)",
      date: "18 de Julio, 1998",
      text: "En la cima de las sierras, la noche congeló el pastizal en agujas de plata. Cerca del refugio solitario, la mirada se pierde hacia el llano mientras el sol tibio empieza a desarmar la helada.",
      leftFolio: "04",
      rightFolio: "05",
      palette: ["#1c2938", "#4e6a85", "#9ab4c7", "#e8eff5"]
    },
    // Spread 3 (Entrada 03)
    {
      id: 3,
      numStr: "03",
      entryLabel: "Entrada 03:",
      title: "Murallas de Arcilla Roja.",
      location: "San Juan (Ischigualasto)",
      date: "5 de Febrero, 2000",
      text: "Paredones sedimentarios que guardan milenios en cada estrato de tierra colorada. El aire seco resuena en los cañadones, donde el tiempo parece haberse detenido bajo el cielo limpio del desierto.",
      leftFolio: "06",
      rightFolio: "07",
      palette: ["#3d1a14", "#8c3b28", "#c86743", "#f2b591"]
    },
    // Spread 4 (Entrada 04)
    {
      id: 4,
      numStr: "04",
      entryLabel: "Entrada 04:",
      title: "Estratos de Sal.",
      location: "Jujuy (Salinas Grandes)",
      date: "22 de Enero, 1999",
      text: "Capas milimétricas de salitre y mineral recortadas contra el azul profundo de la puna. Una pared blanca que encandila la vista y atesora el eco silencioso de las alturas norteñas.",
      leftFolio: "08",
      rightFolio: "09",
      palette: ["#19243b", "#586982", "#b1b9c4", "#edf1f5"]
    },
    // Spread 5 (Entrada 05)
    {
      id: 5,
      numStr: "05",
      entryLabel: "Entrada 05:",
      title: "El Vértigo de la Selva.",
      location: "Cataratas del Iguazú",
      date: "8 de Febrero, 1998",
      text: "El rumor ensordecedor anuncia la caída mucho antes de verla. Desde la pasarela de madera, la vegetación espesa se funde con una nube de rocío que moja las caras y suspende todo alrededor.",
      leftFolio: "10",
      rightFolio: "11",
      palette: ["#1b2d18", "#3f5e30", "#7d9768", "#dbe5ce"]
    },
    // Spread 6 (Entrada 06)
    {
      id: 6,
      numStr: "06",
      entryLabel: "Entrada 06:",
      title: "Cuenca del Viento.",
      location: "San Juan (Valle de la Luna)",
      date: "15 de Julio, 1999",
      text: "La meseta rojiza desciende hacia un bajo interminable de arbustos achaparrados y sombras largas. No hay apuro en este suelo antiguo donde el viento sigue puliendo la piedra con paciencia.",
      leftFolio: "12",
      rightFolio: "13",
      palette: ["#301b14", "#77422f", "#b97b5a", "#e8c2a5"]
    },
    // Spread 7 (Entrada 07)
    {
      id: 7,
      numStr: "07",
      entryLabel: "Entrada 07:",
      title: "Destellos en el Vado.",
      location: "San Luis (Merlo)",
      date: "27 de Enero, 2000",
      text: "Rayos de sol quebrados sobre el agua transparente que baja de la montaña. Piedras redondeadas y tibias bajo el calor de la siesta, invitando a demorar el paso junto a la orilla.",
      leftFolio: "14",
      rightFolio: "15",
      palette: ["#222a1f", "#54604b", "#909d84", "#dbe2d4"]
    },
    // Spread 8 (Entrada 08)
    {
      id: 8,
      numStr: "08",
      entryLabel: "Entrada 08:",
      title: "Cumbres de Salitre.",
      location: "San Luis (Salinas del Bebedero)",
      date: "3 de Febrero, 1999",
      text: "Montañas blancas alzadas en medio del llano árido que semejan nieve tibia bajo el sol del verano. El horizonte se pierde en una claridad cegadora donde el suelo y el cielo casi se tocan.",
      leftFolio: "16",
      rightFolio: "17",
      palette: ["#1d2d44", "#415a77", "#8fa2b8", "#e0e6ed"]
    },
    // Spread 9 (Entrada 09)
    {
      id: 9,
      numStr: "09",
      entryLabel: "Entrada 09:",
      title: "Oleaje en el Nahuel Huapi.",
      location: "Bariloche (Nahuel Huapi)",
      date: "24 de Enero, 1998",
      text: "El viento del sur levanta crestas blancas sobre el lago azul y frío. En el fondo, los cerros aún guardan manchas de nieve eterna que custodian la inmensidad del agua patagónica.",
      leftFolio: "18",
      rightFolio: "19",
      palette: ["#0d233a", "#1a4971", "#4f82a8", "#bcd4e6"]
    },
    // Spread 10 (Entrada 10)
    {
      id: 10,
      numStr: "10",
      entryLabel: "Entrada 10:",
      title: "El Remanso del Valle.",
      location: "San Luis (Potrero de los Funes)",
      date: "19 de Enero, 2000",
      text: "Una curva serena del río corta el monte bajo y refleja el brillo del atardecer. Los plumerillos mecidos por la brisa acompañan la caída del sol tras las crestas suaves de las sierras.",
      leftFolio: "20",
      rightFolio: "21",
      palette: ["#29281e", "#5a593e", "#999468", "#dddab8"]
    },
    // Spread 11 (Entrada 11)
    {
      id: 11,
      numStr: "11",
      entryLabel: "Entrada 11:",
      title: "Penumbra en las Yungas.",
      location: "Jujuy (Parque Nacional Calilegua)",
      date: "12 de Julio, 2000",
      text: "Haces de luz filtrados entre las ramas dibujan senderos sobre la alfombra de musgo húmedo. Caminar entre estos troncos delgados es adentrarse en un abrigo verde y silencioso.",
      leftFolio: "22",
      rightFolio: "23",
      palette: ["#172615", "#324e2d", "#64845a", "#bcd1b4"]
    },
    // Spread 12 (Entrada 12)
    {
      id: 12,
      numStr: "12",
      entryLabel: "Entrada 12:",
      title: "Portales de Piedra Roja.",
      location: "San Ignacio, Misiones",
      date: "11 de Febrero, 1999",
      text: "Muros rojizos de arenisca que desafían el paso de los siglos. Por los umbrales vacíos cruza la luz de la mañana, uniendo las huellas de la piedra con la vegetación que avanza despacio.",
      leftFolio: "24",
      rightFolio: "25",
      palette: ["#361912", "#733321", "#ad5a3e", "#e8a98f"]
    },
    // Spread 13 (Entrada 13)
    {
      id: 13,
      numStr: "13",
      entryLabel: "Entrada 13:",
      title: "Correntada al Mediodía.",
      location: "Cataratas del Iguazú (Paseo Superior)",
      date: "16 de Enero, 1998",
      text: "El agua se arremolina con fuerza entre las islas de palmeras, refractando el sol de frente con destellos incandescentes antes de precipitarse al fondo de la garganta.",
      leftFolio: "26",
      rightFolio: "27",
      palette: ["#292518", "#5e5430", "#9c8f58", "#e4dcad"]
    },
    // Spread 14 (Entrada 14)
    {
      id: 14,
      numStr: "14",
      entryLabel: "Entrada 14:",
      title: "Al Pie del Salto.",
      location: "Cataratas del Iguazú (Salto Bossetti)",
      date: "17 de Enero, 1998",
      text: "Frente a la catarata no hacen falta palabras: solo el vaho tibio que empapa las barandas y la sensación imborrable de estar suspendido al borde del torrente más caudaloso.",
      leftFolio: "28",
      rightFolio: "29",
      palette: ["#1b2721", "#3b5247", "#739486", "#cde0d7"]
    },
    // Spread 15 (Entrada 15)
    {
      id: 15,
      numStr: "15",
      entryLabel: "Entrada 15:",
      title: "Relieves de Arena.",
      location: "San Juan (Médanos de Caucete)",
      date: "28 de Julio, 1999",
      text: "Grandes médanos dibujados por el viento cuyano que esculpen pliegues y surcos en la ladera. Una geografía dorada y cambiante que renace con cada ráfaga bajo el cielo de invierno.",
      leftFolio: "30",
      rightFolio: "31",
      palette: ["#30241b", "#6e5540", "#b39474", "#e7d6c2"]
    },
    // Spread 16 (Entrada 16)
    {
      id: 16,
      numStr: "16",
      entryLabel: "Entrada 16:",
      title: "Nieve en el Catedral.",
      location: "Bariloche (Cerro Catedral)",
      date: "22 de Julio, 2000",
      text: "Un manto blanco y virgen cubre los bosques de lengas en la pendiente. La montaña en reposo regala su aire más frío y limpio, coronando las vacaciones con la pureza de la cordillera.",
      leftFolio: "32",
      rightFolio: "33",
      palette: ["#14233c", "#325078", "#7096c4", "#d9e7f5"]
    },
    // Spread 17: Dos páginas finales en blanco (Páginas de respeto)
    {
      isBlankEnd: true,
      left: { empty: true },
      right: { empty: true }
    }
  ];

  // Elementos DOM
  let tomo1Wrapper = null;
  let bookFrontCover = null;
  let bookBackCover = null;
  let bookSpreadContainer = null;
  let leftPaperContent = null;
  let rightPaperContent = null;
  let flippingLeaf = null;
  let leafFront = null;
  let leafBack = null;
  let leafHighlight = null;
  let leafShadow = null;
  let underLeafShadow = null;
  let detachedPhotoStage = null;
  let detachedPhotoCard = null;
  let detachedPhotoLandscape = null;

  let spreadIndex = 0;
  let isTurning = false;

  function resolveSpread(spreadOrIdx) {
    if (typeof spreadOrIdx === 'number') {
      return { spread: SPREADS_DATA[spreadOrIdx], index: spreadOrIdx };
    }
    const idx = SPREADS_DATA.indexOf(spreadOrIdx);
    return { spread: spreadOrIdx, index: idx >= 0 ? idx : (spreadOrIdx ? spreadOrIdx.id || 0 : 0) };
  }

  function getLeftHTML(spreadOrIdx) {
    const { spread, index } = resolveSpread(spreadOrIdx);
    const texNum = ((index * 2) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png');"></div>`;
    
    if (!spread || spread.isIntro || spread.isBlankEnd) {
      return `${texHTML}<div class="empty-left-page"></div>`;
    }

    const locationDateStr = spread.location ? `${spread.location} — ${spread.date}` : spread.date;

    return `
      ${texHTML}
      <div class="entry-layout-left">
        <div class="entry-text-block">
          <div class="entry-date-sub">${locationDateStr}</div>
          <div class="entry-label-plain">${spread.entryLabel}</div>
          <h2 class="entry-title-text">${spread.title}</h2>
          <p class="entry-narrative">${spread.text}</p>
        </div>
        <div class="folio-left">${spread.leftFolio}</div>
      </div>
    `;
  }

  function getRightHTML(spreadOrIdx) {
    const { spread, index } = resolveSpread(spreadOrIdx);
    if (!spread) return '';
    const texNum = ((index * 2 + 1) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png');"></div>`;

    if (spread.isBlankEnd) {
      return `${texHTML}<div class="empty-left-page"></div>`;
    }

    if (spread.isIntro) {
      return `
        ${texHTML}
        <div class="frontispiece-right">
          <h2 class="frontispiece-title">${spread.right.title}</h2>
          <p class="frontispiece-subtitle">${spread.right.subtitle}</p>
          <div class="frontispiece-divider"></div>
          <blockquote class="frontispiece-quote">
            ${spread.right.quote}
          </blockquote>
          <span class="frontispiece-author">${spread.right.author}</span>
        </div>
      `;
    }

    return `
      ${texHTML}
      <div class="entry-layout-right">
        <div class="photo-only-card" role="button" tabindex="0" data-photo-id="${spread.id}" title="Toca la fotografía para seleccionarla">
          <div class="photo-media-box">
            ${window.AppDesk.renderPhotoMediaHTML(spread.numStr, spread.palette)}
          </div>
        </div>
        <div class="folio-right">${spread.rightFolio}</div>
      </div>
    `;
  }

  function renderSpread(index) {
    const spread = SPREADS_DATA[index];
    if (!spread) return;

    if (leftPaperContent) leftPaperContent.innerHTML = getLeftHTML(spread);
    if (rightPaperContent) rightPaperContent.innerHTML = getRightHTML(spread);

    if (!spread.isIntro && !spread.isBlankEnd) {
      const card = rightPaperContent.querySelector('.photo-only-card');
      if (card) {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          selectLandscapePhoto(spread);
        });
      }
    }
  }

  let isTransitioning = false;

  function setState(newState) {
    if (!tomo1Wrapper) return;
    const STATES = window.AppDesk.STATES;
    tomo1Wrapper.classList.remove(STATES.STACKED, STATES.OPEN, STATES.CLOSED_LEFT);
    tomo1Wrapper.classList.add(newState);
    window.AppDesk.tomo1State = newState;
  }

  function open(targetIndex = 0) {
    if (isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    const prevState = window.AppDesk.tomo1State;

    if (prevState === STATES.OPEN) {
      spreadIndex = targetIndex;
      renderSpread(spreadIndex);
      return;
    }

    if (tomo1Wrapper) {
      tomo1Wrapper.classList.remove('pulse-glow', 'book-closing-in-center-to-stack', 'book-closing-in-center-to-left');
    }
    if (window.AppDesk.tomo2State === STATES.OPEN) {
      window.Tomo2.closeToStack();
    }
    if (window.AppDesk.tomo3State === STATES.OPEN) {
      window.Tomo3.closeToStack();
    }

    isTransitioning = true;
    spreadIndex = targetIndex;

    if (prevState === STATES.CLOSED_LEFT) {
      // FASE 1: El libro cerrado viaja desde la izquierda hacia arriba/centro con contratapa visible
      tomo1Wrapper.classList.add('traveling-closed-left-to-center');
      setTimeout(() => {
        tomo1Wrapper.classList.remove('traveling-closed-left-to-center');
        // FASE 2: Estando arriba en el centro, se abre por la mitad hacia la derecha
        setState(STATES.OPEN);
        renderSpread(spreadIndex);
        tomo1Wrapper.classList.add('book-opening-in-center-from-left');
        setTimeout(() => {
          tomo1Wrapper.classList.remove('book-opening-in-center-from-left');
          isTransitioning = false;
        }, 460);
      }, 440);
    } else {
      // FASE 1: El libro cerrado viaja desde la pila de la derecha hacia arriba/centro con portada visible
      tomo1Wrapper.classList.add('traveling-closed-to-center');
      setTimeout(() => {
        tomo1Wrapper.classList.remove('traveling-closed-to-center');
        // FASE 2: Estando arriba en el centro, se abre por la mitad hacia la izquierda (revelando el interior)
        setState(STATES.OPEN);
        renderSpread(spreadIndex);
        tomo1Wrapper.classList.add('book-opening-in-center-from-stack');
        setTimeout(() => {
          tomo1Wrapper.classList.remove('book-opening-in-center-from-stack');
          isTransitioning = false;
        }, 460);
      }, 440);
    }
  }

  function closeToStack() {
    if (isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo1State === STATES.OPEN && tomo1Wrapper) {
      isTransitioning = true;
      tomo1Wrapper.classList.remove('book-opening-in-center-from-stack', 'book-opening-in-center-from-left');
      // FASE 1: Se cierra por la mitad hacia la derecha estando arriba en el centro
      tomo1Wrapper.classList.add('book-closing-in-center-to-stack');

      setTimeout(() => {
        tomo1Wrapper.classList.remove('book-closing-in-center-to-stack');
        // Pasa a estado cerrado en el centro
        tomo1Wrapper.classList.add('closed-at-center');
        setState(STATES.STACKED);
        void tomo1Wrapper.offsetWidth;

        // FASE 2: Desliza cerrado desde el centro hacia la pila de la derecha
        requestAnimationFrame(() => {
          tomo1Wrapper.classList.remove('closed-at-center');
          setTimeout(() => {
            isTransitioning = false;
            if (!window.AppDesk.isTomo2Unlocked && tomo1Wrapper) {
              tomo1Wrapper.classList.add('pulse-glow');
            }
          }, 460);
        });
      }, 420);
      return;
    }
    setState(STATES.STACKED);
    if (!window.AppDesk.isTomo2Unlocked && tomo1Wrapper) {
      tomo1Wrapper.classList.add('pulse-glow');
    }
  }

  function closeToLeft() {
    if (isTransitioning) return;
    if (!window.AppDesk.activeLandscapeSpread) {
      closeToStack();
      return;
    }
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo1State === STATES.OPEN && tomo1Wrapper) {
      isTransitioning = true;
      tomo1Wrapper.classList.remove('book-opening-in-center-from-stack', 'book-opening-in-center-from-left');
      // FASE 1: Se cierra por la mitad hacia la izquierda estando arriba en el centro
      tomo1Wrapper.classList.add('book-closing-in-center-to-left');

      setTimeout(() => {
        tomo1Wrapper.classList.remove('book-closing-in-center-to-left');
        // Pasa a estado cerrado en el centro con contratapa visible
        tomo1Wrapper.classList.add('closed-left-at-center');
        setState(STATES.CLOSED_LEFT);
        void tomo1Wrapper.offsetWidth;

        // FASE 2: Desliza cerrado hacia la izquierda de la mesa
        requestAnimationFrame(() => {
          tomo1Wrapper.classList.remove('closed-left-at-center');
          setTimeout(() => {
            isTransitioning = false;
            // FASE 3: La foto en la mesa aparece recién al llegar el tomo a la izquierda
            if (detachedPhotoStage && window.AppDesk.activeLandscapeSpread) {
              detachedPhotoStage.classList.add('visible');
            }
          }, 460);
        });
      }, 420);
      return;
    }
    setState(STATES.CLOSED_LEFT);
  }

  function selectLandscapePhoto(spread) {
    window.AppDesk.activeLandscapeSpread = spread;
    window.AppDesk.overprintOffsetY = 0; // Reiniciar exposición de luz para la nueva composición

    // Elección aleatoria entre las 3 opciones: primer tercio (left), centro (center), o segundo tercio (right)
    const alignments = ['left', 'center', 'right'];
    window.AppDesk.cutoutAlignment = alignments[Math.floor(Math.random() * alignments.length)];

    if (detachedPhotoLandscape) {
      detachedPhotoLandscape.innerHTML = window.AppDesk.renderPhotoMediaHTML(spread.numStr, spread.palette);
    }
    if (detachedPhotoCard) {
      detachedPhotoCard.setAttribute('data-target-spread', spread.id);
    }

    closeToLeft();

    window.AppDesk.isTomo2Unlocked = true;
    window.Tomo2.unlock();
  }

  function flipForward() {
    if (isTurning || spreadIndex >= SPREADS_DATA.length - 1) return;
    isTurning = true;

    const current = SPREADS_DATA[spreadIndex];
    const next = SPREADS_DATA[spreadIndex + 1];

    rightPaperContent.innerHTML = getRightHTML(next);
    leafFront.innerHTML = getRightHTML(current);
    leafBack.innerHTML = getLeftHTML(next);

    underLeafShadow.className = 'under-leaf-shadow shadow-right animate-forward-shadow';
    flippingLeaf.className = 'flipping-leaf active animate-forward';

    setTimeout(() => {
      spreadIndex++;
      renderSpread(spreadIndex);
      flippingLeaf.className = 'flipping-leaf';
      flippingLeaf.style.transform = '';
      underLeafShadow.className = 'under-leaf-shadow';
      underLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function flipBackward() {
    if (isTurning || spreadIndex <= 0) return;
    isTurning = true;

    const current = SPREADS_DATA[spreadIndex];
    const prev = SPREADS_DATA[spreadIndex - 1];

    leftPaperContent.innerHTML = getLeftHTML(prev);
    leafFront.innerHTML = getRightHTML(prev);
    leafBack.innerHTML = getLeftHTML(current);

    underLeafShadow.className = 'under-leaf-shadow shadow-left animate-backward-shadow';
    flippingLeaf.className = 'flipping-leaf active animate-backward';

    setTimeout(() => {
      spreadIndex--;
      renderSpread(spreadIndex);
      flippingLeaf.className = 'flipping-leaf';
      flippingLeaf.style.transform = '';
      underLeafShadow.className = 'under-leaf-shadow';
      underLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function init() {
    tomo1Wrapper = document.getElementById('tomo1BookWrapper');
    bookFrontCover = document.getElementById('bookFrontCover');
    bookBackCover = document.getElementById('bookBackCover');
    bookSpreadContainer = document.getElementById('bookSpreadContainer');
    leftPaperContent = document.getElementById('leftPaperContent');
    rightPaperContent = document.getElementById('rightPaperContent');
    flippingLeaf = document.getElementById('flippingLeaf');
    leafFront = document.getElementById('leafFront');
    leafBack = document.getElementById('leafBack');
    leafHighlight = document.getElementById('leafHighlight');
    leafShadow = document.getElementById('leafShadow');
    underLeafShadow = document.getElementById('underLeafShadow');
    detachedPhotoStage = document.getElementById('detachedPhotoStage');
    detachedPhotoCard = document.getElementById('detachedPhotoCard');
    detachedPhotoLandscape = document.getElementById('detachedPhotoLandscape');

    // Inicializar arrastre interactivo 3D y clics
    window.AppDesk.initInteractiveBookDrag({
      container: bookSpreadContainer,
      leftContent: leftPaperContent,
      rightContent: rightPaperContent,
      leaf: flippingLeaf,
      leafFront: leafFront,
      leafBack: leafBack,
      leafHighlight: leafHighlight,
      underLeafShadow: underLeafShadow,
      getSpreadIndex: () => spreadIndex,
      setSpreadIndex: (idx) => { spreadIndex = idx; },
      getMaxSpreadIndex: () => SPREADS_DATA.length - 1,
      getLeftHTML: getLeftHTML,
      getRightHTML: getRightHTML,
      renderSpread: renderSpread,
      isBookOpen: () => window.AppDesk.tomo1State === window.AppDesk.STATES.OPEN,
      isTurning: () => isTurning,
      setTurning: (val) => { isTurning = val; },
      flipForward: flipForward,
      flipBackward: flipBackward,
      excludeSelectors: []
    });

    function handleStackedClick(e) {
      if (e) e.stopPropagation();
      if (window.AppDesk.isPhotoPendingSave) return;
      if (window.AppDesk.tomo1State === window.AppDesk.STATES.STACKED) {
        if (window.AppDesk.isCameraTaken && !window.AppDesk.isPhotoPendingSave) {
          window.AppDesk.resetExperienceToStart();
        }
        open(0);
      }
    }

    if (tomo1Wrapper) {
      tomo1Wrapper.addEventListener('click', (e) => {
        if (window.AppDesk.isPhotoPendingSave) {
          e.stopPropagation();
          return;
        }
        if (window.AppDesk.tomo1State === window.AppDesk.STATES.STACKED) {
          handleStackedClick(e);
        } else if (window.AppDesk.tomo1State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken && !window.AppDesk.isPhotoPendingSave) {
            e.stopPropagation();
            window.AppDesk.resetExperienceToStart();
          }
        }
      });
    }

    if (bookFrontCover) {
      bookFrontCover.addEventListener('click', handleStackedClick);
    }

    if (bookBackCover) {
      bookBackCover.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AppDesk.isPhotoPendingSave) return;
        if (window.AppDesk.tomo1State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken && !window.AppDesk.isPhotoPendingSave) {
            window.AppDesk.resetExperienceToStart();
            return;
          }
          open(spreadIndex || 1);
        }
      });
    }

    // Al tocar la fotografía despegada en el centro de la mesa:
    if (detachedPhotoCard) {
      detachedPhotoCard.addEventListener('click', (e) => {
        // Si la foto está pendiente de guardado, ya se disparó la fotografía o se interactúa con Tomo 3, o si hay una transición en curso, ignorar
        if (window.AppDesk.isPhotoPendingSave || window.AppDesk.isCameraTaken || isTransitioning) {
          return;
        }

        // Si hay personajes ubicados pero aún no se disparó la foto, reabrir Tomo 2 para editar
        if (window.AppDesk.selectedCutoutIds && window.AppDesk.selectedCutoutIds.length > 0) {
          window.Tomo2.open(1);
          return;
        }

        const targetSpread = parseInt(detachedPhotoCard.getAttribute('data-target-spread'), 10) || 1;
        
        // Guardar la foto de vuelta en el libro: la foto en la mesa desaparece
        window.AppDesk.activeLandscapeSpread = null;
        if (detachedPhotoStage) {
          detachedPhotoStage.classList.remove('visible');
        }

        // Bloquear Tomo II ya que no hay foto en la mesa
        window.AppDesk.isTomo2Unlocked = false;
        window.Tomo2.lock();

        // El libro viaja cerrado con contratapa al centro y se abre a la derecha
        open(targetSpread);
      });
    }

    renderSpread(0);
  }

  return {
    init,
    open,
    closeToStack,
    closeToLeft,
    flipForward,
    flipBackward,
    getSpreadIndex: () => spreadIndex,
    SPREADS_DATA
  };

})();
