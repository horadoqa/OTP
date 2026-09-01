const OTP_CORRETO = "711385";

const inputs = document.querySelectorAll(".otp input");
const card = document.getElementById("card");
const mensagem = document.getElementById("mensagem");

/*
 * Avança automaticamente entre os campos
 */

inputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/\D/g, "");

        if (
            input.value &&
            index < inputs.length - 1
        ) {
            inputs[index + 1].focus();
        }

    });

    input.addEventListener("keydown", (event) => {

        if (
            event.key === "Backspace" &&
            !input.value &&
            index > 0
        ) {
            inputs[index - 1].focus();
        }

        if (event.key === "Enter") {
            validarOTP();
        }

    });

});

/*
 * Permite colar o código completo
 */

inputs[0].addEventListener("paste", (event) => {

    event.preventDefault();

    const codigo = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    codigo.split("").forEach((numero, index) => {

        if (inputs[index]) {
            inputs[index].value = numero;
        }

    });

    if (codigo.length === 6) {
        inputs[5].focus();
    }

});

/*
 * Validação
 */

function validarOTP() {

    const codigo = [...inputs]
        .map(input => input.value)
        .join("");

    mensagem.className = "";

    if (codigo === OTP_CORRETO) {

        mensagem.textContent =
            "✓ Código validado com sucesso";

        mensagem.classList.add("success");

        inputs.forEach(input => {

            input.style.borderColor = "#38e89a";

            input.style.background =
                "rgba(56,232,154,.06)";

            input.style.boxShadow =
                "0 0 20px rgba(56,232,154,.08)";

        });

    } else {

        mensagem.textContent =
            "Código inválido. Tente novamente.";

        mensagem.classList.add("error");

        card.classList.remove("shake");

        void card.offsetWidth;

        card.classList.add("shake");

        inputs.forEach(input => {

            input.style.borderColor = "#ff5577";

            input.style.background =
                "rgba(255,85,119,.05)";

        });

    }

}