package revik.com.energycostsavingestimator.user.room;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@Tag(name = "Rooms", description = "Operations for managing user rooms")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "Create a new room", description = "Creates a room for authenticated user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Room created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody RoomCreateRequest req,
            Principal principal
    ) {
        String username = principal.getName();
        RoomResponse dto = roomService.createRoom(req, username);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get rooms by user ID (admin only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Rooms retrieved"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}")
    public ResponseEntity<List<RoomResponse>> getRoomsByUser(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomsByUser(id));
    }

    @Operation(summary = "Get all rooms (admin only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Rooms retrieved"),
            @ApiResponse(responseCode = "403", description = "Forbidden")
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @Operation(summary = "Delete a room by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Deleted"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Not found")
    })
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long roomId,
            Principal principal
    ) {
        String username = principal.getName();
        roomService.deleteRoom(roomId, username);
        return ResponseEntity.noContent().build();
    }
}
