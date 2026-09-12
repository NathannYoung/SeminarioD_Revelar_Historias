/**
 * ============================================================================
 * TOMO I: RECUERDOS ANCLADOS AL ESPACIO
 * Módulo interactivo del Tomo I (Libro de Paisajes)
 * ============================================================================
 */

window.Tomo1 = (function() {

  // --- DATOS DE LOS SPREADS (0 = DEDICATORIA, 1..11 = PAISAJES, 12 = PÁGINAS EN BLANCO) ---
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
      title: "Horizontes de Arena.",
      date: "14 de Octubre, 1984",
      text: "El viento constante barre la cresta de las dunas al atardecer. La luz rasante descompone el relieve en geometrías de ocre y sombra profunda, congelando un silencio que pronto cambiará de forma.",
      leftFolio: "02",
      rightFolio: "03",
      palette: ["#2c2016", "#a46843", "#d9a566", "#ebcfb2"]
    },
    // Spread 2 (Entrada 02)
    {
      id: 2,
      numStr: "02",
      entryLabel: "Entrada 02:",
      title: "Niebla sobre el Valle.",
      date: "28 de Noviembre, 1985",
      text: "Las cumbres emergían lentamente sobre un mar blanco y espeso. Durante casi una hora, el mundo bajo nosotros desapareció, dejando solo el crujido de la escarcha bajo las botas.",
      leftFolio: "04",
      rightFolio: "05",
      palette: ["#1c2526", "#44595d", "#7c9299", "#d0dce0"]
    },
    // Spread 3 (Entrada 03)
    {
      id: 3,
      numStr: "03",
      entryLabel: "Entrada 03:",
      title: "Marea en Calma.",
      date: "03 de Enero, 1986",
      text: "El agua se retiró más allá de lo previsto, descubriendo un suelo liso como un espejo de peltre. El horizonte se volvió indistinguible del cielo marino.",
      leftFolio: "06",
      rightFolio: "07",
      palette: ["#0f1f2c", "#1c4966", "#4a85a8", "#a6d3e8"]
    },
    // Spread 4 (Entrada 04)
    {
      id: 4,
      numStr: "04",
      entryLabel: "Entrada 04:",
      title: "Líneas de Cemento.",
      date: "19 de Marzo, 1986",
      text: "Una estructura abandonada a mitad de la meseta. El hormigón erosionado por la intemperie proyecta diagonales rigurosas que parten el plano en dos mitades.",
      leftFolio: "08",
      rightFolio: "09",
      palette: ["#1e2022", "#4a4e54", "#878c94", "#e2e6ea"]
    },
    // Spread 5 (Entrada 05)
    {
      id: 5,
      numStr: "05",
      entryLabel: "Entrada 05:",
      title: "La Casa del Guardián.",
      date: "07 de Junio, 1987",
      text: "Solitaria sobre la pendiente rocosa, resiste los temporales del oeste. Desde su ventana principal se divisa el paso de las tormentas antes de que toquen tierra.",
      leftFolio: "10",
      rightFolio: "11",
      palette: ["#241e17", "#5c4d3c", "#9c876f", "#dfd5c6"]
    },
    // Spread 6 (Entrada 06)
    {
      id: 6,
      numStr: "06",
      entryLabel: "Entrada 06:",
      title: "Sendero entre Pinos.",
      date: "15 de Agosto, 1987",
      text: "Rayos de sol filtrados a través de las ramas altas. El aroma a resina tibia impregnaba todo el bosque; caminar allí daba la impresión de estar suspendido fuera del tiempo.",
      leftFolio: "12",
      rightFolio: "13",
      palette: ["#142416", "#2d4a2f", "#5c825e", "#b8d1b9"]
    },
    // Spread 7 (Entrada 07)
    {
      id: 7,
      numStr: "07",
      entryLabel: "Entrada 07:",
      title: "Puertos de Invierno.",
      date: "02 de Octubre, 1988",
      text: "Los cascos de madera amarrados a los postes de alerce. Nadie transitaba el muelle salvo las gaviotas que aguardaban el retorno de la marea de media tarde.",
      leftFolio: "14",
      rightFolio: "15",
      palette: ["#121921", "#283b4c", "#567287", "#b0c6d4"]
    },
    // Spread 8 (Entrada 08)
    {
      id: 8,
      numStr: "08",
      entryLabel: "Entrada 08:",
      title: "Carretera Infinita.",
      date: "11 de Diciembre, 1988",
      text: "Trescientas millas sin una sola curva visible. El asfalto vibraba por el calor reverberante, fundiéndose a lo lejos con el espejismo de agua inexistente.",
      leftFolio: "16",
      rightFolio: "17",
      palette: ["#2b1810", "#633522", "#b36844", "#f2ad85"]
    },
    // Spread 9 (Entrada 09)
    {
      id: 9,
      numStr: "09",
      entryLabel: "Entrada 09:",
      title: "El Faro Viejo.",
      date: "23 de Febrero, 1989",
      text: "La linterna ya no gira, pero sus sillares de piedra granítica continúan en pie como un monolito frente al embate incesante del oleaje.",
      leftFolio: "18",
      rightFolio: "19",
      palette: ["#1a242f", "#3c5369", "#7897b0", "#e1edf7"]
    },
    // Spread 10 (Entrada 10)
    {
      id: 10,
      numStr: "10",
      entryLabel: "Entrada 10:",
      title: "Penumbra y Cristal.",
      date: "17 de Mayo, 1989",
      text: "Lluvia fina sobre la vidriera de un café provinciano. Afuera, las luces de la calle comenzaban a encenderse con un fulgor violeta difuso.",
      leftFolio: "20",
      rightFolio: "21",
      palette: ["#111116", "#2a2838", "#625882", "#bfaee3"]
    },
    // Spread 11 (Entrada 11)
    {
      id: 11,
      numStr: "11",
      entryLabel: "Entrada 11:",
      title: "Vuelo al Crepúsculo.",
      date: "04 de Septiembre, 1989",
      text: "Una bandada cruzó el cuadrante superior justo cuando el sol tocaba el lomo de la cordillera. El último registro de la libreta antes del regreso definitivo.",
      leftFolio: "22",
      rightFolio: "23",
      palette: ["#26151b", "#5e2938", "#ab4b60", "#f2a0b3"]
    },
    // Spread 12: Dos páginas finales en blanco (Páginas de respeto)
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

    return `
      ${texHTML}
      <div class="entry-layout-left">
        <div class="entry-text-block">
          <div class="entry-date-sub">${spread.date}</div>
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
      if (window.AppDesk.tomo1State === window.AppDesk.STATES.STACKED) {
        if (window.AppDesk.isCameraTaken) {
          window.AppDesk.resetExperienceToStart();
        }
        open(0);
      }
    }

    if (tomo1Wrapper) {
      tomo1Wrapper.addEventListener('click', (e) => {
        if (window.AppDesk.tomo1State === window.AppDesk.STATES.STACKED) {
          handleStackedClick(e);
        } else if (window.AppDesk.tomo1State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken) {
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
        if (window.AppDesk.tomo1State === window.AppDesk.STATES.CLOSED_LEFT) {
          if (window.AppDesk.isCameraTaken) {
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
        // Si ya se disparó la fotografía o se interactúa con Tomo 3, o si hay una transición en curso, ignorar
        if (window.AppDesk.isCameraTaken || isTransitioning) {
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
