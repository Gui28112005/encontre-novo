document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const comercioId = urlParams.get("id");
  const container = document.getElementById("comercioContainer");

  if (!comercioId) {
    container.innerHTML =
      "<p class='error-message'>ID do comércio não encontrado na URL.</p>";
    return;
  }

  try {
    const response = await fetch(
      `${window.ENV.API_URL}/comercios/${comercioId}`
    );
    if (!response.ok) {
      console.error("Erro ao buscar comércio:", response.status);
      container.innerHTML =
        "<p class='error-message'>Erro ao carregar os detalhes do comércio.</p>";
      return;
    }

    const comercio = await response.json();

    let imagens = [];
    if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
    if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
    if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

    let imagensHtml = "";
    if (imagens.length > 1) {
      imagensHtml = `
                <div class="carousel-container">
                    <div class="carousel-images" id="carouselImages">
                        ${imagens
                          .map(
                            (img) =>
                              `<img src="${img}" alt="Imagem do comércio">`
                          )
                          .join("")}
                    </div>
                    <button class="carousel-button prev" onclick="moverCarousel(-1)">❮</button>
                    <button class="carousel-button next" onclick="moverCarousel(1)">❯</button>
                </div>
            `;
    } else if (imagens.length === 1) {
      imagensHtml = `<img src="${imagens[0]}" alt="Imagem do comércio" class="comercio-imagem" />`;
    }

    const linksHtml = `
            <div class="comercio-links">
                ${
                  comercio.link_facebook
                    ? `<a href="${comercio.link_facebook}" target="_blank">Facebook</a>`
                    : ""
                }
                ${
                  comercio.link_instagram
                    ? `<a href="${comercio.link_instagram}" target="_blank">Instagram</a>`
                    : ""
                }
                ${
                  comercio.link_site_pessoal
                    ? `<a href="${comercio.link_site_pessoal}" target="_blank">Site</a>`
                    : ""
                }
                ${
                  comercio.endereco
                    ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        comercio.endereco
                      )}" target="_blank">Ver no Mapa</a>`
                    : ""
                }
            </div>
        `;

    const currentUrl = window.location.href;

    container.innerHTML = `
            <h2>${comercio.nome}</h2>
            ${imagensHtml}
            <div class="comercio-info">
                <p><strong>Categoria:</strong> ${comercio.categoria}</p>
                <p><strong>Endereço:</strong> ${comercio.endereco}</p>
                <p><strong>Horário:</strong> ${
                  comercio.horario_funcionamento || "Não informado"
                }</p>
                <p><strong>Descrição:</strong> ${
                  comercio.descricao || "Sem descrição"
                }</p>
                <p><strong>Contato:</strong> ${
                  comercio.contato || "Não disponível"
                }</p>
            </div>
            ${linksHtml}
            <div class="qr-section">
                <div id="qrcode"></div>
            </div>
        `;

    new QRCode(document.getElementById("qrcode"), {
      text: currentUrl,
      width: 160,
      height: 160,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    container.innerHTML = `<p class='error-message'>Erro ao carregar os detalhes do comércio.</p>`;
  }
});

let currentSlide = 0;
window.moverCarousel = function (direction) {
  const imagesContainer = document.getElementById("carouselImages");
  if (!imagesContainer) return;
  const totalSlides = imagesContainer.children.length;
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = totalSlides - 1;
  if (currentSlide >= totalSlides) currentSlide = 0;
  const offset = -currentSlide * 100;
  imagesContainer.style.transform = `translateX(${offset}%)`;
};

window.toggleMenu = function () {
  document.getElementById("nav").classList.toggle("show");
};
