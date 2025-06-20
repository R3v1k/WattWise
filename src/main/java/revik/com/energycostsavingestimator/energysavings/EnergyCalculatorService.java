package revik.com.energycostsavingestimator.energysavings;

import org.springframework.stereotype.Service;

import static java.lang.Math.round;

@Service
public class EnergyCalculatorService {

    public EnergySavingsResponse calculateSavings(EnergySavingsRequest req) {
        double power = req.power();

        double energyDumb = power * req.timeOn() / 1000.0;
        double energySmart = power * req.timeUsed() / 1000.0;
        double savedEnergy = energyDumb - energySmart;
        double savedCost = savedEnergy * req.tariff();

        return new EnergySavingsResponse(
                round(energyDumb),
                round(energySmart),
                round(savedEnergy),
                round(savedCost)
        );
    }
}
