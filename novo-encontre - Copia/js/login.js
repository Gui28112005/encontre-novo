const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

const MAX_ATTEMPTS = 4;
const LOCK_TIME_MINUTES = 20;

function isLockedOut() {
  const lockTime = localStorage.getItem("lockTime");
  if (!lockTime) return false;

  const now = new Date().getTime();
  const diff = now - parseInt(lockTime, 10);
  const minutesPassed = diff / 60000;

  if (minutesPassed >= LOCK_TIME_MINUTES) {
    localStorage.removeItem("lockTime");
    localStorage.setItem("loginAttempts", "0");
    return false;
  }

  return true;
}

function incrementAttempts() {
  let attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
  attempts++;
  localStorage.setItem("loginAttempts", attempts.toString());

  if (attempts >= MAX_ATTEMPTS) {
    localStorage.setItem("lockTime", new Date().getTime().toString());
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isLockedOut()) {
    errorMessage.textContent = `Muitas tentativas. Tente novamente em 20 minutos.`;
    errorMessage.style.display = "block";
    return;
  }

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    errorMessage.textContent = "Preencha todos os campos.";
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";
  loading.style.display = "block";

  try {
    const response = await fetch(
      "https://encontreoficialback.azurewebsites.net/api/usuarios/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      }
    );

    const data = await response.json();
    loading.style.display = "none";

    if (!response.ok) {
      incrementAttempts();
      errorMessage.textContent = "Email ou senha inválidos.";
      errorMessage.style.display = "block";
    } else {
      localStorage.setItem("loginAttempts", "0"); // resetar tentativas
      sessionStorage.setItem("token", data.token);
      window.location.href = "negocio2.html";
    }
  } catch (error) {
    console.error("Erro na conexão:", error);
    errorMessage.textContent = "Erro ao conectar ao servidor.";
    errorMessage.style.display = "block";
    loading.style.display = "none";
  }
});

function toggleMenu() {
  const menu = document.querySelector(".header-buttons");
  menu.classList.toggle("show");
}
