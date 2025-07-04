//RE-READ JS

window.addEventListener("load", function () {
    const wasteForm = document.getElementById("waste-footprint-form");
    const officeTypeSelect = document.getElementById("office-type-wf");
    const wasteInput = document.getElementById("waste-per-person");
    const unrecyclablesInput = document.getElementById("unrecyclables");
    const resultDisplay = document.getElementById("waste-footprint-results");

    const officePresets = {
        "corporate": { waste: 1.5, unrecyclables: 30 },
        "co-working": { waste: 1.2, unrecyclables: 25 },
        "industrial": { waste: 2.5, unrecyclables: 40 },
    };

    let manuallyEditedWaste = false;
    let manuallyEditedUnrecyclables = false;

    // Autofill fields based on office type
    officeTypeSelect.addEventListener("change", () => {
        const selected = officeTypeSelect.value;
        if (officePresets[selected]) {
            const preset = officePresets[selected];
            wasteInput.value = preset.waste;
            unrecyclablesInput.value = preset.unrecyclables;
            manuallyEditedWaste = false;
            manuallyEditedUnrecyclables = false;
        } else if (selected === "custom") {
            // Clear fields for custom option
            wasteInput.value = "";
            unrecyclablesInput.value = "";
            manuallyEditedWaste = true;
            manuallyEditedUnrecyclables = true;
        }
    });

    // Monitor manual change to waste input
    wasteInput.addEventListener("input", () => {
        const selected = officeTypeSelect.value;
        const preset = officePresets[selected];

        if (preset && parseFloat(wasteInput.value) !== preset.waste) {
            officeTypeSelect.value = "custom";
            manuallyEditedWaste = true;
        }
    });

    // Monitor manual change to unrecyclables input
    unrecyclablesInput.addEventListener("input", () => {
        const selected = officeTypeSelect.value;
        const preset = officePresets[selected];

        if (preset && parseFloat(unrecyclablesInput.value) !== preset.unrecyclables) {
            officeTypeSelect.value = "custom";
            manuallyEditedUnrecyclables = true;
        }
    });

    // Form submission logic
    wasteForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const employees = parseFloat(document.getElementById("employees").value);
        const wastePerPerson = parseFloat(wasteInput.value);
        const workingDays = parseInt(document.getElementById("working-days").value);
        const unrecyclables = parseFloat(unrecyclablesInput.value);

        const totalWaste = employees * wastePerPerson * workingDays;
        resultDisplay.innerHTML = `
            Total Monthly Waste: <strong>${totalWaste.toFixed(2)} kg</strong><br>
            Unrecyclables: <strong>${(totalWaste * (unrecyclables / 100)).toFixed(2)} kg</strong>
        `;
        resultDisplay.style.display = "block";
    });
});