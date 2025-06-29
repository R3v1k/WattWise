package revik.com.energycostsavingestimator.energysavings;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class EnergyCalculatorServiceTest {

    private final EnergyCalculatorService service = new EnergyCalculatorService();

    @Test
    void shouldCalculateSavingsCorrectly() {
        // 1 500 W, 4 h dumb vs 1 h smart, 0.5 €/kWh
        var req = new EnergySavingsRequest(1500, 4, 1, 0.5);
        var res = service.calculateSavings(req);

        assertThat(res.dumbEnergyKwh()).isEqualTo(6);
        assertThat(res.smartEnergyKwh()).isEqualTo(2);
        assertThat(res.savedEnergyKwh()).isEqualTo(5);
        assertThat(res.savedCost()).isEqualTo(2);
    }
}
