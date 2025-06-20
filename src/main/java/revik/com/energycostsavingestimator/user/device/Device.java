package revik.com.energycostsavingestimator.user.device;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
        import lombok.Data;
import revik.com.energycostsavingestimator.user.room.Room;

@Entity
@Data

public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double powerWatts;
    private double usageHoursPerDay;

    @JsonBackReference
    @ManyToOne
    private Room room;
}
