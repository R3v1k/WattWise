package revik.com.energycostsavingestimator.user.room;

import java.util.List;

public interface RoomService {
    RoomResponse createRoom(RoomCreateRequest request, String userEmail);
    void deleteRoom(Long roomId, String userEmail);
    List<RoomResponse> getRoomsByUser(Long userId);
    List<RoomResponse> getAllRooms();
}