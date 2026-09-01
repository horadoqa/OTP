const { test, expect } = require("@playwright/test");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projetoDir = path.resolve(__dirname, "../..");
const otpJsonPath = path.join(projetoDir, "otp.json");
const gerarOtpPath = path.join(projetoDir, "script", "gerar-otp.js");

test.describe("Validação do OTP", () => {

  test("Cenário positivo - deve aceitar o OTP gerado", async ({ page }) => {

    // 1. Gera um novo OTP executando o gerar-otp.js
    execFileSync("node", [gerarOtpPath], {
      cwd: projetoDir,
      stdio: "inherit"
    });

    // 2. Lê o OTP gerado no arquivo otp.json
    const arquivoOtp = JSON.parse(
      fs.readFileSync(otpJsonPath, "utf8")
    );

    const otp = String(arquivoOtp.otp);

    // Garante que o OTP possui 6 dígitos
    expect(otp).toMatch(/^\d{6}$/);

    console.log(`OTP utilizado no teste positivo: ${otp}`);

    // 3. Abre a página
    await page.goto("https://horadoqa.github.io/OTP/");

    await page.waitForTimeout(1000);

    // 4. Aguarda os campos do OTP
    const inputs = page.locator(".otp input");

    await expect(inputs).toHaveCount(6);

    // 5. Preenche cada dígito
    for (let i = 0; i < otp.length; i++) {
      await inputs.nth(i).fill(otp[i]);
    }

    await page.waitForTimeout(1000);

    // 6. Clica em confirmar
    await page.getByRole("button", {
      name: "Confirmar código"
    }).click();

    // 7. Valida mensagem de sucesso
    const mensagem = page.locator("#mensagem");

    await expect(mensagem)
      .toHaveText("✓ Código validado com sucesso");

    // 8. Valida classe de sucesso
    await expect(mensagem)
      .toHaveClass(/success/);

    // 9. Valida visual dos campos
    for (let i = 0; i < 6; i++) {

      await expect(inputs.nth(i))
        .toHaveCSS("border-color", "rgb(56, 232, 154)");

    }

  });


  test("Cenário negativo - deve rejeitar um OTP inválido", async ({ page }) => {

    // Abre a página
    await page.goto("https://horadoqa.github.io/OTP/");

    await page.waitForTimeout(1000);

    const inputs = page.locator(".otp input");

    await expect(inputs).toHaveCount(6);

    // OTP propositalmente incorreto
    const otpInvalido = "000000";

    console.log(`OTP inválido utilizado: ${otpInvalido}`);

    // Preenche o código inválido
    for (let i = 0; i < otpInvalido.length; i++) {
      await inputs.nth(i).fill(otpInvalido[i]);
    }

    await page.waitForTimeout(1000);

    // Clica em confirmar
    await page.getByRole("button", {
      name: "Confirmar código"
    }).click();

    // Valida mensagem de erro
    const mensagem = page.locator("#mensagem");

    await expect(mensagem)
      .toHaveText("Código inválido. Tente novamente.");

    // Valida classe de erro
    await expect(mensagem)
      .toHaveClass(/error/);

  });

});
