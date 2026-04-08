/* ═══════════════════════════════════════════════════════
   STOCK MANAGER - JAVASCRIPT COMPLET
   ════════════════════════════════════════════════════════ */

// ── CONFIGURATION ──
var SHEET_ID = '1uKxQz3l8aaIGCB480UwFK5sx9qZkmkvgznWk43FZw1U';
var API_KEY = 'AIzaSyD5vOzbgeDvhsT-k-ONNwup6C3IDE1iZzg';
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRZJPwaSZXIT3Gb3hkpjjSI-Myb-fso7ScTcT9OTuPH972nooe8V01silkMRnDOZidPw/exec';
var APP_TOKEN = 'FeD@S!L-2026-M0l3nb33k-X9kzP2';

// ── ÉTAT GLOBAL ──
var currentOperator = '';
var pin = '';
var pinTarget = '';
var teamMembers = ['Brahim', 'Hassanatou', 'Loubna', 'Marc', 'Admin'];
var products = [];
var allMovements = [];
var offlineQueue = [];
try { offlineQueue = JSON.parse(localStorage.getItem('fedasil_queue') || '[]'); } catch (e) { }

// ── INITIALISATION ──
document.addEventListener('DOMContentLoaded', function() {
    renderNameList();
    updateOnlineStatus();
    
    // Splash screen
    setTimeout(function() {
        var s = document.getElementById('splash');
        if (s) {
            s.style.opacity = '0';
            setTimeout(function() { s.style.display = 'none'; }, 500);
        }
    }, 2000);
});

// ── AUTHENTIFICATION & PIN ──
function renderNameList() {
    var list = document.getElementById('operator-select');
    if (!list) return;
    list.innerHTML = '<option value="">-- Choisir un opérateur --</option>';
    teamMembers.forEach(function(name) {
        var opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        list.appendChild(opt);
    });
}

function selectOperator(name) {
    if (!name) return;
    pinTarget = name;
    pin = '';
    resetPinDots();
    var sub = document.getElementById('pin-subtitle');
    if (sub) sub.textContent = 'Entrez le PIN pour ' + name;
}

function p(k) {
    if (!pinTarget) {
        toast('Sélectionnez d\'abord un opérateur', 'inf');
        return;
    }
    if (k === 'C') {
        pin = pin.slice(0, -1);
    } else if (k === 'OK') {
        checkPin();
        return;
    } else if (pin.length < 4) {
        pin += k;
    }
    updatePinDots();
    if (pin.length === 4) setTimeout(checkPin, 250);
}

function updatePinDots() {
    for (var i = 0; i < 4; i++) {
        var d = document.getElementById('d' + i);
        if (d) d.className = 'dot' + (i < pin.length ? ' on' : '');
    }
}

function resetPinDots() {
    pin = '';
    updatePinDots();
}

function checkPin() {
    // Pour cet exemple, on accepte n'importe quel PIN de 4 chiffres
    if (pin.length === 4) {
        loginSuccess(pinTarget);
    } else {
        toast('PIN incomplet', 'err');
    }
}

function loginSuccess(name) {
    currentOperator = name;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.getElementById('tabbar').style.display = 'flex';
    
    var navName = document.getElementById('nav-user-name');
    if (navName) navName.textContent = name;
    
    var menuName = document.getElementById('menu-user-name');
    if (menuName) menuName.textContent = name;

    toast('Bienvenue ' + name, 'ok');
    go('dash');
    loadFromSheets();
}

// ── NAVIGATION ──
function go(id) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var target = document.getElementById('s-' + id);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    var nav = document.getElementById('tb-' + id);
    if (nav) nav.classList.add('active');
}

function toggleMenu() {
    var menu = document.getElementById('slide-menu');
    var overlay = document.getElementById('menu-overlay');
    if (!menu || !overlay) return;
    var isOpen = menu.style.bottom === '0px';
    
    menu.style.bottom = isOpen ? '-100%' : '0';
    overlay.style.display = isOpen ? 'none' : 'block';
}

function goMenu(id) {
    toggleMenu();
    go(id);
}

// ── SYNCHRONISATION SHEETS ──
function loadFromSheets() {
    setSyncing(true);
    // Simulation de chargement (à remplacer par vos appels fetch réels)
    setTimeout(function() {
        setSyncing(false);
        toast('Données à jour', 'ok');
        renderDash();
    }, 1000);
}

function setSyncing(on) {
    var dot = document.getElementById('sdot');
    var txt = document.getElementById('stxt');
    if (dot && txt) {
        dot.style.background = on ? '#d97706' : '#059669';
        txt.textContent = on ? 'Sync...' : 'En ligne';
    }
}

// ── DASHBOARD & RENDU ──
function renderDash() {
    var refs = document.getElementById('s-refs');
    if (refs) refs.textContent = products.length;
}

// ── UTILITAIRES ──
function toast(msg, type) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show ' + (type || 'ok');
    setTimeout(function() { t.className = 'toast'; }, 3000);
}

function updateOnlineStatus() {
    var dot = document.getElementById('sdot');
    var txt = document.getElementById('stxt');
    if (dot && txt) {
        if (navigator.onLine) {
            dot.style.background = '#059669';
            txt.textContent = 'En ligne';
        } else {
            dot.style.background = '#6b7280';
            txt.textContent = 'Hors-ligne';
        }
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── MODULE SCANNER (ZXing) ──
(function() {
  let codeReader = null;
  window.startScanner = async function(videoElementId, inputElementId) {
    if (!codeReader) { codeReader = new ZXing.BrowserMultiFormatReader(); }
    try {
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoElementId, (result) => {
        if (result) {
          document.getElementById(inputElementId).value = result.text;
          codeReader.reset();
        }
      });
    } catch (e) { console.error(e); }
  };
  window.stopScanner = function() { if (codeReader) codeReader.reset(); };
})();
