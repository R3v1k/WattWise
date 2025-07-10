package revik.com.energycostsavingestimator.user.device.dumbdevice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import revik.com.energycostsavingestimator.user.device.smartdevice.SmartDeviceRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DumbDeviceService {
    private final DumbDeviceRepository repo;
    private final SmartDeviceRepository smartRepo;
    public DumbDevice create(DumbDevice dumb) {
        return repo.save(dumb);
    }

    @Transactional(readOnly = true)
    public List<DumbDevice> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public DumbDevice get(Long id) {
        return repo.findById(id).orElseThrow();
    }

    public DumbDevice update(Long id, DumbDevice patch) {
        DumbDevice current = get(id);
        current.setName(patch.getName());
        current.setPowerWatts(patch.getPowerWatts());
        current.setTimeOn(patch.getTimeOn());
        current.setTimeUsedHours(patch.getTimeUsedHours());
        return current;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<DumbDevice> getAttached() {
        return smartRepo.findAllSupported();
    }
}