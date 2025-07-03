package revik.com.energycostsavingestimator.user.room;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.device.Device;

import java.util.List;

@Entity
@Data
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoomType type;

    private String name;

    @JsonBackReference
    @ManyToOne
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Device> devices;
}
