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

// === Função Helper para formatar moeda BRL ===
function formatBRL(number) {
    if (typeof number !== 'number') return 'N/A';
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// === Função que simula a IA/Algoritmo de Otimização (RFS02) - AGORA RESPEITA O BUDGET ===
function getRecommendationData(userBudget, budgetLevel, prefs) {
  const allDestinations = [
    // Destino Luxo/Praia (Alto)
    {
      name: "Jericoacoara (CE)",
      desc: "Luxo e natureza! Praias paradisíacas e experiências exclusivas.",
      transport: {
          icon: "✈️",
          type: "Aéreo e Transfer",
          details: "Voo direto para Fortaleza (FOR) + Transfer Privativo. R$ 1.800 - R$ 2.500 (por pessoa).",
          link: "https://www.google.com/search?q=passagens+aereas+para+jericoacoara"
      },
      accommodation: {
          icon: "🏨",
          type: "Pousada Premium",
          details: "Pousada Vila Kalango ou similar (com piscina e café da manhã). R$ 450 - R$ 900/noite (assumindo 3 noites).",
          link: "https://www.booking.com/searchresults.pt-br.html?ss=Jericoacoara"
      },
      events: {
          icon: "🗺️",
          type: "Experiência Exclusiva",
          details: "Passeio de Buggy completo (Litoral Leste/Oeste) e pôr do sol na Duna. R$ 300 - R$ 500.",
          link: "https://www.google.com/search?q=passeio+buggy+jericoacoara"
      },
      min_estimate: 3000, 
      max_estimate: 6000, 
    },
    // Destino Natureza/Aventura (Médio)
    {
      name: "Chapada Diamantina (BA)",
      desc: "Trilhas, cachoeiras e ecoturismo, com opções de hospedagem sustentável.",
      transport: {
        icon: "🚌",
        type: "Rodoviário / Aéreo Econômico",
        details: "Ônibus de Salvador até Lençóis ou voo para Valença + transfer. R$ 400 - R$ 1.000 (ida e volta).",
        link: "https://www.buson.com.br/passagens-onibus/salvador-ba/lencois-ba"
      },
      accommodation: {
        icon: "⛺",
        type: "Pousada Simples",
        details: "Pousadas e Hostels em Lençóis ou Vale do Capão. R$ 150 - R$ 250/noite (assumindo 3 noites).",
        link: "https://www.booking.com/searchresults.pt-br.html?ss=Chapada+Diamantina"
      },
      events: {
        icon: "🧭",
        type: "Guias e Trilhas",
        details: "Visita à Pratinha, Gruta Azul e Cachoeira da Fumaça (Guias Locais). R$ 150 - R$ 250/dia.",
        link: "https://www.google.com/search?q=guias+chapada+diamantina+pre%C3%A7os"
      },
      min_estimate: 1500, 
      max_estimate: 3000,  
    },
    // Destino Cultura/Histórico (Baixo/Geral)
    {
      name: "Olinda & Recife Antigo (PE)",
      desc: "Roteiro cultural e histórico, ideal para viajantes com orçamento controlado.",
      transport: {
        icon: "✈️",
        type: "Aéreo Low-Cost",
        details: "Voo para Recife (REC) + metrô/Uber local. R$ 300 - R$ 800 (ida e volta).",
        link: "https://www.google.com/search?q=passagens+aereas+para+recife"
      },
      accommodation: {
        icon: "🏘️",
        type: "Hostel / Airbnb",
        details: "Hostel no Recife Antigo ou Pousada simples em Olinda. R$ 80 - R$ 150/noite (assumindo 3 noites).",
        link: "https://www.airbnb.com.br/s/Olinda--PE"
      },
      events: {
        icon: "🎨",
        type: "Patrimônio e Museus",
        details: "Visita ao Marco Zero e Embaixada dos Bonecos Gigantes. R$ 20 - R$ 50.",
        link: "https://www.google.com/search?q=eventos+recife+antigo+fim+de+semana"
      },
      min_estimate: 800, 
      max_estimate: 2000,  
    }
  ];

  // 1. FILTRO PRINCIPAL: Retorna APENAS os destinos onde o custo MÁXIMO respeita o orçamento do usuário.
  let filteredSuggestions = allDestinations.filter(d => d.max_estimate <= userBudget);

  if (filteredSuggestions.length > 0) {
    return filteredSuggestions;
  } 
  
  // 2. FALLBACK: Se o filtro estrito falhar (o orçamento é baixo demais),
  // tentamos retornar a opção mais barata, SE o usuário puder pagar pelo menos o custo MÍNIMO.
  
  const cheapest = allDestinations.reduce((prev, current) => (prev.max_estimate < current.max_estimate) ? prev : current);
  
  if (cheapest.min_estimate <= userBudget) {
    // Se o custo MÍNIMO está dentro do orçamento.
    cheapest.desc += " *Atenção: A estimativa máxima **excede seu orçamento** informado, mas a mínima está dentro. Otimize os gastos com hospedagem e transporte!*";
    return [cheapest];
  }

  // Se nem o custo mínimo da opção mais barata é atingido.
  return [];
}


// === Envio: exige os 4 campos preenchidos e agora exibe os resultados (Simulação RFS02) ===
const form = document.getElementById("form-viagem");
const recommendationsSection = document.getElementById("recommendations");
const recommendationContent = document.getElementById("recommendation-content");
const centerBtn = document.querySelector(".center-btn"); 

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const orcamentoVal = document.getElementById("orcamento").value.trim();
  const dataInicioVal = document.getElementById("dataInicio").value.trim();
  const dataFimVal = document.getElementById("dataFim").value.trim();
  const preferenciasVal = document.getElementById("preferencias").value.trim();
  
  // 1. Validação
  if (!orcamentoVal || !dataInicioVal || !dataFimVal || !preferenciasVal) {
    alert("Por favor, preencha orçamento, datas e preferências.");
    return;
  }
  if (new Date(dataFimVal) < new Date(dataInicioVal)) {
    alert("A data de retorno deve ser posterior à data de início.");
    return;
  }
  
  // 2. Preparação de Dados e Estado de Carregamento
  recommendationContent.innerHTML = '';
  recommendationsSection?.classList.add("hidden-section");
  centerBtn.innerHTML = '<button class="btn btn-primary lg loading" disabled>Gerando Roteiro... <span class="loader"></span></button>';

  // Converte o orçamento: Remove caracteres não numéricos e transforma em Reais (divisão por 100)
  const orcamentoNumericoString = orcamentoVal.replace(/\D/g, "");
  const orcamentoNumerico = parseInt(orcamentoNumericoString) / 100;

  const budgetLevel = orcamentoNumerico > 5000 ? "Alto" : (orcamentoNumerico > 2000 ? "Médio" : "Baixo");
  const prefs = preferenciasVal.toLowerCase();
  
  // 3. Simulação da IA (RFS02)
  setTimeout(() => {
    
    // 3.2. Gerar sugestões detalhadas, respeitando o limite
    const suggestions = getRecommendationData(orcamentoNumerico, budgetLevel, prefs);
    
    // 3.3. Monta o HTML
    let html = '';
    if (suggestions.length === 0) {
        html = '<p>Não encontramos sugestões. Seu orçamento é muito baixo ou restritivo para os roteiros de custo mínimo que sugerimos. Tente aumentar o orçamento ou mudar as preferências.</p>';
    } else {
        html = suggestions.map(s => `
            <article class="recommendation-card">
                <h3>${s.name}</h3>
                <p>${s.desc}</p>
                
                <div class="rec-details">
                    <div class="rec-item">
                        <strong>${s.transport.icon} ${s.transport.type}</strong>
                        ${s.transport.details}
                        <a href="${s.transport.link}" target="_blank">Buscar passagens no Google</a>
                    </div>
                    
                    <div class="rec-item">
                        <strong>${s.accommodation.icon} Hospedagem (${s.accommodation.type})</strong>
                        ${s.accommodation.details}
                        <a href="${s.accommodation.link}" target="_blank">Ver opções de reserva</a>
                    </div>

                    <div class="rec-item">
                        <strong>${s.events.icon} Eventos/Atrações (${s.events.type})</strong>
                        ${s.events.details}
                        <a href="${s.events.link}" target="_blank">Ver mais detalhes</a>
                    </div>
                </div>

                <span class="total-price">Gasto Estimado (Total): ${formatBRL(s.min_estimate)} - ${formatBRL(s.max_estimate)}</span>
            </article>
        `).join('');
    }
    
    recommendationContent.innerHTML = html;
    recommendationsSection?.classList.remove("hidden-section");
    
    // 4. Retorna o botão ao normal e scroll para os resultados
    centerBtn.innerHTML = '<button class="btn btn-primary lg" type="submit" form="form-viagem">Gerar ideias de viagem</button>';
    recommendationsSection?.scrollIntoView({ behavior: 'smooth' });
    
  }, 2000); // Simula 2 segundos de processamento da IA
});


// === Simulação de Banco de Dados de Eventos e Melhores Datas (RFS08) ===
const eventsDatabase = {
    "Rio de Janeiro (RJ)": {
        best_time: "Março a Maio (após o Carnaval, clima ameno e mais barato).",
        events: [
            "Carnaval (Fevereiro/Março): Maior espetáculo da Terra.",
            "Rock in Rio (Setembro - bianual): Festival de música.",
            "Réveillon em Copacabana (Dezembro): Queima de fogos épica."
        ]
    },
    "Gramado (RS)": {
        best_time: "Março a Maio (outono, temperaturas amenas e menos lotado) ou Setembro/Início de Outubro.",
        events: [
            "Natal Luz (Novembro a Janeiro): Espetáculos natalinos famosos (mais caro).",
            "Festival de Cinema de Gramado (Agosto): Principal evento cinematográfico do Brasil."
        ]
    },
    "Salvador (BA)": {
        best_time: "Abril a Junho (fim da alta temporada e clima agradável).",
        events: [
            "Carnaval de Salvador (Fevereiro/Março): Maior festa de rua do mundo.",
            "Festa de Iemanjá (2 de Fevereiro): Grande celebração religiosa."
        ]
    },
    "Fernando de Noronha (PE)": {
        best_time: "Agosto a Outubro (período de seca e melhor visibilidade para mergulho).",
        events: [
            "Semana de Noronha (Setembro): Evento de esportes aquáticos e aventura.",
            "Temporada de tartarugas (Jan-Jun): chances de ver a desova."
        ]
    }
};

// === Nova Função para Gerar Sugestões de Datas e Eventos ===
function generateBestDates(destinationName) {
    const data = eventsDatabase[destinationName];
    if (!data) {
        return {
            title: destinationName,
            content: `<p>Dados de melhor época e eventos não disponíveis para este destino.</p>`
        };
    }

    const eventsList = data.events.map(event => `<li>${event}</li>`).join('');

    const htmlContent = `
        <div class="date-card">
            <h4>Época Ideal</h4>
            <span class="best-dates">${data.best_time}</span>
            <h4>Principais Eventos/Atrações</h4>
            <ul>
                ${eventsList}
            </ul>
        </div>
        <div class="date-card">
            <h4>Dicas de Orçamento</h4>
            <p><strong>Evite:</strong> Datas de eventos grandes (como Carnaval) aumentam o custo em até 300%.</p>
            <p><strong>Prefira:</strong> Viajar na baixa temporada (Março, Maio, Setembro, Outubro) fora de feriados para economizar nas passagens e hospedagem.</p>
        </div>
    `;

    return {
        title: destinationName,
        content: htmlContent
    };
}


// === Event Listener para Destinos Populares (RFS08) ===
const popularDestinationsGrid = document.getElementById("popular-destinations-grid");
const dateSuggestionsSection = document.getElementById("date-suggestions");
const datesDestinationName = document.getElementById("dates-destination-name");
const dateSuggestionsContent = document.getElementById("date-suggestions-content");

if (popularDestinationsGrid) {
    popularDestinationsGrid.addEventListener("click", (e) => {
        const target = e.target.closest(".check-dates-btn");
        if (target) {
            const destination = target.dataset.destination;
            const result = generateBestDates(destination);

            datesDestinationName.textContent = result.title;
            dateSuggestionsContent.innerHTML = result.content;
            
            dateSuggestionsSection.classList.remove("hidden-section");
            dateSuggestionsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}


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
// MAPA INTERATIVO COM LEAFLET (Vanilla JS) - SIMULAÇÃO GOOGLE PLACES API
// ======================================================

/**
 * SIMULAÇÃO DE INTEGRAÇÃO COM GOOGLE PLACES API
 * Esta função simula uma chamada assíncrona para a API de Nearby Search 
 * do Google Places para buscar atrações turísticas.
 * * Em uma aplicação real:
 * 1. Você faria uma requisição `fetch` usando a URL de Nearby Search.
 * 2. O parâmetro `radius` (em metros) e a `key` (chave de API) seriam cruciais.
 * 3. O resultado seria um JSON que você transformaria em objetos de destino.
 * * @param {number} lat - Latitude central.
 * @param {number} lng - Longitude central.
 * @param {number} radius - Raio de busca em metros (simulado, padrão 500km).
 * @returns {Promise<Array>} - Retorna a lista de locais (dados mockados).
 */
async function fetchTouristSpotsFromAPI(lat, lng, radius = 500000) {
    // --- CÓDIGO REAL DA API (COMENTADO) ---
    // Exemplo de endpoint:
    // const apiKey = "SUA_CHAVE_SECRETA_AQUI"; 
    // const type = "tourist_attraction";
    // const realApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
    
    // try {
    //    const response = await fetch(realApiUrl);
    //    const data = await response.json();
    //    // Mapear data.results para o formato esperado pelo seu front-end
    //    // return data.results.map(place => ({ nome: place.name, lat: place.geometry.location.lat, ... }));
    // } catch (error) {
    //    console.error("Erro na chamada real da API:", error);
    //    return [];
    // }
    // --- FIM CÓDIGO REAL ---


    // Simulação do resultado (mock data - MANTIDO):
    const apiResponseResults = [
        { 
            id: 1, 
            nome: "Cristo Redentor - RJ", 
            lat: -22.9519, 
            lng: -43.2105, 
            desc: "O icônico Cristo Redentor, com vistas deslumbrantes do Rio de Janeiro e da Baía de Guanabara.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Corcovado_-_Cristo_Redentor_%282019%29.jpg/800px-Corcovado_-_Cristo_Redentor_%282019%29.jpg",
            preco: "A partir de R$ 90 (ingresso)" 
        },
        { 
            id: 2, 
            nome: "Parque Ibirapuera - SP", 
            lat: -23.5874, 
            lng: -46.6576, 
            desc: "Um dos maiores e mais importantes parques urbanos de São Paulo, perfeito para lazer e cultura.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Parque_Ibirapuera_-_Vista_do_lago_principal.jpg/1280px-Parque_Ibirapuera_-_Vista_do_lago_principal.jpg",
            preco: "Gratuito" 
        },
        { 
            id: 3, 
            nome: "Gramado - Rua Torta", 
            lat: -29.3752, 
            lng: -50.8769, 
            desc: "A famosa Rua Torta de Gramado, com seu paisagismo encantador e arquitetura europeia.",
            imagem: "https://viajandocomamigas.com.br/wp-content/uploads/2023/07/Rua-torta-gramado-com-flores-scaled.jpg",
            preco: "Gratuito" 
        },
        { 
            id: 4, 
            nome: "Pelourinho - BA", 
            lat: -12.9714, 
            lng: -38.5114, 
            desc: "O centro histórico de Salvador, Patrimônio Mundial da UNESCO, vibrante com suas cores e sons.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pelourinho_-_Salvador%2C_Bahia%2C_Brasil.jpg/1280px-Pelourinho_-_Salvador%2C_Bahia%2C_Brasil.jpg",
            preco: "Gratuito (algumas atrações pagas)" 
        },
        // PONTOS ADICIONADOS NA REQUISIÇÃO ANTERIOR
        {
            id: 5,
            nome: "Cataratas do Iguaçu - PR",
            lat: -25.6961, 
            lng: -54.4357, 
            desc: "Uma das Sete Maravilhas Naturais do Mundo. Experiência imperdível de ecoturismo e força da natureza.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Iguazu_Falls%2C_Argentina%2C_01.jpg/1280px-Iguazu_Falls%2C_Argentina%2F1280px-Iguazu_Falls%2C_Argentina%2C_01.jpg",
            preco: "A partir de R$ 88 (ingresso)"
        },
        {
            id: 6,
            nome: "Praia da Pipa - RN",
            lat: -6.2198, 
            lng: -35.0450, 
            desc: "Litoral nordestino com falésias e águas claras. Perfeito para surf, observação de golfinhos e vida noturna agitada.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Praia_de_Pipa.jpg/1280px-Praia_de_Pipa.jpg",
            preco: "Gratuito (passeios opcionais pagos)"
        },
        {
            id: 7,
            nome: "Inhotim - MG",
            lat: -20.1264, 
            lng: -44.2045, 
            desc: "O maior centro de arte contemporânea a céu aberto da América Latina, em meio a um jardim botânico espetacular.",
            imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Inhotim_-_Galeria_Adriana_Varej%C3%A3o.jpg/1280px-Inhotim_-_Galeria_Adriana_Varej%C3%A3o.jpg",
            preco: "A partir de R$ 50 (ingresso)"
        }
    ];

    // Simula a latência da rede
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(apiResponseResults);
        }, 500); 
    });
}


(function initMap() {
  // 1. Define ícone padrão (correção de bug comum do Leaflet em vanilla)
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  // Elemento onde os detalhes serão exibidos
  const destinationDetailsDiv = document.getElementById('destination-details');

  // Variável do mapa
  let map = null;

  // Função para calcular distância (Fórmula de Haversine)
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

  // Função para exibir detalhes do destino
  function displayDestinationDetails(destination) {
    destinationDetailsDiv.innerHTML = `
      <h3>${destination.nome}</h3>
      <img src="${destination.imagem}" alt="${destination.nome}" class="details-image" loading="lazy">
      <p class="details-text">${destination.desc}</p>
      <p class="details-price">Preço: ${destination.preco}</p>
      <a href="#form-viagem" class="btn btn-primary" style="margin-top: 1rem;">Planejar viagem para cá</a>
    `;
  }

  // 3. Inicializa o mapa (agora é uma função assíncrona)
  async function startMap(lat, lng) {
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
      .bindPopup("<b>Você está aqui!</b><br>Ponto de partida.");

    // 4. CHAMA A FUNÇÃO QUE SIMULA A API
    try {
        // Chamada assíncrona para buscar os pontos de interesse (simulando Places API)
        const databaseLocais = await fetchTouristSpotsFromAPI(lat, lng); 
        
        databaseLocais.forEach(local => {
            // Filtra por locais próximos à localização do usuário (500km)
            const distancia = getDistanceFromLatLonInKm(lat, lng, local.lat, local.lng);
            
            if (distancia < 500) { 
                const marker = L.marker([local.lat, local.lng], { icon: defaultIcon })
                    .addTo(map)
                    .bindPopup(`<b>${local.nome}</b><br>Aprox. ${Math.round(distancia)}km`);
                
                // Adiciona evento de clique ao marcador
                marker.on('click', () => {
                    displayDestinationDetails(local);
                });
            }
        });

    } catch (error) {
        console.error("Erro ao buscar pontos turísticos (Simulação de API):", error);
    }
  }

  // 5. Pede permissão de localização
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Chama a função assíncrona
        startMap(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erro ao obter localização ou permissão negada:", error);
        // Fallback: Carrega em São Paulo se negar
        startMap(-23.5505, -46.6333);
      }
    );
  } else {
    console.warn("Geolocalização não é suportada pelo seu navegador.");
    // Navegador não suporta, carrega padrão
    startMap(-23.5505, -46.6333);
  }

})();