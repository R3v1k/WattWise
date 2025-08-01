package revik.com.energycostsavingestimator.user.device.dumbdevice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DumbDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private double powerWatts;

    @Column(nullable = false)
    private double timeOn;

    @Column(nullable = false)
    private double timeUsedHours;
}