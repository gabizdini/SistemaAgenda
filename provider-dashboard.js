// ============================================
// DASHBOARD DO PRESTADOR
// ============================================
let showProviderProfile = false;

let showProfilePhotoPicker = false;

let showEditProfileModal = false;

let showCategoryModal = false;

function renderProviderProfileScreen() {
  const root = document.getElementById("root");

  const PROFILE_PHOTOS = [
    "./images/1.png",
    "./images/2.png",
    "./images/3.png",
    "./images/4.png",
    "./images/5.png",
  ];

  window.openPhotoPicker = function () {
    showProfilePhotoPicker = !showProfilePhotoPicker;
    render();
  };

  window.selectProfilePhoto = function (photo) {
    currentUser.profilePhoto = photo;

    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) users[userIndex].profilePhoto = photo;

    saveToLocalStorage();
    showProfilePhotoPicker = false;
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
                : `${currentUser.name?.charAt(0)?.toUpperCase() || "P"}`
            }
          </div>
          <div style="min-width:0;">
            <h2 style="margin:0; font-size:18px; line-height:1.2; color:#6C5CE7; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:700;">
              ${currentUser.name}
            </h2>
            <p style="margin:4px 0 0; color:#8E44AD; font-size:12px; font-weight:500;">
              Prestador
            </p>
          </div>
        </div>
        <button onclick="window.openProviderHome()"
          style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#f3f4f6; color:#2D3436; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#6C5CE7'; this.style.color='white'; this.style.borderColor='#6C5CE7';"
          onmouseout="this.style.background='#f3f4f6'; this.style.color='#2D3436'; this.style.borderColor='#e5e7eb';">
          <i data-lucide="arrow-left" style="width:18px; height:18px; color:#636E72;"></i> Início
        </button>
        
<p style="margin-bottom:12px; margin-top:0px; color:#9ca3af; font-size:12px; line-height:1.4;">
  Para gerenciar seus serviços<br> volte para a tela inicial
</p>
        <button onclick="window.logout()"
          style="width:100%; text-align:left; padding:10px 12px; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
          onmouseover="this.style.background='#ef4444'; this.style.color='white';"
          onmouseout="this.style.background='#fee2e2'; this.style.color='#991b1b';">
          <i data-lucide="log-out" style="width:18px; height:18px; color:#636E72;"></i> Sair
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
                  : `${currentUser.name?.charAt(0)?.toUpperCase() || "P"}`
              }
            </div>

            <div>
              <h2 style="margin:0; color:white; font-size:30px; font-weight:700;">${currentUser.name}</h2>
              <p style="margin:6px 0 0; color:#e9d5ff; font-weight:500;">Prestador de serviço</p>
            </div>
          </div>

          <div style="display:flex; gap:12px; margin-bottom:18px;">
            <button type="button" onclick="window.openPhotoPicker()"
              style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:2px solid white; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='white'; this.style.color='#6C5CE7';"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white';"
              onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              ${showProfilePhotoPicker ? "Fechar opções" : "Escolher foto"}
            </button>
            <button type="button" onclick="window.openEditProfileModal()"
              style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:2px solid white; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='white'; this.style.color='#6C5CE7';"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white';">
              Editar dados
            </button>
            <button type="button" onclick="window.openCategoryModal()"
              style="padding:10px 16px; background:rgba(255,255,255,0.2); color:white; border:2px solid white; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='white'; this.style.color='#6C5CE7';"
              onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.color='white';">
              Categoria
            </button>
            <button type="button" onclick="window.openDeleteProviderAccountModal()"
              style="padding:10px 16px; background:rgba(239,68,68,0.2); color:white; border:2px solid rgba(239,68,68,0.5); border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.3s ease;"
              onmouseover="this.style.background='#ef4444'; this.style.color='white'; this.style.borderColor='#ef4444';"
              onmouseout="this.style.background='rgba(239,68,68,0.2)'; this.style.color='white'; this.style.borderColor='rgba(239,68,68,0.5)';">
              🗑️ Deletar conta
            </button>
          </div>

          ${
            showProfilePhotoPicker
              ? `
            <div style="display:flex; gap:12px; margin-bottom:28px; flex-wrap:wrap;">
              ${PROFILE_PHOTOS.map((photo) => `
                <button type="button" onclick="window.selectProfilePhoto('${photo}')"
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
              <h3 style="margin:0; color:#6C5CE7; font-weight:700;">Prestador</h3>
            </div>

            <div style="background:rgba(255,255,255,0.95); border-radius:16px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.12); border-left:4px solid #10b981; transition:all 0.3s ease;"
              onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(108,92,231,0.2)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.12)';">
              <p style="margin:0 0 8px; color:#8E44AD; font-size:14px; font-weight:600;">Categoria</p>
              <h3 style="margin:0; color:#2D3436; font-size:16px; font-weight:700;">${currentUser.category || "Não selecionada"}</h3>
            </div>
          </div>
        </div>
      </main>
    </div>

    ${
      showEditProfileModal
        ? `
      <div class="modal-overlay" onclick="window.closeEditProfileModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 400px; width: 90%; border-top:4px solid #6C5CE7;">
          <h3 style="margin-bottom: 20px; color:#6C5CE7; font-size:20px;">✏️ Editar Perfil</h3>

          <div style="margin-bottom: 16px;">
            <label style="display:block; margin-bottom: 8px; font-weight: 600; color: #6C5CE7;">Nome completo</label>
            <input id="editProfileName" type="text" value="${currentUser.name}"
              style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box; transition:all 0.2s;"
              onfocus="this.style.borderColor='#6C5CE7'; this.style.boxShadow='0 0 0 3px rgba(108,92,231,0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display:block; margin-bottom: 8px; font-weight: 600; color: #6C5CE7;">E-mail</label>
            <input id="editProfileEmail" type="email" value="${currentUser.email}"
              style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; font-size:14px; box-sizing:border-box; transition:all 0.2s;"
              onfocus="this.style.borderColor='#6C5CE7'; this.style.boxShadow='0 0 0 3px rgba(108,92,231,0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'" />
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeEditProfileModal()" style="padding:10px 20px; background:#ECEFF1; color:#636E72; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.background='#DFE6E9';"
              onmouseout="this.style.background='#ECEFF1';">
              Cancelar
            </button>
            <button onclick="window.saveProfileChanges()" style="padding:10px 20px; background:linear-gradient(135deg,#6C5CE7 0%,#8E44AD 50%,#A29BFE 100%); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
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

    ${
      showDeleteAccountModal && accountToDelete === currentUser.id
        ? `
      <div class="modal-overlay" onclick="window.closeDeleteProviderAccountModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 450px; width: 90%; border-top:4px solid #ef4444;">
          <h3 style="margin-bottom: 20px; color:#ef4444; font-size:20px;">⚠️ Deletar Conta</h3>
          
          <div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:8px; padding:12px; margin-bottom:20px;">
            <p style="margin:0; color:#991b1b; font-size:14px; line-height:1.5;">
              ⚠️ <strong>Atenção!</strong> Esta ação é <strong>irreversível</strong>. Todos os dados, serviços e histórico serão deletados permanentemente.
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom: 8px; font-weight: 600; color: #ef4444;">Para confirmar, digite '<strong>DELETE</strong>':</label>
            <input id="deleteAccountConfirmText" type="text" placeholder="Digite DELETE aqui"
              style="width:100%; padding:12px; border:2px solid #fca5a5; border-radius:8px; font-size:14px; box-sizing:border-box; transition:all 0.2s; background:#fff5f5;"
              onfocus="this.style.borderColor='#ef4444'; this.style.boxShadow='0 0 0 3px rgba(239,68,68,0.1)'"
              onblur="this.style.borderColor='#fca5a5'; this.style.boxShadow='none'" />
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeDeleteProviderAccountModal()" style="padding:10px 20px; background:#ECEFF1; color:#636E72; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.background='#DFE6E9';"
              onmouseout="this.style.background='#ECEFF1';">
              Cancelar
            </button>
            <button onclick="window.confirmDeleteProviderAccount()" style="padding:10px 20px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(239,68,68,0.3)';"
              onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              Deletar Conta
            </button>
          </div>
        </div>
      </div>
    `
        : ""
    }

    ${
      showCategoryModal
        ? `
      <div class="modal-overlay" onclick="window.closeCategoryModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 500px; width: 90%; border-top:4px solid #6C5CE7;">
          <h3 style="margin-bottom: 20px; color:#6C5CE7; font-size:20px;">📂 Selecionar Categoria</h3>

          <p style="margin-bottom: 16px; color:#6b7280; font-size:14px;">Escolha a categoria que melhor descreve seus serviços:</p>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; margin-bottom:24px; max-height:400px; overflow-y:auto;">
            ${PROVIDER_CATEGORIES.map((category) => `
              <button type="button" onclick="window.selectCategory(${category.id})"
                style="padding:16px; border:2px solid ${currentUser.categoryId === category.id ? "#6C5CE7" : "#d1d5db"}; background:${currentUser.categoryId === category.id ? "#f0e6ff" : "white"}; border-radius:12px; cursor:pointer; transition:all 0.2s; text-align:center; font-weight:600;"
                onmouseover="this.style.borderColor='#6C5CE7'; this.style.background='#f0e6ff';"
                onmouseout="this.style.borderColor='${currentUser.categoryId === category.id ? "#6C5CE7" : "#d1d5db"}'; this.style.background='${currentUser.categoryId === category.id ? "#f0e6ff" : "white"}';">
                <div style="font-size:24px; margin-bottom:8px;">${category.emoji}</div>
                <div style="font-size:12px; color:#2D3436;">${category.name}</div>
              </button>
            `).join("")}
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button onclick="window.closeCategoryModal()" style="padding:10px 20px; background:#ECEFF1; color:#636E72; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; font-weight:600; transition:all 0.2s;"
              onmouseover="this.style.background='#DFE6E9';"
              onmouseout="this.style.background='#ECEFF1';">
              Fechar
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
window.openProviderHome = function () {
  showProviderProfile = false;
  showCreateServiceModal = false;
  showMyServicesModal = false;
  showProviderBookingsModal = false;
  showProviderCancelModal = false;
  showDeleteServiceModal = false;
  showEditProfileModal = false;
  document.body.style.overflow = "auto";
  render();
};
  window.openProviderProfile = function () {
  showProviderProfile = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeProviderProfile = function () {
  showProviderProfile = false;
  showEditProfileModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.openEditProfileModal = function () {
  showEditProfileModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeEditProfileModal = function () {
  showEditProfileModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.openCategoryModal = function () {
  showCategoryModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeCategoryModal = function () {
  showCategoryModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.selectCategory = function (categoryId) {
  const category = PROVIDER_CATEGORIES.find((c) => c.id === categoryId);
  if (category) {
    currentUser.category = category.name;
    currentUser.categoryId = categoryId;

    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].category = category.name;
      users[userIndex].categoryId = categoryId;
    }

    saveToLocalStorage();
    showToast("Categoria atualizada com sucesso!", "success");
    showCategoryModal = false;
    render();
  }
};

window.saveProfileChanges = function () {
  const newName = document.getElementById("editProfileName")?.value.trim();
  const newEmail = document.getElementById("editProfileEmail")?.value.trim();

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
  showEditProfileModal = false;
  render();
};

  window.logout = function () {
    currentUser = null;
    isLogin = true;
    saveToLocalStorage();
    render();
  };

  window.openDeleteProviderAccountModal = function () {
    showDeleteAccountModal = true;
    accountToDelete = currentUser.id;
    document.body.style.overflow = "hidden";
    render();
  };

  window.closeDeleteProviderAccountModal = function () {
    showDeleteAccountModal = false;
    accountToDelete = null;
    document.body.style.overflow = "auto";
    render();
  };

  window.confirmDeleteProviderAccount = function () {
    const confirmText = document.getElementById("deleteAccountConfirmText")?.value.trim().toUpperCase();
    
    if (confirmText !== "DELETE") {
      showToast("Digite 'DELETE' para confirmar", "error");
      return;
    }

    const deletedProviderId = currentUser.id;
    const deletedProviderName = currentUser.name;

    // Encontrar todos os agendamentos deste prestador por:
    // 1. Serviços que pertencem a este ID de prestador
    // 2. Agendamentos com o nome do prestador (para contas recriadas)
    const providerServices = services.filter((s) => s.providerId === deletedProviderId);
    const providerBookings = bookings.filter((b) => 
      providerServices.some((s) => s.id === b.serviceId) ||
      b.provider === deletedProviderName
    );

    // Marcar agendamentos como cancelados e criar notificações
    providerBookings.forEach((booking) => {
      if (booking.cancelled !== true) { // Só marcar se ainda não foi cancelado
        booking.cancelled = true;
        booking.cancelledByProviderDeleted = true;
        booking.notificationRead = false;
        booking.cancellationReason = `A conta do prestador "${deletedProviderName}" foi removida.`;
      }
    });

    // Remover usuário
    users = users.filter((u) => u.id !== deletedProviderId);
    
    // Remover serviços do prestador
    services = services.filter((s) => s.providerId !== deletedProviderId);
    
    saveToLocalStorage();
    showToast("Conta deletada com sucesso", "success");
    
    currentUser = null;
    isLogin = true;
    showDeleteAccountModal = false;
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
  selectedWorkHours = { start: "09:00", end: "18:00" };
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

window.openProviderBookingsModal = function () {
  showProviderBookingsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeProviderBookingsModal = function () {
  showProviderBookingsModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.openProviderCancelModal = function (bookingId) {
  providerBookingToCancel = bookingId;
  showProviderBookingsModal = false;
  showProviderCancelModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeProviderCancelModal = function () {
  showProviderCancelModal = false;
  providerBookingToCancel = null;
  showProviderBookingsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.confirmProviderCancel = function () {
  const justificativa = document.getElementById("cancelJustificativa")?.value.trim();
  
  if (!justificativa) {
    showToast("Por favor, insira uma justificativa", "error");
    return;
  }

  const bookingIndex = bookings.findIndex((b) => b.id === providerBookingToCancel);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].cancelled = true;
    bookings[bookingIndex].cancelledByProvider = true;
    bookings[bookingIndex].cancellationReason = justificativa;
    saveToLocalStorage();
    showToast("Agendamento cancelado com justificativa", "success");
  }

  showProviderCancelModal = false;
  slotToReopen = providerBookingToCancel;
  showReopenSlotModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.confirmReopenSlot = function () {
  if (slotToReopen) {
    const booking = bookings.find((b) => b.id === slotToReopen);
    if (booking) {
      blockedSlots = blockedSlots.filter(
        (slot) => !(slot.providerId === currentUser.id && slot.date === booking.date && slot.time === booking.time)
      );
      localStorage.setItem("agendamento_blockedSlots", JSON.stringify(blockedSlots));
    }
  }
  slotToReopen = null;
  showReopenSlotModal = false;
  showProviderBookingsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.declineReopenSlot = function () {
  if (slotToReopen) {
    const booking = bookings.find((b) => b.id === slotToReopen);
    if (booking) {
      const slotKey = `${currentUser.id}_${booking.date}_${booking.time}`;
      const exists = blockedSlots.some((slot) => `${slot.providerId}_${slot.date}_${slot.time}` === slotKey);
      if (!exists) {
        blockedSlots.push({
          bookingId: booking.id,
          providerId: currentUser.id,
          date: booking.date,
          time: booking.time,
        });
        localStorage.setItem("agendamento_blockedSlots", JSON.stringify(blockedSlots));
      }
    }
  }
  slotToReopen = null;
  showReopenSlotModal = false;
  showProviderBookingsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.openProviderNotificationsModal = function () {
  showProviderNotificationsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeProviderNotificationsModal = function () {
  showProviderNotificationsModal = false;
  document.body.style.overflow = "auto";
  render();
};

window.openProviderClearNotificationsConfirm = function () {
  showProviderNotificationsModal = false;
  showProviderClearNotificationsConfirm = true;
  document.body.style.overflow = "hidden";
  render();
};

window.closeProviderClearNotificationsConfirm = function () {
  showProviderClearNotificationsConfirm = false;
  showProviderNotificationsModal = true;
  document.body.style.overflow = "hidden";
  render();
};

window.clearAllProviderNotifications = function () {
  const providerBookings = bookings.filter((b) => {
    const service = services.find((s) => s.id === b.serviceId);
    return service && service.providerId === currentUser.id;
  });

  providerBookings.forEach((b) => {
    if (b.cancelled === true && b.cancelledByClient === true) {
      b.notificationRead = true;
    }
  });

  saveToLocalStorage();
  showToast("Notificações apagadas", "success");
  showProviderClearNotificationsConfirm = false;
  showProviderNotificationsModal = true;
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

  // Verificar se há agendamentos ativos neste serviço
  const activeBookings = bookings.filter(
    (b) => b.serviceId === serviceToDelete && b.cancelled !== true
  );

  if (activeBookings.length > 0) {
    showToast(
      `Impossível remover este serviço. Há ${activeBookings.length} agendamento(s) ativo(s). Cancele os agendamentos primeiro.`,
      "error"
    );
    return;
  }

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

    // Validar horários
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = timeToMinutes(selectedWorkHours.start);
    const endMinutes = timeToMinutes(selectedWorkHours.end);

    if (startMinutes >= endMinutes) {
      showToast("O horário de início deve ser menor que o horário de término.", "error");
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
      workHours: { ...selectedWorkHours },
    };

    services.push(newService);
    saveToLocalStorage();
    showToast("Serviço criado com sucesso!", "success");
    showCreateServiceModal = false;
    selectedWorkDays = [];
    selectedWorkHours = { start: "09:00", end: "18:00" };
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

  window.updateWorkHourStart = function (value) {
    selectedWorkHours.start = value;
    
    // Validação em tempo real
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };
    
    const startMinutes = timeToMinutes(selectedWorkHours.start);
    const endMinutes = timeToMinutes(selectedWorkHours.end);
    
    if (startMinutes >= endMinutes) {
      showToast("Horário de início deve ser menor que de término", "error");
    }
  };

  window.updateWorkHourEnd = function (value) {
    selectedWorkHours.end = value;
    
    // Validação em tempo real
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };
    
    const startMinutes = timeToMinutes(selectedWorkHours.start);
    const endMinutes = timeToMinutes(selectedWorkHours.end);
    
    if (startMinutes >= endMinutes) {
      showToast("Horário de início deve ser menor que de término", "error");
    }
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
      style="width:36px; height:36px; border:1px solid #B2BEC3; border-radius:8px; background:#ECEFF1; cursor:pointer; font-size:20px; line-height:1; color:#636E72; font-weight:600; transition:all 0.2s; display:flex; align-items:center; justify-content:center;"
      onmouseover="this.style.background='#DFE6E9';"
      onmouseout="this.style.background='#ECEFF1';">
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
      style="width:36px; height:36px; border:1px solid #B2BEC3; border-radius:8px; background:#ECEFF1; cursor:pointer; font-size:20px; line-height:1; color:#636E72; font-weight:600; transition:all 0.2s; display:flex; align-items:center; justify-content:center;"
      onmouseover="this.style.background='#DFE6E9';"
      onmouseout="this.style.background='#ECEFF1';">
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
                    border: 2px solid ${selectedWorkDays.includes(day.value) ? "#6C5CE7" : "#e5e7eb"};
                    border-radius: 10px;
                    background: ${selectedWorkDays.includes(day.value) ? "#6C5CE7" : "#f9fafb"};
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

        <div style="margin-bottom: 20px;">
          <label style="display:block; margin-bottom: 10px; font-weight: 500;">Horário de funcionamento</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label style="display:block; margin-bottom: 6px; font-size:14px; color:#6b7280;">Início</label>
              <input id="workHourStart" type="time" value="09:00" onchange="event.stopPropagation(); window.updateWorkHourStart(this.value)"
                style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px; font-size:14px;" />
            </div>
            <div>
              <label style="display:block; margin-bottom: 6px; font-size:14px; color:#6b7280;">Fim</label>
              <input id="workHourEnd" type="time" value="18:00" onchange="event.stopPropagation(); window.updateWorkHourEnd(this.value)"
                style="width:100%; padding:10px; border:2px solid #e5e7eb; border-radius:8px; font-size:14px;" />
            </div>
          </div>
          <small style="display:block; margin-top:8px; color:#6b7280;">Define a disponibilidade do serviço nesses dias</small>
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeCreateServiceModal()"
            style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">
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
          <button onclick="window.closeMyServicesModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;"
            onmouseover="this.style.background='#DFE6E9';"
            onmouseout="this.style.background='#ECEFF1';">Fechar</button>
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
                          <p style="color:#6b7280; font-size:14px;">Horário: ${service.workHours ? `${service.workHours.start} - ${service.workHours.end}` : "09:00 - 18:00"}</p>
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
let providerBookingsModalHtml = "";
if (showProviderBookingsModal) {
  providerBookingsModalHtml = `
    <div class="modal-overlay" onclick="window.closeProviderBookingsModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>Total de Agendamentos</h3>
          <button onclick="window.closeProviderBookingsModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;"
            onmouseover="this.style.background='#DFE6E9';"
            onmouseout="this.style.background='#ECEFF1';">Fechar</button>
        </div>

        ${
          providerBookings.filter((b) => !b.cancelled).length === 0
            ? '<div class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum agendamento encontrado</p></div>'
            : `<div style="display:flex; flex-direction:column; gap:10px;">
                ${providerBookings
                  .filter((b) => !b.cancelled)
                  .map(
                    (booking) => `
                      <div class="booking-item">
                        <div>
                          <h4 style="margin-bottom:4px;">${booking.serviceName}</h4>
                          <p style="color:#6b7280; font-size:14px;">Cliente: <strong>${booking.clientName}</strong></p>
                          <p style="color:#6C5CE7; font-weight:500; font-size:14px;">${new Date(booking.date).toLocaleDateString("pt-BR")} às ${booking.time}</p>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                          <span style="padding:4px 12px; background:#d1fae5; color:#065f46; border-radius:20px; font-size:14px;">
                            Confirmado
                          </span>
                          <button onclick="window.openProviderCancelModal(${booking.id})" style="padding:6px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer; font-size:12px;">
                            Cancelar
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

let providerCancelModalHtml = "";
if (showProviderCancelModal && providerBookingToCancel) {
  providerCancelModalHtml = `
    <div class="modal-overlay" onclick="window.closeProviderCancelModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 450px; width: 90%;">
        <h3 style="margin-bottom: 12px;">Cancelar Agendamento</h3>
        <p style="margin-bottom: 16px; color: #6b7280;">
          Insira uma justificativa para o cancelamento. Esta mensagem será enviada ao cliente.
        </p>
        
        <div style="margin-bottom: 20px;">
          <textarea 
            id="cancelJustificativa"
            placeholder="Motivo do cancelamento..."
            style="width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: sans-serif; font-size: 14px; resize: vertical; min-height: 100px; box-sizing: border-box;">
          </textarea>
        </div>
        
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeProviderCancelModal()" style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">
            Voltar
          </button>
          <button onclick="window.confirmProviderCancel()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  `;
}

let reopenSlotModalHtml = "";
if (showReopenSlotModal && slotToReopen) {
  reopenSlotModalHtml = `
    <div class="modal-overlay" onclick="window.declineReopenSlot()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 450px; width: 90%;">
        <h3 style="margin-bottom: 12px;">Abrir Horário Novamente?</h3>
        <p style="margin-bottom: 24px; color: #6b7280;">
          Deseja disponibilizar este horário novamente para agendamentos?
        </p>
        
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.declineReopenSlot()" style="padding:8px 16px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer;">
            Não
          </button>
          <button onclick="window.confirmReopenSlot()" style="padding:8px 16px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer;">
            Sim, abrir horário
          </button>
        </div>
      </div>
    </div>
  `;
}

let providerNotificationsModalHtml = "";
if (showProviderNotificationsModal) {
  const providerServices = services.filter((s) => s.providerId === currentUser.id);
  const cancelledByClient = bookings.filter(
    (b) =>
      b.cancelled === true &&
      b.cancelledByClient === true &&
      b.notificationRead !== true &&
      providerServices.some((s) => s.id === b.serviceId)
  );

  providerNotificationsModalHtml = `
    <div class="modal-overlay" onclick="window.closeProviderNotificationsModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:700px; width:90%; max-height:80vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>🔔 Notificações de Cancelamento</h3>
          <div style="display:flex; gap:8px;">
            ${
              cancelledByClient.length > 0
                ? `<button onclick="window.openProviderClearNotificationsConfirm()" style="padding:8px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Apagar Todas</button>`
                : ""
            }
            <button onclick="window.closeProviderNotificationsModal()" style="padding:8px 12px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;"
            onmouseover="this.style.background='#DFE6E9';"
            onmouseout="this.style.background='#ECEFF1';">Fechar</button>
          </div>
        </div>

        ${
          cancelledByClient.length === 0
            ? '<div class="empty-state"><div class="empty-state-icon">✓</div><p>Nenhuma notificação</p></div>'
            : `<div style="display:flex; flex-direction:column; gap:12px;">
                ${cancelledByClient
                  .map(
                    (notification) => `
                      <div style="background:#fef3c7; border-left:4px solid #f59e0b; padding:16px; border-radius:8px;">
                        <div style="margin-bottom:8px;">
                          <h4 style="margin:0 0 4px 0; color:#92400e;">${notification.serviceName}</h4>
                          <p style="margin:0; color:#92400e; font-size:14px;">
                            <strong>Cliente:</strong> ${notification.clientName}
                          </p>
                          <p style="margin:4px 0 0 0; color:#92400e; font-size:14px;">
                            📅 ${new Date(notification.date).toLocaleDateString("pt-BR")} às ${notification.time}
                          </p>
                        </div>
                        <div style="border-top:1px solid #fcd34d; padding-top:8px; margin-top:8px;">
                          <p style="margin:0; color:#92400e; font-size:13px; line-height:1.5;">
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

let providerClearNotificationsConfirmModalHtml = "";
if (showProviderClearNotificationsConfirm) {
  providerClearNotificationsConfirmModalHtml = `
    <div class="modal-overlay" onclick="window.closeProviderClearNotificationsConfirm()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width:400px;">
        <h3 style="margin-bottom:16px;">Confirmar Limpeza de Notificações</h3>
        <p style="margin-bottom:24px; color:#6b7280;">
          Tem certeza que deseja apagar TODAS as notificações? Esta ação não pode ser desfeita.
        </p>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeProviderClearNotificationsConfirm()" style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;"
            onmouseover="this.style.background='#DFE6E9';"
            onmouseout="this.style.background='#ECEFF1';">Cancelar</button>
          <button onclick="window.clearAllProviderNotifications()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">Confirmar</button>
        </div>
      </div>
    </div>
  `;
}

let deleteServiceModalHtml = "";
if (showDeleteServiceModal && serviceToDelete) {
  // Verificar se há agendamentos ativos neste serviço
  const activeBookings = bookings.filter(
    (b) => b.serviceId === serviceToDelete && b.cancelled !== true
  );
  const hasActiveBookings = activeBookings.length > 0;

  let warningHtml = "";
  let confirmButton = "";

  if (hasActiveBookings) {
    warningHtml = `<div style="padding: 12px; margin-bottom: 16px; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; color: #991b1b;">
      <strong>⚠️ Operação Bloqueada</strong>
      <p style="margin: 6px 0 0; font-size: 14px;">
        Este serviço possui ${activeBookings.length} agendamento(s) ativo(s). Você não pode remover um serviço com agendamentos ativos.
      </p>
      <p style="margin: 6px 0 0; font-size: 13px; color: #7f1d1d;">
        Cancele os agendamentos primeiro antes de remover o serviço.
      </p>
    </div>`;
  } else {
    confirmButton = `<button onclick="window.confirmDeleteService()" style="padding:8px 16px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
      Confirmar
    </button>`;
  }

  deleteServiceModalHtml = `
    <div class="modal-overlay" onclick="window.closeDeleteServiceModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <h3 style="margin-bottom: 12px;">Remover Serviço</h3>
        ${warningHtml}
        ${!hasActiveBookings ? `<p style="margin-bottom: 24px; color: #6b7280;">
          Tem certeza que deseja remover este serviço? Esta ação não pode ser desfeita.
        </p>` : ""}
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeDeleteServiceModal()" style="padding:8px 16px; background:#ECEFF1; border:1px solid #B2BEC3; border-radius:8px; cursor:pointer; color:#636E72; font-weight:600; transition:all 0.2s;" onmouseover="this.style.background='#DFE6E9';" onmouseout="this.style.background='#ECEFF1';">
            ${hasActiveBookings ? "Fechar" : "Cancelar"}
          </button>
          ${confirmButton}
        </div>
      </div>
    </div>
  `;
}

let editProfileModalHtml = "";
if (showEditProfileModal) {
  editProfileModalHtml = `
    <div class="modal-overlay" onclick="window.closeEditProfileModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 400px; width: 90%;">
        <h3 style="margin-bottom: 20px;">Editar Perfil</h3>

        <div style="margin-bottom: 16px;">
          <label style="display:block; margin-bottom: 8px; font-weight: 500; color: #111827;">Nome completo</label>
          <input id="editProfileName" type="text" value="${currentUser.name}"
            style="width:100%; padding:12px; border:2px solid #e5e7eb; border-radius:8px; font-size:14px; box-sizing:border-box;" />
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display:block; margin-bottom: 8px; font-weight: 500; color: #111827;">E-mail</label>
          <input id="editProfileEmail" type="email" value="${currentUser.email}"
            style="width:100%; padding:12px; border:2px solid #e5e7eb; border-radius:8px; font-size:14px; box-sizing:border-box;" />
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button onclick="window.closeEditProfileModal()" style="padding:10px 20px; background:#e5e7eb; border:none; border-radius:8px; cursor:pointer; font-weight:500;">
            Cancelar
          </button>
          <button onclick="window.saveProfileChanges()" style="padding:10px 20px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:500;">
            Confirmar
          </button>
        </div>
      </div>
    `;
  }

  const notificationCount = bookings.filter(
    (b) =>
      b.cancelled === true &&
      b.cancelledByClient === true &&
      b.notificationRead !== true &&
      providerServices.some((s) => s.id === b.serviceId)
  ).length;

  const html = `
    <div style="display:flex; min-height:100vh;">
      <aside style="width:240px; background:#111827; color:white; padding:20px;">
        <h2 style="margin-bottom:20px;">AgendaFácil</h2>

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
  <div style="width:44px; height:44px; border-radius:50%; overflow:hidden; flex:0 0 auto; background:linear-gradient(135deg, #6C5CE7 0%, #8E44AD 50%, #A29BFE 100%); display:flex; align-items:center; justify-content:center; color:white; font-size:18px; font-weight:700;">
    ${
      currentUser.profilePhoto
        ? `<img src="${currentUser.profilePhoto}" alt="Foto de perfil" style="width:100%; height:100%; object-fit:cover;">`
        : `${currentUser.name?.charAt(0)?.toUpperCase() || "P"}`
    }
  </div>

  <div style="min-width:0;">
    <h2 style="margin:0; font-size:18px; line-height:1.2; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
      ${currentUser.name}
    </h2>
    <p style="margin:4px 0 0; color:#cbd5e1; font-size:12px;">
      Prestador de serviço
    </p>
  </div>
</div>
<button onclick="window.openProviderProfile()"
          style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#374151; color:white; border:none; border-radius:8px; cursor:pointer;">
          <i data-lucide="user" style="width:18px; height:18px; color:#636E72;"></i> Perfil
        </button>

        <button onclick="window.openProviderNotificationsModal()" style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#374151; color:white; border:none; border-radius:8px; cursor:pointer;">
          <i data-lucide="bell" style="width:18px; height:18px; color:#636E72;"></i> Notificações ${notificationCount > 0 ? "(" + notificationCount + ")" : ""}
        </button>

        <button onclick="window.openCreateServiceModal()"
          style="width:100%; text-align:left; padding:10px 12px; margin-bottom:10px; background:#1f2937; color:white; border:none; border-radius:8px; cursor:pointer;">
          <i data-lucide="plus-circle" style="width:18px; height:18px; color:#636E72;"></i> Criar serviço
        </button>

        <button onclick="window.logout()"
          style="width:100%; text-align:left; padding:10px 12px; background:#ef4444; color:white; border:none; border-radius:8px; cursor:pointer;">
          <i data-lucide="log-out" style="width:18px; height:18px; color:#636E72;"></i> Sair
        </button>
        <button id="themeToggle" class="theme-btn">
          <i data-lucide="${isDarkMode ? 'sun' : 'moon'}" class="icon"></i>
        </button>
      </aside>
      </aside>

      <main style="flex:1;">
        <div class="container">
          <h2 style="margin-bottom:8px; color:#ffffff;">Olá, ${currentUser.name}!</h2>
          <p style="color:#d1d5db; margin-bottom:24px;">Dashboard do Prestador</p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; margin-bottom:28px;">
            <div onclick="window.openProviderBookingsModal()" style="background:white; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:transform 0.2s; hover:transform scale(1.02);">
              <div style="font-size:28px; margin-bottom:8px;">📅</div>
              <h3>Total de Agendamentos</h3>
              <p style="font-size:30px; font-weight:700; color:#6C5CE7;">${providerBookings.filter((b) => b.cancelled !== true).length}</p>
              <p style="font-size:12px; color:#6b7280; margin-top:6px;">Clique para ver</p>
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
          providerBookings.filter((b) => !b.cancelled).length === 0
            ? '<div class="empty-state"><div class="empty-state-icon">📋</div><p>Nenhum agendamento encontrado</p></div>'
            : `<div style="display:flex; flex-direction:column; gap:10px;">
                ${providerBookings
                  .filter((b) => !b.cancelled)
                  .map(
                    (booking) => `
                      <div class="booking-item">
                        <div>
                          <h4 style="margin-bottom:4px;">${booking.serviceName}</h4>
                          <p style="color:#6b7280; font-size:14px;">Cliente: <strong>${booking.clientName}</strong></p>
                          <p style="color:#6C5CE7; font-weight:500; font-size:14px;">${new Date(booking.date).toLocaleDateString("pt-BR")} às ${booking.time}</p>
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
    ${providerBookingsModalHtml}
    ${providerCancelModalHtml}
    ${reopenSlotModalHtml}
    ${providerNotificationsModalHtml}
    ${providerClearNotificationsConfirmModalHtml}
    ${deleteServiceModalHtml}
    ${editProfileModalHtml}
  `;

  root.innerHTML = html;
}

