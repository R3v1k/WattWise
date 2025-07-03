package revik.com.energycostsavingestimator.user.device;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findAllByRoomId(Long roomId);
}
