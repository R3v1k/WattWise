package revik.com.energycostsavingestimator.user.device.smartdevice;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/smart-devices")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class SmartDeviceController {
    private final SmartDeviceService service;

    @PostMapping
    public SmartDevice create(@RequestParam String name, @RequestBody(required = false) Set<Long> supportedIds) {
        return service.create(name, supportedIds == null ? Collections.emptySet() : supportedIds);
    }

    @GetMapping
    public List<SmartDevice> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SmartDevice get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public SmartDevice rename(@PathVariable Long id, @RequestParam String name) {
        return service.updateName(id, name);
    }

    @PostMapping("/{smartId}/supported/{dumbId}")
    public SmartDevice addSupported(@PathVariable Long smartId, @PathVariable Long dumbId) {
        return service.addSupported(smartId, dumbId);
    }

    @DeleteMapping("/{smartId}/supported/{dumbId}")
    public SmartDevice removeSupported(@PathVariable Long smartId, @PathVariable Long dumbId) {
        return service.removeSupported(smartId, dumbId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
