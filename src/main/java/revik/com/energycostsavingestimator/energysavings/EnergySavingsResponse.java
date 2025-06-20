package revik.com.energycostsavingestimator.energysavings;

public record EnergySavingsResponse(
        double dumbEnergyKwh,
        double smartEnergyKwh,
        double savedEnergyKwh,
        double savedCost
) {}
