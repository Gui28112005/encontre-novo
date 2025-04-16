document.addEventListener("DOMContentLoaded", async () => {
  const comercioList = document.getElementById("comercio-list");
  const searchInput = document.getElementById("searchInput");
  const categoriaTextoEl = document.getElementById("categoriaSelecionadaTexto");
  const loading = document.getElementById("loading");
  const comercioSection = document.getElementById("comercio-list");

  window.allComercios = [];

  async function carregarComercios(categoria = "todos") {
    try {
      if (loading) loading.style.display = "flex";

      let url = "https://encontreoficialback.azurewebsites.net/comercios";
      if (categoria !== "todos") {
        url += `?categoria=${encodeURIComponent(categoria)}`;
      }

      const response = await fetch(url);
      const comercios = await response.json();

      window.allComercios = comercios;

      renderComercios(comercios);
    } catch (error) {
      console.error("Erro ao carregar comércios:", error);
      if (comercioList) {
        comercioList.innerHTML = `
          <div class="erro-animado">
               <div class="icone-alerta">⚠️</div>
            <p>Não foi possível carregar os comércios 😢</p>
             <small>estamos em manutenção 🛠️ por favor, tente novamente mais tarde.</small>
          </div>
        `;
      }
    } finally {
      if (loading) loading.style.display = "none";
    }
  }

  function renderComercios(comercios) {
    if (!comercioList) return;

    comercioList.innerHTML = "";

    if (comercios.length === 0) {
      comercioList.innerHTML = `
        <div class="no-results">
          <div class="icon">⚠️</div>
          <p>Nenhum comércio encontrado.</p>
        </div>
      `;
      return;
    }

    comercios.forEach((comercio, index) => {
      const comercioItem = document.createElement("div");
      comercioItem.classList.add("comercio-card");

      let imagens = [];
      if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
      if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
      if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

      let imagensHtml = imagens
        .map(
          (img, i) => `
            <img src="${img}" class="comercio-imagem ${
            i === 0 ? "active" : ""
          }" data-index="${i}" />
          `
        )
        .join("");

      let controlsHtml =
        imagens.length > 1
          ? `
              <button class="prev">&#10094;</button>
              <button class="next">&#10095;</button>
            `
          : "";

      let socialLinksHtml = `
          <div class="comercio-links">
            <a href="${comercio.link_facebook || "#"}" target="_blank"
              class="btn-social ${comercio.link_facebook ? "" : "disabled"}"
              onclick="registrarClique('${comercio.id}', 'facebook', '${
        comercio.nome
      }')">Facebook</a>
            <a href="${comercio.link_instagram || "#"}" target="_blank"
              class="btn-social ${comercio.link_instagram ? "" : "disabled"}"
              onclick="registrarClique('${comercio.id}', 'instagram', '${
        comercio.nome
      }')">Instagram</a>
            <a href="${comercio.link_site_pessoal || "#"}" target="_blank"
              class="btn-social ${comercio.link_site_pessoal ? "" : "disabled"}"
              onclick="registrarClique('${comercio.id}', 'site', '${
        comercio.nome
      }')">Site</a>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              comercio.endereco
            )}"
              target="_blank"
              class="btn-social ${comercio.endereco ? "" : "disabled"}"
              onclick="registrarClique('${comercio.id}', 'maps', '${
        comercio.nome
      }')">Maps</a>
          </div>
        `;

      comercioItem.innerHTML = `
        <div class="comercio-card-content">
          <h3>${comercio.nome}</h3>
          <div class="carrossel" id="carrossel-${index}">
            ${imagensHtml}
            ${controlsHtml}
          </div>
          <div id="detalhes-${
            comercio.id
          }" class="detalhes" style="display:none">
            </p>
            <p><strong>🌎 Categoria:</strong> ${comercio.categoria}
            </p>
            <p><strong>🏬 Endereço:</strong> ${comercio.endereco}
            </p>
<p>
  <strong>⏰ Horário:</strong>
  <span id="horario-texto-${comercio.id}">
    ${
      comercio.horario_funcionamento
        ? comercio.horario_funcionamento.length > 40
          ? comercio.horario_funcionamento.slice(0, 40) + "..."
          : comercio.horario_funcionamento
        : "Não informado"
    }
  </span>
  ${
    comercio.horario_funcionamento && comercio.horario_funcionamento.length > 40
      ? `<button onclick="alternarHorario(${comercio.id})" id="btn-horario-${comercio.id}" class="btn-ver-mais">Ver mais</button>`
      : ""
  }
</p>


            <p><strong>☎️ Contato:</strong> ${
              comercio.contato || "Não disponível"
            }</p>
            <p><strong>💵 Pagamentos Aceitos:</strong> ${
              comercio.formas_pagamento || "Não disponível"
            }</p>
            ${socialLinksHtml}
                  <button onclick="compartilharComercio(${
                    comercio.id
                  })" class="btn-compartilhar">
           Compartilhar comércio 🔗
           </button>
           <small style="font-size: 11px; color: #999; display: block; margin-top: 8px; text-align: center;">
  Informações obtidas de fontes públicas e usuários. 
</small>
<small style="font-size: 11px; color: #999; display: block; text-align: center;">
  É responsável por este local? 
  <a href="https://forms.gle/6cqeckUSu5jhPuXUA" target="_blank" style="color: #007bff;">Atualize aqui</a>.
</small>

          </div>
        </div>
      `;

      comercioList.appendChild(comercioItem);

      if (imagens.length > 1) {
        const carrossel = comercioItem.querySelector(".carrossel");
        const prevButton = carrossel.querySelector(".prev");
        const nextButton = carrossel.querySelector(".next");

        prevButton?.addEventListener("click", () => mudarImagem(carrossel, -1));
        nextButton?.addEventListener("click", () => mudarImagem(carrossel, 1));

        iniciarCarrossel(carrossel);
      }
    });
  }

  function mudarImagem(carrossel, direction) {
    const imagens = carrossel.querySelectorAll(".comercio-imagem");
    let activeIndex = Array.from(imagens).findIndex((img) =>
      img.classList.contains("active")
    );
    imagens[activeIndex].classList.remove("active");

    let newIndex = (activeIndex + direction + imagens.length) % imagens.length;
    imagens[newIndex].classList.add("active");
  }

  function iniciarCarrossel(carrossel) {
    setInterval(() => mudarImagem(carrossel, 1), 3000);
  }

  window.performSearch = function () {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      renderComercios(allComercios);
      return;
    }
    const filtered = allComercios.filter(
      (comercio) =>
        (comercio.nome && comercio.nome.toLowerCase().includes(query)) ||
        (comercio.categoria &&
          comercio.categoria.toLowerCase().includes(query)) ||
        (comercio.endereco &&
          comercio.endereco.toLowerCase().includes(query)) ||
        (comercio.descricao && comercio.descricao.toLowerCase().includes(query))
    );
    renderComercios(filtered);
  };

  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoriaSelecionada = category.getAttribute("data-category");
      carregarComercios(categoriaSelecionada);

      if (comercioSection) {
        comercioSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      const categoriaTexto = category.querySelector("h3")?.innerText;
      if (categoriaTextoEl) {
        categoriaTextoEl.innerText = `Comércios de ${categoriaTexto}`;
      }
    });
  });

  carregarComercios();
});

// Funções globais
window.toggleFavorite = function (comercioId) {
  const icon = document.getElementById(`favorite-icon-${comercioId}`);
  if (icon.classList.contains("fas")) {
    icon.classList.remove("fas");
    icon.classList.add("far");
  } else {
    icon.classList.remove("far");
    icon.classList.add("fas");
  }
};

window.toggleMenu = function () {
  document.getElementById("nav").classList.toggle("show");
};

window.scrollCategorias = function (direction) {
  const container = document.querySelector(".categories");
  const scrollAmount = 300;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
};

window.verMais = function (comercioId) {
  const detalhes = document.getElementById(`detalhes-${comercioId}`);
  const btn = document.querySelector(
    `button[onclick="verMais(${comercioId})"]`
  );

  if (detalhes.style.display === "none" || detalhes.style.display === "") {
    detalhes.style.display = "block";
    if (btn) btn.textContent = "Ver menos";
  } else {
    detalhes.style.display = "none";
    if (btn) btn.textContent = "Ver mais";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o cookie já foi aceito
  if (getCookie("privacyAccepted") === "true") {
    document.getElementById("privacyPopup").style.display = "none";
  } else {
    document.getElementById("privacyPopup").style.display = "block"; // Exibe o pop-up
  }
});

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function acceptPrivacy() {
  const checkbox = document.getElementById("privacyCheckbox");
  if (!checkbox.checked) {
    alert("Por favor, marque a caixa para aceitar a política de privacidade.");
    return;
  }
  setCookie("privacyAccepted", "true", 30);
  document.getElementById("privacyPopup").style.display = "none";
}

function openPopup() {
  const popup = document.getElementById("privacyPopup");
  popup.style.display = "flex"; // Exibir o popup corretamente
}

function closePopup() {
  const popup = document.getElementById("privacyPopup");
  popup.style.display = "none"; // Ocultar o popup
}
window.compartilharComercio = function (comercioId) {
  const comercio = window.allComercios.find((c) => c.id === comercioId);
  if (!comercio) return;

  const texto = `${comercio.nome}\n${
    comercio.descricao || ""
  }\nVeja mais no Encontre!`;
  const url = `${window.location.origin}/comercio.html?id=${comercioId}`;

  if (navigator.share) {
    navigator
      .share({
        title: comercio.nome,
        text: texto,
        url: url,
      })
      .then(() => console.log("Compartilhado com sucesso"))
      .catch((err) => console.error("Erro ao compartilhar:", err));
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
  }
};
function scrollCategorias(direction) {
  const container = document.getElementById("categories");
  const scrollAmount = 300; // pixels a rolar por clique

  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
}
window.alternarHorario = function (comercioId) {
  const comercio = window.allComercios.find((c) => c.id === comercioId);
  if (!comercio) return;

  const span = document.getElementById(`horario-texto-${comercioId}`);
  const botao = document.getElementById(`btn-horario-${comercioId}`);

  const completo = comercio.horario_funcionamento;
  const reduzido = completo.slice(0, 40) + "...";

  const estaExpandido = span.textContent === completo;

  span.textContent = estaExpandido ? reduzido : completo;
  botao.textContent = estaExpandido ? "Ver mais" : "Ver menos";
};
function filtrarPorCategoria(element) {
  // Pega o valor da categoria selecionada
  const categoriaSelecionada = element.getAttribute("data-category");

  // Obtém todos os comércios (ou cards) que você quer filtrar
  const comércios = document.querySelectorAll(".comercio");

  // Para cada comércio, verifica se a categoria dele corresponde à categoria selecionada
  comércios.forEach((comércio) => {
    const categoriaComércio = comércio.getAttribute("data-category");

    if (
      categoriaSelecionada === "todos" ||
      categoriaComércio === categoriaSelecionada
    ) {
      // Exibe o comércio caso ele pertença à categoria ou se a categoria "todos" for selecionada
      comércio.style.display = "block";
    } else {
      // Esconde os outros comércios
      comércio.style.display = "none";
    }
  });
}

function registrarClique(comercioId, linkTipo, comercioNome) {
  // Criar o objeto de dados para enviar
  const data = {
    comercio_id: comercioId,
    link: linkTipo,
    comercio_nome: comercioNome,
  };

  // Enviar o clique para o backend usando fetch
  fetch("https://encontreoficialback.azurewebsites.net/api/cliques", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Clique registrado com sucesso:", data);
    })
    .catch((error) => {
      console.error("Erro ao registrar clique:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnVoltarAoInicio = document.getElementById("btnVoltarAoInicio");

  // Exibe o botão quando o usuário rolar para fora do topo da página
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      // Exibe o botão quando o usuário rolar para fora do topo
      btnVoltarAoInicio.style.display = "block";
    } else {
      btnVoltarAoInicio.style.display = "none"; // Esconde o botão quando estiver no topo
    }
  });

  // Adiciona o evento de clique para rolar a página para o topo
  btnVoltarAoInicio.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Rolagem suave
    });
  });
});
