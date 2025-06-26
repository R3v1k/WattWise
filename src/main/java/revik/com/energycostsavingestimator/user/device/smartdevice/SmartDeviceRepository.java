package revik.com.energycostsavingestimator.user.device.smartdevice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SmartDeviceRepository extends JpaRepository<SmartDevice, Long> {
    List<SmartDevice> findAllByUserId(Long userId);
}
