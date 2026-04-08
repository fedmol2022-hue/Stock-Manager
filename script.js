
/* ═══════════════════════════════════════════════════════
   §1. CONFIGURATION GLOBALE
   Identifiants Google Sheets, clé API et URL du script GAS.
════════════════════════════════════════════════════════ */
var SHEET_ID='1uKxQz3l8aaIGCB480UwFK5sx9qZkmkvgznWk43FZw1U';
var API_KEY='AIzaSyD5vOzbgeDvhsT-k-ONNwup6C3IDE1iZzg';
var SCRIPT_URL='https://script.google.com/macros/s/AKfycbyRZJPwaSZXIT3Gb3hkpjjSI-Myb-fso7ScTcT9OTuPH972nooe8V01silkMRnDOZidPw/exec';
var APP_TOKEN='FeD@S!L-2026-M0l3nb33k-X9kzP2';

/* ═══════════════════════════════════════════════════════
   §2. FILE D'ATTENTE HORS-LIGNE
════════════════════════════════════════════════════════ */
var offlineQueue=[];
try{offlineQueue=JSON.parse(localStorage.getItem('fedasil_queue')||'[]');}catch(e){}
function isOnline(){return navigator.onLine;}
function saveQueue(){try{localStorage.setItem('fedasil_queue',JSON.stringify(offlineQueue));}catch(e){}}
function updateOnlineStatus(){
  var dot=document.getElementById('sdot');
  var txt=document.getElementById('stxt');
  if(!dot||!txt) return;
  if(!isOnline()){dot.style.background='#6b7280';txt.style.color='#6b7280';txt.textContent='Hors-ligne';}
  else if(offlineQueue.length>0){dot.style.background='#d97706';txt.style.color='#d97706';txt.textContent=offlineQueue.length+' en attente';}
  else{dot.style.background='#059669';txt.style.color='#059669';txt.textContent='En ligne';}
}
function syncOfflineQueue(){
  if(!isOnline()||offlineQueue.length===0) return;
  var item=offlineQueue[0];
  scriptPost(item).then(function(){
    offlineQueue.shift();saveQueue();updateOnlineStatus();
    if(offlineQueue.length>0) setTimeout(syncOfflineQueue,500);
    else toast('Synchronisation terminée ✓','ok');
  }).catch(function(err){
    console.error('Sync queue erreur:',err);
    toast('Synchro échouée ('+offlineQueue.length+' en attente)','err');
  });
}
window.addEventListener('online',function(){updateOnlineStatus();toast('Connexion rétablie','ok');setTimeout(syncOfflineQueue,1000);});
window.addEventListener('offline',function(){updateOnlineStatus();toast('Hors-ligne — données sauvegardées','inf');});

/* ═══════════════════════════════════════════════════════
   §3. SÉCURITÉ
════════════════════════════════════════════════════════ */
function escapeHtml(str){
  if(!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ═══════════════════════════════════════════════════════
   §4. ÉTAT GLOBAL
════════════════════════════════════════════════════════ */
var currentOperator='';
var catFilter='all';
var foundProd=null;
var movements=[];
var allMovements=[];
var products=[];
var inventoryActive=false;
var inventoryCategory='';

/* ═══════════════════════════════════════════════════════
   §5. MODULE SCANNER (ZXing)
════════════════════════════════════════════════════════ */
(function() {
  let codeReader = null;
  const cameraPreviewId = 'camera-preview';
  const videoId = 'video';
  const videoScanId = 'video-scan';
  const domCache = {};
  
  function getElement(id) {
    if (!domCache[id]) { domCache[id] = document.getElementById(id); }
    return domCache[id];
  }
  
  async function startScanner(videoElementId = videoId, inputElementId = 'p-sku') {
    const preview = getElement(cameraPreviewId);
    if (preview) preview.style.display = 'block';
    if (!codeReader) { codeReader = new ZXing.BrowserMultiFormatReader(); }
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) { throw new Error('Aucune caméra disponible'); }
      const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoElementId, (result) => {
        if (result) {
          const inputElement = getElement(inputElementId);
          if (inputElement) { inputElement.value = result.text; }
          if (navigator.vibrate) { navigator.vibrate(100); }
          stopScanner();
        }
      });
    } catch (e) {
      console.error('Erreur caméra:', e);
      stopScanner();
    }
  }
  
  function stopScanner() {
    if (codeReader) { codeReader.reset(); }
    const preview = getElement(cameraPreviewId);
    if (preview) preview.style.display = 'none';
  }

  function openAddScreen() { document.getElementById('screen-add').classList.add('active'); }
  function closeAddScreen() { document.getElementById('screen-add').classList.remove('active'); }
  function openScanScreen() { document.getElementById('screen-scan-overlay').style.display = 'block'; }
  function closeScanScreen() { stopScanner(); document.getElementById('screen-scan-overlay').style.display = 'none'; }
  function promptPhotoChoice() { document.getElementById('photo-choice-modal').style.display = 'flex'; }
  function closePhotoModal() { document.getElementById('photo-choice-modal').style.display = 'none'; }
  
  function handlePhotoChoice(choice) {
    closePhotoModal();
    if (choice === 'camera') { document.getElementById('img-input').setAttribute('capture', 'environment'); }
    else { document.getElementById('img-input').removeAttribute('capture'); }
    document.getElementById('img-input').click();
  }

  function generateQRCode(text) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(text);
  }

  window.promptPhotoChoice = promptPhotoChoice;
  window.handlePhotoChoice = handlePhotoChoice;
  window.closePhotoModal = closePhotoModal;
  window.startScanner = startScanner;
  window.stopScanner = stopScanner;
  window.openAddScreen = openAddScreen;
  window.closeAddScreen = closeAddScreen;
  window.openScanScreen = openScanScreen;
  window.closeScanScreen = closeScanScreen;
})();

/* ═══════════════════════════════════════════════════════
   §6. FONCTIONS UI & NAVIGATION
════════════════════════════════════════════════════════ */
function toast(msg, type){
  var t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.className='toast show '+(type||'');
  setTimeout(function(){t.classList.remove('show');},3000);
}

function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  var screen = document.getElementById('s-'+id);
  if(screen) screen.classList.add('active');
  updateMenuState(id);
}

function updateMenuState(id){
  document.querySelectorAll('.menu-item').forEach(m=>m.classList.remove('on'));
  var m=document.getElementById('tb-'+id);
  if(m) m.classList.add('on');
  var nameMap={dash:'Dashboard',scan:'Scanner',stock:'Inventaire',orders:'Commandes',hist:'Historique',inventory:'Inventaire',exp:'Export',admin:'Admin',about:'À propos'};
  var elName = document.getElementById('current-screen-name');
  if(elName) elName.textContent=nameMap[id]||'Menu';
}

function toggleMenu(){
  var m=document.getElementById('slide-menu');
  var o=document.getElementById('menu-overlay');
  if(!m || !o) return;
  if(m.style.bottom==='0px'){ m.style.bottom='-100%'; o.style.display='none'; }
  else { m.style.bottom='0px'; o.style.display='block'; }
}

function goMenu(id){ toggleMenu(); go(id); }

/* ═══════════════════════════════════════════════════════
   §7. DARK MODE
════════════════════════════════════════════════════════ */
var darkMode=false;
try{darkMode=localStorage.getItem('fedasil_dark')==='1';}catch(e){}
function applyDarkMode(on){
  darkMode=on;
  document.documentElement.setAttribute('data-theme',on?'dark':'light');
  var track=document.getElementById('dark-track');
  if(track) track.className='dark-toggle-track'+(on?' on':'');
  try{localStorage.setItem('fedasil_dark',on?'1':'0');}catch(e){}
}
function toggleDarkMode(){ applyDarkMode(!darkMode); }
applyDarkMode(darkMode);

/* ═══════════════════════════════════════════════════════
   §8. INITIALISATION
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  updateOnlineStatus();
  // Splash screen handling
  setTimeout(function(){
    var s=document.getElementById('splash');
    if(s){ s.classList.add('hide'); setTimeout(function(){s.style.display='none';},550); }
  }, 2400);
});
