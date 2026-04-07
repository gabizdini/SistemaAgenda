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

const savedServices = localStorage.getItem("agendamento_services");

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
// DASHBOARD DO CLIENTE
// ============================================

function renderClientDashboard() {
  const root = document.getElementById("root");
  const userBookings = bookings.filter((b) => b.clientId === currentUser.id);

  window.confirmBooking = function () {
    handleBooking();
  };
  window.openBookingsModal = function () {
    showBookingsModal = true;
    document.body.style.overflow = "hidden";
    render();
  };
  window.closeBookingsModal = function () {
    showBookingsModal = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.closeBookingForm = function () {
    showBookingForm = false;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    document.body.style.overflow = "auto";
    render();
  };

  function handleBooking() {
    if (!selectedService || !selectedDate || !selectedTime) {
      showToast("Selecione serviço, data e horário", "error");
      return;
    }

    const isBooked = bookings.some(
      (b) =>
        b.serviceId === selectedService.id &&
        b.date === selectedDate &&
        b.time === selectedTime,
    );

    if (isBooked) {
      showToast("Horário indisponível", "error");
      return;
    }

    const newBooking = {
      id: Date.now(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      provider: selectedService.provider,
      date: selectedDate,
      time: selectedTime,
      clientId: currentUser.id,
      clientName: currentUser.name,
      status: "confirmed",
    };

    bookings.push(newBooking);
    saveToLocalStorage();
    showToast("Agendamento confirmado!", "success");

    showBookingForm = false;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    document.body.style.overflow = "auto";
    render();
  }

  function cancelBooking(bookingId) {
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings.splice(index, 1);
      saveToLocalStorage();
      showToast("Agendamento cancelado", "success");
    }
    render();
  }
  window.cancelAllBookings = function () {
    bookingToCancel = "__all__";
    showBookingsModal = false; // fecha lista antes de abrir confirmação
    showCancelModal = true;
    document.body.style.overflow = "hidden";
    render();
  };
  function openBookingForm(service) {
    selectedService = service;
    selectedDate = null;
    selectedTime = null;
    showBookingForm = true;
    document.body.style.overflow = "hidden";
    render();
  }

  function generateCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(year, month, i));

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return `
        <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4>${today.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h4>
            </div>
            <div class="calendar-grid">
                ${weekDays.map((day) => `<div style="text-align: center; font-weight: bold; font-size: 12px; padding: 8px;">${day}</div>`).join("")}
                ${days
                  .map((date) => {
                    if (!date) return "<div></div>";
                    const dateStr = date.toDateString();
                    const isSelected = selectedDate === dateStr;
                    const isPast =
                      date < today && date.getDate() !== today.getDate();
                    const isDisabled = isPast;

                    return `<div class="calendar-day ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}" onclick="${!isDisabled ? `window.selectDate('${dateStr}')` : ""}" style="${isDisabled ? "background-color: #ef4444; color: white; cursor: not-allowed; opacity: 0.5;" : ""}">${date.getDate()}</div>`;
                  })
                  .join("")}
            </div>
        </div>
    `;
  }

  function updateTimeSelection() {
    document.querySelectorAll(".time-slot").forEach((el) => {
      el.classList.remove("selected");
      if (el.innerText === selectedTime) {
        el.classList.add("selected");
      }
    });
  }

  function updateCalendarAndTimes() {
    document.querySelectorAll(".calendar-day").forEach((el) => {
      el.classList.remove("selected");
      if (el.innerText == new Date(selectedDate).getDate()) {
        el.classList.add("selected");
      }
    });
  }

  window.openCancelModal = function (bookingId) {
    bookingToCancel = bookingId;
    showBookingsModal = false; // fecha modal de lista antes
    showCancelModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.selectDate = function (dateStr) {
    selectedDate = dateStr;
    selectedTime = null;
    updateCalendarAndTimes();
    render();
  };

  window.selectTime = function (time) {
    selectedTime = time;
    updateTimeSelection();
  };

  window.closeCancelModal = function () {
    showCancelModal = false;
    bookingToCancel = null;
    document.body.style.overflow = "auto";
    render();
  };

  // 3) GARANTA que exista só UMA confirmCancel (substitua pela abaixo):
  window.confirmCancel = function () {
    const target = bookingToCancel;
    showCancelModal = false;
    bookingToCancel = null;

    if (target === "__all__") {
      bookings = bookings.filter((b) => b.clientId !== currentUser.id);
      showBookingsModal = false;
      saveToLocalStorage();
      showToast("Todos os agendamentos foram cancelados", "success");
      document.body.style.overflow = "auto";
      render();
      return;
    }

    if (target) cancelBooking(target);
  };

  window.logout = function () {
    currentUser = null;
    isLogin = true;
    saveToLocalStorage();
    render();
  };

  let servicesHtml = mockServices
    .map(
      (service) => `
        <div class="service-card">
            <h4 style="margin-bottom: 8px;">${service.name}</h4>
            <p style="color: #6b7280; margin-bottom: 4px;">${service.provider}</p>
            <p style="color: #10b981; font-weight: bold; margin-bottom: 4px;">R$ ${service.price}</p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Duração: ${service.duration} min</p>
            <button onclick="window.openBookingForm(${service.id})" style="width: 100%; padding: 10px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Agendar</button>
        </div>
    `,
    )
    .join("");

  window.openBookingForm = function (serviceId) {
    const service = mockServices.find((s) => s.id === serviceId);
    openBookingForm(service);
  };

  let bookingsHtml = "";
  if (userBookings.length === 0) {
    bookingsHtml = `<div class="empty-state"><div class="empty-state-icon">📅</div><p>Você ainda não tem agendamentos</p></div>`;
  } else {
    bookingsHtml = userBookings
      .map(
        (booking) => `
            <div class="booking-item">
                <div>
                    <h4 style="margin-bottom: 4px;">${booking.serviceName}</h4>
                    <p style="color: #6b7280; font-size: 14px;">${booking.provider}</p>
                    <p style="color: #667eea; font-weight: 500; font-size: 14px;">${new Date(booking.date).toLocaleDateString("pt-BR")} às ${booking.time}</p>
                </div>
                <button onclick="window.openCancelModal(${booking.id})" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
            </div>
        `,
      )
      .join("");
  }
  let bookingsModalHtml = "";
  if (showBookingsModal) {
    bookingsModalHtml = `
        <div class="modal-overlay" onclick="window.closeBookingsModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h3>Meus Agendamentos</h3>
    <div style="display:flex; gap:8px;">
        ${
          userBookings.length > 0
            ? `
            <button onclick="window.cancelAllBookings()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; min-width:120px;">
                Cancelar todos
            </button>
        `
            : `
            <button style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; min-width:120px; visibility:hidden; pointer-events:none;">
                Cancelar todos
            </button>
        `
        }
        <button onclick="window.closeBookingsModal()" style="padding:8px 12px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">
            Fechar
        </button>
    </div>
</div>
                ${bookingsHtml}
            </div>
        </div>
    `;
  }
  let bookingModalHtml = "";
  if (showBookingForm && selectedService) {
    let timeSlotsHtml = TIME_SLOTS.map((time) => {
      const isBooked =
        selectedDate &&
        selectedService &&
        bookings.some(
          (b) =>
            b.serviceId === selectedService.id &&
            b.date === selectedDate &&
            b.time === time,
        );

      return `
        <div
            class="time-slot ${selectedTime === time ? "selected" : ""} ${isBooked ? "booked" : ""}"
            onclick="${!isBooked && selectedDate ? `window.selectTime('${time}')` : ""}"
            style="${isBooked ? "background-color:#ef4444;color:white;opacity:0.5;cursor:not-allowed;" : !selectedDate ? "opacity:0.5;cursor:not-allowed;" : ""}">
            ${time}
        </div>
    `;
    }).join("");

    bookingModalHtml = `
            <div class="modal-overlay" onclick="window.closeBookingForm()">
                <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px; max-height: 80vh; overflow-y: auto;">
                    <h3 style="margin-bottom: 16px;">Agendar ${selectedService.name}</h3>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Selecione a data</label>
                        ${generateCalendar()}
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Selecione o horário</label>
                        <div class="time-slots-grid">${timeSlotsHtml}</div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                        <button onclick="window.closeBookingForm()" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        <button onclick="window.confirmBooking()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar Agendamento</button>
                    </div>
                </div>
            </div>
        `;
  }

  let cancelModalHtml = "";
  if (showCancelModal && bookingToCancel) {
    cancelModalHtml = `
            <div class="modal-overlay" onclick="window.closeCancelModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <h3 style="margin-bottom: 12px;">Cancelar Agendamento</h3>
                    <p style="margin-bottom: 24px; color: #6b7280;">
    ${
      bookingToCancel === "__all__"
        ? "Tem certeza que deseja cancelar TODOS os agendamentos? Esta ação não pode ser desfeita."
        : "Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
    }
</p>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="window.closeCancelModal()" style="padding: 8px 16px; background: #e5e7eb; border: none; border-radius: 8px; cursor: pointer;">Cancelar</button>
                        <button onclick="window.confirmCancel()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
  }

  const html = `
    <div style="display:flex; min-height:100vh;">
        <aside style="width:240px; background:#111827; color:white; padding:20px;">
            <h2 style="margin-bottom:20px;">AgendaFácil</h2>
            <button onclick="window.openBookingsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#1f2937; color:white; border:none; border-radius:8px; cursor:pointer;">
            Agendamentos
            </button>
            <button onclick="window.logout()" style="width:100%; text-align:left; padding:10px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
                Sair
            </button>
        </aside>

        <main style="flex:1;">

            <div class="container">
                <h2 style="margin-bottom:24px; color:#ffffff;">Olá, ${currentUser.name}!</h2>
                <div style="margin-bottom:40px;">
                    <h3 style="margin-bottom:16px; color:#ffffff;">Serviços Disponíveis</h3>
                    <div class="services-grid">${servicesHtml}</div>
                </div>
            </div>
        </main>
    </div>

    ${bookingModalHtml}
    ${cancelModalHtml}
    ${bookingsModalHtml}
`;

  root.innerHTML = html;
}
// ============================================
// DASHBOARD DO PRESTADOR
// ============================================

function renderProviderDashboard() {
    const root = document.getElementById('root');
    const providerBookings = bookings;
    const providerServices = services.filter(s => s.providerId === currentUser.id);

    window.logout = function () {
        currentUser = null;
        isLogin = true;
        saveToLocalStorage();
        render();
    };

    window.openCreateServiceModal = function () {
        showCreateServiceModal = true;
        document.body.style.overflow = 'hidden';
        render();
    };

    window.closeCreateServiceModal = function () {
        showCreateServiceModal = false;
        document.body.style.overflow = 'auto';
        render();
    };

    window.createService = function () {
        const name = document.getElementById('serviceName')?.value.trim();
        const duration = parseInt(document.getElementById('serviceDuration')?.value, 10);
        const price = parseFloat(document.getElementById('servicePrice')?.value);

        if (!name || Number.isNaN(duration) || Number.isNaN(price) || duration <= 0 || price <= 0) {
            showToast('Preencha nome, duração e preço corretamente.', 'error');
            return;
        }

        const newService = {
            id: Date.now(),
            name,
            duration,
            price,
            providerId: currentUser.id,
            provider: currentUser.name
        };

        services.push(newService);
        saveToLocalStorage();
        showToast('Serviço criado com sucesso!', 'success');
        showCreateServiceModal = false;
        document.body.style.overflow = 'auto';
        render();
    };

    const createServiceModalHtml = showCreateServiceModal ? `
        <div class="modal-overlay" onclick="window.closeCreateServiceModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px; width: 90%;">
                <h3 style="margin-bottom: 16px;">Criar novo serviço</h3>

                <div style="margin-bottom: 12px;">
                    <label style="display:block; margin-bottom: 6px; font-weight: 500;">Nome do serviço</label>
                    <input id="serviceName" type="text" placeholder="Ex: Corte masculino"
                        style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px;" />
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display:block; margin-bottom: 6px; font-weight: 500;">Duração (min)</label>
                    <input id="serviceDuration" type="number" min="1" placeholder="Ex: 30"
                        style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px;" />
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display:block; margin-bottom: 6px; font-weight: 500;">Preço (R$)</label>
                    <input id="servicePrice" type="number" min="0.01" step="0.01" placeholder="Ex: 50"
                        style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px;" />
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button onclick="window.closeCreateServiceModal()"
                        style="padding:8px 16px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">
                        Cancelar
                    </button>
                    <button onclick="window.createService()"
                        style="padding:8px 16px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    ` : '';

    const html = `
        <div style="display:flex; min-height:100vh;">
            <aside style="width:240px; background:#111827; color:white; padding:20px;">
                <h2 style="margin-bottom:20px;">AgendaFácil</h2>

                <button onclick="window.openCreateServiceModal()"
                    style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#1f2937; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Criar serviço
                </button>

                <button onclick="window.logout()"
                    style="width:100%; text-align:left; padding:10px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Sair
                </button>
            </aside>

            <main style="flex:1;">
                <div class="container">
                    <h2 style="margin-bottom:8px; color:#ffffff;">Olá, ${currentUser.name}!</h2>
                    <p style="color:#d1d5db; margin-bottom:24px;">Dashboard do Prestador</p>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; margin-bottom:28px;">
                        <div style="background:white; border-radius:12px; padding:20px; text-align:center;">
                            <div style="font-size:28px; margin-bottom:8px;">📅</div>
                            <h3>Total de Agendamentos</h3>
                            <p style="font-size:30px; font-weight:700; color:#667eea;">${providerBookings.length}</p>
                        </div>

                        <div style="background:white; border-radius:12px; padding:20px; text-align:center;">
                            <div style="font-size:28px; margin-bottom:8px;">🛠️</div>
                            <h3>Meus Serviços</h3>
                            <p style="font-size:30px; font-weight:700; color:#10b981;">${providerServices.length}</p>
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <h3 style="margin-bottom:12px; color:#ffffff;">Serviços Criados</h3>
                        ${providerServices.length === 0
                            ? '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum serviço criado ainda</p></div>'
                            : `<div style="display:flex; flex-direction:column; gap:10px;">
                                ${providerServices.map(service => `
                                    <div class="booking-item">
                                        <div>
                                            <h4 style="margin-bottom:4px;">${service.name}</h4>
                                            <p style="color:#6b7280; font-size:14px;">Duração: ${service.duration} min</p>
                                        </div>
                                        <span style="padding:4px 12px; background:#d1fae5; color:#065f46; border-radius:20px; font-size:14px;">
                                            R$ ${service.price}
                                        </span>
                                    </div>
                                `).join('')}
                            </div>`
                        }
                    </div>

                    <div>
                        <h3 style="margin-bottom:12px; color:#ffffff;">Próximos Agendamentos</h3>
                        ${providerBookings.length === 0
                            ? '<div class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum agendamento encontrado</p></div>'
                            : `<div style="display:flex; flex-direction:column; gap:10px;">
                                ${providerBookings.map(booking => `
                                    <div class="booking-item">
                                        <div>
                                            <h4 style="margin-bottom:4px;">${booking.serviceName}</h4>
                                            <p style="color:#6b7280; font-size:14px;">Cliente: ${booking.clientName}</p>
                                            <p style="color:#667eea; font-weight:500; font-size:14px;">
                                                ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
                                            </p>
                                        </div>
                                        <span style="padding:4px 12px; background:#d1fae5; color:#065f46; border-radius:20px; font-size:14px;">
                                            Confirmado
                                        </span>
                                    </div>
                                `).join('')}
                            </div>`
                        }
                    </div>
                </div>
            </main>
        </div>

        ${createServiceModalHtml}
    `;

    root.innerHTML = html;
}
// ============================================
// RENDER PRINCIPAL COM LOADER
// ============================================

function render() {
  const showPage = () => {
    if (!currentUser) {
      renderAuthScreen();
    } else if (currentUser.role === USER_ROLES.CLIENT) {
      renderClientDashboard();
    } else {
      renderProviderDashboard();
    }

    if (
      showBookingForm ||
      showCancelModal ||
      showBookingsModal ||
      showCreateServiceModal
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
