package revik.com.energycostsavingestimator.user.room;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import revik.com.energycostsavingestimator.config.ErrorResponse;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController implements RoomApiDocs {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public RoomController(UserRepository userRepository, RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }


    @Override
    public ResponseEntity<?> createRoom(@RequestBody RoomCreateRequest req, Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404)
                .body(new ErrorResponse("error", "User has not been found"));

        long count = user.getRooms().stream()
                .filter(room -> room.getType() == req.type())
                .count();

        Room room = new Room();
        room.setUser(user);
        room.setType(req.type());
        room.setName(formatRoomName(req.type(), count + 1));

        return ResponseEntity.ok(roomRepository.save(room));
    }

    @Override
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getRoomsByUser(@PathVariable Long id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new ErrorResponse("error", "User not found"));
        }

        var rooms = roomRepository.findAllByUserId(id);
        if (rooms.isEmpty()) {
            return ResponseEntity.status(404).body(new ErrorResponse("error", "No rooms found for this user"));
        }

        return ResponseEntity.ok(rooms);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRooms() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new ErrorResponse("error", "No rooms found")
            );
        }
        return ResponseEntity.ok(rooms);
    }


    private String formatRoomName(RoomType type, long number) {
        String label = switch (type) {
            case BEDROOM -> "Bedroom";
            case KITCHEN -> "Kitchen";
            case DINING_ROOM -> "Dining Room";
            case BATHROOM -> "Bathroom";
            case LIVING_ROOM -> "Living Room";
            case OFFICE -> "Office";
        };
        return label + " #" + number;
    }
}
