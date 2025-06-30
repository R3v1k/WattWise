package revik.com.energycostsavingestimator.user.device.smartdevice;

import org.springframework.data.jpa.repository.JpaRepository;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;

import java.util.List;

public interface SmartDeviceRepository extends JpaRepository<SmartDevice, Long> {
    List<SmartDevice> findBySupportedContains(DumbDevice template);
}
