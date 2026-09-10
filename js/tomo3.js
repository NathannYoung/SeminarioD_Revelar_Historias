/**
 * ============================================================================
 * TOMO III: MEMORIAS DE RE-UNIONES
 * Módulo interactivo del Tomo III (Álbum de Fotografías Compuestas)
 * ============================================================================
 */

window.Tomo3 = (function() {

  let tomo3Wrapper = null;
  let tomo3FrontCover = null;
  let tomo3BackCover = null;
  let tomo3SpreadContainer = null;
  let tomo3LeftPaperContent = null;
  let tomo3RightPaperContent = null;
  let tomo3FlippingLeaf = null;
  let tomo3LeafFront = null;
  let tomo3LeafBack = null;
  let tomo3LeafHighlight = null;
  let tomo3LeafShadow = null;
  let tomo3UnderLeafShadow = null;

  let spreadIndex = 0;
  let isTurning = false;
  let savedPhotos = [];

  // Cargar fotos persistidas de localStorage
  function loadPersistedPhotos() {
    try {
      const persisted = localStorage.getItem('seminario_tomo3_photos');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (Array.isArray(parsed)) {
          savedPhotos = parsed;
        }
      }
    } catch (err) {
      console.warn('Error cargando fotos de Tomo III', err);
    }
  }

  function persistPhotos() {
    try {
      localStorage.setItem('seminario_tomo3_photos', JSON.stringify(savedPhotos));
    } catch (err) {
      console.warn('No se pudieron persistir las fotos', err);
    }
  }

  // El spread máximo incluye los spreads con fotos + 1 spread final de páginas en blanco
  function getMaxSpreadIndex() {
    const photoSpreads = Math.max(1, Math.ceil(savedPhotos.length / 2));
    return photoSpreads + 1;
  }

  function getLeftHTML(idx) {
    const texNum = ((idx * 2) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png'); opacity: 0.85;"></div>`;
    
    // Spread 0: Dedicatoria vacía
    if (idx === 0) {
      return `
        ${texHTML}
        <div class="tomo3-page-layout empty-page">
          <div class="empty-page-placeholder"></div>
        </div>
      `;
    }

    const maxIdx = getMaxSpreadIndex();
    // Spread final: Páginas en blanco de cortesía
    if (idx >= maxIdx) {
      return `
        ${texHTML}
        <div class="tomo3-page-layout empty-page">
          <div class="empty-page-placeholder"></div>
        </div>
      `;
    }

    const photoIdx = (idx - 1) * 2;
    const photo = savedPhotos[photoIdx];
    const leftFolioStr = String(idx * 2).padStart(2, '0');

    if (!photo) {
      return `
        ${texHTML}
        <div class="tomo3-page-layout empty-page">
          <div class="empty-page-placeholder"></div>
          <div class="folio-left">${leftFolioStr}</div>
        </div>
      `;
    }

    const metaDate = photo.dateTimeStr || (photo.date ? (photo.date + (photo.time ? ' • ' + photo.time : '')) : '');
    return `
      ${texHTML}
      <div class="tomo3-page-layout">
        <div class="tomo3-page-meta-header">
          <span class="tomo3-page-meta-date">${metaDate}</span>
        </div>
        <div class="tomo3-entry-section tomo3-title-section">
          <span class="tomo3-field-lead">Título:</span>
          <h3 class="tomo3-page-photo-title">${window.AppDesk.escapeHTML(photo.title)}</h3>
        </div>
        <div class="tomo3-page-photo-container">
          <div class="tomo3-page-photo-frame">
            ${window.Camara.renderCompositePhotoHTML(photo)}
          </div>
        </div>
        <div class="tomo3-entry-section tomo3-author-section">
          <span class="tomo3-field-lead">Autor/x:</span>
          <span class="tomo3-page-photo-author">${window.AppDesk.escapeHTML(photo.author)}</span>
        </div>
        <div class="tomo3-entry-section tomo3-observations-section">
          <span class="tomo3-field-lead">Observaciones:</span>
          <div class="tomo3-page-photo-observations">${window.AppDesk.escapeHTML(photo.observations || '—')}</div>
        </div>
        <div class="folio-left">${leftFolioStr}</div>
      </div>
    `;
  }

  function getRightHTML(idx) {
    const texNum = ((idx * 2 + 1) % 6) + 1;
    const texHTML = `<div class="page-texture-overlay" style="background-image: url('FOTOS/MATERIALES/pagina${texNum}.png'); opacity: 0.85;"></div>`;

    // Spread 0: Portadilla
    if (idx === 0) {
      return `
        ${texHTML}
        <div class="frontispiece-right">
          <h2 class="frontispiece-title">Memorias de Re-Uniones.</h2>
          <p class="frontispiece-subtitle">Registros de momentos que viví y no inmortalicé.</p>
          <div class="frontispiece-divider"></div>
          <blockquote class="frontispiece-quote">
            «La memoria siempre está hecha de lagunas.»
          </blockquote>
          <span class="frontispiece-author">Christian Boltanski</span>
        </div>
      `;
    }

    const maxIdx = getMaxSpreadIndex();
    // Spread final: Páginas en blanco de cortesía
    if (idx >= maxIdx) {
      return `
        ${texHTML}
        <div class="tomo3-page-layout empty-page">
          <div class="empty-page-placeholder"></div>
        </div>
      `;
    }

    const photoIdx = (idx - 1) * 2 + 1;
    const photo = savedPhotos[photoIdx];
    const rightFolioStr = String(idx * 2 + 1).padStart(2, '0');

    if (!photo) {
      return `
        ${texHTML}
        <div class="tomo3-page-layout empty-page">
          <div class="empty-page-placeholder"></div>
          <div class="folio-right">${rightFolioStr}</div>
        </div>
      `;
    }

    const metaDateRight = photo.dateTimeStr || (photo.date ? (photo.date + (photo.time ? ' • ' + photo.time : '')) : '');
    return `
      ${texHTML}
      <div class="tomo3-page-layout">
        <div class="tomo3-page-meta-header">
          <span class="tomo3-page-meta-date">${metaDateRight}</span>
        </div>
        <div class="tomo3-entry-section tomo3-title-section">
          <span class="tomo3-field-lead">Título:</span>
          <h3 class="tomo3-page-photo-title">${window.AppDesk.escapeHTML(photo.title)}</h3>
        </div>
        <div class="tomo3-page-photo-container">
          <div class="tomo3-page-photo-frame">
            ${window.Camara.renderCompositePhotoHTML(photo)}
          </div>
        </div>
        <div class="tomo3-entry-section tomo3-author-section">
          <span class="tomo3-field-lead">Autor/x:</span>
          <span class="tomo3-page-photo-author">${window.AppDesk.escapeHTML(photo.author)}</span>
        </div>
        <div class="tomo3-entry-section tomo3-observations-section">
          <span class="tomo3-field-lead">Observaciones:</span>
          <div class="tomo3-page-photo-observations">${window.AppDesk.escapeHTML(photo.observations || '—')}</div>
        </div>
        <div class="folio-right">${rightFolioStr}</div>
      </div>
    `;
  }

  function renderSpread(index) {
    if (tomo3LeftPaperContent) {
      tomo3LeftPaperContent.innerHTML = getLeftHTML(index);
    }
    if (tomo3RightPaperContent) {
      tomo3RightPaperContent.innerHTML = getRightHTML(index);
    }
  }

  let isTransitioning = false;

  function setState(newState) {
    if (!tomo3Wrapper) return;
    const STATES = window.AppDesk.STATES;
    tomo3Wrapper.classList.remove(STATES.STACKED, STATES.OPEN, STATES.CLOSED_LEFT);
    tomo3Wrapper.classList.add(newState);
    window.AppDesk.tomo3State = newState;
  }

  function open(targetIndex = 0) {
    if (isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    const prevState = window.AppDesk.tomo3State;

    if (prevState === STATES.OPEN) {
      spreadIndex = targetIndex;
      renderSpread(spreadIndex);
      return;
    }

    if (window.AppDesk.tomo1State === STATES.OPEN) window.Tomo1.closeToLeft();
    if (window.AppDesk.tomo2State === STATES.OPEN) window.Tomo2.closeToLeft();

    if (tomo3Wrapper) {
      tomo3Wrapper.classList.remove('pulse-glow', 'book-closing-in-center-to-stack');
    }

    isTransitioning = true;
    spreadIndex = targetIndex;

    // FASE 1: El libro viaja cerrado desde la pila hacia arriba/centro
    tomo3Wrapper.classList.add('traveling-closed-to-center');
    setTimeout(() => {
      tomo3Wrapper.classList.remove('traveling-closed-to-center');
      // FASE 2: Estando arriba en el centro, se abre por la mitad hacia la izquierda
      setState(STATES.OPEN);
      renderSpread(spreadIndex);
      tomo3Wrapper.classList.add('book-opening-in-center-from-stack');
      setTimeout(() => {
        tomo3Wrapper.classList.remove('book-opening-in-center-from-stack');
        isTransitioning = false;
      }, 460);
    }, 440);
  }

  function closeToStack() {
    if (isTransitioning) return;
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo3State === STATES.OPEN && tomo3Wrapper) {
      isTransitioning = true;
      tomo3Wrapper.classList.remove('book-opening-in-center-from-stack');
      // FASE 1: Se cierra por la mitad hacia la derecha en el centro ("arriba")
      tomo3Wrapper.classList.add('book-closing-in-center-to-stack');

      setTimeout(() => {
        tomo3Wrapper.classList.remove('book-closing-in-center-to-stack');
        tomo3Wrapper.classList.add('closed-at-center');
        setState(STATES.STACKED);
        spreadIndex = 0;
        void tomo3Wrapper.offsetWidth;

        // FASE 2: Desliza cerrado desde el centro hacia la pila de la derecha
        requestAnimationFrame(() => {
          tomo3Wrapper.classList.remove('closed-at-center');
          setTimeout(() => {
            isTransitioning = false;
            if (window.AppDesk.isTomo3Unlocked && tomo3Wrapper) {
              tomo3Wrapper.classList.add('pulse-glow');
            }
          }, 460);
        });
      }, 420);
      return;
    }
    setState(STATES.STACKED);
    spreadIndex = 0;
    if (window.AppDesk.isTomo3Unlocked && tomo3Wrapper) {
      tomo3Wrapper.classList.add('pulse-glow');
    }
  }

  function closeToLeft() {
    // Tomo 3 nunca se cierra hacia la izquierda: siempre queda del lado derecho en la pila
    closeToStack();
  }

  function flipForward() {
    if (isTurning || spreadIndex >= getMaxSpreadIndex()) return;
    isTurning = true;

    const curIdx = spreadIndex;
    const nextIdx = spreadIndex + 1;

    tomo3RightPaperContent.innerHTML = getRightHTML(nextIdx);
    tomo3LeafFront.innerHTML = getRightHTML(curIdx);
    tomo3LeafBack.innerHTML = getLeftHTML(nextIdx);

    tomo3UnderLeafShadow.className = 'under-leaf-shadow shadow-right animate-forward-shadow';
    tomo3FlippingLeaf.className = 'flipping-leaf active animate-forward';

    setTimeout(() => {
      spreadIndex = nextIdx;
      renderSpread(spreadIndex);

      tomo3FlippingLeaf.className = 'flipping-leaf';
      tomo3FlippingLeaf.style.transform = '';
      tomo3UnderLeafShadow.className = 'under-leaf-shadow';
      tomo3UnderLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function flipBackward() {
    if (isTurning || spreadIndex <= 0) return;
    isTurning = true;

    const curIdx = spreadIndex;
    const prevIdx = spreadIndex - 1;

    tomo3LeftPaperContent.innerHTML = getLeftHTML(prevIdx);
    tomo3LeafFront.innerHTML = getRightHTML(prevIdx);
    tomo3LeafBack.innerHTML = getLeftHTML(curIdx);

    tomo3UnderLeafShadow.className = 'under-leaf-shadow shadow-left animate-backward-shadow';
    tomo3FlippingLeaf.className = 'flipping-leaf active animate-backward';

    setTimeout(() => {
      spreadIndex = prevIdx;
      renderSpread(spreadIndex);

      tomo3FlippingLeaf.className = 'flipping-leaf';
      tomo3FlippingLeaf.style.transform = '';
      tomo3UnderLeafShadow.className = 'under-leaf-shadow';
      tomo3UnderLeafShadow.style.opacity = '0';
      isTurning = false;
    }, 700);
  }

  function addPhoto(photoItem) {
    savedPhotos.push(photoItem);
    persistPhotos();

    unlock();

    if (window.AppDesk.tomo3State === window.AppDesk.STATES.OPEN) {
      renderSpread(spreadIndex);
    }
  }

  function lock() {
    window.AppDesk.isTomo3Unlocked = false;
    spreadIndex = 0;
    if (tomo3Wrapper) {
      tomo3Wrapper.classList.remove('unlocked', 'pulse-glow');
      tomo3Wrapper.setAttribute('title', 'TOMO 3: Bloqueado (Se desbloquea al archivar una fotografía)');
    }
  }

  function unlock() {
    window.AppDesk.isTomo3Unlocked = true;
    if (tomo3Wrapper) {
      tomo3Wrapper.classList.add('unlocked', 'pulse-glow');
      tomo3Wrapper.setAttribute('title', `TOMO 3: Memorias de Re-Uniones (${savedPhotos.length} fotografía${savedPhotos.length > 1 ? 's' : ''})`);
    }
  }

  function init() {
    tomo3Wrapper = document.getElementById('tomo3BookWrapper');
    tomo3FrontCover = document.getElementById('tomo3FrontCover');
    tomo3BackCover = document.getElementById('tomo3BackCover');
    tomo3SpreadContainer = document.getElementById('tomo3SpreadContainer');
    tomo3LeftPaperContent = document.getElementById('tomo3LeftPaperContent');
    tomo3RightPaperContent = document.getElementById('tomo3RightPaperContent');
    tomo3FlippingLeaf = document.getElementById('tomo3FlippingLeaf');
    tomo3LeafFront = document.getElementById('tomo3LeafFront');
    tomo3LeafBack = document.getElementById('tomo3LeafBack');
    tomo3LeafHighlight = document.getElementById('tomo3LeafHighlight');
    tomo3LeafShadow = document.getElementById('tomo3LeafShadow');
    tomo3UnderLeafShadow = document.getElementById('tomo3UnderLeafShadow');

    loadPersistedPhotos();

    window.AppDesk.initInteractiveBookDrag({
      container: tomo3SpreadContainer,
      leftContent: tomo3LeftPaperContent,
      rightContent: tomo3RightPaperContent,
      leaf: tomo3FlippingLeaf,
      leafFront: tomo3LeafFront,
      leafBack: tomo3LeafBack,
      leafHighlight: tomo3LeafHighlight,
      underLeafShadow: tomo3UnderLeafShadow,
      getSpreadIndex: () => spreadIndex,
      setSpreadIndex: (idx) => { spreadIndex = idx; },
      getMaxSpreadIndex: getMaxSpreadIndex,
      getLeftHTML: getLeftHTML,
      getRightHTML: getRightHTML,
      renderSpread: renderSpread,
      isBookOpen: () => window.AppDesk.tomo3State === window.AppDesk.STATES.OPEN,
      isTurning: () => isTurning,
      setTurning: (val) => { isTurning = val; },
      flipForward: flipForward,
      flipBackward: flipBackward,
      excludeSelectors: []
    });

    function handleStackedClick(e) {
      if (window.AppDesk.tomo3State !== window.AppDesk.STATES.STACKED) return;
      e.stopPropagation();

      if (!window.AppDesk.isTomo3Unlocked) {
        // Si ya se disparó la foto y está en la mesa, guardarla y abrir Tomo 3
        const droppedStage = document.getElementById('droppedPhotoStage');
        const saveBtn = document.getElementById('saveToTomo3Btn');
        if (window.AppDesk.isCameraTaken && droppedStage && droppedStage.classList.contains('active')) {
          if (saveBtn) {
            saveBtn.click();
            setTimeout(() => open(0), 1350);
            return;
          }
        }

        if (tomo3Wrapper) {
          tomo3Wrapper.classList.add('tomo-shake');
          setTimeout(() => tomo3Wrapper.classList.remove('tomo-shake'), 420);
        }
        return;
      }

      open(0);
    }

    if (tomo3Wrapper) {
      tomo3Wrapper.addEventListener('click', (e) => {
        if (window.AppDesk.tomo3State === window.AppDesk.STATES.STACKED) {
          handleStackedClick(e);
        }
      });
    }

    if (tomo3FrontCover) {
      tomo3FrontCover.addEventListener('click', handleStackedClick);
    }

    if (tomo3BackCover) {
      tomo3BackCover.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AppDesk.tomo3State === window.AppDesk.STATES.CLOSED_LEFT) {
          open(spreadIndex || 0);
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
    flipForward,
    flipBackward,
    addPhoto,
    lock,
    unlock,
    getSavedPhotos: () => savedPhotos,
    getSpreadIndex: () => spreadIndex
  };

})();
