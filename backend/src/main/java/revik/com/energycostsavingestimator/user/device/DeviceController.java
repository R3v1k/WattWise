package revik.com.energycostsavingestimator.user.device;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final DeviceService deviceService;

    @PostMapping
    public Device addDevice(@RequestParam Long roomId, @RequestParam Long dumbDeviceId) {
        return deviceService.addDevice(roomId, dumbDeviceId);
    }

    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
    }

    @GetMapping("/{id}")
    public Device getDevice(@PathVariable Long id) {
        return deviceService.getDevice(id);
    }

    @GetMapping("rooms/{roomId}")
    public List<Device> getDevicesByRoomId(@PathVariable Long roomId) { return deviceService.getDevicesByRoomId(roomId);}
}

