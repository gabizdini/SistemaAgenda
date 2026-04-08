// ============================================
// DASHBOARD DO CLIENTE
// ============================================

// Funções globais para eventos onclick
window.selectProvider = function (providerId) {
  console.log("selectProvider chamado com providerId:", providerId);
  selectedProviderId = providerId;
  showProviderShop = true;
  document.body.style.overflow = "hidden";
  render();
};

function renderClientProfileScreen() {
  const root = document.getElementById("root");

  const PROFILE_PHOTOS = [
    "./images/1.png",
    "./images/2.png",
    "./images/3.png",
    "./images/4.png",
    "./images/5.png",
  ];

  window.openClientPhotoPicker = function () {
    showClientProfilePhotoPicker = !showClientProfilePhotoPicker;
    render();
  };

  window.selectClientProfilePhoto = function (photo) {
    currentUser.profilePhoto = photo;

    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) users[userIndex].profilePhoto = photo;

    saveToLocalStorage();
    showClientProfilePhotoPicker = false;
    render();
  };

  window.openClientHome = function () {
    showClientProfile = false;
    showClientEditProfileModal = false;
    showClientProfilePhotoPicker = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openClientProfile = function () {
    showClientProfile = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeClientProfile = function () {
    showClientProfile = false;
    showClientEditProfileModal = false;
    showClientProfilePhotoPicker = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openClientEditProfileModal = function () {
    showClientEditProfileModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeClientEditProfileModal = function () {
    showClientEditProfileModal = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.saveClientProfileChanges = function () {
    const newName = document.getElementById("editClientProfileName")?.value.trim();
    const newEmail = document.getElementById("editClientProfileEmail")?.value.trim();

    if (!newName) {
      showToast("Nome é obrigatório", "error");
      return;
    }

    if (!newEmail) {
      showToast("Email é obrigatório", "error");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Email inválido", "error");
      return;
    }

    // Verificar se email já existe (excluindo o usuário atual)
    const emailExists = users.some((u) => u.email === newEmail && u.id !== currentUser.id);
    if (emailExists) {
      showToast("Este email já está cadastrado", "error");
      return;
    }

    // Atualizar usuário atual
    currentUser.name = newName;
    currentUser.email = newEmail;

    // Atualizar no array de usuários
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].name = newName;
      users[userIndex].email = newEmail;
    }

    saveToLocalStorage();
    showToast("Perfil atualizado com sucesso!", "success");
    showClientEditProfileModal = false;
    render();
  };

  window.logout = function () {
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

  const html = `
    <div style="display:flex; min-height:100vh; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%);">
      <aside style="width:240px; background:white; color:#2D3436; padding:20px; box-shadow:0 8px 32px rgba(108,92,231,0.2);">
        <h2 style="margin-bottom:24px; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-0.5px;">AgendaFácil</h2>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; background:linear-gradient(135deg,rgba(108,92,231,0.05),rgba(162,155,254,0.05)); padding:12px; border-radius:12px;">
          <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; flex:0 0 auto; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:18px; font-weight:700;">
            ${
              currentUser.profilePhoto
                ? `<img src="${currentUser.profilePhoto}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover;">`
                : `${currentUser.name?.charAt(0)?.toUpperCase() || "C"}`
            }
          </div>
          <div style="min-width:0;">
            <h2 style="margin:0; font-size:18px; line-height:1.2; color:#6C5CE7; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:700;">
              ${currentUser.name}
            </h2>
            <p style="margin:4px 0 0; color:#8E44AD; font-size:12px; font-weight:500;">
              Cliente
            </p>
          </div>
        </div>
        <button onclick="window.openClientHome()"
          style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#f3f4f6; color:#2D3436; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#6C5CE7'; this.style.color='white'; this.style.borderColor='#6C5CE7';"
          onmouseout="this.style.background='#f3f4f6'; this.style.color='#2D3436'; this.style.borderColor='#e5e7eb';">
          Início
        </button>
        
<p style="margin-bottom:12px; margin-top:0px; color:#9ca3af; font-size:12px; line-height:1.4;">
  Para gerenciar seus agendamentos<br> volte para a tela inicial
</p>
        <button onclick="window.logout()"
          style="width:100%; text-align:left; padding:10px 12px; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#ef4444'; this.style.color='white';"
          onmouseout="this.style.background='#fee2e2'; this.style.color='#991b1b';">
          Sair
        </button>
        <button id="themeToggle" class="theme-btn">
          <i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="icon"></i>
        </button>
      </aside>
      </aside>

      <main style="flex:1; padding:32px;">
        <div class="container">
          <div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">
            <div style="width:84px; height:84px; border-radius:50%; overflow:hidden; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:34px; font-weight:700; box-shadow:0 12px 30px rgba(108,92,231,0.35);">
              ${
                currentUser.profilePhoto
                  ? `<img src="${currentUser.profilePhoto}" alt="Foto do perfil" style="width:100%; height:100%; object-fit:cover;">`
                  : `${currentUser.name?.charAt(0)?.toUpperCase() || "C"}`
              }
            </div>

            <div>
              <h2 style="margin:0; color:white; font-size:30px; font-weight:700;">${currentUser.name}</h2>
              <p style="margin:6px 0 0; color:#e9d5ff; font-weight:500;">Cliente</p>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-bottom:18px;">
            <button type="button" onclick="window.openClientPhotoPicker()"
              style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:2px solid white; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='white'; this.style.color='#6C5CE7';"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white';"
              onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              ${showClientProfilePhotoPicker ? "Fechar opções" : "Escolher foto"}
            </button>
            <button type="button" onclick="window.openClientEditProfileModal()"
              style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:2px solid white; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='white'; this.style.color='#6C5CE7';"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white';">
              Editar dados
            </button>
          </div>

          ${
            showClientProfilePhotoPicker
              ? `
            <div style="display:flex; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
              ${PROFILE_PHOTOS.map((photo) => `
                <button type="button" onclick="window.selectClientProfilePhoto('${photo}')"
                  style="width:90px; height:90px; padding:0; border:${currentUser.profilePhoto === photo ? "3px solid #6C5CE7" : "2px solid #d1d5db"}; border-radius:16px; overflow:hidden; cursor:pointer; background:white; transition:all 0.2s; box-shadow:${currentUser.profilePhoto === photo ? "0 4px 12px rgba(108,92,231,0.3)" : "none"}"
                  onmouseover="this.style.borderColor='#6C5CE7'; this.style.boxShadow='0 4px 12px rgba(108,92,231,0.3)';"
                  onmouseout="this.style.borderColor='${currentUser.profilePhoto === photo ? "#6C5CE7" : "#d1d5db"}'; this.style.boxShadow='${currentUser.profilePhoto === photo ? "0 4px 12px rgba(108,92,231,0.3)" : "none"}';">
                  <img src="${photo}" alt="Opção de foto" style="width:100%; height:100%; object-fit:cover;">
                </button>
              `).join("")}
            </div>
          `
              : ""
          }

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:18px; margin-bottom:24px;">
            <div style="background:rgba(255,255,255,0.95); border-radius:16px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.12); border-left:4px solid #6C5CE7; transition:all 0.3s ease;"
              onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(108,92,231,0.2)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.12)';">
              <p style="margin:0 0 8px; color:#8E44AD; font-size:14px; font-weight:600;">Nome completo</p>
              <h3 style="margin:0; color:#2D3436; font-size:18px; font-weight:700;">${currentUser.name}</h3>
            </div>

            <div style="background:rgba(255,255,255,0.95); border-radius:16px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.12); border-left:4px solid #A29BFE; transition:all 0.3s ease;"
              onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(108,92,231,0.2)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.12)';">
              <p style="margin:0 0 8px; color:#8E44AD; font-size:14px; font-weight:600;">E-mail</p>
              <h3 style="margin:0; color:#2D3436; word-break:break-word; font-size:14px; font-weight:700;">${currentUser.email}</h3>
            </div>

            <div style="background:rgba(255,255,255,0.95); border-radius:16px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.12); border-left:4px solid #6C5CE7; transition:all 0.3s ease;"
              onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(108,92,231,0.2)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.12)';">
              <p style="margin:0 0 8px; color:#8E44AD; font-size:14px; font-weight:600;">Tipo de conta</p>
              <h3 style="margin:0; color:#6C5CE7; font-weight:700;">Cliente</h3>
            </div>
          </div>
        </div>
      </main>
    </div>

    ${
      showClientEditProfileModal
        ? `
      <div class="modal-overlay" onclick="window.closeClientEditProfileModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 400px; width: 90%; border-top:4px solid #6C5CE7;">
          <h3 style="margin-bottom: 20px; color:#6C5CE7; font-size:20px;">✏️ Editar Perfil</h3>

          <div style="margin-bottom: 16px;">
            <label style="display:block; margin-bottom: 8px; font-weight: 600; color: #6C5CE7;">Nome completo</label>
            <input id="editClientProfileName" type="text" value="${currentUser.name}"
              style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box; transition:all 0.2s;"
              onfocus="this.style.borderColor='#6C5CE7'; this.style.boxShadow='0 0 0 3px rgba(108,92,231,0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display:block; margin-bottom: 8px; font-weight: 600; color: #6C5CE7;">E-mail</label>
            <input id="editClientProfileEmail" type="email" value="${currentUser.email}"
              style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box; transition:all 0.2s;"
              onfocus="this.style.borderColor='#6C5CE7'; this.style.boxShadow='0 0 0 3px rgba(108,92,231,0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeClientEditProfileModal()" style="padding:10px 20px; background:#ECEFF1; color:#636E72; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.background='#DFE6E9';"
              onmouseout="this.style.background='#ECEFF1';">
              Cancelar
            </button>
            <button onclick="window.saveClientProfileChanges()" style="padding:10px 20px; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108,92,231,0.3)';"
              onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    `
        : ""
    }
  `;

  root.innerHTML = html;
}

function renderProviderShopScreen() {
  const root = document.getElementById("root");
  const provider = users.find((u) => u.id === selectedProviderId);
  const providerServices = services.filter((s) => s.providerId === selectedProviderId);

  window.backToProviders = function () {
    selectedProviderId = null;
    showProviderShop = false;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    showBookingForm = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openProviderShopBookingForm = function (serviceId) {
    const service = providerServices.find((s) => s.id === serviceId);
    if (service) {
      selectedService = service;
      selectedDate = null;
      selectedTime = null;
      showBookingForm = true;
      document.body.style.overflow = "hidden";
      render();
    }
  };

  window.confirmProviderShopBooking = function () {
    if (!selectedService || !selectedDate || !selectedTime) {
      showToast("Selecione serviço, data e horário", "error");
      return;
    }

    const isBooked = bookings.some(
      (b) =>
        b.serviceId === selectedService.id &&
        b.date === selectedDate &&
        b.time === selectedTime &&
        b.cancelled !== true,
    );

    const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${selectedTime}`;
    const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

    if (isBooked || isBlocked) {
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
  };

  window.logout = function () {
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
                    const dayOfWeek = date.getDay();

                    const isWorkingDay =
                      !selectedService?.workDays || selectedService.workDays.length === 0
                        ? true
                        : selectedService.workDays.includes(dayOfWeek);

                    const isPast = date < today && date.getDate() !== today.getDate();
                    const isDisabled = isPast || !isWorkingDay;

                    return `<div class="calendar-day ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}"
                      onclick="${!isDisabled ? `window.selectProviderShopDate('${dateStr}')` : ""}"
                      style="${isDisabled ? "background-color: #ef4444; color: white; cursor: not-allowed; opacity: 0.5;" : ""}">
                      ${date.getDate()}
                    </div>`;
                  })
                  .join("")}
            </div>
        </div>
    `;
  }

  function generateTimeSlots() {
    // Funções auxiliares para conversão de tempo
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    };

    // Gerar horários baseado no workHours e duração do serviço
    let filteredSlots = [];
    
    if (selectedService && selectedService.workHours && selectedService.workHours.start && selectedService.workHours.end) {
      const startMinutes = timeToMinutes(selectedService.workHours.start);
      const endMinutes = timeToMinutes(selectedService.workHours.end);
      const serviceDuration = selectedService.duration || 30;
      
      // Gerar slots começando do horário inicial, incrementando pela duração
      for (let timeMin = startMinutes; (timeMin + serviceDuration) <= endMinutes; timeMin += serviceDuration) {
        filteredSlots.push(minutesToTime(timeMin));
      }
    }

    let timeSlotsHtml = filteredSlots.map((time) => {
      const isBooked =
        selectedDate &&
        selectedService &&
        bookings.some(
          (b) =>
            b.serviceId === selectedService.id &&
            b.date === selectedDate &&
            b.time === time &&
            b.cancelled !== true,
        );

      const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${time}`;
      const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

      return `
        <div
            class="time-slot ${selectedTime === time ? "selected" : ""} ${isBooked || isBlocked ? "booked" : ""}"
            onclick="${!isBooked && !isBlocked && selectedDate ? `window.selectProviderShopTime('${time}')` : ""}"
            style="${isBooked || isBlocked ? "background-color:#ef4444;color:white;opacity:0.5;cursor:not-allowed;" : !selectedDate ? "opacity:0.5;cursor:not-allowed;" : ""}">
            ${time}
        </div>
    `;
    }).join("");
    return timeSlotsHtml;
  }

  window.selectProviderShopDate = function (dateStr) {
    selectedDate = dateStr;
    selectedTime = null;
    
    // Atualizar calendário
    document.querySelectorAll(".calendar-day").forEach((el) => {
      el.classList.remove("selected");
      if (el.innerText == new Date(dateStr).getDate()) {
        el.classList.add("selected");
      }
    });

    // Atualizar horários sem render completo
    const timeSlotsContainer = document.querySelector(".time-slots-grid");
    if (timeSlotsContainer) {
      timeSlotsContainer.innerHTML = generateTimeSlots();
    }
  };

  window.selectProviderShopTime = function (time) {
    selectedTime = time;
    document.querySelectorAll(".time-slot").forEach((el) => {
      el.classList.remove("selected");
      if (el.innerText === selectedTime) {
        el.classList.add("selected");
      }
    });
  };

  window.closeProviderShopBookingForm = function () {
    showBookingForm = false;
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    document.body.style.overflow = "auto";
    render();
  };

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
            b.time === time &&
            b.cancelled !== true,
        );

      const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${time}`;
      const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

      return `
        <div
            class="time-slot ${selectedTime === time ? "selected" : ""} ${isBooked || isBlocked ? "booked" : ""}"
            onclick="${!isBooked && !isBlocked && selectedDate ? `window.selectProviderShopTime('${time}')` : ""}"
            style="${isBooked || isBlocked ? "background-color:#ef4444;color:white;opacity:0.5;cursor:not-allowed;" : !selectedDate ? "opacity:0.5;cursor:not-allowed;" : ""}">
            ${time}
        </div>
    `;
    }).join("");

    bookingModalHtml = `
            <div class="modal-overlay" onclick="window.closeProviderShopBookingForm()">
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
                        <button onclick="window.closeProviderShopBookingForm()" style="padding: 10px 20px; background: #ECEFF1; border: 1px solid #B2BEC3; border-radius: 8px; cursor: pointer; font-weight:600; transition:all 0.2s; color:#636E72;"
                          onmouseover="this.style.background='#DFE6E9';"
                          onmouseout="this.style.background='#ECEFF1';">Cancelar</button>
                        <button onclick="window.confirmProviderShopBooking()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar Agendamento</button>
                    </div>
                </div>
            </div>
        `;
  }

  const html = `
    <div style="display:flex; min-height:100vh; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%);">
      <main style="flex:1; padding:32px;">
        <button onclick="window.backToProviders()" style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.4); border-radius:8px; cursor:pointer; margin-bottom:24px; font-weight:600; transition:all 0.3s;"
          onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.borderColor='rgba(255,255,255,0.6)';"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.borderColor='rgba(255,255,255,0.4)';">
          ← Voltar aos Prestadores
        </button>

        <div style="display:flex; align-items:center; gap:18px; margin-bottom:24px; background:rgba(255,255,255,0.95); border-radius:16px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.12);">
          <div style="width:84px; height:84px; border-radius:50%; overflow:hidden; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:34px; font-weight:700; flex-shrink:0;">
            ${
              provider.profilePhoto
                ? `<img src="${provider.profilePhoto}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover;">`
                : `${provider.name?.charAt(0)?.toUpperCase() || "P"}`
            }
          </div>
          <div>
            <h2 style="margin:0 0 8px; color:#111827; font-size:24px;">${provider.name}</h2>
            <p style="margin:0 0 4px; color:#6b7280;">Prestador de serviços</p>
            <p style="margin:0; color:#10b981; font-weight:600;">${providerServices.length} serviço(s) disponível(is)</p>
          </div>
        </div>

        <div style="margin-bottom:40px;">
          <h3 style="margin-bottom:16px; color:#ffffff;">Serviços Disponíveis</h3>
          ${
            providerServices.length === 0
              ? '<div class="empty-state" style="background:rgba(255,255,255,0.95); border-radius:16px; padding:40px; text-align:center;"><div class="empty-state-icon">📋</div><p style="color:#111827;">Nenhum serviço disponível no momento</p></div>'
              : `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:20px;">
                  ${providerServices
                    .map(
                      (service) => `
                        <div style="background:rgba(255,255,255,0.95); border-radius:12px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                          <h4 style="margin:0 0 8px; color:#111827; font-size:16px;">${service.name}</h4>
                          <p style="margin:0 0 4px; color:#6b7280; font-size:14px;">Duração: ${formatDuration(service.duration)}</p>
                          <p style="margin:0 0 12px; color:#10b981; font-weight:700; font-size:18px;">R$ ${service.price.toFixed(2)}</p>
                          <button onclick="window.openProviderShopBookingForm(${service.id})" style="width:100%; padding:10px; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s;"
                            onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108,92,231,0.3)';"
                            onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                            Agendar
                          </button>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
          }
        </div>
      </main>
    </div>

    ${bookingModalHtml}
  `;

  root.innerHTML = html;
}

function renderProvidersListScreen() {
  const root = document.getElementById("root");
  const providers = users.filter((u) => u.role === USER_ROLES.PROVIDER);
  const userBookings = bookings.filter((b) => b.clientId === currentUser.id);

  window.openMyBookings = function () {
    showBookingsModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeMyBookings = function () {
    showBookingsModal = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openNotificationsModal = function () {
    showNotificationsModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeNotificationsModal = function () {
    showNotificationsModal = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openClearNotificationsConfirm = function () {
    showNotificationsModal = false;
    showClearNotificationsConfirm = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeClearNotificationsConfirm = function () {
    showClearNotificationsConfirm = false;
    showNotificationsModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.clearAllNotifications = function () {
    userBookings.forEach((b) => {
      if (b.cancelled === true && b.cancelledByProvider === true) {
        b.notificationRead = true;
      }
    });
    saveToLocalStorage();
    showToast("Notificações apagadas", "success");
    showClearNotificationsConfirm = false;
    showNotificationsModal = true;
    render();
  };

  window.openMyProfile = function () {
    showClientProfile = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.logout = function () {
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

  window.openCancelModal = function (bookingId) {
    bookingToCancel = bookingId;
    showBookingsModal = false;
    showClientCancelJustificativeModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeCancelModal = function () {
    showClientCancelJustificativeModal = false;
    bookingToCancel = null;
    document.body.style.overflow = "hidden";
    showBookingsModal = true;
    render();
  };

  window.confirmCancelFromModal = function () {
    const justificativa = document.getElementById("clientCancelJustificativa")?.value.trim();
    
    if (!justificativa) {
      showToast("Por favor, insira uma justificativa", "error");
      return;
    }

    const target = bookingToCancel;
    showClientCancelJustificativeModal = false;
    bookingToCancel = null;

    if (target === "__all__") {
      bookings.forEach((b) => {
        if (b.clientId === currentUser.id && b.cancelled !== true) {
          b.cancelled = true;
          b.cancelledByClient = true;
          b.cancellationReason = justificativa;
          b.notificationRead = false;
        }
      });
      saveToLocalStorage();
      showToast("Todos os agendamentos foram cancelados", "success");
      showBookingsModal = true;
      document.body.style.overflow = "hidden";
      render();
      return;
    }

    if (target) {
      const booking = bookings.find((b) => b.id === target);
      if (booking) {
        booking.cancelled = true;
        booking.cancelledByClient = true;
        booking.cancellationReason = justificativa;
        booking.notificationRead = false;
        saveToLocalStorage();
        showToast("Agendamento cancelado", "success");
      }
      showBookingsModal = true;
      document.body.style.overflow = "hidden";
      render();
    }
  };

  window.confirmCancel = function () {
    const justificativa = document.getElementById("clientCancelJustificativa")?.value.trim();
    
    if (!justificativa) {
      showToast("Por favor, insira uma justificativa", "error");
      return;
    }

    const target = bookingToCancel;
    showClientCancelJustificativeModal = false;
    bookingToCancel = null;

    if (target) {
      const booking = bookings.find((b) => b.id === target);
      if (booking) {
        booking.cancelled = true;
        booking.cancelledByClient = true;
        booking.cancellationReason = justificativa;
        booking.notificationRead = false;
        saveToLocalStorage();
        showToast("Agendamento cancelado", "success");
      }
      showBookingsModal = true;
      document.body.style.overflow = "hidden";
      render();
    }
  };

  window.cancelAllBookings = function () {
    bookingToCancel = "__all__";
    showBookingsModal = false;
    showClientCancelJustificativeModal = true;
    document.body.style.overflow = "hidden";
    render();
  };

  let bookingsHtml = "";
  if (userBookings.length === 0) {
    bookingsHtml = `<div class="empty-state"><div class="empty-state-icon">📅</div><p>Você ainda não tem agendamentos</p></div>`;
  } else {
    const activeBookings = userBookings.filter((b) => !b.cancelled);
    if (activeBookings.length === 0) {
      bookingsHtml = `<div class="empty-state"><div class="empty-state-icon">📅</div><p>Você ainda não tem agendamentos</p></div>`;
    } else {
      bookingsHtml = activeBookings
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
  }

  let bookingsModalHtml = "";
  if (showBookingsModal) {
    const activeBookings = userBookings.filter((b) => !b.cancelled);
    bookingsModalHtml = `
        <div class="modal-overlay" onclick="window.closeMyBookings()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h3>Meus Agendamentos</h3>
                    <div style="display:flex; gap:8px;">
                        ${
                          activeBookings.length >= 2
                            ? `
                            <button onclick="window.cancelAllBookings()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; min-width:130px;">
                                Cancelar Todos
                            </button>
                        `
                            : ``
                        }
                        <button onclick="window.closeMyBookings()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">
                            Fechar
                        </button>
                    </div>
                </div>
                ${bookingsHtml}
            </div>
        </div>
    `;
  }

  let cancelModalHtml = "";
  if (showClientCancelJustificativeModal && bookingToCancel) {
    cancelModalHtml = `
            <div class="modal-overlay" onclick="window.closeCancelModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <h3 style="margin-bottom: 12px;">Cancelar Agendamento</h3>
                    <p style="margin-bottom: 16px; color: #6b7280;">
                        Insira uma justificativa para o cancelamento. Esta mensagem será enviada ao prestador.
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                      <textarea 
                        id="clientCancelJustificativa"
                        placeholder="Motivo do cancelamento..."
                        style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; font-size: 14px; resize: vertical; min-height: 100px; box-sizing: border-box;">
                      </textarea>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="window.closeCancelModal()" style="padding: 8px 16px; background: #ECEFF1; border: 1px solid #B2BEC3; border-radius: 8px; cursor: pointer; color: #636E72; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Voltar</button>
                        <button onclick="window.confirmCancelFromModal()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar Cancelamento</button>
                    </div>
                </div>
            </div>
        `;
  }

  let notificationsModalHtml = "";
  if (showNotificationsModal) {
    const cancelledByProvider = userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true);
    notificationsModalHtml = `
      <div class="modal-overlay" onclick="window.closeNotificationsModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3>🔔 Notificações</h3>
            <div style="display:flex; gap:8px;">
              ${
                cancelledByProvider.length > 0
                  ? `<button onclick="window.openClearNotificationsConfirm()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Apagar Todas</button>`
                  : ""
              }
              <button onclick="window.closeNotificationsModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Fechar</button>
            </div>
          </div>

          ${
            cancelledByProvider.length === 0
              ? '<div class="empty-state"><div class="empty-state-icon">✓</div><p>Nenhuma notificação</p></div>'
              : `<div style="display:flex; flex-direction:column; gap:12px;">
                  ${cancelledByProvider
                    .map(
                      (notification) => `
                        <div style="background:#fff3cd; border-left:4px solid #ffc107; padding:16px; border-radius:8px;">
                          <div style="margin-bottom:8px;">
                            <h4 style="margin:0 0 4px 0; color:#856404;">${notification.serviceName}</h4>
                            <p style="margin:0; color:#856404; font-size:14px;">
                              <strong>Prestador:</strong> ${notification.provider}
                            </p>
                            <p style="margin:4px 0 0 0; color:#856404; font-size:14px;">
                              📅 ${new Date(notification.date).toLocaleDateString("pt-BR")} às ${notification.time}
                            </p>
                          </div>
                          <div style="border-top:1px solid #ffeaa7; padding-top:8px; margin-top:8px;">
                            <p style="margin:0; color:#856404; font-size:13px; line-height:1.5;">
                              <strong>Motivo do cancelamento:</strong> ${notification.cancellationReason}
                            </p>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
          }
        </div>
      </div>
    `;
  }

  let clearNotificationsConfirmModalHtml = "";
  if (showClearNotificationsConfirm) {
    clearNotificationsConfirmModalHtml = `
      <div class="modal-overlay" onclick="window.closeClearNotificationsConfirm()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width:400px;">
          <h3 style="margin-bottom:16px;">Confirmar Limpeza de Notificações</h3>
          <p style="margin-bottom:24px; color:#6b7280;">
            Tem certeza que deseja apagar TODAS as notificações? Esta ação não pode ser desfeita.
          </p>
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeClearNotificationsConfirm()" style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Cancelar</button>
            <button onclick="window.clearAllNotifications()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Confirmar</button>
          </div>
        </div>
      </div>
    `;
  }

  const html = `
    <div style="display:flex; min-height:100vh; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%);">
      <aside style="width:240px; background:white; color:#2D3436; padding:20px; box-shadow:0 8px 32px rgba(108,92,231,0.2);">
        <h2 style="margin-bottom:24px; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-0.5px;">AgendaFácil</h2>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; background:linear-gradient(135deg,rgba(108,92,231,0.05),rgba(162,155,254,0.05)); padding:12px; border-radius:12px;">
          <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; flex:0 0 auto; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:18px; font-weight:700;">
            ${
              currentUser.profilePhoto
                ? `<img src="${currentUser.profilePhoto}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover;">`
                : `${currentUser.name?.charAt(0)?.toUpperCase() || "C"}`
            }
          </div>
          <div style="min-width:0;">
            <h2 style="margin:0; font-size:18px; line-height:1.2; color:#6C5CE7; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:700;">
              ${currentUser.name}
            </h2>
            <p style="margin:4px 0 0; color:#8E44AD; font-size:12px; font-weight:500;">
              Cliente
            </p>
          </div>
        </div>
        <button onclick="window.openMyProfile()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#f3f4f6; color:#2D3436; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#6C5CE7'; this.style.color='white'; this.style.borderColor='#6C5CE7';"
          onmouseout="this.style.background='#f3f4f6'; this.style.color='#2D3436'; this.style.borderColor='#e5e7eb';">
          👤 Perfil
        </button>
        <button onclick="window.openNotificationsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#f3f4f6; color:#2D3436; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#6C5CE7'; this.style.color='white'; this.style.borderColor='#6C5CE7';"
          onmouseout="this.style.background='#f3f4f6'; this.style.color='#2D3436'; this.style.borderColor='#e5e7eb'; position:'relative';">
          🔔 Notificações ${userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true).length > 0 ? `(${userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true).length})` : ''}
        </button>
        <button onclick="window.openMyBookings()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#f3f4f6; color:#2D3436; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#6C5CE7'; this.style.color='white'; this.style.borderColor='#6C5CE7';"
          onmouseout="this.style.background='#f3f4f6'; this.style.color='#2D3436'; this.style.borderColor='#e5e7eb';">
          📅 Meus Agendamentos (${userBookings.filter((b) => b.cancelled !== true).length})
        </button>
        
        <button onclick="window.logout()" style="width:100%; text-align:left; padding:10px 12px; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#ef4444'; this.style.color='white';"
          onmouseout="this.style.background='#fee2e2'; this.style.color='#991b1b';">
          Sair
        </button>

        <button id="themeToggle" class="theme-btn">
          <i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="icon"></i>
        </button>
      </aside>

      

      <main style="flex:1; padding:32px;">
        <div class="container">
          <h2 style="margin-bottom:8px; color:white; font-weight:700; font-size:28px;">💼 Prestadores Disponíveis</h2>
          <p style="color:#e9d5ff; margin-bottom:32px; font-weight:500;">Escolha um prestador para ver seus serviços</p>

          ${
            providers.length === 0
              ? '<div class="empty-state"><div class="empty-state-icon">👤</div><p>Nenhum prestador disponível</p></div>'
              : `<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:24px;">
                  ${providers
                    .map(
                      (provider) => {
                        const providerServices = services.filter(
                          (s) => s.providerId === provider.id,
                        );
                        return `
                          <div style="background:rgba(255,255,255,0.95); border-radius:16px; padding:24px; box-shadow:0 4px 12px rgba(0,0,0,0.08); cursor:pointer; transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                              <div style="width:56px; height:56px; border-radius:50%; overflow:hidden; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:700; flex-shrink:0;">
                                ${
                                  provider.profilePhoto
                                    ? `<img src="${provider.profilePhoto}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover;">`
                                    : `${provider.name?.charAt(0)?.toUpperCase() || "P"}`
                                }
                              </div>
                              <div style="min-width:0;">
                                <h3 style="margin:0; color:#111827; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${provider.name}</h3>
                                <p style="margin:4px 0 0; color:#6b7280; font-size:12px;">Prestador</p>
                              </div>
                            </div>
                            <p style="margin:0 0 12px; color:#6b7280; font-size:14px;">📋 ${providerServices.length} serviço(s)</p>
                            <button onclick="window.selectProvider(${provider.id})" style="width:100%; padding:10px; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
                              onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(108,92,231,0.3)';"
                              onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                              Ver Serviços
                            </button>
                          </div>
                        `;
                      },
                    )
                    .join("")}
                </div>`
          }
        </div>
      </main>
    </div>

    ${bookingsModalHtml}
    ${notificationsModalHtml}
    ${clearNotificationsConfirmModalHtml}
    ${cancelModalHtml}
  `;

  root.innerHTML = html;
}

function renderClientDashboard() {
  const root = document.getElementById("root");
  const userBookings = bookings.filter((b) => b.clientId === currentUser.id);

  window.confirmBooking = function () {
    handleBooking();
  };
  window.openBookingsModal = function () {
    showBookingsModal = true;
    showProviderShop = false;
    selectedProviderId = null;
    document.body.style.overflow = "hidden";
    render();
  };
  window.closeBookingsModal = function () {
    showBookingsModal = false;
    document.body.style.overflow = "auto";
    render();
  };

  window.openClientProfile = function () {
    showClientProfile = true;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeClientProfile = function () {
    showClientProfile = false;
    showClientEditProfileModal = false;
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

  window.logout = function () {
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

  function handleBooking() {
    if (!selectedService || !selectedDate || !selectedTime) {
      showToast("Selecione serviço, data e horário", "error");
      return;
    }

    const isBooked = bookings.some(
      (b) =>
        b.serviceId === selectedService.id &&
        b.date === selectedDate &&
        b.time === selectedTime &&
        b.cancelled !== true,
    );

    const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${selectedTime}`;
    const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

    if (isBooked || isBlocked) {
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
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.cancelled = true;
      saveToLocalStorage();
      showToast("Agendamento cancelado", "success");
    }
    showBookingsModal = true; // reabre lista após cancelamento
    render();
  }
  window.cancelAllBookings = function () {
  bookingToCancel = "__all__";
  showBookingsModal = false; // fecha lista
  showCancelModal = true;    // abre confirmação
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
    const dayOfWeek = date.getDay();

    const isWorkingDay =
      !selectedService?.workDays || selectedService.workDays.length === 0
        ? true
        : selectedService.workDays.includes(dayOfWeek);

    const isPast = date < today && date.getDate() !== today.getDate();
    const isDisabled = isPast || !isWorkingDay;

    return `<div class="calendar-day ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}"
      onclick="${!isDisabled ? `window.selectDate('${dateStr}')` : ""}"
      style="${isDisabled ? "background-color: #ef4444; color: white; cursor: not-allowed; opacity: 0.5;" : ""}">
      ${date.getDate()}
    </div>`;
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

  function generateClientTimeSlots() {
    // Funções auxiliares para conversão de tempo
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    };

    // Gerar horários baseado no workHours e duração do serviço
    let filteredSlots = [];
    
    if (selectedService && selectedService.workHours && selectedService.workHours.start && selectedService.workHours.end) {
      const startMinutes = timeToMinutes(selectedService.workHours.start);
      const endMinutes = timeToMinutes(selectedService.workHours.end);
      const serviceDuration = selectedService.duration || 30;
      
      // Gerar slots começando do horário inicial, incrementando pela duração
      for (let timeMin = startMinutes; (timeMin + serviceDuration) <= endMinutes; timeMin += serviceDuration) {
        filteredSlots.push(minutesToTime(timeMin));
      }
    }

    let timeSlotsHtml = filteredSlots.map((time) => {
      const isBooked =
        selectedDate &&
        selectedService &&
        bookings.some(
          (b) =>
            b.serviceId === selectedService.id &&
            b.date === selectedDate &&
            b.time === time &&
            b.cancelled !== true,
        );

      const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${time}`;
      const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

      return `
        <div
            class="time-slot ${selectedTime === time ? "selected" : ""} ${isBooked || isBlocked ? "booked" : ""}"
            onclick="${!isBooked && !isBlocked && selectedDate ? `window.selectTime('${time}')` : ""}"
            style="${isBooked || isBlocked ? "background-color:#ef4444;color:white;opacity:0.5;cursor:not-allowed;" : !selectedDate ? "opacity:0.5;cursor:not-allowed;" : ""}">
            ${time}
        </div>
    `;
    }).join("");
    return timeSlotsHtml;
  }

  function updateCalendarAndTimes() {
    document.querySelectorAll(".calendar-day").forEach((el) => {
      el.classList.remove("selected");
      if (el.innerText == new Date(selectedDate).getDate()) {
        el.classList.add("selected");
      }
    });

    // Atualizar horários também
    const timeSlotsContainer = document.querySelector(".time-slots-grid");
    if (timeSlotsContainer) {
      timeSlotsContainer.innerHTML = generateClientTimeSlots();
    }
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
    bookings.forEach((b) => {
      if (b.clientId === currentUser.id) {
        b.cancelled = true;
      }
    });
    saveToLocalStorage();
    showToast("Todos os agendamentos foram cancelados", "success");

    showBookingsModal = true; // reabre lista DEPOIS de confirmar
    document.body.style.overflow = "hidden";
    render();
    return;
  }

  if (target) cancelBooking(target);
};

  let servicesHtml = mockServices
    .map(
      (service) => `
        <div class="service-card">
            <h4 style="margin-bottom: 8px;">${service.name}</h4>
            <p style="color: #6b7280; margin-bottom: 4px;">${service.provider}</p>
            <p style="color: #10b981; font-weight: bold; margin-bottom: 4px;">R$ ${service.price}</p>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Duração: ${formatDuration(service.duration)}</p>
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
    const activeBookings = userBookings.filter((b) => !b.cancelled);
    if (activeBookings.length === 0) {
      bookingsHtml = `<div class="empty-state"><div class="empty-state-icon">📅</div><p>Você ainda não tem agendamentos</p></div>`;
    } else {
      bookingsHtml = activeBookings
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
  }
  let bookingsModalHtml = "";
  if (showBookingsModal) {
    bookingsModalHtml = `
        <div class="modal-overlay" onclick="window.closeBookingsModal()">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
    <h3>Meus Agendamentos</h3>
    <div style="display:flex; gap:8px;">
        ${
          userBookings.filter((b) => b.cancelled !== true).length >= 2
            ? `
            <button onclick="window.cancelAllBookings()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; min-width:120px;">
                Cancelar todos
            </button>
        `
            : ``
        }
        <button onclick="window.closeBookingsModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">
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
    // Funções auxiliares para conversão de tempo
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    };

    // Gerar horários baseado no workHours e duração do serviço
    let filteredSlots = [];
    
    if (selectedService.workHours && selectedService.workHours.start && selectedService.workHours.end) {
      const startMinutes = timeToMinutes(selectedService.workHours.start);
      const endMinutes = timeToMinutes(selectedService.workHours.end);
      const serviceDuration = selectedService.duration || 30;
      
      // Gerar slots começando do horário inicial, incrementando pela duração
      for (let timeMin = startMinutes; (timeMin + serviceDuration) <= endMinutes; timeMin += serviceDuration) {
        filteredSlots.push(minutesToTime(timeMin));
      }
    }

    let timeSlotsHtml = filteredSlots.map((time) => {
      const isBooked =
        selectedDate &&
        selectedService &&
        bookings.some(
          (b) =>
            b.serviceId === selectedService.id &&
            b.date === selectedDate &&
            b.time === time &&
            b.cancelled !== true,
        );

      const slotKey = `${selectedService?.providerId || selectedService?.id}_${selectedDate}_${time}`;
      const isBlocked = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);

      return `
        <div
            class="time-slot ${selectedTime === time ? "selected" : ""} ${isBooked || isBlocked ? "booked" : ""}"
            onclick="${!isBooked && !isBlocked && selectedDate ? `window.selectTime('${time}')` : ""}"
            style="${isBooked || isBlocked ? "background-color:#ef4444;color:white;opacity:0.5;cursor:not-allowed;" : !selectedDate ? "opacity:0.5;cursor:not-allowed;" : ""}">
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
                        <button onclick="window.closeBookingForm()" style="padding: 10px 20px; background: #ECEFF1; border: 1px solid #B2BEC3; border-radius: 8px; cursor: pointer; color: #636E72; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Cancelar</button>
                        <button onclick="window.confirmBooking()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar Agendamento</button>
                    </div>
                </div>
            </div>
        `;
  }

  let cancelModalHtml = "";
  if (showClientCancelJustificativeModal && bookingToCancel) {
    cancelModalHtml = `
            <div class="modal-overlay" onclick="window.closeCancelModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <h3 style="margin-bottom: 12px;">Cancelar Agendamento</h3>
                    <p style="margin-bottom: 16px; color: #6b7280;">
                        Insira uma justificativa para o cancelamento. Esta mensagem será enviada ao prestador.
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                      <textarea 
                        id="clientCancelJustificativa"
                        placeholder="Motivo do cancelamento..."
                        style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; font-size: 14px; resize: vertical; min-height: 100px; box-sizing: border-box;">
                      </textarea>
                    </div>
                    
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="window.closeCancelModal()" style="padding: 8px 16px; background: #ECEFF1; border: 1px solid #B2BEC3; border-radius: 8px; cursor: pointer; color: #636E72; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Voltar</button>
                        <button onclick="window.confirmCancel()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">Confirmar Cancelamento</button>
                    </div>
                </div>
            </div>
        `;
  }

  let notificationsModalHtml = "";
  if (showNotificationsModal) {
    const cancelledByProvider = userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true);
    notificationsModalHtml = `
      <div class="modal-overlay" onclick="window.closeNotificationsModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3>🔔 Notificações</h3>
            <div style="display:flex; gap:8px;">
              ${
                cancelledByProvider.length > 0
                  ? `<button onclick="window.openClearNotificationsConfirm()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Apagar Todas</button>`
                  : ""
              }
              <button onclick="window.closeNotificationsModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Fechar</button>
            </div>
          </div>

          ${
            cancelledByProvider.length === 0
              ? '<div class="empty-state"><div class="empty-state-icon">✓</div><p>Nenhuma notificação</p></div>'
              : `<div style="display:flex; flex-direction:column; gap:12px;">
                  ${cancelledByProvider
                    .map(
                      (notification) => `
                        <div style="background:#fff3cd; border-left:4px solid #ffc107; padding:16px; border-radius:8px;">
                          <div style="margin-bottom:8px;">
                            <h4 style="margin:0 0 4px 0; color:#856404;">${notification.serviceName}</h4>
                            <p style="margin:0; color:#856404; font-size:14px;">
                              <strong>Prestador:</strong> ${notification.provider}
                            </p>
                            <p style="margin:4px 0 0 0; color:#856404; font-size:14px;">
                              📅 ${new Date(notification.date).toLocaleDateString("pt-BR")} às ${notification.time}
                            </p>
                          </div>
                          <div style="border-top:1px solid #ffeaa7; padding-top:8px; margin-top:8px;">
                            <p style="margin:0; color:#856404; font-size:13px; line-height:1.5;">
                              <strong>Motivo do cancelamento:</strong> ${notification.cancellationReason}
                            </p>
                          </div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
          }
        </div>
      </div>
    `;
  }

  let clearNotificationsConfirmModalHtml = "";
  if (showClearNotificationsConfirm) {
    clearNotificationsConfirmModalHtml = `
      <div class="modal-overlay" onclick="window.closeClearNotificationsConfirm()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width:400px;">
          <h3 style="margin-bottom:16px;">Confirmar Limpeza de Notificações</h3>
          <p style="margin-bottom:24px; color:#6b7280;">
            Tem certeza que deseja apagar TODAS as notificações? Esta ação não pode ser desfeita.
          </p>
          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeClearNotificationsConfirm()" style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">Cancelar</button>
            <button onclick="window.clearAllNotifications()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Confirmar</button>
          </div>
        </div>
      </div>
    `;
  }

  const html = `
    <div style="display:flex; min-height:100vh;">
        <aside style="width:240px; background:#111827; color:white; padding:20px;">
            <h2 style="margin-bottom:20px;">AgendaFácil</h2>
            <button onclick="window.openNotificationsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#374151; color:white; border:none; border-radius:8px; cursor:pointer;">
              🔔 Notificações ${userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true).length > 0 ? `(${userBookings.filter((b) => b.cancelled === true && b.cancelledByProvider === true && b.notificationRead !== true).length})` : ''}
            </button>
            <button onclick="window.openBookingsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#1f2937; color:white; border:none; border-radius:8px; cursor:pointer;">
            Meus Agendamentos
            </button>
            <button onclick="window.openClientProfile()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#374151; color:white; border:none; border-radius:8px; cursor:pointer;">
            Perfil
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
    ${notificationsModalHtml}
    ${clearNotificationsConfirmModalHtml}
    ${cancelModalHtml}
    ${bookingsModalHtml}
`;

  root.innerHTML = html;
}

