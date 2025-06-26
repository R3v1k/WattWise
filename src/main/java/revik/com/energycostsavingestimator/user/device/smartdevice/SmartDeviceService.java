package revik.com.energycostsavingestimator.user.device.smartdevice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;
import revik.com.energycostsavingestimator.user.device.DeviceRepository;
import revik.com.energycostsavingestimator.user.device.DeviceResponse;

import java.util.List;
import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class SmartDeviceService {

    private final SmartDeviceRepository sdRepo;
    private final UserRepository userRepo;
    private final DeviceRepository deviceRepo;

    @Transactional
    public SmartDeviceResponse create(Long userId, SmartDeviceRequest req) {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        var sd = new SmartDevice();
        sd.setName(req.name());
        sd.setUser(u);
        sd = sdRepo.save(sd);
        return new SmartDeviceResponse(sd.getId(), sd.getName());
    }

    @Transactional(readOnly = true)
    public List<SmartDeviceResponse> list(Long userId) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(NOT_FOUND, "User not found");
        }
        return sdRepo.findAllByUserId(userId).stream()
                .map(sd -> new SmartDeviceResponse(sd.getId(), sd.getName()))
                .toList();
    }

    @Transactional
    public void assignDevice(Long userId, Long smartDeviceId, DeviceAssignmentRequest req) {
        var sd = sdRepo.findById(smartDeviceId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "SmartDevice not found"));
        if (!sd.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        var d = deviceRepo.findById(req.deviceId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Device not found"));
        sd.getDevices().add(d);
        sdRepo.save(sd);
    }

    @Transactional
    public void removeDevice(Long userId, Long smartDeviceId, Long deviceId) {
        var sd = sdRepo.findById(smartDeviceId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "SmartDevice not found"));
        if (!sd.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        sd.getDevices().removeIf(d -> d.getId().equals(deviceId));
        sdRepo.save(sd);
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> listDevices(Long userId, Long smartDeviceId) {
        var sd = sdRepo.findById(smartDeviceId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "SmartDevice not found"));
        if (!sd.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }
        return sd.getDevices().stream()
                .map(d -> new DeviceResponse(
                        d.getId(),
                        d.getName(),
                        d.getPowerWatts(),
                        d.getUsageHoursPerDay(),
                        d.getRoom().getId(),
                        d.getRoom().getName()
                ))
                .toList();
    }

    @Transactional
    public void deleteSmartDevice(Long userId, Long smartDeviceId) {
        var sd = sdRepo.findById(smartDeviceId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "SmartDevice not found"));

        if (!sd.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(FORBIDDEN, "Access denied");
        }

        sdRepo.delete(sd);
    }
}

