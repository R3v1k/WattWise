package revik.com.energycostsavingestimator.energysavings;

public record EnergySavingsRequest(
        double power,
        double timeOn,
        double timeUsed,
        double tariff
) {}
