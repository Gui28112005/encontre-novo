const questions = [
  // Perguntas simples (sim/não)
  { text: "Está com fome?", key: "fome", options: ["Muita", "pouca"] },
  { text: "Gosta de lugares ao ar livre?", key: "arLivre" },
  { text: "Quer estar em um ambiente agitado?", key: "ambiente" },
  { text: "Está disposto(a) a gastar mais?", key: "dinheiro" },
  // Pergunta de escolha com opções personalizadas
  {
    text: "Qual estilo você prefere para novas experiências?",
    key: "novidade",
    options: ["Inovador", "Clássico"],
  },
  { text: "Busca uma experiência única?", key: "experiencia" },
  // Outra pergunta de escolha
  {
    text: "Que tipo de evento ao ar livre você prefere?",
    key: "evento",
    options: ["Música", "Arte", "Esporte"],
  },
  { text: "Quer algo mais movimentado?", key: "movimento" },
  { text: "Gosta de música ao vivo?", key: "musicaAoVivo" },
  // Mais uma pergunta de escolha com opções
  {
    text: "Você prefere o novo ou o tradicional?",
    key: "novoOuTradicional",
    options: ["Novo", "Tradicional"],
  },
  { text: "Está buscando um ambiente tranquilo?", key: "calmoOuAgitado" },
  { text: "Gostaria de estar em contato com a natureza?", key: "natureza" },
  // Pergunta de escolha: sozinho ou com amigos
  {
    text: "Você prefere ir:",
    key: "sozinhoOuGrupo",
    options: ["Sozinho(a)", "Com amigos", "Com meu namorado(a)"],
  },
  {
    text: "Está procurando comida rápida e de boa qualidade?",
    key: "comidaRapida",
  },
  { text: "Quer visitar algo cultural, como um museu?", key: "cultura" },

  { text: "Procura um lugar para socializar?", key: "socializar" },
  // Pergunta de escolha com opções de estilo
  {
    text: "Que ambiente você prefere?",
    key: "moderno",
    options: ["Moderno", "Vintage"],
  },
  { text: "Está em busca de algo exótico?", key: "exotico" },
  { text: "Quer fazer algo ativo, como esportes?", key: "ativo" },
  { text: "Precisa de um lugar para relaxar?", key: "relaxar" },
  { text: "Está procurando opções de compras?", key: "compras" },
  { text: "Gostaria de fazer uma trilha?", key: "trilha" },
  { text: "Quer ir a um rooftop ou lounge moderno?", key: "rooftop" },
  { text: "Prefere um ambiente mais familiar?", key: "familiarOuSofisticado" },
];

const answers = {};
let currentQuestion = 0;
const totalQuestions = questions.length;
const progressBar = document.getElementById("progressBar");

// Renderiza os botões de resposta de acordo com o tipo de pergunta
function displayQuestion() {
  const questionObj = questions[currentQuestion];
  document.getElementById("questionText").textContent = questionObj.text;
  const buttonContainer = document.getElementById("buttonContainer");
  buttonContainer.innerHTML = ""; // Limpa botões anteriores

  // Se a pergunta tiver opções definidas, cria botões para cada escolha
  if (questionObj.options && Array.isArray(questionObj.options)) {
    questionObj.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => answer(option);
      buttonContainer.appendChild(btn);
    });
  } else {
    // Botões padrão sim/não para perguntas sem opções personalizadas
    const btnSim = document.createElement("button");
    btnSim.textContent = "👍 Sim";
    btnSim.onclick = () => answer("sim");

    const btnNao = document.createElement("button");
    btnNao.textContent = "👎 Não";
    btnNao.onclick = () => answer("nao");

    buttonContainer.appendChild(btnSim);
    buttonContainer.appendChild(btnNao);
  }
}

function updateProgress() {
  const progress = (currentQuestion / totalQuestions) * 100;
  progressBar.style.width = progress + "%";
}

function answer(response) {
  const key = questions[currentQuestion].key;
  answers[key] = response;

  const box = document.getElementById("questionBox");
  box.classList.add("fade-out");

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < totalQuestions) {
      updateProgress();
      box.classList.remove("fade-out");
      displayQuestion(); // Exibe a próxima pergunta
    } else {
      updateProgress();
      showResult();
    }
  }, 400);
}

function showResult() {
  const {
    fome,
    arLivre,
    ambiente,
    dinheiro,
    novidade,
    experiencia,
    evento,
    movimento,
    musicaAoVivo,
    novoOuTradicional,
    calmoOuAgitado,
    natureza,
    sozinhoOuGrupo,
    comidaRapida,
    cultura,
    socializar,
    moderno,
    exotico,
    ativo,
    relaxar,
    compras,
    trilha,
    rooftop,
    familiarOuSofisticado,
  } = answers;

  let suggestion = "";

  // Lógica para determinar sugestões com base nas respostas
  let modo = "";
  if (ativo === "sim") {
    modo = "ativo";
  } else if (evento === "sim") {
    modo = "evento";
  } else if (fome === "sim") {
    modo = "comida";
  } else {
    modo = "aleatorio";
  }

  if (modo === "ativo") {
    const opcoesAtivo = [
      "💪 Que tal uma aventura no Eco Arborismo ou um treino funcional no Parque Ecológico?",
      "🏃‍♂️ Corre que dá tempo de caminhar ou pedalar na Ufscar!", // avaliar
      "🧗 Explore trilhas ao ar livre ou busque um grupo de corrida no Parque do Kartódromo!",
      "🚴‍♀️ Que tal alugar uma bike e explorar os arredores da USP São Carlos?",
      "🏃‍♂️ Vá jogar bola ou praticar esportes nas quadras do Ginásio Milton Olaio Filho!",
    ];
    suggestion = opcoesAtivo[Math.floor(Math.random() * opcoesAtivo.length)];
  } else if (modo === "evento") {
    const opcoesEvento = [
      "🎉 Confira se há algum evento cultural no Museu da Ciência de São Carlos!",
      "🎭 Pode ter teatro, show ou feira no Teatro do Sesc ou na Praça do Mercado!",
      "📆 Fique atento às feirinhas e shows no Shopping Iguatemi!",
      "🎤 Vá ao Celeiro Bar e Eventos, sempre tem música ao vivo e agito!",
      "🛏️ Se o evento for o dia todo, considere descansar no Dan Inn ou no The Hill Executive!",
    ];
    suggestion = opcoesEvento[Math.floor(Math.random() * opcoesEvento.length)];
  } else if (modo === "comida") {
    const opcoesComida = [
      "🍕 Pizzaria Dona Firminna, Picanha na Tábua ou Top Lanches são ótimas escolhas!",
      "🍔 Experimente o IN JOY BURGER, Burgers on The Table ou Beco Hamburgueria!",
      "🍝 Se preferir italiano, tente o Amora Gastronomia ou o Raffaele Pizze & Ristorante!",
      "🌮 Se a fome bater forte, vá no Ce Que Sabe Lanches ou SanduWish!",
      "🍗 Toca do Bauru, Rei dos Lanches ou A Fábrica Pizzaria vão te satisfazer!",
    ];
    suggestion = opcoesComida[Math.floor(Math.random() * opcoesComida.length)];
  } else {
    const opcoesAleatorias = [
      "🛍️ Dê uma volta no Iguatemi São Carlos, veja as vitrines e tome um café!",
      "📚 Visite a Livraria Paulista e passe na Papelaria Tropical para ver novidades!",
      "🧸 Vá com a família na Tik Tak Toys ou na Ri Happy e garanta um presente especial!",
      "🎁 Quer encontrar um mimo? Explore a Panda Presentes ou a BLACK STORE MODA!",
      "🛌 Precisa de uma pausa? Relaxe no Central Park Hotel ou The Hill Executive!",
      "⛪ Busque um momento de paz na Catedral de São Carlos ou na Missão Encorajamento!",
    ];
    suggestion =
      opcoesAleatorias[Math.floor(Math.random() * opcoesAleatorias.length)];
  }

  document.getElementById("questionBox").style.display = "none";
  document.getElementById(
    "result"
  ).innerHTML = `${suggestion} <br/><button class="restart-btn" onclick="restart()">🔄 Reiniciar</button>`;
}

function restart() {
  currentQuestion = 0;
  for (let key in answers) {
    delete answers[key];
  }

  // Esconde o resultado
  document.getElementById("result").innerHTML = "";

  // Exibe a caixa de pergunta novamente
  document.getElementById("questionBox").style.display = "block";

  // Zera a barra de progresso
  progressBar.style.width = "0%";

  // Recomeça as perguntas
  displayQuestion();
}

// Inicia com a primeira pergunta
displayQuestion();
