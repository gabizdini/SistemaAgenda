// ============================================
// DASHBOARD DO PRESTADOR
// ============================================

function renderProviderDashboard() {
  const root = document.getElementById("root");
  const providerServices = services.filter(
    (s) => s.providerId === currentUser.id,
  );

  const providerBookings = bookings.filter(
    (b) =>
      providerServices.some((s) => s.id === b.serviceId) ||
      b.provider === currentUser.name,
  );

  window.logout = function () {
    currentUser = null;
    isLogin = true;
    saveToLocalStorage();
    render();
  };

  window.openCreateServiceModal = function () {
  selectedWorkDays = [];
  showCreateServiceModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeCreateServiceModal = function () {
  showCreateServiceModal = false;
  selectedWorkDays = [];
  document.body.style.overflow = "auto";
  render();
};

window.openMyServicesModal = function () {
  showMyServicesModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeMyServicesModal = function () {
  showMyServicesModal = false;
  document.body.style.overflow = "auto";
  render();
};
window.openDeleteServiceModal = function (serviceId) {
  serviceToDelete = serviceId;
  showMyServicesModal = false; // fecha "Meus Serviços"
  showDeleteServiceModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeDeleteServiceModal = function () {
  showDeleteServiceModal = false;
  serviceToDelete = null;
  document.body.style.overflow = "hidden";
  showMyServicesModal = true; // reabre lista
  render();
};

window.confirmDeleteService = function () {
  if (!serviceToDelete) return;

  services = services.filter((s) => s.id !== serviceToDelete);
  bookings = bookings.filter((b) => b.serviceId !== serviceToDelete);

  saveToLocalStorage();
  showToast("Serviço removido com sucesso!", "success");

  showDeleteServiceModal = false;
  serviceToDelete = null;
  showMyServicesModal = true; // reabre a lista
  document.body.style.overflow = "auto";
  render();
};
  window.toggleWorkDay = function (day, el) {
  const index = selectedWorkDays.indexOf(day);

  if (index >= 0) {
    selectedWorkDays.splice(index, 1);
    el.classList.remove("selected");
  } else {
    selectedWorkDays.push(day);
    el.classList.add("selected");
  }
};

  window.createService = function () {
    const name = document.getElementById("serviceName")?.value.trim();
    const duration = parseInt(
      document.getElementById("serviceDuration")?.value,
      10,
    );
    const price = parseFloat(document.getElementById("servicePrice")?.value);

    if (
      !name ||
      Number.isNaN(duration) ||
      Number.isNaN(price) ||
      duration <= 0 ||
      price <= 0
    ) {
      showToast("Preencha nome, duração e preço corretamente.", "error");
      return;
    }

    if (selectedWorkDays.length === 0) {
      showToast("Selecione ao menos 1 dia de trabalho.", "error");
      return;
    }

    const newService = {
      id: Date.now(),
      name,
      duration,
      price,
      providerId: currentUser.id,
      provider: currentUser.name,
      workDays: [...selectedWorkDays],
    };

    services.push(newService);
    saveToLocalStorage();
    showToast("Serviço criado com sucesso!", "success");
    showCreateServiceModal = false;
    selectedWorkDays = [];
    document.body.style.overflow = "auto";
    render();
  };
  window.changeDuration = function (delta) {
  const input = document.getElementById("serviceDuration");
  const label = document.getElementById("serviceDurationLabel");
  if (!input) return;

  let value = parseInt(input.value, 10);
  if (Number.isNaN(value)) value = 60;

  value = Math.max(15, Math.min(240, value + delta)); // 15min até 4h
  input.value = String(value);

  if (label) label.textContent = formatDuration(value);
};

  const createServiceModalHtml = showCreateServiceModal
  ? `
    <div class="modal-overlay" onclick="window.closeCreateServiceModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px; width: 90%;">
        <h3 style="margin-bottom: 16px;">Criar novo serviço</h3>

        <div style="margin-bottom: 12px;">
          <label style="display:block; margin-bottom: 6px; font-weight: 500;">Nome do serviço</label>
          <input id="serviceName" type="text" placeholder="Ex: Corte masculino"
            style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px;" />
        </div>

        <div style="margin-bottom: 12px;">
  <label style="display:block; margin-bottom: 6px; font-weight: 500;">Duração</label>

  <div style="display:flex; align-items:center; gap:8px;">
    <button
      type="button"
      onclick="event.stopPropagation(); window.changeDuration(-15)"
      style="width:36px; height:36px; border:none; border-radius:8px; background:#e5e7eb; cursor:pointer; font-size:20px; line-height:1;">
      −
    </button>

    <input
      id="serviceDuration"
      type="text"
      value="60"
      readonly
      style="flex:1; text-align:center; padding:10px; border:2px solid #e5e7eb; border-radius:8px; font-weight:600;" />

    <button
      type="button"
      onclick="event.stopPropagation(); window.changeDuration(15)"
      style="width:36px; height:36px; border:none; border-radius:8px; background:#e5e7eb; cursor:pointer; font-size:20px; line-height:1;">
      +
    </button>
  </div>

  <small id="serviceDurationLabel" style="display:block; margin-top:6px; color:#6b7280;">1h</small>
</div>

        <div style="margin-bottom: 16px;">
          <label style="display:block; margin-bottom: 6px; font-weight: 500;">Preço (R$)</label>
          <input id="servicePrice" type="number" min="0.01" step="0.01" placeholder="Ex: 50"
            style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px;" />
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display:block; margin-bottom: 8px; font-weight: 500;">Dias de trabalho</label>
          <div style="display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:8px;">
            ${WEEK_DAYS.map(
              (day) => `
                <button
                  type="button"
                  onclick="event.stopPropagation(); window.toggleWorkDay(${day.value}, this)"
                  class="work-day-btn ${selectedWorkDays.includes(day.value) ? "selected" : ""}"
                  style="
                    aspect-ratio: 1 / 1;
                    border: 2px solid ${selectedWorkDays.includes(day.value) ? "#667eea" : "#e5e7eb"};
                    border-radius: 10px;
                    background: ${selectedWorkDays.includes(day.value) ? "#667eea" : "#f9fafb"};
                    color: ${selectedWorkDays.includes(day.value) ? "white" : "#111827"};
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 600;
                  ">
                  ${day.short}
                </button>
              `,
            ).join("")}
          </div>
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
  `
  : "";

  let myServicesModalHtml = "";
if (showMyServicesModal) {
  myServicesModalHtml = `
    <div class="modal-overlay" onclick="window.closeMyServicesModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>Meus Serviços</h3>
          <button onclick="window.closeMyServicesModal()" style="padding:8px 12px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">Fechar</button>
        </div>

        ${
          providerServices.length === 0
            ? '<div class="empty-state"><div class="empty-state-icon">📦</div><p>Nenhum serviço criado ainda</p></div>'
            : `<div style="display:flex; flex-direction:column; gap:10px;">
                ${providerServices
                  .map(
                    (service) => `
                      <div class="booking-item">
                        <div>
                          <h4 style="margin-bottom:4px;">${service.name}</h4>
                          <p style="color:#6b7280; font-size:14px;">Duração: ${formatDuration(service.duration)}</p>
                          <p style="color:#6b7280; font-size:14px;">Dias: ${Array.isArray(service.workDays) ? service.workDays.map((d) => WEEK_DAYS.find((w) => w.value === d)?.short).filter(Boolean).join(", ") : "-"}</p>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
  <span style="padding:4px 12px; background:#d1fae5; color:#065f46; border-radius:20px; font-size:14px;">
    R$ ${service.price}
  </span>
  <button
    onclick="window.openDeleteServiceModal(${service.id})"
    style="padding:6px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; font-size:12px;">
    Remover
  </button>
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
let deleteServiceModalHtml = "";
if (showDeleteServiceModal && serviceToDelete) {
  deleteServiceModalHtml = `
    <div class="modal-overlay" onclick="window.closeDeleteServiceModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <h3 style="margin-bottom: 12px;">Remover Serviço</h3>
        <p style="margin-bottom: 24px; color: #6b7280;">
          Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita.
        </p>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeDeleteServiceModal()" style="padding:8px 16px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">
            Cancelar
          </button>
          <button onclick="window.confirmDeleteService()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `;
}
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

            <div onclick="window.openMyServicesModal()" style="background:white; border-radius:12px; padding:20px; text-align:center; cursor:pointer;">
  <div style="font-size:28px; margin-bottom:8px;">🛠️</div>
  <h3>Meus Serviços</h3>
  <p style="font-size:30px; font-weight:700; color:#10b981;">${providerServices.length}</p>
  <p style="font-size:12px; color:#6b7280; margin-top:6px;">Clique para ver</p>
</div>
          </div>

          <div>
            <h3 style="margin-bottom:12px; color:#ffffff;">Próximos Agendamentos</h3>
            ${
              providerBookings.length === 0
                ? '<div class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum agendamento encontrado</p></div>'
                : `<div style="display:flex; flex-direction:column; gap:10px;">
                    ${providerBookings
                      .map(
                        (booking) => `
                          <div class="booking-item">
                            <div>
                              <h4 style="margin-bottom:4px;">${booking.serviceName}</h4>
                              <p style="color:#6b7280; font-size:14px;">Cliente: ${booking.clientName}</p>
                              <p style="color:#667eea; font-weight:500; font-size:14px;">${new Date(booking.date).toLocaleDateString("pt-BR")} às ${booking.time}</p>
                            </div>
                            <span style="padding:4px 12px; background:#d1fae5; color:#065f46; border-radius:20px; font-size:14px;">
                              Confirmado
                            </span>
                          </div>
                        `,
                      )
                      .join("")}
                  </div>`
            }
          </div>
        </div>
      </main>
    </div>

    ${createServiceModalHtml} 
    ${myServicesModalHtml}
    ${deleteServiceModalHtml}
  `;

  root.innerHTML = html;
}

