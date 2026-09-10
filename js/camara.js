/**
 * ============================================================================
 * CÁMARA FOTOGRÁFICA 35MM Y SISTEMA DE CAPTURA
 * Módulo interactivo de la Cámara, Rueda de Exposición y Revelado
 * ============================================================================
 */

window.Camara = (function() {

  // Generador de SVG de sobreimpresión lumínica con IDs de degradados únicos para evitar colisiones
  function getOverprintSVG(id = 'default') {
    const sunId = `opGradSun_${id}`;
    const prismId = `opGradPrism_${id}`;
    return `
      <svg viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="${sunId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff4db" stop-opacity="0.95" />
            <stop offset="30%" stop-color="#ffb703" stop-opacity="0.7" />
            <stop offset="65%" stop-color="#fb8500" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#023047" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${prismId}" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8ecae6" stop-opacity="0.85" />
            <stop offset="45%" stop-color="#219ebc" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon points="0,0 260,0 140,1200 0,1200" fill="url(#${sunId})" />
        <polygon points="210,0 460,0 320,1200 90,1200" fill="url(#${sunId})" opacity="0.65" />
        <polygon points="420,0 680,0 520,1200 280,1200" fill="url(#${sunId})" opacity="0.45" />
        <polygon points="610,0 800,0 800,1200 480,1200" fill="url(#${prismId})" opacity="0.7" />
        <circle cx="410" cy="480" r="190" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.6" stroke-dasharray="14 9" />
        <circle cx="410" cy="480" r="280" fill="none" stroke="#ffe5b4" stroke-width="1.8" opacity="0.4" />
        <circle cx="320" cy="740" r="130" fill="url(#${prismId})" opacity="0.5" />
        <line x1="0" y1="280" x2="800" y2="760" stroke="#fff" stroke-width="1.5" opacity="0.35" stroke-dasharray="8 6" />
      </svg>`;
  }

  const OVERPRINT_SVG = getOverprintSVG('static');

  // Convierte el valor de desplazamiento (-150 a +150) a porcentaje proporcional relativo al track
  function getTrackPercent(offset) {
    const val = (offset !== undefined && offset !== null) ? offset : 0;
    return (val / 150) * 22;
  }

  let cameraEl = null;
  let cameraBackdropDim = null;
  let cameraLed = null;
  let cameraFlashOverlay = null;
  let opticalViewfinderBox = null;
  let rearShutterBtn = null;
  let rearExitBtn = null;
  let screenLandscapeLayer = null;
  let screenCutoutsLayer = null;
  let overprintCanvasTrack = null;
  let physicalLightWheel = null;
  let wheelCylinderBarrel = null;

  let viewfinderFullscreen = null;
  let fsLandscapeLayer = null;
  let fsCutoutsLayer = null;
  let fsOverprintTrack = null;
  let fsShutterBtn = null;

  let droppedPhotoStage = null;
  let droppedPhotoCard = null;
  let droppedPhotoFlipper = null;
  let droppedPhotoImg = null;
  let photoTitleInput = null;
  let photoAuthorInput = null;
  let photoObservationsInput = null;
  let saveToTomo3Btn = null;
  let detachedPhotoStage = null;

  let currentCapturedPhotoDataUrl = '';
  let currentCapturedSnapshot = null;

  function unlockMechanics() {
    window.AppDesk.isCameraUnlocked = true;
    window.AppDesk.isCameraTaken = false;

    if (cameraEl) {
      cameraEl.classList.remove('camera-locked');
      cameraEl.classList.add('camera-unlocked');
      cameraEl.setAttribute('title', 'Cámara fotográfica desbloqueada • Haz clic para mirar por la pantalla trasera');
    }
    if (cameraLed) {
      cameraLed.classList.remove('led-off');
      cameraLed.classList.add('led-red-on');
    }
  }

  function lockMechanics() {
    window.AppDesk.isCameraUnlocked = false;

    closeRear();
    closeFullscreenViewfinder();

    if (cameraEl) {
      cameraEl.classList.remove('camera-unlocked', 'active');
      cameraEl.classList.add('camera-locked');
      cameraEl.setAttribute('title', 'Cámara fotográfica apagada');
    }
    if (cameraLed) {
      cameraLed.classList.remove('led-red-on');
      cameraLed.classList.add('led-off');
    }

    if (screenLandscapeLayer) screenLandscapeLayer.innerHTML = '';
    if (screenCutoutsLayer) screenCutoutsLayer.innerHTML = '';
    if (overprintCanvasTrack) overprintCanvasTrack.innerHTML = '';
  }

  function openRear() {
    if (!cameraEl || cameraEl.classList.contains('active')) return;
    if (!window.AppDesk.isCameraUnlocked) return;

    // Cerrar libros si alguno estuviera abierto
    const STATES = window.AppDesk.STATES;
    if (window.AppDesk.tomo1State === STATES.OPEN) window.Tomo1.closeToLeft();
    if (window.AppDesk.tomo2State === STATES.OPEN) window.Tomo2.closeToLeft();
    if (window.AppDesk.tomo3State === STATES.OPEN) window.Tomo3.closeToStack();

    cameraEl.classList.add('active');
    if (cameraBackdropDim) {
      cameraBackdropDim.classList.add('active');
    }

    const activeSpread = window.AppDesk.activeLandscapeSpread;
    if (screenLandscapeLayer && activeSpread) {
      screenLandscapeLayer.innerHTML = window.AppDesk.renderPhotoMediaHTML(activeSpread.numStr, activeSpread.palette);
    }

    if (screenCutoutsLayer) {
      const selectedIds = window.AppDesk.selectedCutoutIds || [];
      const alignment = window.AppDesk.cutoutAlignment || 'center';
      const layout = window.Tomo2.getCutoutLayout ? window.Tomo2.getCutoutLayout(selectedIds, alignment) : [];
      screenCutoutsLayer.innerHTML = layout.map(pos => `
        <div class="placed-cutout" style="left:${pos.left}; bottom:${pos.bottom}; width:${pos.width}; height:${pos.height}; z-index:${pos.zIndex};">
          <img src="FOTOS/RECORTES/${pos.id}.png" 
               onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${pos.item.fallbackSrc || ''}';}" 
               alt="${pos.item.name || pos.id}" 
               class="placed-cutout-img" />
        </div>
      `).join('');
    }

    if (overprintCanvasTrack) {
      overprintCanvasTrack.innerHTML = getOverprintSVG('camera_rear');
      applyWheelOffset(0);
    }
  }

  function closeRear() {
    if (!cameraEl) return;
    cameraEl.classList.remove('active');
    if (cameraBackdropDim) {
      cameraBackdropDim.classList.remove('active');
    }
    if (viewfinderFullscreen) {
      viewfinderFullscreen.classList.remove('active');
    }
  }

  function openFullscreenViewfinder() {
    if (!viewfinderFullscreen) return;
    viewfinderFullscreen.classList.add('active');

    const activeSpread = window.AppDesk.activeLandscapeSpread;
    if (fsLandscapeLayer && activeSpread) {
      fsLandscapeLayer.innerHTML = window.AppDesk.renderPhotoMediaHTML(activeSpread.numStr, activeSpread.palette);
    }

    if (fsCutoutsLayer) {
      const selectedIds = window.AppDesk.selectedCutoutIds || [];
      const alignment = window.AppDesk.cutoutAlignment || 'center';
      const layout = window.Tomo2.getCutoutLayout ? window.Tomo2.getCutoutLayout(selectedIds, alignment) : [];
      fsCutoutsLayer.innerHTML = layout.map(pos => `
        <div class="placed-cutout" style="left:${pos.left}; bottom:${pos.bottom}; width:${pos.width}; height:${pos.height}; z-index:${pos.zIndex};">
          <img src="FOTOS/RECORTES/${pos.id}.png" 
               onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${pos.item.fallbackSrc || ''}';}" 
               alt="${pos.item.name || pos.id}" 
               class="placed-cutout-img" />
        </div>
      `).join('');
    }

    if (fsOverprintTrack) {
      fsOverprintTrack.innerHTML = getOverprintSVG('camera_fs');
      const trackPercent = getTrackPercent(window.AppDesk.overprintOffsetY);
      fsOverprintTrack.style.transform = `translateY(${trackPercent}%)`;
    }
  }

  function closeFullscreenViewfinder(returnToCamera = false) {
    if (!viewfinderFullscreen) return;
    viewfinderFullscreen.classList.remove('active');
    if (returnToCamera && cameraEl && !cameraEl.classList.contains('active') && window.AppDesk.isCameraUnlocked) {
      cameraEl.classList.add('active');
      if (cameraBackdropDim) cameraBackdropDim.classList.add('active');
    }
  }

  function applyWheelOffset(delta) {
    const MIN_OFFSET = -150;
    const MAX_OFFSET = 150;
    window.AppDesk.overprintOffsetY = Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, (window.AppDesk.overprintOffsetY || 0) + delta));
    const offset = window.AppDesk.overprintOffsetY;
    const trackPercent = getTrackPercent(offset);

    if (overprintCanvasTrack) {
      overprintCanvasTrack.style.transform = `translateY(${trackPercent}%)`;
    }
    if (wheelCylinderBarrel) {
      wheelCylinderBarrel.style.backgroundPositionY = `${-offset * 0.9}px`;
    }
    if (fsOverprintTrack) {
      fsOverprintTrack.style.transform = `translateY(${trackPercent}%)`;
    }
  }

  // Renderiza la fotografía compuesta EXACTAMENTE igual que la pantalla de la cámara
  function renderCompositePhotoHTML(photo) {
    if (!photo) return '';

    const photoId = photo.id || ('p_' + Math.random().toString(36).substr(2, 9));
    const alignment = (photo && photo.cutoutAlignment) || window.AppDesk.cutoutAlignment || 'center';
    const layout = window.Tomo2.getCutoutLayout ? window.Tomo2.getCutoutLayout(photo.cutoutIds || [], alignment) : [];
    const cutoutsHTML = layout.map(pos => `
      <div class="placed-cutout" style="left:${pos.left}; bottom:${pos.bottom}; width:${pos.width}; height:${pos.height}; z-index:${pos.zIndex};">
        <img src="FOTOS/RECORTES/${pos.id}.png" 
             onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='${pos.item.fallbackSrc || ''}';}" 
             alt="${pos.item.name || pos.id}" 
             class="placed-cutout-img" />
      </div>
    `).join('');

    const numStr = photo.numStr || '01';
    const overlayNum = ((Math.max(1, parseInt(numStr, 10) || 1) - 1) % 4) + 1;
    const trackPercent = getTrackPercent(photo.overprintOffsetY);

    return `
      <div class="composite-photo-media">
        <div class="composite-photo-landscape">
          <img src="FOTOS/PAISAJES/${numStr}.jpg" 
               alt="Paisaje ${numStr}" 
               class="landscape-real-img"
               onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='FOTO/PAISAJES/${numStr}.jpg';}" />
          <img src="FOTOS/MATERIALES/foto${overlayNum}.png" 
               alt="Textura" 
               class="landscape-overlay-img" 
               onerror="this.style.display='none';" />
        </div>
        <div class="composite-photo-cutouts">
          ${cutoutsHTML}
        </div>
        <div class="composite-photo-overprint">
          <div class="overprint-canvas-track" style="transform: translateY(${trackPercent}%);">
            ${getOverprintSVG('snap_' + photoId)}
          </div>
        </div>
      </div>
    `;
  }

  function composeCanvasSnapshot(callback) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const activeSpread = window.AppDesk.activeLandscapeSpread || window.Tomo1.SPREADS_DATA[1];
    const p = activeSpread.palette || ["#222", "#555", "#888", "#ddd"];

    const landscapeImg = screenLandscapeLayer ? screenLandscapeLayer.querySelector('.landscape-real-img') : null;
    const landscapeOverlay = screenLandscapeLayer ? screenLandscapeLayer.querySelector('.landscape-overlay-img') : null;

    const drawLandscapeVector = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, p[0]);
      grad.addColorStop(0.5, p[1]);
      grad.addColorStop(1, p[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(600, 320, 180, 0, Math.PI * 2);
      ctx.fillStyle = p[3];
      ctx.globalAlpha = 0.35;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(600, 320, 85, 0, Math.PI * 2);
      ctx.globalAlpha = 0.75;
      ctx.fill();

      ctx.globalAlpha = 0.85;
      ctx.fillStyle = p[1];
      ctx.beginPath();
      ctx.moveTo(0, 440);
      ctx.quadraticCurveTo(300, 350, 600, 430);
      ctx.quadraticCurveTo(900, 390, 1200, 390);
      ctx.lineTo(1200, 675);
      ctx.lineTo(0, 675);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = p[0];
      ctx.beginPath();
      ctx.moveTo(0, 490);
      ctx.quadraticCurveTo(360, 420, 680, 480);
      ctx.quadraticCurveTo(1000, 460, 1200, 460);
      ctx.lineTo(1200, 675);
      ctx.lineTo(0, 675);
      ctx.closePath();
      ctx.fill();
    };

    if (landscapeImg && landscapeImg.naturalWidth > 0) {
      try {
        ctx.drawImage(landscapeImg, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        drawLandscapeVector();
      }
    } else {
      drawLandscapeVector();
    }

    if (landscapeOverlay && landscapeOverlay.naturalWidth > 0) {
      try {
        ctx.drawImage(landscapeOverlay, 0, 0, canvas.width, canvas.height);
      } catch (e) {}
    }

    const finalizeExport = () => {
      let exportUrl = '';
      try {
        exportUrl = canvas.toDataURL('image/jpeg', 0.92);
      } catch (e) {
        exportUrl = '';
      }
      callback(exportUrl);
    };

    const applyOverprintAndFinish = () => {
      try {
        const snapId = (currentCapturedSnapshot && currentCapturedSnapshot.id) || Date.now();
        const svgStr = getOverprintSVG('canvas_' + snapId);
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const blobUrl = URL.createObjectURL(svgBlob);
        const opImg = new Image();
        opImg.crossOrigin = 'anonymous';
        opImg.onload = () => {
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.globalCompositeOperation = 'screen';
          const trackH = canvas.height * 2.2;
          const trackPercent = getTrackPercent(window.AppDesk.overprintOffsetY);
          const trackY = -canvas.height * 0.6 + (trackPercent / 100) * trackH;
          ctx.drawImage(opImg, 0, trackY, canvas.width, trackH);
          ctx.restore();
          URL.revokeObjectURL(blobUrl);
          finalizeExport();
        };
        opImg.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          finalizeExport();
        };
        opImg.src = blobUrl;
      } catch (err) {
        finalizeExport();
      }
    };

    // Dibujar los recortes fotográficos familiares situados con sombras suaves
    const selectedIds = window.AppDesk.selectedCutoutIds || [];
    const alignment = window.AppDesk.cutoutAlignment || 'center';
    const layout = window.Tomo2.getCutoutLayout ? window.Tomo2.getCutoutLayout(selectedIds, alignment) : [];

    if (layout.length === 0) {
      applyOverprintAndFinish();
    } else {
      let loadedCount = 0;
      const totalToLoad = layout.length;
      const entries = [];

      const onAllImagesReady = (loadedEntries) => {
        loadedEntries.forEach(entry => {
          if (!entry || !entry.img) return;
          const { img, pos } = entry;
          const leftPercent = parseFloat(pos.left) / 100;
          const bottomPercent = parseFloat(pos.bottom) / 100;
          const widthPercent = parseFloat(pos.width) / 100;
          const heightPercent = parseFloat(pos.height) / 100;

          const figW = widthPercent * canvas.width;
          const figH = heightPercent * canvas.height;
          const figX = leftPercent * canvas.width;
          const figY = canvas.height - (bottomPercent * canvas.height) - figH;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.70)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 6;
          ctx.drawImage(img, figX, figY, figW, figH);
          ctx.restore();
        });
        applyOverprintAndFinish();
      };

      layout.forEach((pos, idx) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const done = () => {
          loadedCount++;
          if (loadedCount >= totalToLoad) {
            onAllImagesReady(entries);
          }
        };
        img.onload = () => {
          entries[idx] = { img, pos };
          done();
        };
        img.onerror = () => {
          if (pos.item && pos.item.fallbackSrc && !img.datasetTried) {
            img.datasetTried = true;
            img.src = pos.item.fallbackSrc;
          } else {
            entries[idx] = null;
            done();
          }
        };
        img.src = `FOTOS/RECORTES/${pos.id}.png`;
      });
    }
  }

  function triggerShutterCapture() {
    if (cameraFlashOverlay) {
      cameraFlashOverlay.classList.add('flash-active');
      setTimeout(() => {
        cameraFlashOverlay.classList.remove('flash-active');
      }, 120);
    }

    const activeSpread = window.AppDesk.activeLandscapeSpread;
    const currentSnap = {
      id: Date.now(),
      dataUrl: '',
      numStr: activeSpread ? (activeSpread.numStr || '01') : '01',
      palette: activeSpread ? activeSpread.palette : ['#023047', '#219ebc', '#8ecae6', '#ffb703'],
      cutoutIds: [...(window.AppDesk.selectedCutoutIds || [])],
      overprintOffsetY: window.AppDesk.overprintOffsetY,
      cutoutAlignment: window.AppDesk.cutoutAlignment || 'center'
    };
    currentCapturedSnapshot = currentSnap;

    composeCanvasSnapshot((dataUrl) => {
      currentCapturedPhotoDataUrl = dataUrl;
      currentSnap.dataUrl = dataUrl;

      // Al disparar la foto: LA CÁMARA SE APAGA Y NO PERMITE MÁS INTERACCIÓN
      // a menos que el usuario seleccione Tomo 1 y recomience
      window.AppDesk.isCameraTaken = true;
      lockMechanics();

      // En la mesa queda la nueva foto tomada (se oculta el paisaje base)
      if (detachedPhotoStage) {
        detachedPhotoStage.classList.remove('visible');
      }

      const mediaWrap = document.querySelector('.photo-card-media-wrap') || (droppedPhotoImg ? droppedPhotoImg.parentElement : null);
      if (mediaWrap) {
        mediaWrap.innerHTML = renderCompositePhotoHTML(currentSnap);
      } else if (droppedPhotoImg) {
        droppedPhotoImg.src = dataUrl;
      }

      if (droppedPhotoFlipper) {
        droppedPhotoFlipper.classList.remove('flipped');
      }
      if (photoTitleInput) {
        photoTitleInput.value = '';
      }
      if (photoAuthorInput) {
        photoAuthorInput.value = '';
      }
      if (photoObservationsInput) {
        photoObservationsInput.value = '';
      }

      if (droppedPhotoStage) {
        droppedPhotoStage.classList.remove('flying-to-tomo3');
        droppedPhotoStage.classList.remove('active');
        void droppedPhotoStage.offsetWidth; // Forzar reflow para animación
        droppedPhotoStage.classList.add('active');
      }
    });
  }

  function init() {
    cameraEl = document.getElementById('camera');
    cameraBackdropDim = document.getElementById('cameraBackdropDim');
    cameraLed = document.getElementById('cameraLed');
    cameraFlashOverlay = document.getElementById('cameraFlashOverlay');
    opticalViewfinderBox = document.getElementById('opticalViewfinderBox');
    rearShutterBtn = document.getElementById('rearShutterBtn');
    rearExitBtn = document.getElementById('rearExitBtn');
    screenLandscapeLayer = document.getElementById('screenLandscapeLayer');
    screenCutoutsLayer = document.getElementById('screenCutoutsLayer');
    overprintCanvasTrack = document.getElementById('overprintCanvasTrack');
    physicalLightWheel = document.getElementById('physicalLightWheel');
    wheelCylinderBarrel = document.getElementById('wheelCylinderBarrel');

    viewfinderFullscreen = document.getElementById('viewfinderFullscreen');
    fsLandscapeLayer = document.getElementById('fsLandscapeLayer');
    fsCutoutsLayer = document.getElementById('fsCutoutsLayer');
    fsOverprintTrack = document.getElementById('fsOverprintTrack');
    fsShutterBtn = document.getElementById('fsShutterBtn');

    droppedPhotoStage = document.getElementById('droppedPhotoStage');
    droppedPhotoCard = document.getElementById('droppedPhotoCard');
    droppedPhotoFlipper = document.getElementById('droppedPhotoFlipper');
    droppedPhotoImg = document.getElementById('droppedPhotoImg');
    photoTitleInput = document.getElementById('photoTitleInput');
    photoAuthorInput = document.getElementById('photoAuthorInput');
    photoObservationsInput = document.getElementById('photoObservationsInput');
    saveToTomo3Btn = document.getElementById('saveToTomo3Btn');
    detachedPhotoStage = document.getElementById('detachedPhotoStage');

    if (cameraEl) {
      cameraEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!window.AppDesk.isCameraUnlocked) {
          cameraEl.classList.add('camera-shake');
          setTimeout(() => cameraEl.classList.remove('camera-shake'), 420);
          return;
        }
        openRear();
      });
    }

    if (rearExitBtn) {
      rearExitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeRear();
      });
    }

    if (cameraBackdropDim) {
      cameraBackdropDim.addEventListener('click', () => {
        closeRear();
      });
    }

    if (opticalViewfinderBox) {
      opticalViewfinderBox.addEventListener('click', (e) => {
        e.stopPropagation();
        openFullscreenViewfinder();
      });
    }


    if (viewfinderFullscreen) {
      viewfinderFullscreen.addEventListener('click', (e) => {
        if (e.target.closest('#fsShutterBtn')) return;
        e.stopPropagation();
        closeFullscreenViewfinder(true);
      });
    }

    // Disparadores
    if (rearShutterBtn) {
      rearShutterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerShutterCapture();
      });
    }

    if (fsShutterBtn) {
      fsShutterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerShutterCapture();
      });
    }

    // Rueda física de exposición y ajuste lumínico interactivo
    function handleWheelScroll(e) {
      e.preventDefault();
      const delta = Math.max(-25, Math.min(25, -e.deltaY * 0.28));
      applyWheelOffset(delta);
    }

    if (physicalLightWheel) {
      physicalLightWheel.addEventListener('wheel', handleWheelScroll, { passive: false });

      let wheelDragging = false;
      let wheelStartY = 0;

      physicalLightWheel.addEventListener('mousedown', (e) => {
        wheelDragging = true;
        wheelStartY = e.clientY;
        document.body.style.cursor = 'ns-resize';
      });

      window.addEventListener('mousemove', (e) => {
        if (!wheelDragging) return;
        const deltaY = e.clientY - wheelStartY;
        wheelStartY = e.clientY;
        applyWheelOffset(-deltaY * 1.2);
      });

      window.addEventListener('mouseup', () => {
        if (wheelDragging) {
          wheelDragging = false;
          document.body.style.cursor = '';
        }
      });

      physicalLightWheel.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          wheelDragging = true;
          wheelStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!wheelDragging || !e.touches || e.touches.length === 0) return;
        const deltaY = e.touches[0].clientY - wheelStartY;
        wheelStartY = e.touches[0].clientY;
        applyWheelOffset(-deltaY * 1.2);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        wheelDragging = false;
      });
    }

    // Permitir desplazar la exposición con scroll o arrastre sobre la pantalla LCD trasera
    const rearScreenEl = document.getElementById('rearScreenViewport');
    if (rearScreenEl) {
      rearScreenEl.addEventListener('wheel', handleWheelScroll, { passive: false });

      let screenDragging = false;
      let screenStartY = 0;

      rearScreenEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        screenDragging = true;
        screenStartY = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (!screenDragging) return;
        const deltaY = e.clientY - screenStartY;
        screenStartY = e.clientY;
        applyWheelOffset(-deltaY * 1.0);
      });

      window.addEventListener('mouseup', () => {
        screenDragging = false;
      });

      rearScreenEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length > 0) {
          screenDragging = true;
          screenStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!screenDragging || !e.touches || e.touches.length === 0) return;
        const deltaY = e.touches[0].clientY - screenStartY;
        screenStartY = e.touches[0].clientY;
        applyWheelOffset(-deltaY * 1.0);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        screenDragging = false;
      });
    }

    // Scroll en chasis de cámara y visor pantalla completa
    if (cameraEl) {
      cameraEl.addEventListener('wheel', (e) => {
        if (cameraEl.classList.contains('active')) {
          handleWheelScroll(e);
        }
      }, { passive: false });
    }

    if (viewfinderFullscreen) {
      viewfinderFullscreen.addEventListener('wheel', handleWheelScroll, { passive: false });
    }

    // Flechas de exposición (↑ / ↓)
    const exposureArrowUp = document.getElementById('exposureArrowUp');
    const exposureArrowDown = document.getElementById('exposureArrowDown');
    if (exposureArrowUp) {
      exposureArrowUp.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWheelOffset(20);
      });
    }
    if (exposureArrowDown) {
      exposureArrowDown.addEventListener('click', (e) => {
        e.stopPropagation();
        applyWheelOffset(-20);
      });
    }

    // Teclas de flechas arriba / abajo cuando la cámara está activa
    window.addEventListener('keydown', (e) => {
      const isCamActive = (cameraEl && cameraEl.classList.contains('active')) ||
                          (viewfinderFullscreen && viewfinderFullscreen.classList.contains('active'));
      if (!isCamActive) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        applyWheelOffset(15);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        applyWheelOffset(-15);
      } else if (e.key === 'Escape') {
        closeRear();
        closeFullscreenViewfinder();
      }
    });

    // Giro de la fotografía revelada (Front <-> Ficha de memoria)
    if (droppedPhotoCard) {
      droppedPhotoCard.addEventListener('click', (e) => {
        // Si el usuario hace clic en inputs, botones o campos editables: NO girar
        if (e.target.closest('input, textarea, select, button, label, .card-input-group')) {
          return;
        }
        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.toggle('flipped');
        }
      });
    }

    // Botón opcional para volver al frente
    const flipToFrontBtn = document.getElementById('flipToFrontBtn');
    if (flipToFrontBtn) {
      flipToFrontBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.remove('flipped');
        }
      });
    }

    // Asegurar que hacer clic o enfocar los campos de texto no propague eventos ni cause giros
    [photoTitleInput, photoAuthorInput, photoObservationsInput].forEach((fieldEl) => {
      if (fieldEl) {
        fieldEl.addEventListener('click', (e) => e.stopPropagation());
        fieldEl.addEventListener('mousedown', (e) => e.stopPropagation());
      }
    });

    // Botón Guardar en Tomo III (Icono check)
    if (saveToTomo3Btn) {
      saveToTomo3Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = (photoTitleInput && photoTitleInput.value.trim()) || 'Sin título';
        const author = (photoAuthorInput && photoAuthorInput.value.trim()) || 'Autor/x anónimo';
        const observations = (photoObservationsInput && photoObservationsInput.value.trim()) || '';

        const photoId = (currentCapturedSnapshot && currentCapturedSnapshot.id) || Date.now();

        const now = new Date();
        const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hs';
        const dateTimeStr = `${dateStr} • ${timeStr}`;

        const newPhotoItem = {
          id: photoId,
          dataUrl: currentCapturedPhotoDataUrl,
          title: title,
          author: author,
          observations: observations,
          date: dateStr,
          time: timeStr,
          dateTimeStr: dateTimeStr,
          numStr: (currentCapturedSnapshot && currentCapturedSnapshot.numStr) || '01',
          palette: (currentCapturedSnapshot && currentCapturedSnapshot.palette) || ['#023047', '#219ebc', '#8ecae6', '#ffb703'],
          cutoutIds: (currentCapturedSnapshot && currentCapturedSnapshot.cutoutIds) || [...(window.AppDesk.selectedCutoutIds || [])],
          overprintOffsetY: (currentCapturedSnapshot && currentCapturedSnapshot.overprintOffsetY !== undefined) ? currentCapturedSnapshot.overprintOffsetY : window.AppDesk.overprintOffsetY,
          cutoutAlignment: (currentCapturedSnapshot && currentCapturedSnapshot.cutoutAlignment) || window.AppDesk.cutoutAlignment || 'center'
        };

        window.Tomo3.addPhoto(newPhotoItem);

        // Descarga automática en archivo vinculado a CREADAS
        try {
          if (currentCapturedPhotoDataUrl && currentCapturedPhotoDataUrl.startsWith('data:')) {
            const downloadLink = document.createElement('a');
            downloadLink.download = `CREADAS_foto_${newPhotoItem.id}.jpg`;
            downloadLink.href = currentCapturedPhotoDataUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
        } catch (dlErr) {}

        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.remove('flipped');
        }

        setTimeout(() => {
          if (droppedPhotoStage) {
            droppedPhotoStage.classList.add('flying-to-tomo3');
          }
        }, 180);

        setTimeout(() => {
          if (droppedPhotoStage) {
            droppedPhotoStage.classList.remove('active', 'flying-to-tomo3');
          }

          // Deseleccionar imagen de paisaje y recortes al terminar la experiencia
          window.AppDesk.activeLandscapeSpread = null;
          window.AppDesk.selectedCutoutIds = [];
          window.AppDesk.isCameraTaken = true;

          // Limpiar elementos de la mesa
          if (detachedPhotoStage) {
            detachedPhotoStage.classList.remove('visible');
          }
          const detachedPhotoCutouts = document.getElementById('detachedPhotoCutouts');
          if (detachedPhotoCutouts) detachedPhotoCutouts.innerHTML = '';
          const detachedPhotoLandscape = document.getElementById('detachedPhotoLandscape');
          if (detachedPhotoLandscape) detachedPhotoLandscape.innerHTML = '';

          // Bloquear cámara y tomo 2
          lockMechanics();
          if (window.Tomo2 && window.Tomo2.lock) {
            window.Tomo2.lock();
          }

          // Desbloquear Tomo III con la nueva fotografía archivada
          if (window.Tomo3 && window.Tomo3.unlock) {
            window.Tomo3.unlock();
          }

          // Abrir Tomo III en las páginas iniciales (Spread 0: Portadilla con Título y Frase de Boltanski)
          // permitiendo que el usuario hojee libremente hasta su fotografía
          if (window.Tomo3 && window.Tomo3.open) {
            window.Tomo3.open(0);
          }
        }, 1320);
      });
    }

    lockMechanics();
  }

  return {
    init,
    unlockMechanics,
    lockMechanics,
    openRear,
    closeRear,
    openFullscreenViewfinder,
    closeFullscreenViewfinder,
    applyWheelOffset,
    renderCompositePhotoHTML,
    getOverprintSVG,
    getTrackPercent,
    OVERPRINT_SVG
  };

})();
