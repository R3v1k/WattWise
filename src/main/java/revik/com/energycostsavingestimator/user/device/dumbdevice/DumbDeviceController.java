package revik.com.energycostsavingestimator.user.device.dumbdevice;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dumb-devices")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class DumbDeviceController {
    private final DumbDeviceService service;

    @PostMapping
    public DumbDevice create(@RequestBody DumbDevice dumb) {
        return service.create(dumb);
    }

    @GetMapping
    public List<DumbDevice> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DumbDevice get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public DumbDevice update(@PathVariable Long id, @RequestBody DumbDevice patch) {
        return service.update(id, patch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}