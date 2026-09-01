const fs = require("fs");
const crypto = require("crypto");

function gerarOTP() {
  const array = new Uint32Array(1);
  crypto.webcrypto.getRandomValues(array);

  return String(array[0] % 1000000).padStart(6, "0");
}

const OTP_GERADO = gerarOTP();

const dados = {
  otp: OTP_GERADO,
  criado_em: new Date().toISOString()
};

fs.writeFileSync(
  "otp.json",
  JSON.stringify(dados, null, 2),
  "utf8"
);

console.log("OTP gerado:", OTP_GERADO);
