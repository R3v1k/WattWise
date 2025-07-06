package revik.com.energycostsavingestimator.energysavings;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import revik.com.energycostsavingestimator.user.device.Device;
import revik.com.energycostsavingestimator.user.device.DeviceRepository;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;
import revik.com.energycostsavingestimator.user.device.smartdevice.SmartDeviceRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EnergyCalculatorServiceTest {

    @Mock  DeviceRepository deviceRepo;
    @Mock  SmartDeviceRepository smartRepo;

    @InjectMocks
    EnergyCalculatorService service;                 // конструктор с 2 repo подставит Mockito

    @Test
    void calcRoomDailySaving_ok() {
        // ── 1 устройство, включено 4 ч, реально использовали 1 ч ──
        DumbDevice tpl = new DumbDevice();
        tpl.setTimeOn(4);
        tpl.setTimeUsedHours(1);

        Device dev = new Device();
        dev.setTemplate(tpl);

        when(deviceRepo.findAllByRoomId(42L)).thenReturn(List.of(dev));

        double saving = service.calcRoomDailySaving(42L, 0.5);

        assertThat(saving).isEqualTo((4 - 1) * 0.5);
    }
}

