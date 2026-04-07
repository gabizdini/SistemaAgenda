// ============================================
// CONSTANTES GLOBAIS
// ============================================
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let showBookingForm = false;
let showCancelModal = false;
let bookingToCancel = null;
let services = [];
let showBookingsModal = false;

const savedServices = localStorage.getItem('agendamento_services');

if (savedServices) services = JSON.parse(savedServices);
const USER_ROLES = { CLIENT: 'client', PROVIDER: 'provider' };

// ============================================
// MOCK SERVICES (CORRIGIDO - ADICIONADO!)
// ============================================
const mockServices = [
    { id: 1, name: 'Corte de Cabelo', duration: 30, price: 50, provider: 'Carlos - Barbearia' },
    { id: 2, name: 'Manicure', duration: 45, price: 40, provider: 'Ana - Studio de Beleza' },
    { id: 3, name: 'Troca de Óleo', duration: 60, price: 120, provider: 'Mecânica Rápida' },
    { id: 4, name: 'Consulta Clínica', duration: 30, price: 200, provider: 'Clínica Saúde' }
];

// Gerar horários disponíveis (8h às 18h com intervalos de 30min)
const TIME_SLOTS = [];
for (let i = 8; i <= 18; i++) {
    TIME_SLOTS.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 18) TIME_SLOTS.push(`${i.toString().padStart(2, '0')}:30`);
}

// ============================================
// DADOS PERSISTIDOS (localStorage)
// ============================================

let users = [
    { id: 1, name: 'Ana Silva', email: 'ana@email.com', password: '123', role: USER_ROLES.CLIENT },
    { id: 2, name: 'Carlos Souza', email: 'carlos@email.com', password: '123', role: USER_ROLES.PROVIDER }
];

let bookings = [
    { id: 1, serviceId: 1, serviceName: 'Corte de Cabelo', date: new Date().toDateString(), time: '10:00', status: 'confirmed', clientName: 'Ana Silva', clientId: 1, provider: 'Carlos - Barbearia' }
];

let currentUser = null;

// Carregar dados salvos
const savedUsers = localStorage.getItem('agendamento_users');
const savedBookings = localStorage.getItem('agendamento_bookings');
const savedCurrentUser = localStorage.getItem('agendamento_currentUser');

if (savedUsers) users = JSON.parse(savedUsers);
if (savedBookings) bookings = JSON.parse(savedBookings);
if (savedCurrentUser) currentUser = JSON.parse(savedCurrentUser);

function isTimeBooked(time) {
    if (!selectedService || !selectedDate) return false;
    return bookings.some(b => b.serviceId === selectedService.id && b.date === selectedDate && b.time === time);
}

function saveToLocalStorage() {
    localStorage.setItem('agendamento_users', JSON.stringify(users));
    localStorage.setItem('agendamento_bookings', JSON.stringify(bookings));
    localStorage.setItem('agendamento_services', JSON.stringify(services));

    if (currentUser) {
        localStorage.setItem('agendamento_currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('agendamento_currentUser');
    }
}

//prestador add serviços
function addService(name, duration, price) {

    const newService = {
        id: Date.now(),
        name,
        duration,
        price,
        providerId: currentUser.id
    };

    services.push(newService);
    saveToLocalStorage();
    render();

    showToast('Serviço criado com sucesso!', 'success');
}

function showToast(message, type) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// FUNÇÃO PARA ESCONDER O LOADER
// ============================================
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// ============================================
// FUNÇÃO PARA MOSTRAR O LOADER
// ============================================
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        loader.style.visibility = 'visible';
    }
}

// ============================================
// TELA DE LOGIN/CADASTRO
// ============================================
let isLogin = true;

function renderAuthScreen() {
    const root = document.getElementById('root');

    function handleSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (isLogin) {
            // LOGIN
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                saveToLocalStorage();
                showToast(`Bem-vindo, ${user.name}!`, 'success');
                render();
            } else {
                showToast('Email ou senha inválidos', 'error');
            }
        } else {
            // CADASTRO
            const name = document.getElementById('name').value;
            const role = document.getElementById('role').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!name) {
                showToast('Nome é obrigatório', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showToast('Senhas não conferem', 'error');
                return;
            }
            if (users.find(u => u.email === email)) {
                showToast('Email já cadastrado', 'error');
                return;
            }

            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password,
                role: role
            };
            users.push(newUser);
            currentUser = newUser;
            saveToLocalStorage();
            showToast('Cadastro realizado com sucesso!', 'success');
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
                <p style="text-align: center; color: #6b7280; margin-bottom: 32px;">${isLogin ? 'Faça login para continuar' : 'Crie sua conta gratuitamente'}</p>
                
                <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 12px;">
                    <strong>🧪 Contas para teste:</strong><br>
                    Cliente: ana@email.com / 123<br>
                    Prestador: carlos@email.com / 123
                </div>
                
                <form id="authForm">
                    ${!isLogin ? `
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
                    ` : ''}
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Email</label>
                        <input type="email" id="email" placeholder="seu@email.com" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500;">Senha</label>
                        <input type="password" id="password" placeholder="Digite sua senha" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                    </div>
                    ${!isLogin ? `
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Confirmar senha</label>
                            <input type="password" id="confirmPassword" placeholder="Confirme sua senha" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px;">
                        </div>
                    ` : ''}
                    <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-size: 16px; cursor: pointer;">
                        ${isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>
                <p style="text-align: center; margin-top: 24px; color: #6b7280;">
                    ${isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                    <button id="toggleBtn" style="background: none; border: none; color: #667eea; font-weight: 600; cursor: pointer;">${isLogin ? 'Cadastre-se' : 'Faça login'}</button>
                </p>
            </div>
        </div>
    `;

    root.innerHTML = html;

    document.getElementById('authForm').onsubmit = handleSubmit;
    document.getElementById('toggleBtn').onclick = function (e) {
        e.preventDefault();
        toggleMode();
    };
}

// ============================================
// DASHBOARD DO CLIENTE
// ============================================

function renderClientDashboard() {
    const root = document.getElementById('root');
    const userBookings = bookings.filter(b => b.clientId === currentUser.id);

    window.confirmBooking = function () {
        handleBooking();
    };

    window.openBookingsModal = function () {
        showBookingsModal = true;
        showCancelModal = false;
        document.body.style.overflow = 'hidden';
        render();
    };

    window.closeBookingsModal = function () {
        showBookingsModal = false;
        document.body.style.overflow = 'auto';
        render();
    };

    window.closeBookingForm = function () {
        showBookingForm = false;
        selectedService = null;
        selectedDate = null;
        selectedTime = null;
        document.body.style.overflow = 'auto';
        render();
    };

    window.selectDate = function (dateStr) {
        selectedDate = dateStr;
        selectedTime = null;
        render();
    };

    window.selectTime = function (time) {
        selectedTime = time;
        render();
    };

    window.openCancelModal = function (bookingId) {
        bookingToCancel = bookingId;
        showBookingsModal = false;
        showCancelModal = true;
        document.body.style.overflow = 'hidden';
        render();
    };

    window.closeCancelModal = function () {
        showCancelModal = false;
        bookingToCancel = null;
        document.body.style.overflow = 'auto';
        render();
    };

    window.confirmCancel = function () {
        const id = bookingToCancel;
        showCancelModal = false;
        bookingToCancel = null;
        document.body.style.overflow = 'auto';
        if (id !== null && id !== undefined) cancelBooking(id);
        render();
    };

    window.logout = function () {
        currentUser = null;
        isLogin = true;
        saveToLocalStorage();
        render();
    };

    function handleBooking() {
        if (!selectedService || !selectedDate || !selectedTime) {
            showToast('Selecione serviço, data e horário', 'error');
            return;
        }

        const isBooked = bookings.some(
            b => b.serviceId === selectedService.id && b.date === selectedDate && b.time === selectedTime
        );

        if (isBooked) {
            showToast('Horário indisponível', 'error');
            return;
        }

        bookings.push({
            id: Date.now(),
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            provider: selectedService.provider,
            date: selectedDate,
            time: selectedTime,
            clientId: currentUser.id,
            clientName: currentUser.name,
            status: 'confirmed'
        });

        saveToLocalStorage();
        showToast('Agendamento confirmado!', 'success');
        showBookingForm = false;
        selectedService = null;
        selectedDate = null;
        selectedTime = null;
        document.body.style.overflow = 'auto';
        render();
    }

    function cancelBooking(bookingId) {
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            bookings.splice(index, 1);
            saveToLocalStorage();
            showToast('Agendamento cancelado', 'success');
        }
        render();
    }

    function openBookingForm(service) {
        selectedService = service;
        selectedDate = null;
        selectedTime = null;
        showBookingForm = true;
        document.body.style.overflow = 'hidden';
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
        for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));

        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        return `
            <div style="margin-bottom: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h4>${today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h4>
                </div>
                <div class="calendar-grid">
                    ${weekDays.map(day => `<div style="text-align:center; font-weight:bold; font-size:12px; padding:8px;">${day}</div>`).join('')}
                    ${days.map(date => {
                        if (!date) return '<div></div>';
                        const dateStr = date.toDateString();
                        const isSelected = selectedDate === dateStr;
                        return `<div class="calendar-day ${isSelected ? 'selected' : ''}" onclick="window.selectDate('${dateStr}')">${date.getDate()}</div>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    const servicesToShow = services.length ? services : mockServices;

const servicesHtml = servicesToShow.map(service =>`
        <div class="service-card">
            <h4 style="margin-bottom: 8px;">${service.name}</h4>
            <p style="color:#6b7280; margin-bottom:4px;">${service.provider}</p>
            <p style="color:#10b981; font-weight:bold; margin-bottom:4px;">R$ ${service.price}</p>
            <p style="color:#6b7280; font-size:14px; margin-bottom:16px;">Duração: ${service.duration} min</p>
            <button onclick="window.openBookingForm(${service.id})" style="width:100%; padding:10px; background:#667eea; color:white; border:none; border-radius:8px; cursor:pointer;">Agendar</button>
        </div>
    `).join('');

    window.openBookingForm = function (serviceId) {
        const service = mockServices.find(s => s.id === serviceId);
        openBookingForm(service);
    };

    const bookingsHtml = userBookings.length === 0
        ? `<div class="empty-state"><div class="empty-state-icon">📅</div><p>Você ainda não tem agendamentos</p></div>`
        : userBookings.map(booking => `
            <div class="booking-item">
                <div>
                    <h4 style="margin-bottom:4px;">${booking.serviceName}</h4>
                    <p style="color:#6b7280; font-size:14px;">${booking.provider}</p>
                    <p style="color:#667eea; font-weight:500; font-size:14px;">${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}</p>
                </div>
                <button onclick="window.openCancelModal(${booking.id})" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Cancelar</button>
            </div>
        `).join('');

    const pageHtml = `
        <div style="display:flex; min-height:100vh;">
            <aside style="width:240px; background:#111827; color:white; padding:20px;">
                <h2 style="margin-bottom:20px;">AgendaFácil</h2>
                <button onclick="window.openBookingsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#1f2937; color:white; border:none; border-radius:8px; cursor:pointer;">📅 Agendamentos Marcados</button>
                <button onclick="window.logout()" style="width:100%; text-align:left; padding:10px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Sair</button>
            </aside>

            <main style="flex:1;">
                <div class="nav-bar">
                    <div class="container" style="display:flex; justify-content:space-between; align-items:center; padding:0;">
                        <h1 style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">AgendaFácil</h1>
                        <span style="color:#6b7280;">👤 Cliente: ${currentUser.name}</span>
                    </div>
                </div>

                <div class="container">
                    <h2 style="margin-bottom:24px;">Olá, ${currentUser.name}!</h2>
                    <div style="margin-bottom:40px;">
                        <h3 style="margin-bottom:16px;">Serviços Disponíveis</h3>
                        <div class="services-grid">${servicesHtml}</div>
                    </div>
                </div>
            </main>
        </div>
    `;

    root.innerHTML = pageHtml;

    const oldModal = document.getElementById('modal-root');
if (oldModal) {
    oldModal.innerHTML = '';
    oldModal.remove();
}
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    modalRoot.innerHTML = `
        ${showBookingForm && selectedService ? `
            <div class="modal-overlay" onclick="window.closeBookingForm()">
                <div class="modal-content" onclick="event.stopPropagation()" style="max-width:500px; max-height:80vh; overflow-y:auto;">
                    <h3 style="margin-bottom:16px;">Agendar ${selectedService.name}</h3>
                    <div style="margin-bottom:20px;">
                        <label style="display:block; margin-bottom:8px; font-weight:500;">Selecione a data</label>
                        ${generateCalendar()}
                    </div>
                    <div style="margin-bottom:20px;">
                        <label style="display:block; margin-bottom:8px; font-weight:500;">Selecione o horário</label>
                        <div class="time-slots-grid">
                            ${TIME_SLOTS.map(time => `<div class="time-slot ${selectedTime === time ? 'selected' : ''} ${isTimeBooked(time) ? 'booked' : ''}" onclick="window.selectTime('${time}')">${time}</div>`).join('')}
                        </div>
                    </div>
                    <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:20px;">
                        <button onclick="window.closeBookingForm()" style="padding:10px 20px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">Cancelar</button>
                        <button onclick="window.confirmBooking()" style="padding:10px 20px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">Confirmar Agendamento</button>
                    </div>
                </div>
            </div>
        ` : ''}

        ${showCancelModal && bookingToCancel ? `
            <div class="modal-overlay" onclick="window.closeCancelModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <h3 style="margin-bottom:12px;">Cancelar Agendamento</h3>
                    <p style="margin-bottom:24px; color:#6b7280;">Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.</p>
                    <div style="display:flex; gap:12px; justify-content:flex-end;">
                        <button onclick="window.closeCancelModal()" style="padding:8px 16px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">Cancelar</button>
                        <button onclick="window.confirmCancel()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Confirmar</button>
                    </div>
                </div>
            </div>
        ` : ''}

        ${showBookingsModal ? `
            <div class="modal-overlay" onclick="window.closeBookingsModal()">
                <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <h3>Meus Agendamentos</h3>
                        <button onclick="window.closeBookingsModal()" style="padding:8px 12px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">Fechar</button>
                    </div>
                    ${bookingsHtml}
                </div>
            </div>
        ` : ''}
    `;
    document.body.appendChild(modalRoot);

    document.body.style.overflow = (showBookingForm || showCancelModal || showBookingsModal) ? 'hidden' : 'auto';
}

//criar
window.createService = function () {
    const name = document.getElementById('serviceName').value;
    const duration = document.getElementById('serviceDuration').value;
    const price = document.getElementById('servicePrice').value;

    const newService = {
        id: Date.now(),
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        providerId: currentUser.id
    };

    services.push(newService);
    saveToLocalStorage();
    showToast('Serviço criado com sucesso!', 'success');
    render();
};

// ============================================
// DASHBOARD DO PRESTADOR
// ============================================

function renderProviderDashboard() {
    const root = document.getElementById('root');
    const providerBookings = bookings;

    window.logout = function () {
        currentUser = null;
        isLogin = true;
        saveToLocalStorage();
        render();
    };

    const html = `
        <div class="nav-bar">
            <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding: 0;">
                <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AgendaFácil</h1>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <span style="color: #6b7280;">✂️ Prestador: ${currentUser.name}</span>
                    <button onclick="window.logout()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Sair</button>
                </div>
            </div>
        </div>

        <div class="container">
            <h2 style="margin-bottom: 8px;">Dashboard do Prestador</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">Bem-vindo, ${currentUser.name}</p>

            <!-- 📌 CRIAR SERVIÇO -->
            <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="margin-bottom: 12px;">Criar novo serviço</h3>
                <input id="serviceName" placeholder="Nome do serviço" style="width:100%; padding:10px; margin:5px 0;" />
                <input id="serviceDuration" placeholder="Duração (min)" type="number" style="width:100%; padding:10px; margin:5px 0;" />
                <input id="servicePrice" placeholder="Preço" type="number" step="0.01" style="width:100%; padding:10px; margin:5px 0;" />
                <button onclick="window.createService()" style="margin-top:10px; padding:10px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
                    Adicionar Serviço
                </button>
            </div>

            <!-- CARDS -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 32px;">
                <div style="background: white; border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
                    <h3>Total de Agendamentos</h3>
                    <p style="font-size: 32px; font-weight: bold; color: #667eea;">${providerBookings.length}</p>
                </div>

                <div style="background: white; border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
                    <h3>Agendamentos Confirmados</h3>
                    <p style="font-size: 32px; font-weight: bold; color: #10b981;">
                        ${providerBookings.filter(b => b.status === 'confirmed').length}
                    </p>
                </div>
            </div>

            <!-- AGENDAMENTOS -->
            <div>
                <h3 style="margin-bottom: 16px;">Próximos Agendamentos</h3>
                ${providerBookings.length === 0 ?
            '<div class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum agendamento encontrado</p></div>' :
            `<div style="display: flex; flex-direction: column; gap: 12px;">
                        ${providerBookings.map(booking => `
                            <div class="booking-item">
                                <div>
                                    <h4 style="margin-bottom: 4px;">${booking.serviceName}</h4>
                                    <p style="color: #6b7280; font-size: 14px;">Cliente: ${booking.clientName}</p>
                                    <p style="color: #667eea; font-weight: 500; font-size: 14px;">
                                        ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
                                    </p>
                                </div>
                                <span style="padding: 4px 12px; background: #d1fae5; color: #065f46; border-radius: 20px; font-size: 14px;">
                                    Confirmado
                                </span>
                            </div>
                        `).join('')}
                    </div>`
        }
            </div>
        </div>
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

        if (showBookingForm || showCancelModal || showBookingsModal) {
    document.body.style.overflow = 'hidden';
} else {
    document.body.style.overflow = 'auto';
}
    };

    // só mostra loader na primeira carga ou login/logout
    const loader = document.getElementById('loader');

    if (loader && loader.style.display !== 'none' && loader.style.visibility !== 'hidden') {
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
window.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('agendamento_currentUser'); // força abrir no login
    currentUser = null;
    isLogin = true;
    generateLoaderCalendar();
    render();
});
//teste