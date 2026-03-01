const XP_POR_DIFICULTAD = { easy: 10, normal: 25, hard: 50 };

const RANGOS = [
  { nombre: "⬡ Novice",    min: 0,   max: 99,       hint: "Necesitas 100 XP para ser Warrior" },
  { nombre: "⚔ Warrior",   min: 100, max: 299,       hint: "Necesitas 300 XP para ser Champion" },
  { nombre: "★ Champion",  min: 300, max: Infinity,  hint: "¡Rango máximo alcanzado!" }
];

const ETIQUETA_DIFICULTAD = { easy: "Fácil", normal: "Normal", hard: "Difícil" };

var misiones = [];
var totalXP  = 0;

function createMission() {
  var nombre      = document.getElementById("inp-name").value.trim();
  var descripcion = document.getElementById("inp-desc").value.trim();
  var dificultad  = document.getElementById("inp-diff").value;

  if (nombre === "") {
    showToast("⚠ Escribe un nombre para la misión");
    return;
  }

  var mision = {
    id:          Date.now(),
    nombre:      nombre,
    descripcion: descripcion,
    dificultad:  dificultad,
    xp:          XP_POR_DIFICULTAD[dificultad],
    status:      "PENDING"
  };

  console.log("Nueva misión creada:", mision);

  misiones.push(mision);
  renderMisiones();
  showToast("Misión \"" + nombre + "\" creada ✦");

  document.getElementById("inp-name").value = "";
  document.getElementById("inp-desc").value = "";
  document.getElementById("inp-diff").value = "normal";
}

function completarMision(id) {
  var mision = null;
  for (var i = 0; i < misiones.length; i++) {
    if (misiones[i].id === id) { mision = misiones[i]; break; }
  }
  if (mision === null || mision.status === "SUCCESFUL") return;

  mision.status = "SUCCESFUL";
  totalXP += mision.xp;

  renderMisiones();
  actualizarXP();
  showToast("🎉 +" + mision.xp + " XP — ¡Misión completada!");
}

function renderMisiones() {
  var lista       = document.getElementById("mission-list");
  var estadoVacio = document.getElementById("empty-state");
  var contador    = document.getElementById("mission-count");

  lista.innerHTML = "";
  estadoVacio.style.display = misiones.length === 0 ? "block" : "none";
  contador.textContent = misiones.length;

  for (var i = 0; i < misiones.length; i++) {
    var m     = misiones[i];
    var hecha = m.status === "SUCCESFUL";
    var li    = document.createElement("li");

    li.className = "mission-card" + (hecha ? " done" : "");
    li.innerHTML =
      "<div class='card-row'>" +
        "<span class='mission-name'>" + escaparHtml(m.nombre) + "</span>" +
        "<div class='badge-row'>" +
          "<span class='badge b-" + m.dificultad + "'>" + ETIQUETA_DIFICULTAD[m.dificultad] + "</span>" +
          "<span class='badge b-xp'>+" + m.xp + " XP</span>" +
          (hecha ? "<span class='badge b-done'>✔ SUCCESFUL</span>" : "") +
        "</div>" +
      "</div>" +
      (m.descripcion ? "<p class='mission-desc'>" + escaparHtml(m.descripcion) + "</p>" : "") +
      (!hecha ? "<button class='btn-complete' onclick='completarMision(" + m.id + ")'>Marcar como completada</button>" : "");

    lista.appendChild(li);
  }
}

function actualizarXP() {
  document.getElementById("xp-counter").textContent = totalXP + " XP";

  var rangoActual = RANGOS[0];
  for (var i = 0; i < RANGOS.length; i++) {
    if (totalXP >= RANGOS[i].min) rangoActual = RANGOS[i];
  }

  document.getElementById("rank-badge").textContent = rangoActual.nombre;
  document.getElementById("rank-hint").textContent  = rangoActual.hint;

  var pct = rangoActual.max === Infinity ? 100
    : Math.min(100, ((totalXP - rangoActual.min) / (rangoActual.max - rangoActual.min + 1)) * 100);

  document.getElementById("xp-fill").style.width = pct + "%";
}

var timerToast = null;
function showToast(mensaje) {
  var toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");
  if (timerToast) clearTimeout(timerToast);
  timerToast = setTimeout(function() { toast.classList.remove("show"); }, 2800);
}

function escaparHtml(texto) {
  return texto.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

renderMisiones();
actualizarXP();
