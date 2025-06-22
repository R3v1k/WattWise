package revik.com.energycostsavingestimator.user.device;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.room.Room;
import revik.com.energycostsavingestimator.user.room.RoomRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@Transactional
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;

    public DeviceService(DeviceRepository deviceRepository,
                         RoomRepository roomRepository) {
        this.deviceRepository = deviceRepository;
        this.roomRepository = roomRepository;
    }

    public Device create(DeviceCreateRequest req, String username) {
        Room room = roomRepository.findById(req.roomId())
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND, "Room not found")
                );
        if (!room.getUser().getEmail().equals(username)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        Device device = new Device();
        device.setName(req.name());
        device.setPowerWatts(req.powerWatts());
        device.setUsageHoursPerDay(req.usageHoursPerDay());
        device.setRoom(room);
        return deviceRepository.save(device);
    }

    public List<Device> getByRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND, "Room not found")
                );
        if (!room.getUser().getEmail().equals(username)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        return deviceRepository.findAllByRoomId(roomId);
    }

    public void delete(Long deviceId, String username) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() ->
                        new ResponseStatusException(NOT_FOUND, "Device not found")
                );
        if (!device.getRoom().getUser().getEmail().equals(username)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        deviceRepository.delete(device);
    }
}
