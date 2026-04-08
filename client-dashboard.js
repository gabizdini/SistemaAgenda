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
    saveToLocalStorage();
    showToast("Todos os agendamentos foram cancelados", "success");

    showBookingsModal = true; // reabre lista DEPOIS de confirmar
    document.body.style.overflow = "hidden";
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
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

