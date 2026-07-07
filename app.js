/* ============ GLOBAL STATE ============ */
const state = {
  lang: "uz",
  theme: "dark",
  view: "welcome",
  role: "player",
  authMode: "signin",
  isAuthed: false,
  selectedPitch: null,
  ownerPitches: [],
  bookingsTab: "upcoming",
};

/* ============ VIEW SWITCHING ============ */
function setView(viewName) {
  document.querySelectorAll(".view").forEach((el) => el.classList.add("hidden"));
  const target = document.getElementById("view-" + viewName);
  if (target) target.classList.remove("hidden");
  state.view = viewName;

  const nav = document.getElementById("topNav");
  const floating = document.getElementById("floatingControls");
  if (viewName === "welcome") {
    nav.classList.add("hidden");
    floating.classList.remove("hidden");
  } else {
    nav.classList.remove("hidden");
    floating.classList.add("hidden");
  }

  const signInBtn = document.getElementById("navSignInBtn");
  const signOutBtn = document.getElementById("navSignOutBtn");
  const dashboardBtn = document.getElementById("navDashboardBtn");
  if (signInBtn) signInBtn.classList.toggle("hidden", state.isAuthed);
  if (signOutBtn) signOutBtn.classList.toggle("hidden", !state.isAuthed);
  if (dashboardBtn) dashboardBtn.classList.toggle("hidden", !state.isAuthed);

  if (viewName === "browse") renderBrowse();
  if (viewName === "pitch-detail") renderPitchDetail();
  if (viewName === "player-dashboard") renderBookings();
  if (viewName === "owner-dashboard") renderOwnerDashboard();

  window.scrollTo(0, 0);
}

/* ============ THEME ============ */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  document.querySelectorAll(".theme-icon").forEach((el) => {
    el.textContent = state.theme === "dark" ? "☀️" : "🌙";
  });
}

document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
  });
});

/* ============ LANGUAGE ============ */
function applyLang() {
  document.documentElement.setAttribute("lang", state.lang);
  document.querySelectorAll(".lang-label").forEach((el) => { el.textContent = state.lang.toUpperCase(); });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });

  document.querySelectorAll(".lang-option").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-lang") === state.lang);
  });

  if (state.view === "browse") renderBrowse();
  if (state.view === "pitch-detail") renderPitchDetail();
  if (state.view === "player-dashboard") renderBookings();
  if (state.view === "owner-dashboard") renderOwnerDashboard();
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const menu = btn.parentElement.querySelector(".lang-menu");
    document.querySelectorAll(".lang-menu").forEach((m) => { if (m !== menu) m.classList.add("hidden"); });
    menu.classList.toggle("hidden");
  });
});
document.querySelectorAll(".lang-option").forEach((el) => {
  el.addEventListener("click", () => {
    state.lang = el.getAttribute("data-lang");
    applyLang();
    document.querySelectorAll(".lang-menu").forEach((m) => m.classList.add("hidden"));
  });
});
document.addEventListener("click", () => document.querySelectorAll(".lang-menu").forEach((m) => m.classList.add("hidden")));

/* ============ NAV ============ */
document.getElementById("navLogo").addEventListener("click", () => setView("landing"));
document.getElementById("navSignInBtn").addEventListener("click", () => setView("auth"));
document.getElementById("navSignOutBtn").addEventListener("click", () => {
  state.isAuthed = false;
  setView("welcome");
});
document.getElementById("navDashboardBtn").addEventListener("click", () => {
  setView(state.role === "owner" ? "owner-dashboard" : "browse");
});

/* ============ WELCOME SCREEN ============ */
document.getElementById("welcomeStartBtn").addEventListener("click", () => setView("auth"));
document.getElementById("welcomeGuestBtn").addEventListener("click", () => setView("landing"));

/* ============ LANDING ============ */
document.getElementById("heroFindBtn").addEventListener("click", () => setView("browse"));
document.getElementById("heroOwnerBtn").addEventListener("click", () => {
  state.role = "owner";
  setAuthRole("owner");
  setView("auth");
});
document.getElementById("ctaBandBtn").addEventListener("click", () => setView("auth"));

/* ============ AUTH ============ */
function setAuthRole(role) {
  state.role = role;
  document.getElementById("roleBtnPlayer").classList.toggle("active", role === "player");
  document.getElementById("roleBtnOwner").classList.toggle("active", role === "owner");
}
document.getElementById("roleBtnPlayer").addEventListener("click", () => setAuthRole("player"));
document.getElementById("roleBtnOwner").addEventListener("click", () => setAuthRole("owner"));

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === "signup";
  document.getElementById("authTitle").setAttribute("data-i18n", isSignup ? "signup_title" : "signin_title");
  document.getElementById("authSubmitBtn").setAttribute("data-i18n", isSignup ? "signup_btn" : "signin_btn");
  document.getElementById("switchModePrompt").setAttribute("data-i18n", isSignup ? "have_account" : "no_account");
  document.getElementById("switchModeLink").setAttribute("data-i18n", isSignup ? "signin_link" : "signup_free");
  document.getElementById("signupOnlyFields").classList.toggle("hidden", !isSignup);
  document.getElementById("signupOnlyPhone").classList.toggle("hidden", !isSignup);
  document.getElementById("signupOnlyConfirm").classList.toggle("hidden", !isSignup);
  document.getElementById("forgotRow").classList.toggle("hidden", isSignup);
  applyLang();
}
document.getElementById("switchModeLink").addEventListener("click", () => {
  setAuthMode(state.authMode === "signup" ? "signin" : "signup");
});
document.getElementById("authSubmitBtn").addEventListener("click", () => {
  state.isAuthed = true;
  setView(state.role === "owner" ? "owner-dashboard" : "browse");
});

/* ============ BROWSE ============ */
function renderBrowse() {
  const districtSel = document.getElementById("districtFilter");
  const formatSel = document.getElementById("formatFilter");

  districtSel.innerHTML = `<option value="all">${t("district")}: ${t("all")}</option>` +
    DISTRICTS.map((d) => `<option value="${d}">${d}</option>`).join("");
  formatSel.innerHTML = `<option value="all">${t("format")}: ${t("all")}</option>` +
    FORMATS.map((f) => `<option value="${f}">${f}</option>`).join("");

  drawPitchGrid();

  document.getElementById("searchInput").oninput = drawPitchGrid;
  districtSel.onchange = drawPitchGrid;
  formatSel.onchange = drawPitchGrid;
}

function drawPitchGrid() {
  const query = (document.getElementById("searchInput").value || "").toLowerCase();
  const district = document.getElementById("districtFilter").value;
  const format = document.getElementById("formatFilter").value;

  const filtered = initialPitches.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(query) || p.district.toLowerCase().includes(query);
    const matchDistrict = district === "all" || district === undefined || p.district === district;
    const matchFormat = format === "all" || format === undefined || p.format === format;
    return matchQuery && matchDistrict && matchFormat;
  });

  document.getElementById("resultsCount").textContent = `${filtered.length} ${t("results")}`;

  document.getElementById("pitchGrid").innerHTML = filtered.map((p) => `
    <div class="card pitch-card">
      <div class="pitch-thumb">⚽</div>
      <div class="pitch-body">
        <div class="pitch-top">
          <h3>${p.name}</h3>
          <div class="pitch-rating">⭐ ${p.rating}</div>
        </div>
        <div class="pitch-loc">📍 ${p.district}</div>
        <div class="pitch-tags">
          <span class="badge">${p.format}</span>
          ${p.amenities.slice(0, 2).map((a) => `<span class="badge">${a}</span>`).join("")}
        </div>
        <div class="pitch-bottom">
          <div><span class="pitch-price">${p.price.toLocaleString()}</span> <span class="pitch-price-unit">so'm/${t("per_hour")}</span></div>
          <button class="pitch-book-btn" data-pitch-id="${p.id}">${t("book_now")}</button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".pitch-book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-pitch-id"));
      state.selectedPitch = initialPitches.find((p) => p.id === id);
      setView("pitch-detail");
    });
  });
}

/* ============ PITCH DETAIL / BOOKING ============ */
let selectedSlot = null;

document.getElementById("backToBrowseBtn").addEventListener("click", () => setView("browse"));
document.getElementById("backHomeBtn").addEventListener("click", () => setView("player-dashboard"));

function renderPitchDetail() {
  const p = state.selectedPitch;
  if (!p) return;
  selectedSlot = null;

  document.getElementById("pitchDetailContent").innerHTML = `
    <div class="detail-thumb">⚽</div>
    <div class="detail-top">
      <h1>${p.name}</h1>
      <div class="detail-rating">⭐ ${p.rating} <span style="color:var(--text-muted);font-weight:500;">(${p.reviews})</span></div>
    </div>
    <div class="detail-loc">📍 ${p.district}, Tashkent</div>
    <div class="detail-tags">
      <span class="badge badge-accent">${p.format}</span>
      ${p.amenities.map((a) => `<span class="badge">${a}</span>`).join("")}
    </div>
    <h3 class="slots-title">${t("available_slots")} — ${t("today")}</h3>
    <div class="slots-grid" id="slotsGrid">
      ${slotsToday.map((s) => {
        const isBooked = bookedSlots.includes(s);
        return `<button class="slot-btn ${isBooked ? "booked" : ""}" data-slot="${s}" ${isBooked ? "disabled" : ""}>${s}</button>`;
      }).join("")}
    </div>
    <div id="bookingSummaryWrap"></div>
  `;

  document.querySelectorAll(".slot-btn:not(.booked)").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSlot = btn.getAttribute("data-slot");
      document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      renderBookingSummary(p);
    });
  });
}

function renderBookingSummary(p) {
  document.getElementById("bookingSummaryWrap").innerHTML = `
    <div class="card booking-summary">
      <h4>${t("booking_summary")}</h4>
      <div class="summary-row"><span>${p.name}</span><span>${t("today")}, ${selectedSlot}</span></div>
      <div class="summary-total"><span>${t("total")}</span><span>${p.price.toLocaleString()} so'm</span></div>
      <button class="btn btn-primary btn-full" id="confirmBookingBtn">${t("confirm_booking")}</button>
    </div>
  `;
  document.getElementById("confirmBookingBtn").addEventListener("click", () => setView("booking-success"));
}

/* ============ PLAYER DASHBOARD ============ */
document.getElementById("tabUpcoming").addEventListener("click", () => { state.bookingsTab = "upcoming"; renderBookings(); });
document.getElementById("tabPast").addEventListener("click", () => { state.bookingsTab = "past"; renderBookings(); });

function renderBookings() {
  document.getElementById("tabUpcoming").classList.toggle("active", state.bookingsTab === "upcoming");
  document.getElementById("tabPast").classList.toggle("active", state.bookingsTab === "past");

  const list = mockBookings.filter((b) =>
    state.bookingsTab === "upcoming" ? b.status !== "completed" : b.status === "completed"
  );

  const statusLabel = { confirmed: t("status_confirmed"), pending: t("status_pending"), completed: t("status_completed") };

  const container = document.getElementById("bookingsList");
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>${t("no_bookings")}</h3>
        <p>${t("no_bookings_sub")}</p>
        <button class="btn btn-primary" id="emptyFindBtn">${t("cta_find")}</button>
      </div>`;
    document.getElementById("emptyFindBtn").addEventListener("click", () => setView("browse"));
  } else {
    container.innerHTML = list.map((b) => `
      <div class="list-row">
        <div>
          <h4>${b.pitch}</h4>
          <div class="list-row-meta">⏰ ${b.date} · ${b.time}</div>
        </div>
        <span class="badge ${b.status === "confirmed" ? "badge-accent" : ""}">${statusLabel[b.status]}</span>
      </div>
    `).join("");
  }
}

/* ============ OWNER DASHBOARD ============ */
document.getElementById("showAddPitchBtn").addEventListener("click", () => {
  document.getElementById("addPitchForm").classList.remove("hidden");
});
document.getElementById("cancelPitchBtn").addEventListener("click", () => {
  document.getElementById("addPitchForm").classList.add("hidden");
});
document.getElementById("savePitchBtn").addEventListener("click", () => {
  const name = document.getElementById("newPitchName").value.trim();
  const address = document.getElementById("newPitchAddress").value.trim();
  const price = document.getElementById("newPitchPrice").value.trim();
  const format = document.querySelector("#newPitchFormatRow .pill.active")?.getAttribute("data-format") || "5x5";
  if (!name || !address || !price) return;

  state.ownerPitches.push({ id: Date.now(), name, address, price, format });
  document.getElementById("newPitchName").value = "";
  document.getElementById("newPitchAddress").value = "";
  document.getElementById("newPitchPrice").value = "";
  document.getElementById("addPitchForm").classList.add("hidden");

  const notice = document.getElementById("pitchAddedNotice");
  notice.classList.remove("hidden");
  setTimeout(() => notice.classList.add("hidden"), 3000);

  renderOwnerDashboard();
});

function renderOwnerDashboard() {
  const hasPitches = state.ownerPitches.length > 0;

  document.getElementById("ownerStats").innerHTML = `
    <div class="card stat-card">
      <div class="stat-icon">📅</div>
      <div class="stat-value">${hasPitches ? "12" : "0"}</div>
      <div class="stat-label">${t("owner_bookings_week")}</div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon">💰</div>
      <div class="stat-value">${hasPitches ? "2,160,000" : "0"}</div>
      <div class="stat-label">${t("owner_revenue")}</div>
    </div>
    <div class="card stat-card">
      <div class="stat-icon">📈</div>
      <div class="stat-value">${hasPitches ? "64%" : "0%"}</div>
      <div class="stat-label">${t("owner_occupancy")}</div>
    </div>
  `;

  document.getElementById("showAddPitchBtn").classList.toggle("hidden", !hasPitches);

  document.getElementById("newPitchFormatRow").innerHTML = FORMATS.map((f, i) =>
    `<button class="pill ${i === 0 ? "active" : ""}" data-format="${f}">${f}</button>`
  ).join("");
  document.querySelectorAll("#newPitchFormatRow .pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#newPitchFormatRow .pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const listEl = document.getElementById("ownerPitchesList");
  if (!hasPitches) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🏟️</div>
        <h3>${t("no_pitches")}</h3>
        <p>${t("no_pitches_sub")}</p>
        <button class="btn btn-primary" id="emptyAddPitchBtn">${t("add_pitch")}</button>
      </div>`;
    document.getElementById("emptyAddPitchBtn").addEventListener("click", () => {
      document.getElementById("addPitchForm").classList.remove("hidden");
    });
  } else {
    listEl.innerHTML = state.ownerPitches.map((p) => `
      <div class="list-row">
        <div>
          <h4>${p.name}</h4>
          <div class="list-row-meta">📍 ${p.address}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="badge">${p.format}</span>
          <span style="font-size:14px;font-weight:800;">${Number(p.price).toLocaleString()} so'm</span>
        </div>
      </div>
    `).join("");
  }
}

// This guarantees all files are completely loaded before applying translations
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  applyLang();
  setView("welcome");
});
