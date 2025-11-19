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


// ======================================================
// MAPA INTERATIVO COM LEAFLET (Vanilla JS)
// ======================================================

(function initMap() {
  // 1. Define ícone padrão (correção de bug comum do Leaflet em vanilla)
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  // 2. "Banco de Dados" simulado (Latitude/Longitude)
  // Aqui viriam os dados do seu Firebase
  const databaseLocais = [
    { nome: "Cristo Redentor - RJ", lat: -22.9519, lng: -43.2105, desc: "O clássico do Rio." },
    { nome: "Parque Ibirapuera - SP", lat: -23.5874, lng: -46.6576, desc: "Natureza em SP." },
    { nome: "Gramado - Centro", lat: -29.3746, lng: -50.8764, desc: "Charme da serra." },
    { nome: "Pelourinho - BA", lat: -12.9714, lng: -38.5114, desc: "História e cultura." }
  ];

  // Variável do mapa
  let map = null;

  // Função para calcular distância (Fórmula de Haversine)
  // Retorna a distância em Km entre dois pontos
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da terra em km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // 3. Inicializa o mapa
  function startMap(lat, lng) {
    // Se o elemento #map não existir na página, para tudo (evita erro)
    if (!document.getElementById('map')) return;

    // Cria o mapa centralizado no usuário
    map = L.map('map').setView([lat, lng], 12);

    // Adiciona o "azulejo" (TileLayer) do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Adiciona marcador do usuário
    L.marker([lat, lng], { icon: defaultIcon })
      .addTo(map)
      .bindPopup("<b>Você está aqui!</b><br>Ponto de partida.")
      .openPopup();

    // Adiciona um local "falso" perto do usuário só para testar a funcionalidade
    // (Removemos isso quando tiver dados reais)
    databaseLocais.push({
      nome: "Destino Surpresa Perto de Você",
      lat: lat + 0.01, // Um pouco ao lado
      lng: lng + 0.01,
      desc: "Sugestão da IA baseada na sua localização."
    });

    // 4. Filtra e adiciona marcadores próximos (Raio de 500km)
    databaseLocais.forEach(local => {
      const distancia = getDistanceFromLatLonInKm(lat, lng, local.lat, local.lng);
      
      // Se for menor que 500km, adiciona no mapa
      if (distancia < 500) {
        L.marker([local.lat, local.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<b>${local.nome}</b><br>${local.desc}<br>Aprox. ${Math.round(distancia)}km`);
      }
    });
  }

  // 5. Pede permissão de localização
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        startMap(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erro ao obter localização ou permissão negada:", error);
        // Fallback: Carrega em São Paulo se negar
        startMap(-23.5505, -46.6333);
      }
    );
  } else {
    // Navegador não suporta, carrega padrão
    startMap(-23.5505, -46.6333);
  }

})();