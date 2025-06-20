package revik.com.energycostsavingestimator.user.room;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RequestMapping("/rooms")
public interface RoomApiDocs {

    @PostMapping
    @Operation(
            summary = "Create a new room for the authenticated user",
            description = "Creates a room with auto-generated name (e.g., Bathroom #1) and assigns it to the authenticated user.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Room successfully created",
                            content = @Content(schema = @Schema(implementation = Room.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User not found",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    ResponseEntity<?> createRoom(@RequestBody RoomCreateRequest req, Principal principal);

    @GetMapping
    @Operation(
            summary = "Get all rooms (admin only)",
            description = "Returns a list of all rooms in the system. Only accessible by admins.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Rooms fetched successfully",
                            content = @Content(schema = @Schema(implementation = Room.class))
                    ),
                    @ApiResponse(
                            responseCode = "403",
                            description = "Forbidden – Admin access required",
                            content = @Content
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "No rooms found",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    ResponseEntity<?> getRooms();

    @GetMapping("/user/{id}")
    @Operation(
            summary = "Get rooms by user ID (admin only)",
            description = "Returns all rooms for a specific user by their ID. Only accessible by admins.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Rooms for user found",
                            content = @Content(schema = @Schema(implementation = Room.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User or rooms not found",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    ResponseEntity<?> getRoomsByUser(@PathVariable Long id);
}
