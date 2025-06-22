package revik.com.energycostsavingestimator.user.room;

import jakarta.validation.constraints.NotNull;

public record RoomCreateRequest(
        @NotNull(message = "Type must be provided")
        RoomType type
) {}
