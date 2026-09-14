/**
 * ============================================================================
 * CÁMARA FOTOGRÁFICA 35MM Y SISTEMA DE CAPTURA
 * Módulo interactivo de la Cámara, Rueda de Exposición y Revelado
 * ============================================================================
 */

window.Camara = (function() {

  // Generador de SVG de sobreimpresión lumínica única (960 x 6360, continuo y sin repeticiones)
  function getOverprintSVG(id = 'default') {
    const sunId = `opGradSun_${id}`;
    const prismId = `opGradPrism_${id}`;
    const roseId = `opGradRose_${id}`;
    const violetId = `opGradViolet_${id}`;
    const amberId = `opGradAmber_${id}`;
    const flareId = `opFlareAura_${id}`;

    return `
      <svg viewBox="0 0 960 6360" width="960" height="6360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="overprint-svg-layer" style="width:100%;height:100%;">
        <defs>
          <linearGradient id="${sunId}" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stop-color="#fff8e7" stop-opacity="0.95" />
            <stop offset="18%" stop-color="#ffe17d" stop-opacity="0.80" />
            <stop offset="42%" stop-color="#f77f00" stop-opacity="0.60" />
            <stop offset="70%" stop-color="#d62828" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#003049" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${prismId}" x1="90%" y1="5%" x2="10%" y2="95%">
            <stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.90" />
            <stop offset="25%" stop-color="#48cae4" stop-opacity="0.65" />
            <stop offset="55%" stop-color="#0077b6" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#03045e" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${roseId}" x1="100%" y1="35%" x2="0%" y2="65%">
            <stop offset="0%" stop-color="#ff0a54" stop-opacity="0.75" />
            <stop offset="35%" stop-color="#ff5400" stop-opacity="0.50" />
            <stop offset="70%" stop-color="#ffbd00" stop-opacity="0.28" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${violetId}" x1="0%" y1="40%" x2="100%" y2="70%">
            <stop offset="0%" stop-color="#7209b7" stop-opacity="0.70" />
            <stop offset="40%" stop-color="#3f37c9" stop-opacity="0.45" />
            <stop offset="75%" stop-color="#4cc9f0" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${amberId}" x1="0%" y1="100%" x2="100%" y2="20%">
            <stop offset="0%" stop-color="#ffb703" stop-opacity="0.80" />
            <stop offset="45%" stop-color="#fb8500" stop-opacity="0.50" />
            <stop offset="80%" stop-color="#e63946" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#023047" stop-opacity="0" />
          </linearGradient>
          <radialGradient id="${flareId}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.90" />
            <stop offset="25%" stop-color="#fff1c5" stop-opacity="0.65" />
            <stop offset="55%" stop-color="#ffb703" stop-opacity="0.30" />
            <stop offset="85%" stop-color="#e76f51" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Haces lumínicos continuos que fluyen a lo largo de toda la longitud 960x6360 -->
        <polygon points="0,0 380,0 560,2900 320,6360 0,6360 0,3800" fill="url(#${sunId})" opacity="0.75" />
        <polygon points="260,0 640,0 800,2700 650,6360 410,6360 450,3200" fill="url(#${sunId})" opacity="0.50" />
        <polygon points="620,0 960,0 960,3500 740,6360 520,6360 860,2300" fill="url(#${prismId})" opacity="0.65" />
        <polygon points="960,1600 660,2850 960,4100" fill="url(#${roseId})" opacity="0.55" />
        <polygon points="0,3700 520,4650 0,5650" fill="url(#${violetId})" opacity="0.50" />
        <polygon points="0,5100 960,4500 960,6360 0,6360" fill="url(#${amberId})" opacity="0.45" />

        <!-- 2. ANILLOS ÓPTICOS CONCÉNTRICOS Y LENTES (Líneas punteadas y continuas) -->
        <!-- Cluster Central (En torno al centro anamórfico cy="3180") -->
        <circle cx="480" cy="3180" r="340" fill="url(#${flareId})" opacity="0.65" />
        <circle cx="480" cy="3180" r="540" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.40" stroke-dasharray="24 16" />
        <circle cx="480" cy="3180" r="430" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.60" stroke-dasharray="28 16" />
        <circle cx="480" cy="3180" r="360" fill="none" stroke="#ffe5b4" stroke-width="2.0" opacity="0.50" />
        <circle cx="480" cy="3180" r="280" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.55" stroke-dasharray="16 12" />
        <circle cx="480" cy="3180" r="210" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.55" />
        <circle cx="480" cy="3180" r="140" fill="none" stroke="#ffd166" stroke-width="1.6" opacity="0.60" stroke-dasharray="10 8" />
        <circle cx="480" cy="3180" r="80" fill="none" stroke="#e0f7fa" stroke-width="1.6" opacity="0.60" />

        <!-- Satélites de aberración cromática secundaria en zona central -->
        <circle cx="580" cy="2720" r="150" fill="url(#${prismId})" opacity="0.45" />
        <circle cx="360" cy="3620" r="190" fill="url(#${roseId})" opacity="0.35" />

        <!-- Cluster Superior (Fotograma superior cy="1750") -->
        <circle cx="480" cy="1750" r="440" fill="none" stroke="#ffd166" stroke-width="1.8" opacity="0.45" stroke-dasharray="24 16" />
        <circle cx="480" cy="1750" r="320" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.50" />
        <circle cx="480" cy="1750" r="220" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.55" stroke-dasharray="14 10" />
        <circle cx="480" cy="1750" r="130" fill="none" stroke="#ffe5b4" stroke-width="1.6" opacity="0.55" />
        <circle cx="480" cy="1750" r="70" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.60" stroke-dasharray="8 6" />

        <!-- Cluster Inferior (Fotograma inferior cy="4650") -->
        <circle cx="480" cy="4650" r="440" fill="none" stroke="#48cae4" stroke-width="1.8" opacity="0.45" stroke-dasharray="24 16" />
        <circle cx="480" cy="4650" r="320" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.50" />
        <circle cx="480" cy="4650" r="220" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.55" stroke-dasharray="14 10" />
        <circle cx="480" cy="4650" r="130" fill="none" stroke="#e0f7fa" stroke-width="1.6" opacity="0.55" />
        <circle cx="480" cy="4650" r="70" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.60" stroke-dasharray="8 6" />

        <!-- Satélites ópticos auxiliares (Lentes y refracciones dispersas) -->
        <circle cx="640" cy="1150" r="180" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.40" stroke-dasharray="18 12" />
        <circle cx="640" cy="1150" r="110" fill="none" stroke="#ffd166" stroke-width="1.4" opacity="0.45" />
        <circle cx="300" cy="5350" r="190" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.40" stroke-dasharray="20 14" />
        <circle cx="300" cy="5350" r="115" fill="none" stroke="#48cae4" stroke-width="1.4" opacity="0.45" />

        <!-- Destellos anamórficos transversales -->
        <line x1="0" y1="780" x2="960" y2="1080" stroke="#ffd166" stroke-width="7" opacity="0.30" />
        <line x1="0" y1="780" x2="960" y2="1080" stroke="#ffffff" stroke-width="2.2" opacity="0.70" />
        <line x1="0" y1="3350" x2="960" y2="3010" stroke="#ff006e" stroke-width="8" opacity="0.25" />
        <line x1="0" y1="3350" x2="960" y2="3010" stroke="#ffffff" stroke-width="2.0" opacity="0.65" />
        <line x1="0" y1="5050" x2="960" y2="5380" stroke="#48cae4" stroke-width="6" opacity="0.25" />
        <line x1="0" y1="5050" x2="960" y2="5380" stroke="#ffffff" stroke-width="1.8" opacity="0.55" />

        <!-- Calibración y registro 35mm analógico -->
        <line x1="28" y1="120" x2="28" y2="6240" stroke="#ffffff" stroke-width="1.2" opacity="0.28" stroke-dasharray="16 22" />
        <line x1="932" y1="120" x2="932" y2="6240" stroke="#ffffff" stroke-width="1.2" opacity="0.28" stroke-dasharray="16 22" />

        <!-- Cruz de calibración superior (Start frame) -->
        <line x1="430" y1="180" x2="530" y2="180" stroke="#ffffff" stroke-width="2.0" opacity="0.75" />
        <line x1="480" y1="130" x2="480" y2="230" stroke="#ffffff" stroke-width="2.0" opacity="0.75" />
        <circle cx="480" cy="180" r="22" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.70" />

        <!-- 1. Diana de calibración superior / Frame 1 (Cruz con círculo según imagen) -->
        <g class="reticle-target-upper">
          <line x1="400" y1="1750" x2="560" y2="1750" stroke="#ffffff" stroke-width="2.2" opacity="0.85" />
          <line x1="480" y1="1670" x2="480" y2="1830" stroke="#ffffff" stroke-width="2.2" opacity="0.85" />
          <circle cx="480" cy="1750" r="35" fill="none" stroke="#ffffff" stroke-width="2.0" opacity="0.80" />
        </g>

        <!-- 2. Diana de calibración central / Optical Center (Cruz con círculo según imagen) -->
        <g class="reticle-target-center">
          <line x1="390" y1="3180" x2="570" y2="3180" stroke="#ffffff" stroke-width="2.4" opacity="0.90" />
          <line x1="480" y1="3090" x2="480" y2="3270" stroke="#ffffff" stroke-width="2.4" opacity="0.90" />
          <circle cx="480" cy="3180" r="38" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.85" />
        </g>

        <!-- 3. Diana de calibración inferior / Frame 3 (Cruz con círculo según imagen) -->
        <g class="reticle-target-lower">
          <line x1="400" y1="4650" x2="560" y2="4650" stroke="#ffffff" stroke-width="2.2" opacity="0.85" />
          <line x1="480" y1="4570" x2="480" y2="4730" stroke="#ffffff" stroke-width="2.2" opacity="0.85" />
          <circle cx="480" cy="4650" r="35" fill="none" stroke="#ffffff" stroke-width="2.0" opacity="0.80" />
        </g>

        <!-- Cruz de calibración inferior (End frame) -->
        <line x1="430" y1="6180" x2="530" y2="6180" stroke="#ffffff" stroke-width="2.0" opacity="0.75" />
        <line x1="480" y1="6130" x2="480" y2="6230" stroke="#ffffff" stroke-width="2.0" opacity="0.75" />
        <circle cx="480" cy="6180" r="22" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.70" />
      </svg>`;
  }

  // Generador de contenido completo del track: imagen FILTRO.png puesta 2 veces en la base + FILTRO.svg encima
  function renderOverprintTrackHTML(id = 'default') {
    return `
      <img src="FOTOS/MATERIALES/FILTRO.png" 
           alt="Filtro Analógico Capa 1" 
           class="overprint-texture-img overprint-texture-layer-1" 
           onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='FOTOS/MATERIALES/FILTRO.PNG';}" />
      <img src="FOTOS/MATERIALES/FILTRO.png" 
           alt="Filtro Analógico Capa 2" 
           class="overprint-texture-img overprint-texture-layer-2" 
           onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='FOTOS/MATERIALES/FILTRO.PNG';}" />
      <img src="FOTOS/MATERIALES/FILTRO.svg" 
           alt="Filtro Lumínico" 
           class="overprint-svg-layer" 
           onerror="if(!this.dataset.fallbackTried){this.dataset.fallbackTried='1';this.src='FOTOS/MATERIALES/FILTRO.SVG';}" />
    `;
  }

  const OVERPRINT_SVG = getOverprintSVG('static');

  // Convierte el valor de desplazamiento de la rueda a porcentaje vertical
  // Con el track centrado en top: 50% y aspect-ratio 960/6360, translateY varía alrededor de -50%
  function getTrackPercent(offset) {
    const val = (offset !== undefined && offset !== null) ? offset : 0;
    // Con base en -50%, ±200 recorre suavemente ±45% por toda la tira de 6360px
    return -50 + (val / 200) * 45.0;
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
  let isPhotoFirstClick = true;

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
      overprintCanvasTrack.innerHTML = renderOverprintTrackHTML('camera_rear');
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
      fsOverprintTrack.innerHTML = renderOverprintTrackHTML('camera_fs');
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
    const MIN_OFFSET = -200;
    const MAX_OFFSET = 200;
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
            ${renderOverprintTrackHTML('snap_' + photoId)}
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

        let svgReady = false;
        let filtroReady = false;
        const opImg = new Image();
        const filtroImg = new Image();

        const checkBothLoadedAndDraw = () => {
          if (!svgReady || !filtroReady) return;

          const trackW = canvas.width;
          const trackH = trackW * (6360 / 960);
          const trackPercent = getTrackPercent(window.AppDesk.overprintOffsetY);
          const trackY = (canvas.height * 0.5) + (trackPercent / 100) * trackH;

          // 1. Dibujar FILTRO.png (textura analógica física de base) - Puesta dos veces según solicitado
          if (filtroImg.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = 0.55 * 0.85;
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(filtroImg, 0, trackY, trackW, trackH);
            ctx.drawImage(filtroImg, 0, trackY, trackW, trackH); // Segunda capa de FILTRO.png
            ctx.restore();
          }

          // 2. Dibujar sobreimpresión vectorial lumínica (SVG)
          if (opImg.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = 0.55;
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(opImg, 0, trackY, trackW, trackH);
            ctx.restore();
          }

          URL.revokeObjectURL(blobUrl);
          finalizeExport();
        };

        opImg.crossOrigin = 'anonymous';
        opImg.onload = () => {
          svgReady = true;
          checkBothLoadedAndDraw();
        };
        opImg.onerror = () => {
          if (!opImg.datasetBlobFallback) {
            opImg.datasetBlobFallback = '1';
            opImg.src = blobUrl;
          } else {
            svgReady = true;
            checkBothLoadedAndDraw();
          }
        };

        filtroImg.crossOrigin = 'anonymous';
        filtroImg.onload = () => {
          filtroReady = true;
          checkBothLoadedAndDraw();
        };
        filtroImg.onerror = () => {
          if (!filtroImg.datasetFallback) {
            filtroImg.datasetFallback = '1';
            filtroImg.src = 'FOTOS/MATERIALES/FILTRO.PNG';
          } else {
            filtroReady = true;
            checkBothLoadedAndDraw();
          }
        };

        opImg.src = 'FOTOS/MATERIALES/FILTRO.svg';
        filtroImg.src = 'FOTOS/MATERIALES/FILTRO.png';
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
        // Ordenar por zIndex ascendente: fondo (1 persona) primero, luego 2 personas, y al frente (3 personas)
        const sortedEntries = [...loadedEntries]
          .filter(entry => entry && entry.img)
          .sort((a, b) => (a.pos.zIndex || 0) - (b.pos.zIndex || 0));

        sortedEntries.forEach(entry => {
          const { img, pos } = entry;
          const leftPercent = parseFloat(pos.left) / 100;
          const bottomPercent = parseFloat(pos.bottom) / 100;
          const widthPercent = parseFloat(pos.width) / 100;
          const heightPercent = parseFloat(pos.height) / 100;

          const figW = widthPercent * canvas.width;
          const figH = heightPercent * canvas.height;
          const figX = leftPercent * canvas.width;

          // Mantener proporción (contain) y anclaje a la base inferior, idéntico a la vista en pantalla
          const imgAspect = (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight) : (figW / figH);
          let drawW = figW;
          let drawH = figH;
          if (imgAspect > (figW / figH)) {
            drawH = figW / imgAspect;
          } else {
            drawW = figH * imgAspect;
          }
          const drawX = figX + (figW - drawW) / 2;
          const drawY = canvas.height - (bottomPercent * canvas.height) - drawH;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.70)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 6;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
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

      // Al disparar la foto: LA FOTO CAE EN LA MESA Y SE PROTEGE HASTA GUARDARLA
      window.AppDesk.isPhotoPendingSave = true;
      window.AppDesk.isCameraTaken = false; // NO permite reiniciar hasta que esté archivada en Tomo 3
      lockMechanics();

      // Mostrar fondo interceptor que aísla la fotografía en la mesa
      const droppedPhotoBackdrop = document.getElementById('droppedPhotoBackdrop');
      if (droppedPhotoBackdrop) {
        droppedPhotoBackdrop.classList.add('active');
      }

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

      isPhotoFirstClick = true;
      if (droppedPhotoFlipper) {
        droppedPhotoFlipper.classList.remove('flipped');
      }
      const frontEl = document.getElementById('droppedPhotoFront');
      if (frontEl) {
        frontEl.setAttribute('title', 'Haz clic en la foto para ver el reverso');
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
        droppedPhotoStage.classList.remove('flying-to-tomo3', 'zoomed');
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

    // Pre-cargar FILTRO.png y FILTRO.svg para que estén disponibles de inmediato en memoria y canvas
    const preloadFiltro = new Image();
    preloadFiltro.src = 'FOTOS/MATERIALES/FILTRO.png';
    const preloadSvg = new Image();
    preloadSvg.src = 'FOTOS/MATERIALES/FILTRO.svg';

    if (cameraEl) {
      cameraEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AppDesk.isPhotoPendingSave) return;
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

    // Ciclo interactivo de la fotografía revelada en la mesa:
    // 1. Primer clic sobre la foto: la gira y muestra el reverso.
    // 2. Clic en los campos del reverso: permite tipear sin girar.
    // 3. Clic fuera de los campos o fuera de la foto: la gira al anverso.
    // 4. Siguientes clics sobre la foto: la agranda (zoom).
    // 5. Clic fuera de la foto: quita el zoom y la gira nuevamente al reverso.
    const droppedPhotoFrontEl = document.getElementById('droppedPhotoFront');
    const droppedPhotoBackEl = document.getElementById('droppedPhotoBack');
    const droppedPhotoBackdropEl = document.getElementById('droppedPhotoBackdrop');

    function handlePhotoClickOutside() {
      if (!window.AppDesk.isPhotoPendingSave) return;
      if (!droppedPhotoStage || !droppedPhotoStage.classList.contains('active')) return;

      const isZoomed = droppedPhotoStage.classList.contains('zoomed');

      if (isZoomed) {
        // "si vuelvo a ahcer click fuera se da vuelta y veo nuevamente el reverso"
        droppedPhotoStage.classList.remove('zoomed');
        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.add('flipped');
        }
      } else {
        // "los siguientes click fuera de la foto la giro"
        isPhotoFirstClick = false;
        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.toggle('flipped');
        }
      }
    }

    // Clic sobre la foto (anverso)
    if (droppedPhotoFrontEl) {
      droppedPhotoFrontEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!droppedPhotoStage) return;

        if (isPhotoFirstClick) {
          // "cuando saco la foto y le hago click lo primero que haga es darse vuelta y ver el reverso"
          isPhotoFirstClick = false;
          if (droppedPhotoFlipper) {
            droppedPhotoFlipper.classList.add('flipped');
          }
          droppedPhotoFrontEl.setAttribute('title', 'Haz clic para agrandar la foto');
        } else {
          // "pero si el click es sobre la foto la agrando"
          droppedPhotoStage.classList.toggle('zoomed');
        }
      });
    }

    // Clic sobre la ficha (reverso)
    if (droppedPhotoBackEl) {
      droppedPhotoBackEl.addEventListener('click', (e) => {
        // "click sobre los campos me deja tipear"
        if (e.target.closest('input, textarea, select, button, label, .card-input-group')) {
          return;
        }
        e.stopPropagation();
        // "pero si no hago click en los campos y hago en cualqueir otro ahi si se gira y veo el anvverso nuevamente"
        if (droppedPhotoFlipper) {
          droppedPhotoFlipper.classList.remove('flipped');
        }
      });
    }

    // Clic fuera de la foto (en el fondo oscuro protector)
    if (droppedPhotoBackdropEl) {
      droppedPhotoBackdropEl.addEventListener('click', (e) => {
        e.stopPropagation();
        handlePhotoClickOutside();
      });
    }

    // Clic en cualquier parte exterior fuera de la tarjeta
    window.addEventListener('click', (e) => {
      if (!window.AppDesk.isPhotoPendingSave) return;
      if (e.target.closest('#droppedPhotoCard')) return;
      handlePhotoClickOutside();
    });

    // Asegurar que interactuar con los campos de texto no cause giros involuntarios
    [photoTitleInput, photoAuthorInput, photoObservationsInput].forEach((fieldEl) => {
      if (fieldEl) {
        fieldEl.addEventListener('click', (e) => e.stopPropagation());
        fieldEl.addEventListener('mousedown', (e) => e.stopPropagation());
      }
    });

    // ÚNICO BOTÓN: Guardar en Tomo III (Icono check)
    if (saveToTomo3Btn) {
      saveToTomo3Btn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Preguntar al usuario si desea descargar la fotografía a su dispositivo
        const wantsDownload = window.confirm('¿Deseas descargar la fotografía en tu dispositivo?');
        if (wantsDownload) {
          try {
            if (currentCapturedPhotoDataUrl && currentCapturedPhotoDataUrl.startsWith('data:')) {
              const downloadLink = document.createElement('a');
              downloadLink.download = `CREADAS_foto_${Date.now()}.jpg`;
              downloadLink.href = currentCapturedPhotoDataUrl;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          } catch (dlErr) {}
        }

        // Salir del modo agrandado y desactivar backdrop protector
        if (droppedPhotoStage) {
          droppedPhotoStage.classList.remove('zoomed');
        }
        const droppedPhotoBackdrop = document.getElementById('droppedPhotoBackdrop');
        if (droppedPhotoBackdrop) {
          droppedPhotoBackdrop.classList.remove('active');
        }

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
          window.AppDesk.isPhotoPendingSave = false;
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
    renderOverprintTrackHTML,
    getOverprintSVG,
    getTrackPercent,
    OVERPRINT_SVG
  };

})();
