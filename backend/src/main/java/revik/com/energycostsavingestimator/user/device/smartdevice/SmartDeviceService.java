package revik.com.energycostsavingestimator.user.device.smartdevice;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDeviceRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class SmartDeviceService {

    private final SmartDeviceRepository smartRepo;
    private final DumbDeviceRepository dumbRepo;

    public SmartDevice create(String name, Set<Long> supportedIds) {
        SmartDevice sd = new SmartDevice();
        sd.setName(name);
        if (supportedIds != null && !supportedIds.isEmpty()) {
            sd.setSupported(new HashSet<>(dumbRepo.findAllById(supportedIds)));
        }
        return smartRepo.save(sd);
    }

    @Transactional(readOnly = true)
    public List<SmartDevice> findAll() {
        return smartRepo.findAll();
    }

    @Transactional(readOnly = true)
    public SmartDevice get(Long id) {
        return smartRepo.findById(id).orElseThrow();
    }

    public SmartDevice updateName(Long id, String name) {
        SmartDevice sd = get(id);
        sd.setName(name);
        return sd;
    }

    public SmartDevice addSupported(Long smartId, Long dumbId) {
        SmartDevice sd = get(smartId);
        DumbDevice dd = dumbRepo.findById(dumbId).orElseThrow();
        sd.getSupported().add(dd);
        return sd;
    }

    public SmartDevice removeSupported(Long smartId, Long dumbId) {
        SmartDevice sd = get(smartId);
        DumbDevice dd = dumbRepo.findById(dumbId).orElseThrow();
        sd.getSupported().remove(dd);
        return sd;
    }

    public void delete(Long id) {
        smartRepo.deleteById(id);
    }
}