/**
 * ============================================================================
 * SINCRONIZACIÓN EN TIEMPO REAL CON FIREBASE FIRESTORE
 * Permite que cualquier visitante desde cualquier dispositivo comparta
 * y visualice las fotografías colectivas creadas en Tomo III.
 * ============================================================================
 */

window.FirebaseSync = (function() {

  // Configuración oficial del proyecto Firebase del usuario
  const firebaseConfig = {
    apiKey: "AIzaSyDhg3peiNc0R8NseddT_4AMrRz-7ZbcYrw",
    authDomain: "seminario-recuerdos.firebaseapp.com",
    projectId: "seminario-recuerdos",
    storageBucket: "seminario-recuerdos.firebasestorage.app",
    messagingSenderId: "249042009512",
    appId: "1:249042009512:web:290da914e3cf8a449e319d"
  };

  let db = null;
  let isInitialized = false;

  function init() {
    if (isInitialized) return;

    try {
      if (typeof firebase !== 'undefined') {
        // Evitar inicializaciones dobles
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        isInitialized = true;
        console.log('[Firebase] Conectado exitosamente a Firestore (seminario-recuerdos).');
        startRealtimeListener();
      } else {
        console.warn('[Firebase] SDK no detectado aún en window.firebase.');
      }
    } catch (err) {
      console.warn('[Firebase] Error inicializando Firestore:', err);
    }
  }

  // Escuchar en tiempo real la colección de memorias
  function startRealtimeListener() {
    if (!db) return;

    db.collection('memorias')
      .onSnapshot((snapshot) => {
        const cloudPhotos = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          cloudPhotos.push({
            id: data.id || doc.id,
            firestoreId: doc.id,
            title: data.title || 'Sin título',
            author: data.author || 'Autor/x anónimo',
            observations: data.observations || '',
            date: data.date || '',
            time: data.time || '',
            dateTimeStr: data.dateTimeStr || '',
            numStr: data.numStr || '01',
            palette: data.palette || ['#023047', '#219ebc', '#8ecae6', '#ffb703'],
            cutoutIds: data.cutoutIds || [],
            overprintOffsetY: data.overprintOffsetY !== undefined ? data.overprintOffsetY : 0,
            cutoutAlignment: data.cutoutAlignment || 'center',
            createdAtMillis: data.createdAtMillis || (data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : (data.id || 0))
          });
        });

        // Ordenar cronológicamente (las más antiguas primero, las nuevas al final del álbum)
        cloudPhotos.sort((a, b) => (a.createdAtMillis || 0) - (b.createdAtMillis || 0));

        console.log(`[Firebase] ${cloudPhotos.length} recuerdos sincronizados desde la nube.`);

        if (window.Tomo3 && window.Tomo3.setRemotePhotos) {
          window.Tomo3.setRemotePhotos(cloudPhotos);
        }
      }, (err) => {
        console.warn('[Firebase] Error en listener de Firestore:', err);
      });
  }

  // Guardar un nuevo recuerdo en la nube
  function saveMemory(photoItem) {
    if (!db) {
      console.warn('[Firebase] Firestore no conectado, el recuerdo se mantiene localmente.');
      return Promise.resolve(null);
    }

    const payload = {
      id: photoItem.id || Date.now(),
      title: photoItem.title || 'Sin título',
      author: photoItem.author || 'Autor/x anónimo',
      observations: photoItem.observations || '',
      date: photoItem.date || '',
      time: photoItem.time || '',
      dateTimeStr: photoItem.dateTimeStr || '',
      numStr: photoItem.numStr || '01',
      palette: photoItem.palette || ['#023047', '#219ebc', '#8ecae6', '#ffb703'],
      cutoutIds: photoItem.cutoutIds || [],
      overprintOffsetY: photoItem.overprintOffsetY !== undefined ? photoItem.overprintOffsetY : 0,
      cutoutAlignment: photoItem.cutoutAlignment || 'center',
      createdAtMillis: Date.now(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    return db.collection('memorias').add(payload)
      .then(docRef => {
        console.log('[Firebase] Foto guardada exitosamente en la nube con ID:', docRef.id);
        return docRef.id;
      })
      .catch(err => {
        console.error('[Firebase] Error al subir recuerdo a Firestore:', err);
      });
  }

  // Inicializar apenas el DOM esté listo o se cargue el script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }

  return {
    init,
    saveMemory,
    isConnected: () => !!db
  };

})();
