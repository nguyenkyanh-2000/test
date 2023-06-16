const API_KEY = 'c9b0641fc739a17bf6f7646d';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

async function getSupportedCodes() {
    try {
        const response = await fetch(`${BASE_URL}/codes`);
        if(response.ok) {
            const data = await response.json();
            const codes = data["supported_codes"];
            return codes;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};
// getSupportedCodes().then((result) => {console.log(result)});

async function getCoversionRate(baseCode, targetCode) {
    try {
        const response = await fetch(`${BASE_URL}/pair/${baseCode}/${targetCode}`);
        if(response.ok) {
            const data = await response.json();
            const rate = data["conversion_rate"];
            return rate;
        }
    } catch (error) {
        console.log(error)
        return 0;
    }
}

const baseUnit = document.querySelector("#base-unit");
const targetRate = document.querySelector("#target-rate");

const inputBaseAmount = document.querySelector("#base-amount");
const selectBaseCode = document.querySelector("#base-code");
const inputTargetAmount = document.querySelector("#target-amount");
const selectTargetCode = document.querySelector("#target-code");

const errorMsg = document.querySelector(".error-message");

let supportedCodes = [];
let conversionRate = 0;

const updateExchangeRate = async () => {
    const baseCode = selectBaseCode.value;
    const targetCode = selectTargetCode.value;

    errorMsg.textContent = "Loading data...";
    conversionRate = await getCoversionRate(baseCode, targetCode);
    if (conversionRate === 0) {
        errorMsg.textContent = "No Supported Coversion Rate"
        return;
    }
    errorMsg.textContent = "";

    baseUnit.textContent = `1 ${baseCode} equals`;
    targetRate.textContent = `${conversionRate} ${targetCode}`;
}

const initialize = async () => {
    // Get supported codes from the API
    errorMsg.textContent = "Loading data...";
    supportedCodes = await getSupportedCodes();
    if (!supportedCodes.length) {
        errorMsg.textContent = "No Supported Codes"
        return;
    }
    errorMsg.textContent = "";
    // Put options into the select boxs
    supportedCodes.forEach((code) => {
        const baseOption = document.createElement("option");
        baseOption.value = code[0];
        baseOption.textContent = code[1];
        selectBaseCode.appendChild(baseOption);

        const targetOption = document.createElement("option");
        targetOption.value = code[0];
        targetOption.textContent = code[1];
        selectTargetCode.appendChild(targetOption);
    });
    // Set VND to USD as default
    selectBaseCode.value = "VND";
    selectTargetCode.value = "USD";
    // Update exchange rate

    await updateExchangeRate();
};

selectBaseCode.addEventListener("change", updateExchangeRate);
selectTargetCode.addEventListener("change", updateExchangeRate);

inputBaseAmount.addEventListener("input", () => {
    inputTargetAmount.value = inputBaseAmount.value * conversionRate;
});
inputTargetAmount.addEventListener("input", () => {
    inputBaseAmount.value = inputTargetAmount.value / conversionRate;
});

initialize();