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

        // Base weights
        const weights = {
            waste: 35,
            overflow: 20,
            pickup: 15,
            officeType: 20,
            binMultiplier: 10
        };

        // Normalize waste score
        const wasteScore = Math.min(monthlyWaste / 10000, 1) * weights.waste;

        // Overflow score based on bin count
        let overflowScore = 0;
        if (overflowComplaints === "yes") {
            overflowScore = ((numBins / 100) * 1) * weights.overflow;
        }

        // Pickup schedule score
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

        // Office type score
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

        // Bin count bonus
        const binScore = (numBins / 100) * weights.binMultiplier;

        // Final score
        let totalScore = wasteScore + overflowScore + pickupScore + officeScore + binScore;
        totalScore = Math.min(totalScore, 100);

        // Generate explanation
        const explanation = getScoreExplanation(totalScore);

        resultDisplay.innerHTML = `
            Smart Bin Suitability Score: <strong>${totalScore.toFixed(1)} / 100</strong><br/>
            <em>${explanation}</em>
        `;
        resultDisplay.style.display = "block";
    });

    // Explanation based on score range
    function getScoreExplanation(score) {
        if (score >= 95) {
            return "Your facility is an ideal candidate for smart bins. You’ll see immediate improvements in efficiency, overflow reduction, and cost savings.";
        } else if (score >= 80) {
            return "Smart bins are highly suitable. Expect to notice clear benefits in just a few days after implementation.";
        } else if (score >= 60) {
            return "Smart bins will offer moderate improvements. Benefits should become evident within a few weeks.";
        } else if (score >= 40) {
            return "Smart bins may offer gradual improvements over a few months. Consider additional changes to maximize their effectiveness.";
        } else if (score >= 20) {
            return "Smart bins could be useful long-term, but benefits might take over a year to become cost-effective. Evaluate your infrastructure and usage.";
        } else {
            return "Smart bins are still beneficial, but it may take a couple of years to see meaningful impact. Use data to build the case for future upgrades.";
        }
    }
});
