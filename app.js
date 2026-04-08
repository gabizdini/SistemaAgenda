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

const savedServices = localStorage.getItem("agendamento_services");
const savedBlockedSlots = localStorage.getItem("agendamento_blockedSlots");

if (savedBlockedSlots) blockedSlots = JSON.parse(savedBlockedSlots);

if (savedServices) services = JSON.parse(savedServices);
const USER_ROLES = { CLIENT: "client", PROVIDER: "provider" };

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
    email: "ana@email.com",
    password: "123",
    role: USER_ROLES.CLIENT,
  },
  {
    id: 2,
    name: "Carlos Souza",
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

if (savedUsers) users = JSON.parse(savedUsers);
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
      const role = document.getElementById("role").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!name) {
        showToast("Nome é obrigatório", "error");
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

  function toggleMode() {
    isLogin = !isLogin;
    renderAuthScreen();
  }

  const html = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: white; border-radius: 24px; padding: 40px; max-width: 450px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h1 style="text-align: center; margin-bottom: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AgendaFácil</h1>
                <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">${isLogin ? "Faça login para continuar" : "Crie sua conta gratuitamente"}</p>
                
                <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 12px;">
                    <strong>🧪 Contas para teste:</strong><br>
                    Cliente: ana@email.com / 123<br>
                    Prestador: carlos@email.com / 123
                </div>
                
                <form id="authForm">
                    ${
                      !isLogin
                        ? `
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Nome completo</label>
                            <input type="text" id="name" placeholder="Digite seu nome" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Tipo de conta</label>
                            <select id="role" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                                <option value="${USER_ROLES.CLIENT}">Cliente</option>
                                <option value="${USER_ROLES.PROVIDER}">Prestador de Serviço</option>
                            </select>
                        </div>
                    `
                        : ""
                    }
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                        <input type="email" id="email" placeholder="seu@email.com" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Senha</label>
                        <input type="password" id="password" placeholder="Digite sua senha" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    ${
                      !isLogin
                        ? `
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Confirmar senha</label>
                            <input type="password" id="confirmPassword" placeholder="Confirme sua senha" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                    `
                        : ""
                    }
                    <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; cursor: pointer;">
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
}

// ============================================
// RENDER PRINCIPAL COM LOADER
// ============================================

function render() {
  const showPage = () => {
    if (!currentUser) {
  renderAuthScreen();
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
  showProviderShop
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
    }, 600);
  } else {
    showPage();
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

