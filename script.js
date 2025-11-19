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
// SISTEMA DE CONVITES COM ENVIO DE E-MAIL
// ======================================================

(function initInvitesSystem() {
  const formConvite = document.getElementById('form-convite');
  const listaConvites = document.getElementById('lista-convites');
  const emptyInvites = document.getElementById('empty-invites');
  const secaoConvites = document.getElementById('convites');
  const destinoViagemSpan = document.getElementById('destino-viagem');
  const btnEnviarConvite = document.getElementById('btn-enviar-convite');
  const btnText = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  const btnEmailFallback = document.getElementById('btn-email-fallback');
  
  // Carregar convites do localStorage
  let convites = JSON.parse(localStorage.getItem('orcamtrip_convites')) || [];
  
  // Inicializar EmailJS (substitua com suas credenciais)
  // emailjs.init("YOUR_PUBLIC_KEY");
  
  // Atualizar a lista de convites
  function atualizarListaConvites() {
    // Limpar lista
    listaConvites.innerHTML = '';
    
    if (convites.length === 0) {
      // Mostrar mensagem de lista vazia
      listaConvites.appendChild(emptyInvites);
      emptyInvites.style.display = 'block';
      return;
    }
    
    // Esconder mensagem de lista vazia
    emptyInvites.style.display = 'none';
    
    // Adicionar cada convite à lista
    convites.forEach((convite, index) => {
      const conviteCard = document.createElement('div');
      conviteCard.className = 'invite-card';
      
      const statusClass = `status-${convite.status}`;
      
      conviteCard.innerHTML = `
        <div class="invite-info">
          <h4>${convite.nome}</h4>
          <p>${convite.email}</p>
          <p>Enviado em: ${new Date(convite.dataEnvio).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="invite-status">
          <span class="${statusClass}">${getStatusText(convite.status)}</span>
          <button class="btn btn-secondary" data-index="${index}">✕</button>
        </div>
      `;
      
      listaConvites.appendChild(conviteCard);
    });
    
    // Adicionar event listeners aos botões de remover
    document.querySelectorAll('.invite-card .btn-secondary').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        removerConvite(index);
      });
    });
  }
  
  // Função auxiliar para obter texto do status
  function getStatusText(status) {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceito';
      case 'declined': return 'Recusado';
      default: return 'Pendente';
    }
  }
  
  // Remover convite
  function removerConvite(index) {
    if (confirm('Tem certeza que deseja remover este convite?')) {
      convites.splice(index, 1);
      localStorage.setItem('orcamtrip_convites', JSON.stringify(convites));
      atualizarListaConvites();
    }
  }
  
  // Função para enviar e-mail com EmailJS
  function enviarEmailComEmailJS(nome, email, mensagem) {
    // Mostrar loading
    btnText.textContent = 'Enviando...';
    btnLoading.style.display = 'inline-block';
    btnEnviarConvite.disabled = true;
    
    // Parâmetros do template (ajuste conforme seu template no EmailJS)
    const templateParams = {
      to_name: nome,
      to_email: email,
      from_name: 'OrçaTrip',
      message: mensagem || `Olá ${nome}! Estou planejando uma viagem incrível com o OrçaTrip e gostaria que você participasse. Confira os detalhes da viagem!`,
      destination: destinoViagemSpan.textContent,
      reply_to: 'no-reply@orcatrip.com'
    };
    
    // Enviar e-mail (substitua com seu Service ID e Template ID)
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
      .then(function(response) {
        console.log('E-mail enviado com sucesso!', response.status, response.text);
        alert('Convite enviado com sucesso!');
      }, function(error) {
        console.error('Falha ao enviar e-mail:', error);
        alert('Falha ao enviar o convite. Tente usar a opção "Abrir cliente de e-mail" ou verifique suas credenciais do EmailJS.');
      })
      .finally(function() {
        // Restaurar botão
        btnText.textContent = 'Enviar convite';
        btnLoading.style.display = 'none';
        btnEnviarConvite.disabled = false;
      });
  }
  
  // Função para abrir cliente de e-mail nativo (fallback)
  function abrirClienteEmail(nome, email, mensagem) {
    const assunto = `Convite para viagem - ${destinoViagemSpan.textContent}`;
    const corpo = mensagem || `Olá ${nome}!\n\nEstou planejando uma viagem para ${destinoViagemSpan.textContent} com o OrçaTrip e gostaria que você participasse!\n\nAcesse o OrçaTrip para mais detalhes: [URL_DO_SITE]\n\nAguardo sua resposta!\n\nAtenciosamente,\n[SEU_NOME]`;
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = mailtoLink;
  }
  
  // Enviar novo convite
  formConvite.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome-convidado').value.trim();
    const email = document.getElementById('email-convidado').value.trim();
    const mensagem = document.getElementById('mensagem-convite').value.trim();
    
    if (!nome || !email) {
      alert('Por favor, preencha pelo menos o nome e e-mail do convidado.');
      return;
    }
    
    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    
    // Criar novo convite
    const novoConvite = {
      nome,
      email,
      mensagem,
      status: 'pending',
      dataEnvio: new Date().toISOString()
    };
    
    // Adicionar à lista
    convites.push(novoConvite);
    
    // Salvar no localStorage
    localStorage.setItem('orcamtrip_convites', JSON.stringify(convites));
    
    // Atualizar a lista
    atualizarListaConvites();
    
    // Limpar formulário
    formConvite.reset();
    
    // Tentar enviar e-mail com EmailJS
    enviarEmailComEmailJS(nome, email, mensagem);
  });
  
  // Botão fallback para abrir cliente de e-mail
  btnEmailFallback.addEventListener('click', function() {
    const nome = document.getElementById('nome-convidado').value.trim();
    const email = document.getElementById('email-convidado').value.trim();
    const mensagem = document.getElementById('mensagem-convite').value.trim();
    
    if (!nome || !email) {
      alert('Por favor, preencha pelo menos o nome e e-mail do convidado antes de usar esta opção.');
      return;
    }
    
    abrirClienteEmail(nome, email, mensagem);
  });
  
  // Inicializar a lista de convites
  atualizarListaConvites();
  
  // Função para ativar a seção de convites
  window.ativarConvites = function(destino) {
    // Atualizar o destino na seção
    destinoViagemSpan.textContent = destino;
    
    // Mostrar a seção de convites
    secaoConvites.style.display = 'block';
    
    // Rolar suavemente até a seção
    secaoConvites.scrollIntoView({ behavior: 'smooth' });
  };
})();

// ======================================================
// MODAL DE CONFIRMAÇÃO DE VIAGEM
// ======================================================

(function initModalViagem() {
  const modalViagem = document.getElementById('modal-viagem');
  const modalClose = document.getElementById('modal-close');
  const modalCancelar = document.getElementById('modal-cancelar');
  const modalConfirmar = document.getElementById('modal-confirmar');
  const modalDestino = document.getElementById('modal-destino');
  const modalOrcamento = document.getElementById('modal-orcamento');
  const modalDatas = document.getElementById('modal-datas');
  
  let destinoSelecionado = '';
  
  // Fechar modal
  function fecharModal() {
    modalViagem.classList.remove('active');
  }
  
  // Abrir modal
  window.abrirModalViagem = function(destino) {
    destinoSelecionado = destino;
    
    // Preencher informações no modal
    modalDestino.textContent = destino;
    modalOrcamento.textContent = document.getElementById('orcamento').value || 'Não informado';
    
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    
    if (dataInicio && dataFim) {
      const dataInicioFormatada = new Date(dataInicio).toLocaleDateString('pt-BR');
      const dataFimFormatada = new Date(dataFim).toLocaleDateString('pt-BR');
      modalDatas.textContent = `${dataInicioFormatada} a ${dataFimFormatada}`;
    } else {
      modalDatas.textContent = 'Não informadas';
    }
    
    // Mostrar modal
    modalViagem.classList.add('active');
  };
  
  // Event listeners para fechar modal
  modalClose.addEventListener('click', fecharModal);
  modalCancelar.addEventListener('click', fecharModal);
  
  // Fechar modal ao clicar fora
  modalViagem.addEventListener('click', function(e) {
    if (e.target === modalViagem) {
      fecharModal();
    }
  });
  
  // Confirmar viagem
  modalConfirmar.addEventListener('click', function() {
    // Fechar modal
    fecharModal();
    
    // Ativar seção de convites
    window.ativarConvites(destinoSelecionado);
    
    // Mostrar mensagem de sucesso
    alert(`Viagem para ${destinoSelecionado} confirmada com sucesso! Agora você pode convidar amigos e familiares.`);
  });
})();

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
  // Adicionei mais informações como imagem e preço
  const databaseLocais = [
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
    }
  ];

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
      <button class="btn btn-primary" style="margin-top: 1rem;" onclick="abrirModalViagem('${destination.nome}')">Planejar viagem para cá</button>
    `;
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
      .bindPopup("<b>Você está aqui!</b><br>Ponto de partida.");

    // 4. Filtra e adiciona marcadores próximos (Raio de 500km)
    databaseLocais.forEach(local => {
      const distancia = getDistanceFromLatLonInKm(lat, lng, local.lat, local.lng);
      
      // Se for menor que 500km, adiciona no mapa
      // Removi o "Destino Surpresa" para usar os locais reais
      if (distancia < 500) { // Pode ajustar este raio
        const marker = L.marker([local.lat, local.lng], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<b>${local.nome}</b><br>Aprox. ${Math.round(distancia)}km`);
        
        // Adiciona evento de clique ao marcador
        marker.on('click', () => {
          displayDestinationDetails(local);
        });
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
    console.warn("Geolocalização não é suportada pelo seu navegador.");
    // Navegador não suporta, carrega padrão
    startMap(-23.5505, -46.6333);
  }

})();