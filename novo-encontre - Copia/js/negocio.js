let dadosCliques = [];
let graficoComercio = null; // gráfico do comércio selecionado

// Função que cria o gráfico de pizza
function criarGraficoVazio() {
  const ctx = document.getElementById("cliquesChart").getContext("2d");

  if (graficoComercio) {
    graficoComercio.destroy();
  }

  graficoComercio = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Sem Cliques, clique em um comércio para ver as estatisticas"],
      datasets: [
        {
          label: "Total de Cliques",
          data: [100], // Valor de 100 para "Sem Cliques"
          backgroundColor: ["#C0C0C0"], // Cor cinza
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return "Nenhum clique registrado";
            },
          },
        },
      },
    },
  });
}

// Função que mostra as estatísticas do comércio
function mostrarEstatisticasComercio(comercio) {
  const ctx = document.getElementById("cliquesChart").getContext("2d");

  if (graficoComercio) {
    graficoComercio.destroy();
  }

  // Verifica se o comércio tem cliques. Se não, mostra gráfico de pizza cinza.
  const dados =
    comercio.total_cliques > 0
      ? [comercio.total_cliques] // Caso haja cliques, mostra o total.
      : [100]; // Se não houver cliques, exibe 100 (ou outro valor) como "Sem Cliques".

  const labels =
    comercio.total_cliques > 0 ? [comercio.comercio_nome] : ["Sem Cliques"];

  const backgroundColor =
    comercio.total_cliques > 0
      ? ["#007BFF"] // Azul para cliques
      : ["#C0C0C0"]; // Cinza para "Sem Cliques"

  graficoComercio = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total de Cliques",
          data: dados,
          backgroundColor: backgroundColor,
          borderColor: "#0056b3",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw === 100
                ? "Nenhum clique registrado"
                : `${tooltipItem.raw} cliques`;
            },
          },
        },
      },
    },
  });
}

// Função para carregar o ranking e exibir os dados na tabela
async function carregarRanking() {
  try {
    const res = await fetch("${window.ENV.API_URL}/api/cliques/por-comercio");
    const data = await res.json();
    const tbody = document.getElementById("ranking-cliques");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>Nenhum dado encontrado.</td></tr>";
      return;
    }

    dadosCliques = data;

    // Atualiza as "cards" do dashboard
    atualizarDashboard(data);

    // Cria a tabela de comércios
    data.forEach((comercio, index) => {
      const tr = document.createElement("tr");
      tr.onclick = () => mostrarEstatisticasComercio(comercio);
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="posicao">${comercio.posicao ?? "-"}</td>
        <td>${comercio.comercio_nome}</td>
        <td>${comercio.total_cliques}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    document.getElementById("ranking-cliques").innerHTML =
      "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";
  }
}

// Função para atualizar o dashboard
function atualizarDashboard(data) {
  const totalCliques = data.reduce((acc, c) => acc + c.total_cliques, 0);

  // Remover as partes que atualizam o "Comércio com Mais Cliques" e "Comércio com Menos Cliques"
  // document.getElementById("top-comercio").textContent = `${topComercio.comercio_nome} (${topComercio.total_cliques})`;
  // document.getElementById("bottom-comercio").textContent = `${bottomComercio.comercio_nome} (${bottomComercio.total_cliques})`;
}

function filtrarTabela() {
  const filtro = document.getElementById("search-input").value.toLowerCase();
  const tbody = document.getElementById("ranking-cliques");
  tbody.innerHTML = "";

  const dadosFiltrados = dadosCliques.filter((comercio) =>
    comercio.comercio_nome.toLowerCase().includes(filtro)
  );

  if (dadosFiltrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>Nenhum dado encontrado.</td></tr>";
    // Exibe todos os dados novamente após um tempo
    setTimeout(() => {
      carregarRanking(); // Chama a função que recarrega todos os dados
    }, 2000); // 2 segundos de espera antes de recarregar
    return;
  }

  dadosFiltrados.forEach((comercio, index) => {
    const tr = document.createElement("tr");
    tr.onclick = () => mostrarEstatisticasComercio(comercio);
    tr.innerHTML = ` 
      <td>${index + 1}</td>
      <td class="posicao">${comercio.posicao ?? "-"}</td>
      <td>${comercio.comercio_nome}</td>
      <td>${comercio.total_cliques}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Função para alternar a exibição do menu em telas menores
function toggleMenu() {
  const menu = document.querySelector(".header-buttons");
  menu.classList.toggle("show");
}
// Carrega o ranking ao inicializar a página
(async () => {
  await carregarRanking(); // Carrega a lista de comércios
  criarGraficoVazio(); // Exibe o gráfico de pizza "Sem Cliques" inicialmente
})();
