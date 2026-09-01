const fs = require("fs");
const crypto = require("crypto");

const ARQUIVO_OTP = "otp.json";
const INTERVALO = 30 * 1000; // 30 segundos

function gerarOTP() {
  const array = new Uint32Array(1);

  crypto.webcrypto.getRandomValues(array);

  return String(array[0] % 1000000).padStart(6, "0");
}

function atualizarOTP() {

  const OTP_GERADO = gerarOTP();

  const dados = {
    otp: OTP_GERADO,
    criado_em: new Date().toISOString()
  };

  fs.writeFileSync(
    ARQUIVO_OTP,
    JSON.stringify(dados, null, 2),
    "utf8"
  );

  console.log(
    `[${new Date().toLocaleTimeString()}] OTP gerado: ${OTP_GERADO}`
  );
}

// Gera imediatamente ao iniciar
atualizarOTP();

// Gera um novo OTP a cada 30 segundos
setInterval(() => {
  atualizarOTP();
}, INTERVALO);

console.log("Gerador de OTP iniciado.");
console.log("Um novo código será gerado a cada 30 segundos.");
