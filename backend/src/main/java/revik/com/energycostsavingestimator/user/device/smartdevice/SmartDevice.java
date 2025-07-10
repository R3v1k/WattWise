package revik.com.energycostsavingestimator.user.device.smartdevice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SmartDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "smart_device_supported",
            joinColumns = @JoinColumn(name = "smart_device_id"),
            inverseJoinColumns = @JoinColumn(name = "dumb_device_id")
    )
    private Set<DumbDevice> supported = new HashSet<>();
}