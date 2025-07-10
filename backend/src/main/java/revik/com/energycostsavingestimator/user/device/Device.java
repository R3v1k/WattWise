package revik.com.energycostsavingestimator.user.device;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import revik.com.energycostsavingestimator.user.device.dumbdevice.DumbDevice;
import revik.com.energycostsavingestimator.user.room.Room;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private DumbDevice template;

    @ManyToOne(optional = false)
    @JsonBackReference
    private Room room;
}