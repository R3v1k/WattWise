package revik.com.energycostsavingestimator.user.room;

public final class RoomMapper {

    private RoomMapper() {}

    public static RoomResponse toDto(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getType(),
                room.getName()
        );
    }

}
