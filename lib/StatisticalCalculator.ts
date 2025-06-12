

export function calculateProportionConfidenceInterval(
    x: number, // Number of successes
    n: number, // Sample size
    confidenceLevel: number // Confidence level (e.g., 0.95 for 95%)
): { lowerBound: number; upperBound: number } {
    if (n <= 0 || x < 0 || x > n) {
        throw new Error("Invalid input: ensure 0 <= x <= n and n > 0.");
    }

    // Calculate the sample proportion
    const pHat = x / n;

    // Get the critical value (z-score) for the confidence level
    const z = getZScore(confidenceLevel);

    // Calculate the margin of error
    const marginOfError = z * Math.sqrt((pHat * (1 - pHat)) / n);

    // Calculate the confidence interval
    const lowerBound = pHat - marginOfError;
    const upperBound = pHat + marginOfError;

    return { lowerBound, upperBound };
}

function getZScore(confidenceLevel: number): number {
    // Predefined z-scores for common confidence levels
    const zTable: Record<string, number> = {
        "0.80": 1.282,
        "0.85": 1.440,
        "0.90": 1.645,
        "0.95": 1.960,
        "0.99": 2.576,
    };

    const key = confidenceLevel.toFixed(2);

    // Ensure the key exists in the zTable
    if (!zTable[key]) {
        throw new Error("Unsupported confidence level. Use common levels like 0.95 or 0.99.");
    }

    return zTable[key];
}