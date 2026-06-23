// ============================================
// CONSTANTES GLOBAIS
// ============================================
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let showBookingForm = false;
let showCancelModal = false;
let bookingToCancel = null;
let showCreateServiceModal = false;
let services = [];
let showBookingsModal = false;
let showProviderBookingsModal = false;
let showProviderCancelModal = false;
let showNotificationsModal = false;
let showClearNotificationsConfirm = false;
let providerBookingToCancel = null;
let selectedWorkDays = [];
let selectedWorkHours = { start: "09:00", end: "18:00" };
let showMyServicesModal = false;
let showDeleteServiceModal = false;
let serviceToDelete = null;
let showClientProfile = false;
let showClientEditProfileModal = false;
let showClientProfilePhotoPicker = false;
let selectedProviderId = null;
let showProviderShop = false;
let showReopenSlotModal = false;
let slotToReopen = null;
let blockedSlots = [];
let showClientCancelJustificativeModal = false;
let showProviderNotificationsModal = false;
let showProviderClearNotificationsConfirm = false;
let showDeleteAccountModal = false;
let accountToDelete = null;
let showLogoutConfirmModal = false;
let showConfirmDoneModal = false;
let doneBookingId = null;
let showLandingPage = true;
let providerSearchTerm = "";
let providerCategoryFilter = "";
let calendarMonth = new Date().getMonth();
let calendarYear = new Date().getFullYear();
let showCropModal = false;
let cropImageSrc = "";
let cropZoom = 1;
let cropX = 0;
let cropY = 0;
let cropCallback = null;

const savedServices = localStorage.getItem("agendamento_services");
const savedBlockedSlots = localStorage.getItem("agendamento_blockedSlots");

if (savedBlockedSlots) blockedSlots = JSON.parse(savedBlockedSlots);

if (savedServices) services = JSON.parse(savedServices);
const USER_ROLES = { CLIENT: "client", PROVIDER: "provider" };

// Estados obrigatórios
const STATES = {
  LOADING: "loading",
  EMPTY: "empty",
  ERROR: "erro",
  VALIDATION: "validação",
  SUCCESS: "sucesso",
  NO_PERMISSION: "sem_permissão"
};

let currentState = null;
let stateMessage = "";

// ============================================
// MOCK SERVICES (CORRIGIDO - ADICIONADO!)
// ============================================
const mockServices = [
  {
    id: 1,
    name: "Corte de Cabelo",
    duration: 30,
    price: 50,
    provider: "Carlos - Barbearia",
  },
  {
    id: 2,
    name: "Manicure",
    duration: 45,
    price: 40,
    provider: "Ana - Studio de Beleza",
  },
  {
    id: 3,
    name: "Troca de Óleo",
    duration: 60,
    price: 120,
    provider: "Mecânica Rápida",
  },
  {
    id: 4,
    name: "Consulta Clínica",
    duration: 30,
    price: 200,
    provider: "Clínica Saúde",
  },
];

// ============================================
// CATEGORIAS DE PRESTADORES
// ============================================
const PROVIDER_CATEGORIES = [
  { id: 1, name: "💇 Beleza & Cabelo", emoji: "💇" },
  { id: 2, name: "💅 Manicure & Pedicure", emoji: "💅" },
  { id: 3, name: "🏥 Saúde & Médico", emoji: "🏥" },
  { id: 4, name: "🔧 Manutenção & Reparo", emoji: "🔧" },
  { id: 5, name: "🏋️ Fitness & Personal", emoji: "🏋️" },
  { id: 6, name: "🎓 Educação & Aulas", emoji: "🎓" },
  { id: 7, name: "🏠 Limpeza & Organização", emoji: "🏠" },
  { id: 8, name: "🚗 Automotivo", emoji: "🚗" },
  { id: 9, name: "💻 Tecnologia & TI", emoji: "💻" },
  { id: 10, name: "🎨 Criativo & Design", emoji: "🎨" },
];

// Gerar horários disponíveis (8h às 18h com intervalos de 30min)
const TIME_SLOTS = [];
for (let i = 8; i <= 18; i++) {
  TIME_SLOTS.push(`${i.toString().padStart(2, "0")}:00`);
  if (i !== 18) TIME_SLOTS.push(`${i.toString().padStart(2, "0")}:30`);
}
//formato de duração: 30, 45, 60 (minutos)
function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}
const WEEK_DAYS = [
  { value: 0, label: "Domingo", short: "Dom" },
  { value: 1, label: "Segunda", short: "Seg" },
  { value: 2, label: "Terça", short: "Ter" },
  { value: 3, label: "Quarta", short: "Qua" },
  { value: 4, label: "Quinta", short: "Qui" },
  { value: 5, label: "Sexta", short: "Sex" },
  { value: 6, label: "Sábado", short: "Sáb" },
];
// ============================================
// DADOS PERSISTIDOS (localStorage)
// ============================================

let users = [
  {
    id: 1,
    name: "Ana Silva",
    username: "ana_silva",
    email: "ana@email.com",
    password: "123",
    role: USER_ROLES.CLIENT,
  },
  {
    id: 2,
    name: "Carlos Souza",
    username: "carlos_barber",
    email: "carlos@email.com",
    password: "123",
    role: USER_ROLES.PROVIDER,
  },
];

let bookings = [
  {
    id: 1,
    serviceId: 1,
    serviceName: "Corte de Cabelo",
    date: new Date().toDateString(),
    time: "10:00",
    status: "confirmed",
    clientName: "Ana Silva",
    clientId: 1,
    provider: "Carlos - Barbearia",
  },
];

let currentUser = null;

// Carregar dados salvos
const savedUsers = localStorage.getItem("agendamento_users");
const savedBookings = localStorage.getItem("agendamento_bookings");
const savedCurrentUser = localStorage.getItem("agendamento_currentUser");

// Usuários padrão para testes
const defaultUsers = [
  {
    id: 1,
    name: "Ana Silva",
    username: "ana_silva",
    email: "ana@email.com",
    password: "123",
    role: USER_ROLES.CLIENT,
  },
  {
    id: 2,
    name: "Carlos Souza",
    username: "carlos_barber",
    email: "carlos@email.com",
    password: "123",
    role: USER_ROLES.PROVIDER,
  },
];

if (savedUsers) {
  users = JSON.parse(savedUsers);
  // Garantir que usuários padrão estão presentes
  defaultUsers.forEach(defaultUser => {
    if (!users.find(u => u.id === defaultUser.id)) {
      users.push(defaultUser);
    }
  });
} else {
  users = defaultUsers;
}

if (savedBookings) bookings = JSON.parse(savedBookings);
if (savedCurrentUser) currentUser = JSON.parse(savedCurrentUser);

// Migrar categorias antigas (string) para novo formato (array)
users.forEach(u => {
  if (!u.categories) {
    u.categories = u.category ? [u.category] : [];
  }
});
if (currentUser && !currentUser.categories) {
  currentUser.categories = currentUser.category ? [currentUser.category] : [];
}

function isTimeBooked(time) {
  if (!selectedService || !selectedDate) return false;
  return bookings.some(
    (b) =>
      b.serviceId === selectedService.id &&
      b.date === selectedDate &&
      b.time === time,
  );
}

function saveToLocalStorage() {
  localStorage.setItem("agendamento_users", JSON.stringify(users));
  localStorage.setItem("agendamento_bookings", JSON.stringify(bookings));
  localStorage.setItem("agendamento_services", JSON.stringify(services));

  if (currentUser) {
    localStorage.setItem(
      "agendamento_currentUser",
      JSON.stringify(currentUser),
    );
  } else {
    localStorage.removeItem("agendamento_currentUser");
  }
}

// ============================================
// TEMA ESCURO / CLARO
// ============================================
let isDarkMode = localStorage.getItem("agendamento_darkMode") === "true" || false;

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("agendamento_darkMode", isDarkMode.toString());
  applyTheme();
  initThemeButton();
}

window.renderLogo = function(height = 40) {
  return `<div style="display:inline-flex; align-items:center; gap:10px;">
    <img src="assets/images/logo-GVT.png" alt="Agenda GVT" style="height:${height}px; width:auto;">
    <span class="logo-text" style="font-size:${Math.round(height * 0.35)}px; font-weight:700; line-height:1.2; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Agenda GVT</span>
  </div>`;
};

function applyTheme() {
  const htmlElement = document.documentElement;
  
  if (isDarkMode) {
    htmlElement.classList.add("dark-mode");
  } else {
    htmlElement.classList.remove("dark-mode");
  }
  
  const themeToggles = document.querySelectorAll("#themeToggle, .theme-btn");
  themeToggles.forEach(themeToggle => {
    themeToggle.innerHTML = `<i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="icon"></i>`;
  });
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function getTheme() {
  if (isDarkMode) {
    return {
      bgMain: "linear-gradient(135deg, #1C1C28 0%, #2A2A3C 100%)",
      bgSecondary: "#1E1E2F",
      bgCard: "#2B2B3C",
      bgMenu: "#252536",
      borderColor: "#3A3A4F",
      primary: "#8E7CFF",
      secondary: "#B3A9FF",
      primaryHover: "#6C5CE7",
      textMain: "#F1F2F6",
      textSecondary: "#A4B0BE",
      textMuted: "#747D8C",
      btnCloseBg: "#3A3A4F",
      btnCloseHover: "#4B4B63",
      btnCloseBorder: "#5A5A75",
      btnCloseText: "#DCDDE1"
    };
  }
  
  return {
    bgMain: "linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%)",
    bgSecondary: "#ffffff",
    bgCard: "#ffffff",
    bgMenu: "#ffffff",
    borderColor: "#d1d5db",
    primary: "#6C5CE7",
    secondary: "#8E44AD",
    primaryHover: "#A29BFE",
    textMain: "#2D3436",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    btnCloseBg: "#ECEFF1",
    btnCloseHover: "#DFE6E9",
    btnCloseBorder: "#B2BEC3",
    btnCloseText: "#636E72"
  };
}

function initThemeButton() {
  // Inicializar Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  const btns = document.querySelectorAll("#themeToggle, .theme-btn");
  btns.forEach(btn => {
    btn.removeEventListener("click", toggleDarkMode);
    btn.addEventListener("click", toggleDarkMode);
  });
}

//prestador add serviços
function addService(name, duration, price) {
  const newService = {
    id: Date.now(),
    name,
    duration,
    price,
    providerId: currentUser.id,
  };

  services.push(newService);
  saveToLocalStorage();
  render();

  showToast("Serviço criado com sucesso!", "success");
}

function showToast(message, type) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Funções para modal de confirmação de logout
window.openLogoutConfirm = function () {
  showLogoutConfirmModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeLogoutConfirm = function () {
  showLogoutConfirmModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.confirmLogout = function () {
  showLogoutConfirmModal = false;
  document.body.style.overflow = "auto";
  currentUser = null;
  isLogin = true;
  showClientProfile = false;
  showClientEditProfileModal = false;
  showClientProfilePhotoPicker = false;
  selectedProviderId = null;
  showProviderShop = false;
  saveToLocalStorage();
  render();
};

function getLogoutConfirmModalHtml() {
  if (!showLogoutConfirmModal) return "";

  return `
    <div class="modal-overlay" onclick="window.closeLogoutConfirm()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 420px; width: 90%; border-top:4px solid #6C5CE7;">
        <h3 style="margin-bottom: 16px; color:#6C5CE7; font-size:20px;">Confirmar saída</h3>
        <p style="margin-bottom: 24px; color:#6b7280;">
          Tem certeza que deseja sair da sua conta?
        </p>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeLogoutConfirm()" style="padding:10px 20px; background:#ECEFF1; color:#636E72; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
            
           >
            Cancelar
          </button>
          <button onclick="window.confirmLogout()" style="padding:10px 20px; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
            onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108,92,231,0.3)';"
            onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
            Sair
          </button>
        </div>
      </div>
    </div>
  `;
}

// Funções para gerenciar estados
function setState(state, message = "") {
  currentState = state;
  stateMessage = message;
}

function clearState() {
  currentState = null;
  stateMessage = "";
}

function showState() {
  const root = document.getElementById("root");
  if (!currentState) return false;

  const states = {
    loading: { icon: "⏳", title: "Carregando", color: "#6C5CE7", bg: "rgba(107, 92, 231, 0.1)" },
    empty: { icon: "📭", title: "Sem dados", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)" },
    erro: { icon: "❌", title: "Erro", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    validação: { icon: "⚠️", title: "Validação", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    sucesso: { icon: "✅", title: "Sucesso", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    sem_permissão: { icon: "🔒", title: "Acesso Negado", color: "#a855f7", bg: "rgba(168, 85, 247, 0.1)" }
  };

  const state = states[currentState];
  if (!state) return false;

  if (currentState === "loading") {
    // Usar tela de load existente
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "flex";
      loader.style.opacity = "1";
      loader.style.visibility = "visible";
    }
    return true;
  }

  // Para outros estados, mostrar container customizado
  root.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px 20px;
      background: ${state.bg};
    ">
      <div style="font-size: 60px; margin-bottom: 20px;">${state.icon}</div>
      <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 12px; color: ${state.color};">${state.title}</h2>
      <p style="font-size: 16px; color: #6b7280; text-align: center; max-width: 400px;">${stateMessage}</p>
    </div>
  `;
  return true;
}

// ============================================
// FUNÇÃO PARA ESCONDER O LOADER
// ============================================
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    loader.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
}

// ============================================
// FUNÇÃO PARA MOSTRAR O LOADER
// ============================================
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "1";
    loader.style.visibility = "visible";
  }
}

// ============================================
// TELA DE LOGIN/CADASTRO
// ============================================
let isLogin = true;

// ============================================
// TELA INICIAL (LANDING PAGE)
// ============================================
function renderLandingPage() {
  const root = document.getElementById("root");
  const isDark = isDarkMode;

  const bgGradient = isDark
    ? "linear-gradient(160deg, #0d0521 0%, #1a0a2e 20%, #2d1b69 45%, #6C5CE7 70%, #1a0a2e 100%)"
    : "linear-gradient(160deg, #f0e6ff 0%, #dcd6ff 20%, #A29BFE 50%, #6C5CE7 80%, #8E44AD 100%)";

  const navBg = isDark ? "rgba(10, 6, 20, 0.6)" : "rgba(255, 255, 255, 0.2)";
  const navBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(108,92,231,0.15)";

  const titleColor = isDark ? "white" : "#3a2fa0";
  const subtitleColor = isDark ? "rgba(255,255,255,0.85)" : "#5a4fcf";
  const textColor = isDark ? "rgba(255,255,255,0.6)" : "#4a3fb8";
  const badgeBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.5)";
  const badgeBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(108,92,231,0.2)";
  const badgeText = isDark ? "rgba(255,255,255,0.9)" : "#5a4fcf";
  const cardBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.45)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(108,92,231,0.15)";
  const cardText = isDark ? "rgba(255,255,255,0.55)" : "#4a3580";
  const cardHoverBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.65)";
  const btnInscrevaBg = isDark ? "white" : "#6C5CE7";
  const btnInscrevaColor = isDark ? "#6C5CE7" : "white";
  const btnInscrevaShadow = isDark ? "rgba(0,0,0,0.3)" : "rgba(108,92,231,0.4)";
  const btnLoginBorder = isDark ? "rgba(255,255,255,0.35)" : "rgba(108,92,231,0.4)";
  const btnLoginColor = isDark ? "white" : "#6C5CE7";
  const btnLoginHoverBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(108,92,231,0.1)";
  const btnLoginHoverBorder = isDark ? "rgba(255,255,255,0.5)" : "rgba(108,92,231,0.4)";

  const html = `
    <div style="min-height:100vh; display:flex; flex-direction:column; background:${bgGradient}; position:relative; overflow:hidden;">

      <div style="position:absolute; top:-120px; right:-120px; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(162,155,254,${isDark ? '0.2' : '0.2'}) 0%, transparent 70%); pointer-events:none;"></div>
      <div style="position:absolute; bottom:-150px; left:-100px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, rgba(108,92,231,${isDark ? '0.15' : '0.15'}) 0%, transparent 70%); pointer-events:none;"></div>

      <!-- NAVBAR -->
      <header style="position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:18px 40px; background:${navBg}; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid ${navBorder};">
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/logo-GVT.png" alt="Agenda GVT" style="height:36px; width:auto;">
          <span style="font-size:18px; font-weight:700; color:${isDark ? 'white' : '#6C5CE7'}; letter-spacing:-0.5px;">Agenda GVT</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <button onclick="window.toggleLandingTheme()" title="Alternar tema"
            style="width:45px; height:45px; border-radius:50%; background:${isDark ? '#FFFFFF' : '#2D3436'}; border:2px solid ${isDark ? '#B2BEC3' : '#555'}; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s ease; padding:0;"
            onmouseover="this.style.background='${isDark ? '#F4F3FF' : '#1a1a1a'}'; this.style.borderColor='${isDark ? '#A29BFE' : '#777'}'; this.style.transform='scale(1.05)';"
            onmouseout="this.style.background='${isDark ? '#FFFFFF' : '#2D3436'}'; this.style.borderColor='${isDark ? '#B2BEC3' : '#555'}'; this.style.transform='scale(1)';">
            <i data-lucide="${isDark ? 'sun' : 'moon'}" style="width:28px; height:28px; color:${isDark ? '#636E72' : '#e0e0e0'}; transition:all 0.3s ease;"></i>
          </button>
          <button onclick="window.goToLogin()" 
            style="padding:10px 24px; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 100%); color:white; border:none; border-radius:10px; cursor:pointer; font-weight:600; font-size:14px; transition:all 0.3s; box-shadow:0 4px 15px rgba(108,92,231,0.4);"
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(108,92,231,0.5)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(108,92,231,0.4)';">
            Login
          </button>
        </div>
      </header>

      <!-- HERO -->
      <main style="flex:1; display:flex; align-items:center; justify-content:center; position:relative; z-index:5; padding:60px 24px;">
        <div style="text-align:center; max-width:700px;">
          <div style="display:inline-block; padding:6px 16px; background:${badgeBg}; border:1px solid ${badgeBorder}; border-radius:50px; margin-bottom:28px; backdrop-filter:blur(10px);">
            <span style="font-size:13px; color:${badgeText}; font-weight:500; letter-spacing:0.5px;">&#128197; Agende de forma simples e rapida</span>
          </div>

          <h1 style="font-size:clamp(36px, 6vw, 64px); font-weight:800; color:${titleColor}; margin:0 0 20px 0; line-height:1.1; letter-spacing:-1.5px; text-shadow:0 2px 30px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(108,92,231,0.15)'};">
            Agenda GVT
          </h1>
          <h2 style="font-size:clamp(18px, 3vw, 26px); font-weight:400; color:${subtitleColor}; margin:0 0 16px 0; line-height:1.4; letter-spacing:-0.3px;">
            Sistema de Agendamento
          </h2>
          <p style="font-size:clamp(15px, 2vw, 18px); color:${textColor}; margin:0 0 44px 0; line-height:1.7; max-width:520px; margin-left:auto; margin-right:auto;">
            Conecte clientes e prestadores de servico em uma plataforma intuitiva. Gerencie seus horarios, agendamentos e servicos em um so lugar.
          </p>

          <div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap;">
            <button onclick="window.goToSignup()"
              style="padding:16px 40px; background:${btnInscrevaBg}; color:${btnInscrevaColor}; border:none; border-radius:14px; cursor:pointer; font-weight:700; font-size:16px; transition:all 0.3s; box-shadow:0 8px 30px ${btnInscrevaShadow};"
              onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 12px 40px ${btnInscrevaShadow}';"
              onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 30px ${btnInscrevaShadow}';">
              Inscreva-se
            </button>
            <button onclick="window.goToLogin()"
              style="padding:16px 40px; background:transparent; color:${btnLoginColor}; border:2px solid ${btnLoginBorder}; border-radius:14px; cursor:pointer; font-weight:600; font-size:16px; transition:all 0.3s; backdrop-filter:blur(10px);"
              onmouseover="this.style.background='${btnLoginHoverBg}'; this.style.borderColor='${btnLoginHoverBorder}'; this.style.transform='translateY(-3px)';"
              onmouseout="this.style.background='transparent'; this.style.borderColor='${btnLoginBorder}'; this.style.transform='translateY(0)';">
              Ja tenho conta
            </button>
          </div>

          <!-- FEATURES -->
          <div class="landing-features" style="margin-top:72px; text-align:center;">
            <div style="padding:24px 16px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:16px; backdrop-filter:blur(10px); transition:all 0.3s;"
              onmouseover="this.style.background='${cardHoverBg}'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='${cardBg}'; this.style.transform='translateY(0)';">
              <div style="font-size:32px; margin-bottom:12px;">&#128198;</div>
              <h3 style="margin:0 0 8px; color:${isDark ? 'white' : '#6C5CE7'}; font-size:15px; font-weight:600;">Agendamento Facil</h3>
              <p style="margin:0; color:${cardText}; font-size:13px; line-height:1.5;">Escolha o servico, selecione o dia e horario. Pronto!</p>
            </div>
            <div style="padding:24px 16px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:16px; backdrop-filter:blur(10px); transition:all 0.3s;"
              onmouseover="this.style.background='${cardHoverBg}'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='${cardBg}'; this.style.transform='translateY(0)';">
              <div style="font-size:32px; margin-bottom:12px;">&#128101;</div>
              <h3 style="margin:0 0 8px; color:${isDark ? 'white' : '#6C5CE7'}; font-size:15px; font-weight:600;">Conecte-se</h3>
              <p style="margin:0; color:${cardText}; font-size:13px; line-height:1.5;">Encontre prestadores de servico perto de voce</p>
            </div>
            <div style="padding:24px 16px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:16px; backdrop-filter:blur(10px); transition:all 0.3s;"
              onmouseover="this.style.background='${cardHoverBg}'; this.style.transform='translateY(-4px)';"
              onmouseout="this.style.background='${cardBg}'; this.style.transform='translateY(0)';">
              <div style="font-size:32px; margin-bottom:12px;">&#128736;</div>
              <h3 style="margin:0 0 8px; color:${isDark ? 'white' : '#6C5CE7'}; font-size:15px; font-weight:600;">Gerencie Tudo</h3>
              <p style="margin:0; color:${cardText}; font-size:13px; line-height:1.5;">Organize seus servicos, horarios e clientes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  root.innerHTML = html;

  window.goToLogin = function() {
    showLandingPage = false;
    isLogin = true;
    render();
  };

  window.goToSignup = function() {
    showLandingPage = false;
    isLogin = false;
    render();
  };

  window.toggleLandingTheme = function() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("agendamento_darkMode", isDarkMode.toString());
    applyTheme();

    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; inset:0; z-index:9999; opacity:0; transition:opacity 0.4s ease; pointer-events:none; background:" + (isDarkMode ? "#0d0521" : "#f0e6ff") + ";";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = "1"; });
    setTimeout(() => {
      renderLandingPage();
      requestAnimationFrame(() => { overlay.style.opacity = "0"; });
      setTimeout(() => { overlay.remove(); }, 400);
    }, 200);
  };

  if (typeof lucide !== "undefined") lucide.createIcons();
}

function renderAuthScreen() {
  const root = document.getElementById("root");

  function handleSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (isLogin) {
      // LOGIN
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (user) {
        currentUser = user;
        saveToLocalStorage();
        showToast(`Bem-vindo, ${user.name}!`, "success");
        render();
      } else {
        showToast("Email ou senha inválidos", "error");
      }
    } else {
      // CADASTRO
      const name = document.getElementById("name").value;
      const username = document.getElementById("username").value;
      const role = document.getElementById("role").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!name) {
        showToast("Nome é obrigatório", "error");
        return;
      }
      if (!username) {
        showToast("Nome único é obrigatório", "error");
        return;
      }
      if (username.length < 3) {
        showToast("Nome único deve ter pelo menos 3 caracteres", "error");
        return;
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        showToast("Nome único pode conter apenas letras, números, ponto, hífen e underscore", "error");
        return;
      }
      if (users.find((u) => u.username === username)) {
        showToast("Este nome único já está em uso", "error");
        return;
      }
      if (password !== confirmPassword) {
        showToast("Senhas não conferem", "error");
        return;
      }
      if (users.find((u) => u.email === email)) {
        showToast("Email já cadastrado", "error");
        return;
      }

      const newUser = {
        id: Date.now(),
        name: name,
        username: username,
        email: email,
        password: password,
        role: role,
      };
      users.push(newUser);
      currentUser = newUser;
      saveToLocalStorage();
      showToast("Cadastro realizado com sucesso!", "success");
      render();
    }
  }

  window.toggleMode = function toggleMode() {
    isLogin = !isLogin;
    renderAuthScreen();
  };

  const html = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 24px; padding: 40px; max-width: 450px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <button id="backBtn" onclick="${isLogin ? 'window.goToLandingPage()' : 'toggleMode()'}" style="display: flex; align-items: center; gap: 6px; background: var(--neutral-100); color: var(--neutral-800); border: 1px solid var(--neutral-200); padding: 8px 12px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background var(--transition-base); margin-bottom: 20px;">
                    <span>←</span> Voltar
                </button>
                <div style="text-align:center; margin-bottom:8px;">${window.renderLogo(64)}</div>
                <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">${isLogin ? "Faça login para continuar" : "Crie sua conta gratuitamente"}</p>
                
                
                <form id="authForm">
                    ${
                      !isLogin
                        ? `
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nome completo</label>
                            <input type="text" id="name" placeholder="Digite seu nome" autocomplete="off" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Seu username</label>
                            <input type="text" id="username" placeholder="seu_usuario" autocomplete="off" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <p id="usernameFeedback" style="margin: 8px 0 0; font-size: 13px; font-weight: 600; display: none; min-height: 20px;"></p>
                            <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Use letras, números, ponto, hífen e underscore. Mín. 3 caracteres.</p>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Tipo de conta</label>
                            <select id="role" autocomplete="off" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                <option value="${USER_ROLES.CLIENT}">Cliente</option>
                                <option value="${USER_ROLES.PROVIDER}">Prestador de Serviço</option>
                            </select>
                        </div>
                    `
                        : ""
                    }
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                        <input type="email" id="email" placeholder="seu@email.com" autocomplete="off" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Senha</label>
                        <input type="password" id="password" placeholder="Digite sua senha" autocomplete="new-password" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    ${
                      !isLogin
                        ? `
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Confirmar senha</label>
                            <input type="password" id="confirmPassword" placeholder="Confirme sua senha" autocomplete="new-password" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                    `
                        : ""
                    }
                    <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color: white; border: none; border-radius: 12px; font-size: 16px; cursor: pointer;">
                        ${isLogin ? "Entrar" : "Cadastrar"}
                    </button>
                </form>
                <p style="text-align: center; margin-top: 24px; color: #6b7280;">
                    ${isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                    <button id="toggleBtn" style="background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer;">${isLogin ? "Cadastre-se" : "Faça login"}</button>
                </p>
            </div>
        </div>
    `;

  root.innerHTML = html;

  document.getElementById("authForm").onsubmit = handleSubmit;
  document.getElementById("toggleBtn").onclick = function (e) {
    e.preventDefault();
    toggleMode();
  };

  // Limpar campo de username para evitar preenchimento automático
  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    // Limpar ao carregar
    usernameInput.value = "";
    // Limpar se houver qualquer valor pré-preenchido
    setTimeout(() => {
      usernameInput.value = "";
    }, 100);
    
    // Validação em tempo real
    usernameInput.addEventListener("input", function(e) {
      // Remover caracteres inválidos
      if (this.value.includes("@") || this.value.includes(".com")) {
        this.value = "";
      }
      
      const username = this.value.trim().toLowerCase();
      const feedbackElement = document.getElementById("usernameFeedback");
      
      if (!feedbackElement) return;
      
      // Se campo vazio, não mostrar feedback
      if (username.length === 0) {
        feedbackElement.innerHTML = "";
        feedbackElement.style.display = "none";
        this.style.borderColor = "#e5e7eb";
        return;
      }
      
      // Validar tamanho mínimo
      if (username.length < 3) {
        feedbackElement.innerHTML = '⚠️ Mínimo 3 caracteres';
        feedbackElement.style.display = "block";
        feedbackElement.style.color = "#f59e0b";
        this.style.borderColor = "#f59e0b";
        return;
      }
      
      // Validar caracteres
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        feedbackElement.innerHTML = '❌ Caracteres inválidos';
        feedbackElement.style.display = "block";
        feedbackElement.style.color = "#ef4444";
        this.style.borderColor = "#ef4444";
        return;
      }
      
      // Verificar se username já existe
      const exists = (window.allUsers || []).some(u => (u.username || "").toLowerCase() === username);
      
      if (exists) {
        feedbackElement.innerHTML = '❌ Esse username já existe!';
        feedbackElement.style.display = "block";
        feedbackElement.style.color = "#ef4444";
        feedbackElement.style.fontWeight = "600";
        this.style.borderColor = "#ef4444";
      } else {
        feedbackElement.innerHTML = '✅ Username disponível!';
        feedbackElement.style.display = "block";
        feedbackElement.style.color = "#10b981";
        feedbackElement.style.fontWeight = "600";
        this.style.borderColor = "#10b981";
      }
    });
  }

  window.goToLandingPage = function() {
    showLandingPage = true;
    render();
  };

  // Fazer users acessível globalmente para validação de username
  window.allUsers = users;

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("mouseover", function() {
      this.style.background = "var(--neutral-200)";
    });
    backBtn.addEventListener("mouseout", function() {
      this.style.background = "var(--neutral-100)";
    });
  }
}

// ============================================
// IMAGE CROP MODAL
// ============================================

window.openCropModal = function (src, callback) {
  cropImageSrc = src;
  cropX = 0;
  cropY = 0;
  cropCallback = callback;
  showCropModal = true;
  document.body.style.overflow = "hidden";

  const tmpImg = new Image();
  tmpImg.onload = function () {
    const frameSize = _cropFrameSize;
    const minZoom = Math.max(frameSize / tmpImg.naturalWidth, frameSize / tmpImg.naturalHeight);
    cropZoom = minZoom;
    render();
    const range = document.getElementById("cropZoomRange");
    if (range) {
      range.min = minZoom.toFixed(4);
      range.value = cropZoom;
    }
    const label = document.getElementById("cropZoomLabel");
    if (label) label.textContent = Math.round(cropZoom * 100) + "%";
  };
  tmpImg.src = src;
};

window.closeCropModal = function () {
  if (_cropDragging || _cropJustDragged) return;
  showCropModal = false;
  cropImageSrc = "";
  cropCallback = null;
  document.body.style.overflow = "auto";
  render();
};

window._cropImgLoaded = function () {
  clampCropPosition();
  renderCropImage();
};

window.setCropZoom = function (val) {
  const range = document.getElementById("cropZoomRange");
  const minZoom = range ? parseFloat(range.min) : 0.5;
  cropZoom = Math.max(minZoom, parseFloat(val));
  const label = document.getElementById("cropZoomLabel");
  if (label) label.textContent = Math.round(cropZoom * 100) + "%";
  clampCropPosition();
  renderCropImage();
};

window.confirmCrop = function () {
  const frame = document.getElementById("cropFrame");
  if (!frame) return;
  const canvas = document.createElement("canvas");
  const size = 400;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const img = document.getElementById("cropImg");
  if (!img) return;

  const frameRect = frame.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();

  const scale = img.naturalWidth / imgRect.width;
  const sx = (frameRect.left - imgRect.left) * scale;
  const sy = (frameRect.top - imgRect.top) * scale;
  const sWidth = frameRect.width * scale;
  const sHeight = frameRect.height * scale;

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

  const result = canvas.toDataURL("image/png");
  showCropModal = false;
  cropImageSrc = "";
  document.body.style.overflow = "auto";
  if (cropCallback) cropCallback(result);
  cropCallback = null;
  render();
};

let _cropDragging = false;
let _cropJustDragged = false;
let _cropDragStartX = 0;
let _cropDragStartY = 0;
let _cropStartX = 0;
let _cropStartY = 0;
const _cropFrameSize = 200;

window.startCropDrag = function (e) {
  _cropDragging = true;
  const touch = e.touches ? e.touches[0] : e;
  _cropDragStartX = touch.clientX;
  _cropDragStartY = touch.clientY;
  _cropStartX = cropX;
  _cropStartY = cropY;
  const frame = document.getElementById("cropFrame");
  if (frame) frame.style.cursor = "grabbing";
  e.preventDefault();
  e.stopPropagation();
};

window.onCropDrag = function (e) {
  if (!_cropDragging) return;
  const touch = e.touches ? e.touches[0] : e;
  let newX = _cropStartX + (touch.clientX - _cropDragStartX);
  let newY = _cropStartY + (touch.clientY - _cropDragStartY);

  const img = document.getElementById("cropImg");
  if (img) {
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const frame = document.getElementById("cropFrame");
    const frameW = frame ? frame.offsetWidth : _cropFrameSize;
    const frameH = frame ? frame.offsetHeight : _cropFrameSize;
    const scaledW = imgW * cropZoom;
    const scaledH = imgH * cropZoom;
    const minX = -Math.max(0, (scaledW - frameW) / 2);
    const maxX = Math.max(0, (scaledW - frameW) / 2);
    const minY = -Math.max(0, (scaledH - frameH) / 2);
    const maxY = Math.max(0, (scaledH - frameH) / 2);
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));
  }

  cropX = newX;
  cropY = newY;
  renderCropImage();
  e.preventDefault();
};

window.endCropDrag = function () {
  if (_cropDragging) _cropJustDragged = true;
  _cropDragging = false;
  const frame = document.getElementById("cropFrame");
  if (frame) frame.style.cursor = "grab";
  setTimeout(() => { _cropJustDragged = false; }, 100);
};

function renderCropImage() {
  const img = document.getElementById("cropImg");
  if (img) {
    img.style.transform = `translate(calc(-50% + ${cropX}px), calc(-50% + ${cropY}px)) scale(${cropZoom})`;
  }
}

function clampCropPosition() {
  const img = document.getElementById("cropImg");
  if (!img) return;
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const frame = document.getElementById("cropFrame");
  const frameW = frame ? frame.offsetWidth : _cropFrameSize;
  const frameH = frame ? frame.offsetHeight : _cropFrameSize;
  const scaledW = imgW * cropZoom;
  const scaledH = imgH * cropZoom;
  const minX = -Math.max(0, (scaledW - frameW) / 2);
  const maxX = Math.max(0, (scaledW - frameW) / 2);
  const minY = -Math.max(0, (scaledH - frameH) / 2);
  const maxY = Math.max(0, (scaledH - frameH) / 2);
  cropX = Math.max(minX, Math.min(maxX, cropX));
  cropY = Math.max(minY, Math.min(maxY, cropY));
}

function getCropModalHtml() {
  if (!showCropModal) return "";
  return `
    <div class="modal-overlay" onclick="window.closeCropModal()" style="z-index:2000;">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:400px; width:90%; text-align:center;">
        <h3 style="margin-bottom:16px;">Recortar foto</h3>
        <div id="cropFrame" onclick="event.stopPropagation()" style="width:200px; height:200px; border-radius:50%; overflow:hidden; border:3px solid #6C5CE7; margin:0 auto 16px; position:relative; background:#1e1e1e; cursor:grab;">
          <img id="cropImg" src="${cropImageSrc}" draggable="false"
            onload="window._cropImgLoaded()"
            style="position:absolute; top:50%; left:50%; transform:translate(calc(-50% + ${cropX}px), calc(-50% + ${cropY}px)) scale(${cropZoom}); transform-origin:center center; max-width:none; user-select:none; pointer-events:none;">
        </div>
        <div style="margin-bottom:16px;">
          <input type="range" id="cropZoomRange" min="0.05" max="3" step="0.05" value="${cropZoom}"
            oninput="window.setCropZoom(this.value)"
            style="width:100%; accent-color:#6C5CE7;">
          <p id="cropZoomLabel" style="margin:4px 0 0; font-size:13px; color:#6b7280;">${Math.round(cropZoom * 100)}%</p>
        </div>
        <p style="font-size:12px; color:#9ca3af; margin-bottom:16px;">Arraste a imagem para posicionar</p>
        <div style="display:flex; gap:12px; justify-content:center;">
          <button onclick="window.closeCropModal()" style="padding:10px 20px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600;">Cancelar</button>
          <button onclick="window.confirmCrop()" style="padding:10px 20px; background:#6C5CE7; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600;">Aplicar</button>
        </div>
      </div>
    </div>
  `;
}

function appendCropModal() {
  const old = document.getElementById("cropModalContainer");
  if (old) old.remove();
  const html = getCropModalHtml();
  if (!html) return;
  const div = document.createElement("div");
  div.id = "cropModalContainer";
  div.innerHTML = html;
  document.body.appendChild(div);
}

function setupCropDrag() {
  const frame = document.getElementById("cropFrame");
  if (!frame) return;
  frame.addEventListener("mousedown", window.startCropDrag);
  frame.addEventListener("touchstart", window.startCropDrag, { passive: false });
  document.addEventListener("mousemove", window.onCropDrag);
  document.addEventListener("touchmove", window.onCropDrag, { passive: false });
  document.addEventListener("mouseup", window.endCropDrag);
  document.addEventListener("touchend", window.endCropDrag);
}

// ============================================
// RENDER PRINCIPAL COM LOADER
// ============================================

function render() {
  applyTheme();
  window.toggleDarkMode = toggleDarkMode;
  
  // Se houver estado ativo, mostrar tela de estado
  if (showState()) {
    initThemeButton();
    return;
  }
  
  const showPage = () => {
    if (!currentUser) {
      if (showLandingPage) {
        renderLandingPage();
      } else {
        renderAuthScreen();
      }
    } else if (currentUser.role === USER_ROLES.CLIENT) {
      if (showProviderShop) {
        renderProviderShopScreen();
      } else if (showClientProfile) {
        renderClientProfileScreen();
      } else {
        renderProvidersListScreen();
      }
    } else if (showProviderProfile) {
      renderProviderProfileScreen();
    } else {
      renderProviderDashboard();
    }

    if (
      showBookingForm ||
      showCancelModal ||
      showBookingsModal ||
      showCreateServiceModal ||
      showMyServicesModal ||
      showDeleteServiceModal ||
      showClientProfile ||
      showClientEditProfileModal ||
      showClientProfilePhotoPicker ||
      showProviderShop ||
      showLogoutConfirmModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  // só mostra loader na primeira carga ou login/logout
  const loader = document.getElementById("loader");

  if (loader && loader.style.display !== "none") {
    setTimeout(() => {
      hideLoader();
      showPage();
      initThemeButton();
      appendCropModal();
      setupCropDrag();
    }, 600);
  } else {
    showPage();
    initThemeButton();
    appendCropModal();
    setupCropDrag();
  }
}

// ============================================
// FUNÇÃO PARA GERAR CALENDÁRIO NO LOADER
// ============================================
function generateLoaderCalendar() {
  const container = document.getElementById("calendarNumbers");
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  let html = "";

  // espaços vazios antes do dia 1
  for (let i = 0; i < firstDay; i++) {
    html += `<span></span>`;
  }

  // dias do mês
  for (let day = 1; day <= totalDays; day++) {
    if (day === today) {
      html += `<span class="today">${day}</span>`;
    } else {
      html += `<span>${day}</span>`;
    }
  }

  container.innerHTML = html;
}

// ============================================
// INICIAR APLICAÇÃO
// ============================================

// Garantir que abra na tela de login e com loader toda vez que recarregar a página
window._slideCalendar = function (direction, htmlFn) {
  const container = document.getElementById("calendarContainer");
  if (!container) { htmlFn(); return; }
  const inner = container.querySelector("div");
  if (!inner) { htmlFn(); return; }
  const outClass = direction === "next" ? "cal-slide-out-left" : "cal-slide-out-right";
  const inClass = direction === "next" ? "cal-slide-in-right" : "cal-slide-in-left";
  inner.classList.add(outClass);
  setTimeout(() => {
    htmlFn();
    const newInner = container.querySelector("div");
    if (newInner) newInner.classList.add(inClass);
  }, 180);
};

window.addEventListener("DOMContentLoaded", function () {
  localStorage.removeItem("agendamento_currentUser"); // força abrir no login
  currentUser = null;
  isLogin = true;
  generateLoaderCalendar();
  render();
});

