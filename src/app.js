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

  const html = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; background: white;">
      <!-- HEADER -->
      <header style="background: white; border-bottom: 1px solid #e5e7eb; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <h1 style="margin: 0;">${window.renderLogo(80)}</h1>
        </div>
        <button onclick="window.goToLogin()" style="padding: 12px 28px; background: linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: transform 0.2s;">Fazer Login</button>
      </header>

      <!-- CONTEÚDO PRINCIPAL -->
      <main style="flex: 1; padding: 80px 40px; max-width: 1200px; margin: 0 auto; width: 100%;">
        <!-- SEÇÃO HERO -->
        <div style="text-align: center; margin-bottom: 80px;">
          <h2 style="font-size: 48px; font-weight: 700; color: #2D3436; margin: 0 0 20px 0;">Organize seus agendamentos com facilidade</h2>
          <p style="font-size: 20px; color: #6b7280; margin: 0 0 40px 0; line-height: 1.6;">Conecte clientes e prestadores de serviço em uma única plataforma intuitiva e segura</p>
          <button onclick="window.goToSignup()" style="padding: 16px 40px; background: linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 16px; transition: transform 0.2s;">Começar Agora</button>
        </div>

        <!-- RECURSOS -->
        <div style="margin-top: 60px;">
          <h3 style="text-align: center; font-size: 32px; color: #2D3436; margin-bottom: 50px;">O que oferecemos</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
            <!-- Card 1 -->
            <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; border-top: 4px solid #6C5CE7; transition: transform 0.3s;">

              <h4 style="font-size: 18px; font-weight: 600; color: #2D3436; margin: 0 0 10px 0;">Agendamento Simplificado</h4>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">Sistema intuitivo para agendar e gerenciar compromissos em tempo real</p>
            </div>
            <!-- Card 2 -->
            <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; border-top: 4px solid #8E44AD; transition: transform 0.3s;">

              <h4 style="font-size: 18px; font-weight: 600; color: #2D3436; margin: 0 0 10px 0;">Conecte Prestadores</h4>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">Encontre profissionais qualificados para seus serviços de forma rápida</p>
            </div>
            <!-- Card 4 -->
            <div style="padding: 30px; background: #f8f9fa; border-radius: 12px; border-top: 4px solid #6C5CE7; transition: transform 0.3s;">

              <h4 style="font-size: 18px; font-weight: 600; color: #2D3436; margin: 0 0 10px 0;">Gestão de Serviços</h4>
              <p style="color: #6b7280; margin: 0; line-height: 1.5;">Crie, edite e organize seus serviços com facilidade</p>
            </div>
          </div>
        </div>

        <!-- CTA FINAL -->
        <div style="text-align: center; margin-top: 80px; padding: 40px; background: linear-gradient(135deg, #f8f9fa 0%, #f0f1f7 100%); border-radius: 12px;">
          <h3 style="font-size: 28px; color: #2D3436; margin: 0 0 20px 0;">Pronto para começar?</h3>
          <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px;">Crie sua conta agora e comece a gerenciar seus agendamentos</p>
          <button onclick="window.goToSignup()" style="padding: 14px 36px; background: linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; transition: transform 0.2s;">Cadastre-se Agora</button>
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
    }, 600);
  } else {
    showPage();
    initThemeButton();
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
window.addEventListener("DOMContentLoaded", function () {
  localStorage.removeItem("agendamento_currentUser"); // força abrir no login
  currentUser = null;
  isLogin = true;
  generateLoaderCalendar();
  render();
});

