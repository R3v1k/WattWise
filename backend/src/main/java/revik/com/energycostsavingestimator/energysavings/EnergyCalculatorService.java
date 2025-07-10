package revik.com.energycostsavingestimator.energysavings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import revik.com.energycostsavingestimator.user.device.Device;
import revik.com.energycostsavingestimator.user.device.DeviceRepository;
import revik.com.energycostsavingestimator.user.device.smartdevice.SmartDeviceRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnergyCalculatorService {

    private final DeviceRepository deviceRepository;
    private final SmartDeviceRepository smartDeviceRepository;

    public double calcRoomDailySaving(Long roomId, double pricePerKwh) {
        return deviceRepository.findAllByRoomId(roomId).stream()
                .mapToDouble(d -> calcDeviceSaving(d, pricePerKwh))
                .sum();
    }

    public double calcUserDailySaving(Long userId, double pricePerKwh) {
        return deviceRepository.findAllByRoomId_UserId(userId).stream()
                .mapToDouble(d -> calcDeviceSaving(d, pricePerKwh))
                .sum();
    }

    private double calcDeviceSaving(Device dev, double tariffPerHour) {
        var tpl = dev.getTemplate();
        double wastedHours = Math.max(0,
                tpl.getTimeOn() - tpl.getTimeUsedHours());
        return wastedHours * tariffPerHour;
    }
}