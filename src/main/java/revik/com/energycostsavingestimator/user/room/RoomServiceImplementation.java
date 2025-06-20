package revik.com.energycostsavingestimator.user.room;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import revik.com.energycostsavingestimator.exception.RoomAccessDeniedException;
import revik.com.energycostsavingestimator.exception.RoomNotFoundException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImplementation implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    public RoomResponse createRoom(RoomCreateRequest req, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RoomNotFoundException("User not found"));

        long count = roomRepository.countByUserIdAndType(user.getId(), req.type());
        String name = formatRoomName(req.type(), count + 1);

        Room room = new Room();
        room.setUser(user);
        room.setType(req.type());
        room.setName(name);

        Room saved = roomRepository.save(room);
        return RoomMapper.toDto(saved);
    }

    @Override
    public void deleteRoom(Long roomId, String userEmail) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        if (!room.getUser().getEmail().equals(userEmail)) {
            throw new RoomAccessDeniedException("You do not have permission to delete this room");
        }

        roomRepository.delete(room);
    }

    @Override
    public List<RoomResponse> getRoomsByUser(Long userId) {
        return roomRepository.findAllByUserId(userId).stream()
                .map(RoomMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(RoomMapper::toDto)
                .collect(Collectors.toList());
    }

    private String formatRoomName(RoomType type, long num) {
        String label = switch (type) {
            case BEDROOM -> "Bedroom";
            case KITCHEN -> "Kitchen";
            case DINING_ROOM -> "Dining Room";
            case BATHROOM -> "Bathroom";
            case LIVING_ROOM -> "Living Room";
            case OFFICE -> "Office";
        };
        return label + " #" + num;
    }
}
