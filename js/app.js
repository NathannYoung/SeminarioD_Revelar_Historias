/**
 * ============================================================================
 * REVELAR HISTORIAS: RESIGNIFICANDO EL ARCHIVO FAMILIAR
 * Orquestador General y Estado Compartido
 * ============================================================================
 */

window.AppDesk = {
  STATES: {
    STACKED: 'state-stacked',
    OPEN: 'state-open',
    CLOSED_LEFT: 'state-closed-left'
  },

  tomo1State: 'state-stacked',
  tomo2State: 'state-stacked',
  tomo3State: 'state-stacked',

  activeLandscapeSpread: null,
  selectedCutoutIds: [],
  overprintOffsetY: 0,
  cutoutAlignment: 'center',

  isTomo2Unlocked: false,
  isCameraUnlocked: false,
  isTomo3Unlocked: false,
  isCameraTaken: false,

  // Helper para sanitizar textos de autor y título
  escapeHTML: function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Renderizador de fotografías reales 16:9 con fallbacks y texturas
  renderPhotoMediaHTML: function(numStr, palette) {
    const p = palette || ["#2c2016", "#a46843", "#d9a566", "#ebcfb2"];
    const overlayNum = ((Math.max(1, parseInt(numStr, 10) || 1) - 1) % 4) + 1;
    return `
      <div class="photo-media-aspect-wrapper" style="width:100%; height:100%; position:relative; overflow:hidden;">
        <img src="FOTOS/PAISAJES/${numStr}.jpg" 
             alt="Paisaje ${numStr}" 
             class="landscape-real-img"
             style="width:100%; height:100%; object-fit:cover; display:block;" 
             onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='FOTO/PAISAJES/${numStr}.jpg';}else{this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';}" />
        <div class="landscape-vector-fallback" style="display:none; width:100%; height:100%;">
          <svg viewBox="0 0 480 270" preserveAspectRatio="none" style="width:100%; height:100%; display:block;">
            <defs>
              <linearGradient id="skyGrad_${numStr}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${p[0]}" />
                <stop offset="50%" stop-color="${p[1]}" />
                <stop offset="100%" stop-color="${p[2]}" />
              </linearGradient>
            </defs>
            <rect width="480" height="270" fill="url(#skyGrad_${numStr})" />
            <circle cx="240" cy="120" r="60" fill="${p[3]}" opacity="0.4" />
            <path d="M 0 170 Q 120 130 240 160 Q 360 140 480 150 L 480 270 L 0 270 Z" fill="${p[1]}" opacity="0.8" />
            <path d="M 0 195 Q 140 160 270 190 Q 400 170 480 180 L 480 270 L 0 270 Z" fill="${p[0]}" />
          </svg>
        </div>
        <img src="FOTOS/MATERIALES/foto${overlayNum}.png" 
             alt="Textura paisaje ${overlayNum}" 
             class="landscape-overlay-img" 
             onerror="this.style.display='none';" />
      </div>
    `;
  },

  // Controlador universal de interacción física 3D: Arrastre (Drag) y Swipe táctil para pasar páginas
  initInteractiveBookDrag: function({
    container,
    leftContent,
    rightContent,
    leaf,
    leafFront,
    leafBack,
    leafHighlight,
    underLeafShadow,
    getSpreadIndex,
    setSpreadIndex,
    getMaxSpreadIndex,
    getLeftHTML,
    getRightHTML,
    renderSpread,
    isBookOpen,
    isTurning,
    setTurning,
    flipForward,
    flipBackward,
    excludeSelectors = []
  }) {
    let isDragging = false;
    let dragDirection = null; // 'forward' | 'backward'
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let currentProgress = 0;
    let activePointerId = null;
    let suppressClickUntil = 0;

    function onPointerDown(e) {
      if (!isBookOpen() || isTurning()) return;

      for (const sel of excludeSelectors) {
        if (e.target.closest(sel)) return;
      }

      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
      activePointerId = e.pointerId;
      isDragging = false;
      dragDirection = null;
      currentProgress = 0;
    }

    function setupVisuals(direction) {
      const curIdx = getSpreadIndex();
      setTurning(true);

      if (direction === 'forward') {
        const nextIdx = curIdx + 1;
        if (rightContent) rightContent.innerHTML = getRightHTML(nextIdx);
        leafFront.innerHTML = getRightHTML(curIdx);
        leafBack.innerHTML = getLeftHTML(nextIdx);

        if (underLeafShadow) {
          underLeafShadow.className = 'under-leaf-shadow shadow-right';
          underLeafShadow.style.opacity = '0';
          underLeafShadow.style.transition = 'none';
        }

        leaf.className = 'flipping-leaf active turning-dragging';
        leaf.style.transform = 'rotateY(0deg)';
        leaf.style.transition = 'none';
      } else {
        const prevIdx = curIdx - 1;
        if (leftContent) leftContent.innerHTML = getLeftHTML(prevIdx);
        leafFront.innerHTML = getRightHTML(prevIdx);
        leafBack.innerHTML = getLeftHTML(curIdx);

        if (underLeafShadow) {
          underLeafShadow.className = 'under-leaf-shadow shadow-left';
          underLeafShadow.style.opacity = '0';
          underLeafShadow.style.transition = 'none';
        }

        leaf.className = 'flipping-leaf active turning-dragging';
        leaf.style.transform = 'rotateY(-180deg)';
        leaf.style.transition = 'none';
      }
    }

    function onPointerMove(e) {
      if (activePointerId === null || (e.pointerId !== undefined && e.pointerId !== activePointerId)) return;
      if (!isBookOpen()) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (!isDragging) {
        // Umbral de activación del arrastre horizontal
        if (absX > 8 && absX > absY * 0.45) {
          const curIdx = getSpreadIndex();
          const maxIdx = getMaxSpreadIndex();

          if (deltaX < 0 && curIdx < maxIdx) {
            dragDirection = 'forward';
          } else if (deltaX > 0 && curIdx > 0) {
            dragDirection = 'backward';
          } else {
            return;
          }

          isDragging = true;
          setupVisuals(dragDirection);

          try {
            container.setPointerCapture(activePointerId);
          } catch (err) {}
        } else {
          return;
        }
      }

      if (e.cancelable) {
        e.preventDefault();
      }

      const rect = container.getBoundingClientRect();
      const halfW = Math.max(rect.width / 2, 160);

      let angle = 0;
      if (dragDirection === 'forward') {
        currentProgress = Math.max(0, Math.min(1, -deltaX / halfW));
        angle = -currentProgress * 180;
      } else {
        currentProgress = Math.max(0, Math.min(1, deltaX / halfW));
        angle = -180 + (currentProgress * 180);
      }

      leaf.style.transform = `rotateY(${angle}deg)`;

      if (underLeafShadow) {
        underLeafShadow.style.opacity = `${Math.sin(currentProgress * Math.PI) * 0.8}`;
      }
      if (leafHighlight) {
        leafHighlight.style.opacity = `${Math.sin(currentProgress * Math.PI) * 0.55}`;
      }
    }

    function finishTurn(direction, shouldComplete) {
      leaf.classList.remove('turning-dragging');
      leaf.classList.add('turning-smooth');
      leaf.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      if (underLeafShadow) underLeafShadow.style.transition = 'opacity 0.35s ease';

      const targetAngle = direction === 'forward'
        ? (shouldComplete ? -180 : 0)
        : (shouldComplete ? 0 : -180);

      leaf.style.transform = `rotateY(${targetAngle}deg)`;
      if (underLeafShadow) underLeafShadow.style.opacity = '0';

      setTimeout(() => {
        const curIdx = getSpreadIndex();
        if (shouldComplete) {
          const newIdx = direction === 'forward' ? curIdx + 1 : curIdx - 1;
          setSpreadIndex(newIdx);
          renderSpread(newIdx);
        } else {
          renderSpread(curIdx);
        }
        leaf.className = 'flipping-leaf';
        leaf.style.transform = '';
        leaf.style.transition = '';
        if (underLeafShadow) {
          underLeafShadow.className = 'under-leaf-shadow';
          underLeafShadow.style.opacity = '0';
          underLeafShadow.style.transition = '';
        }
        setTurning(false);
      }, 420);
    }

    function onPointerUp(e) {
      if (activePointerId === null || (e.pointerId !== undefined && e.pointerId !== activePointerId)) return;

      const elapsed = Date.now() - startTime;
      const deltaX = e.clientX - startX;
      const absX = Math.abs(deltaX);

      if (isDragging && dragDirection) {
        // Deslizamiento rápido en celulares (quick swipe) o arrastre superando el 18% del ancho
        const isQuickSwipe = elapsed < 380 && absX > 22;
        const shouldComplete = currentProgress > 0.18 || isQuickSwipe;
        finishTurn(dragDirection, shouldComplete);
        suppressClickUntil = Date.now() + 300;
      }
      // NOTA: Si no hubo arrastre (isDragging === false), NO se pasa de página.
      // Se eliminó el cambio de página por simple clic según lo solicitado.

      if (activePointerId !== null) {
        try {
          container.releasePointerCapture(activePointerId);
        } catch (err) {}
        activePointerId = null;
      }

      dragDirection = null;
      isDragging = false;
      currentProgress = 0;
    }

    function onPointerCancel(e) {
      if (isDragging && dragDirection) {
        finishTurn(dragDirection, false);
      }
      if (activePointerId !== null) {
        try {
          container.releasePointerCapture(activePointerId);
        } catch (err) {}
        activePointerId = null;
      }
      dragDirection = null;
      isDragging = false;
      currentProgress = 0;
    }

    // Interceptar clics residuales generados al soltar el dedo tras arrastrar
    container.addEventListener('click', (e) => {
      if (Date.now() < suppressClickUntil) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  },

  // Reinicia la experiencia al estado inicial con ambos libros en la pila y cámara bloqueada
  resetExperienceToStart: function() {
    window.AppDesk.activeLandscapeSpread = null;
    window.AppDesk.selectedCutoutIds = [];
    window.AppDesk.overprintOffsetY = 0;
    window.AppDesk.isCameraTaken = false;
    window.AppDesk.isTomo2Unlocked = false;
    window.AppDesk.isTomo3Unlocked = false;

    const alignments = ['left', 'center', 'right'];
    window.AppDesk.cutoutAlignment = alignments[Math.floor(Math.random() * alignments.length)];
    if (window.Tomo2 && window.Tomo2.shuffleCutouts) {
      window.Tomo2.shuffleCutouts();
    }

    // 1. Tomo 1 cerrado en la pila
    window.Tomo1.closeToStack();

    // 2. Tomo 2 cerrado en la pila
    window.Tomo2.closeToStack();
    window.Tomo2.lock();

    // 3. Tomo 3 cerrado en la pila y bloqueado
    window.Tomo3.closeToStack();
    if (window.Tomo3.lock) {
      window.Tomo3.lock();
    }

    // 4. Apagar y bloquear cámara
    window.Camara.lockMechanics();

    // 5. Ocultar fotos de la mesa
    const detachedPhotoStage = document.getElementById('detachedPhotoStage');
    if (detachedPhotoStage) detachedPhotoStage.classList.remove('visible');

    const detachedPhotoCutouts = document.getElementById('detachedPhotoCutouts');
    if (detachedPhotoCutouts) detachedPhotoCutouts.innerHTML = '';

    const detachedPhotoLandscape = document.getElementById('detachedPhotoLandscape');
    if (detachedPhotoLandscape) detachedPhotoLandscape.innerHTML = '';

    const droppedPhotoStage = document.getElementById('droppedPhotoStage');
    if (droppedPhotoStage) droppedPhotoStage.classList.remove('active', 'flying-to-tomo3');
  }
};

// ============================================================================
// INICIALIZACIÓN GLOBAL CUANDO EL DOM ESTÁ LISTO
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {

  const desk = document.getElementById('desk');
  const deskFullscreenBtn = document.getElementById('deskFullscreenBtn');
  const iconFullscreenExpand = document.getElementById('iconFullscreenExpand');
  const iconFullscreenCompress = document.getElementById('iconFullscreenCompress');
  const orientationGateOverlay = document.getElementById('orientationGateOverlay');
  const gateStatePortrait = document.getElementById('gateStatePortrait');
  const gateStateReady = document.getElementById('gateStateReady');
  const gateStartBtn = document.getElementById('gateStartBtn');

  let isExperienceStarted = false;

  // Inicializar submódulos
  window.Tomo1.init();
  window.Tomo2.init();
  window.Camara.init();
  window.Tomo3.init();

  // Estados iniciales en la mesa
  window.Tomo1.closeToStack();
  window.Tomo2.closeToStack();
  window.Tomo3.closeToStack();

  // Cierre global al hacer clic en el fondo de la mesa (Click Outside)
  if (desk) {
    desk.addEventListener('click', (e) => {
      if (e.target.closest('#tomo1BookWrapper') ||
          e.target.closest('#tomo2BookWrapper') ||
          e.target.closest('#tomo3BookWrapper') ||
          e.target.closest('#detachedPhotoStage') ||
          e.target.closest('#droppedPhotoStage') ||
          e.target.closest('#camera') ||
          e.target.closest('#cameraBackdropDim') ||
          e.target.closest('#viewfinderFullscreen') ||
          e.target.closest('#tomo3PhotoFullscreen') ||
          e.target.closest('#deskFullscreenBtn')) {
        return;
      }

      const STATES = window.AppDesk.STATES;

      if (window.AppDesk.tomo1State === STATES.OPEN) {
        if (window.AppDesk.activeLandscapeSpread) {
          window.Tomo1.closeToLeft();
        } else {
          window.Tomo1.closeToStack();
        }
      }

      if (window.AppDesk.tomo2State === STATES.OPEN) {
        if (window.AppDesk.activeLandscapeSpread && (window.AppDesk.selectedCutoutIds || []).length > 0) {
          window.Tomo2.closeToLeft();
        } else {
          window.Tomo2.closeToStack();
        }
      }

      if (window.AppDesk.tomo3State === STATES.OPEN) {
        window.Tomo3.closeToStack();
      }
    });
  }

  // Controles por teclado (Escape y Flechas)
  window.addEventListener('keydown', (e) => {
    const STATES = window.AppDesk.STATES;
    if (e.key === 'Escape') {
      const fsTomo3 = document.getElementById('tomo3PhotoFullscreen');
      if (fsTomo3 && fsTomo3.classList.contains('active')) {
        fsTomo3.classList.remove('active');
        return;
      }
      const fsView = document.getElementById('viewfinderFullscreen');
      if (fsView && fsView.classList.contains('active')) {
        window.Camara.closeFullscreenViewfinder();
        return;
      }
      const cam = document.getElementById('camera');
      if (cam && cam.classList.contains('active')) {
        window.Camara.closeRear();
        return;
      }
      if (window.AppDesk.tomo1State === STATES.OPEN) {
        if (window.AppDesk.activeLandscapeSpread) window.Tomo1.closeToLeft();
        else window.Tomo1.closeToStack();
      }
      if (window.AppDesk.tomo2State === STATES.OPEN) {
        if (window.AppDesk.activeLandscapeSpread && (window.AppDesk.selectedCutoutIds || []).length > 0) window.Tomo2.closeToLeft();
        else window.Tomo2.closeToStack();
      }
      if (window.AppDesk.tomo3State === STATES.OPEN) {
        window.Tomo3.closeToStack();
      }
    } else if (window.AppDesk.tomo1State === STATES.OPEN) {
      if (e.key === 'ArrowRight') window.Tomo1.flipForward();
      else if (e.key === 'ArrowLeft') window.Tomo1.flipBackward();
    } else if (window.AppDesk.tomo2State === STATES.OPEN) {
      if (e.key === 'ArrowRight') window.Tomo2.flipForward();
      else if (e.key === 'ArrowLeft') window.Tomo2.flipBackward();
    } else if (window.AppDesk.tomo3State === STATES.OPEN) {
      if (e.key === 'ArrowRight') window.Tomo3.flipForward();
      else if (e.key === 'ArrowLeft') window.Tomo3.flipBackward();
    } else {
      const cam = document.getElementById('camera');
      if (cam && cam.classList.contains('active')) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          window.Camara.applyWheelOffset(-12);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          window.Camara.applyWheelOffset(12);
        }
      }
    }
  });

  // Sensor de orientación y pantalla completa para móviles
  function isDevicePortrait() {
    return window.matchMedia("(orientation: portrait)").matches || (window.innerWidth < window.innerHeight);
  }

  function isMobileOrTouch() {
    return (window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
  }

  function checkOrientation() {
    if (!orientationGateOverlay) return;

    const inPortrait = isDevicePortrait();
    const isMobile = isMobileOrTouch();

    if (isMobile) {
      if (inPortrait) {
        orientationGateOverlay.classList.add('visible');
        if (gateStatePortrait) gateStatePortrait.style.display = 'flex';
        if (gateStateReady) gateStateReady.style.display = 'none';
      } else {
        if (!isExperienceStarted) {
          orientationGateOverlay.classList.add('visible');
          if (gateStatePortrait) gateStatePortrait.style.display = 'none';
          if (gateStateReady) gateStateReady.style.display = 'flex';
        } else {
          orientationGateOverlay.classList.remove('visible');
        }
      }
    } else {
      if (inPortrait) {
        orientationGateOverlay.classList.add('visible');
        if (gateStatePortrait) gateStatePortrait.style.display = 'flex';
        if (gateStateReady) gateStateReady.style.display = 'none';
      } else {
        orientationGateOverlay.classList.remove('visible');
        isExperienceStarted = true;
      }
    }
  }

  function toggleFullscreen() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    if (!isFs) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }

  function updateFullscreenIcons() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    if (iconFullscreenExpand && iconFullscreenCompress) {
      iconFullscreenExpand.style.display = isFs ? 'none' : 'block';
      iconFullscreenCompress.style.display = isFs ? 'block' : 'none';
    }
  }

  document.addEventListener('fullscreenchange', updateFullscreenIcons);
  document.addEventListener('webkitfullscreenchange', updateFullscreenIcons);

  if (deskFullscreenBtn) {
    deskFullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  if (gateStartBtn) {
    gateStartBtn.addEventListener('click', () => {
      toggleFullscreen();
      isExperienceStarted = true;
      if (orientationGateOverlay) {
        orientationGateOverlay.classList.remove('visible');
      }
    });
  }

  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 150));
  if (screen && screen.orientation) {
    screen.orientation.addEventListener('change', () => setTimeout(checkOrientation, 150));
  }

  checkOrientation();

});
