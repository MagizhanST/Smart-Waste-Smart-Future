//RE-READ JS

window.addEventListener("load", function () {
    const smartBinForm = document.getElementById("smart-bin-suitability-form");
    const resultDisplay = document.getElementById("smart-bin-suitability-result");

    smartBinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get input values
        const numBins = Math.min(parseInt(document.getElementById("num-bins").value), 100);
        const monthlyWaste = parseFloat(document.getElementById("monthly-waste").value);
        const overflowComplaints = document.getElementById("overflow-complaints").value;
        const pickupSchedule = document.getElementById("pickup-schedule").value;
        const officeType = document.getElementById("office-type-sbs").value;

        // Base weights for each factor (can sum to < 100 to avoid accidental 100 without good reason)
        const weights = {
            waste: 35,
            overflow: 20,
            pickup: 15,
            officeType: 20,
            binMultiplier: 10
        };

        // Normalize waste (assuming 0 - 10,000 kg/month range for typical office buildings)
        const wasteScore = Math.min(monthlyWaste / 10000, 1) * weights.waste;

        // Overflow multiplier with bin count
        let overflowScore = 0;
        if (overflowComplaints === "yes") {
            overflowScore = ((numBins / 100) * 1) * weights.overflow; // scaled by bin count
        }

        // Pickup score
        let pickupScore = 0;
        switch (pickupSchedule) {
            case "daily":
                pickupScore = weights.pickup;
                break;
            case "alternate":
                pickupScore = weights.pickup * 0.8;
                break;
            case "twice-weekly":
                pickupScore = weights.pickup * 0.6;
                break;
            case "weekly":
                pickupScore = weights.pickup * 0.4;
                break;
        }

        // Office type weight
        let officeScore = 0;
        switch (officeType) {
            case "industrial":
                officeScore = weights.officeType;
                break;
            case "co-working":
                officeScore = weights.officeType * 0.5;
                break;
            case "corporate":
                officeScore = weights.officeType * 0.7;
                break;
        }

        // Bin multiplier bonus, encourages higher bin availability
        const binScore = (numBins / 100) * weights.binMultiplier;

        // Total score capped at 100
        let totalScore = wasteScore + overflowScore + pickupScore + officeScore + binScore;
        totalScore = Math.min(totalScore, 100);

        resultDisplay.innerHTML = `Smart Bin Suitability Score: <strong>${totalScore.toFixed(1)} / 100</strong>`;
        resultDisplay.style.display = "block";
    });
});