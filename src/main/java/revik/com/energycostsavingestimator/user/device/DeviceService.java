package revik.com.energycostsavingestimator.user.device;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDeviceRepository;
import revik.com.energycostsavingestimator.user.room.Room;
import revik.com.energycostsavingestimator.user.room.RoomRepository;
import java.util.List;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class DeviceService {

    private final DumbDeviceRepository dumbDeviceRepository;
    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;

    public Device addDevice(Long roomId, Long dumbDeviceId) {

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        DumbDevice template = dumbDeviceRepository.findById(dumbDeviceId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        Device device = new Device();
        device.setTemplate(template);

        room.addDevice(device);
        roomRepository.save(room);

        return device;
    }

    public void deleteDevice(Long deviceId) {
        Device device = deviceRepository.findById(deviceId).orElseThrow();
        Room room = device.getRoom();
        room.removeDevice(device);
        roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public Device getDevice(Long deviceId) {
        return deviceRepository.findById(deviceId).orElseThrow();
    }

    public List<Device> getDevicesByRoomId(Long roomId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
        return deviceRepository.findAllByRoomId(roomId);
    }
}
