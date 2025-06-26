package revik.com.energycostsavingestimator.user.device.smartdevice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.device.Device;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmartDevice {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(optional = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "smart_device_devices",
            joinColumns = @JoinColumn(name = "smart_device_id"),
            inverseJoinColumns = @JoinColumn(name = "device_id")
    )
    private Set<Device> devices = new HashSet<>();
}
