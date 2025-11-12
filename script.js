// === Rotator do fundo do HERO (6s) ===
(function initHeroRotator() {
  const slides = document.querySelectorAll(".hero-bg .slide");
  if (!slides.length) return;

  // Pré-carrega imagens
  slides.forEach((s) => {
    const i = new Image();
    const url = s.style.backgroundImage.slice(5, -2);
    i.src = url;
  });

  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 6000);
})();

// === Máscara BRL (somente números + "R$ 2.000") ===
const orcamento = document.getElementById("orcamento");
if (orcamento) {
  orcamento.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    e.target.value = v ? "R$ " + Number(v).toLocaleString("pt-BR") : "";
  });
  orcamento.addEventListener("keypress", (e) => {
    if (!/[0-9]/.test(e.key)) e.preventDefault();
  });
}

// === Datas: hoje como mínimo + retorno >= início ===
const dataInicio = document.getElementById("dataInicio");
const dataFim = document.getElementById("dataFim");
if (dataInicio && dataFim) {
  const hoje = new Date().toISOString().split("T")[0];
  dataInicio.min = hoje;
  dataFim.min = hoje;

  dataInicio.addEventListener("change", () => {
    dataFim.min = dataInicio.value || hoje;
    if (dataFim.value && new Date(dataFim.value) < new Date(dataInicio.value)) {
      dataFim.value = "";
    }
  });
}

// === Envio: exige os 4 campos preenchidos ===
const form = document.getElementById("form-viagem");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const campos = ["orcamento", "dataInicio", "dataFim", "preferencias"];
  const faltando = campos.filter(
    (id) => !document.getElementById(id).value.trim()
  );
  if (faltando.length) {
    alert("Por favor, preencha orçamento, datas e preferências.");
    return;
  }
  if (new Date(dataFim.value) < new Date(dataInicio.value)) {
    alert("A data de retorno deve ser posterior à data de início.");
    return;
  }
  alert(
    "Perfeito! A IA da OrçaTrip está gerando ideias personalizadas para você!"
  );
});

// === Chat flutuante (Chat Orça) ===
const chatToggle = document.getElementById("chat-toggle");
const chatContainer = document.getElementById("chat-container");
const chatClose = document.getElementById("chat-close");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatToggle.addEventListener("click", () =>
  chatContainer.classList.toggle("open")
);
chatClose?.addEventListener("click", () =>
  chatContainer.classList.remove("open")
);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg(text, "user");
  chatInput.value = "";
  setTimeout(() => {
    const respostas = [
      "Ótima pergunta! Nossa IA está pronta para ajudar.",
      "Você pode ajustar orçamento e datas quando quiser.",
      "Estamos testando novas rotas para seu perfil!",
      "Obrigado por conversar comigo 😊",
    ];
    addMsg(respostas[Math.floor(Math.random() * respostas.length)], "bot");
  }, 700);
});

function addMsg(text, tipo) {
  const el = document.createElement("div");
  el.className = `msg ${tipo}`;
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
