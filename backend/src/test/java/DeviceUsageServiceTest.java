package revik.com.energycostsavingestimator.deviceUsageStat;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class DeviceUsageServiceTest {

    private final DeviceUsageService service = new DeviceUsageService();

    @Test
    void getAllShouldReturn25Stats() {
        assertThat(service.getAll()).hasSize(25)
                .extracting(DeviceUsageStat::deviceName)
                .contains("Refrigerator");
    }
}
