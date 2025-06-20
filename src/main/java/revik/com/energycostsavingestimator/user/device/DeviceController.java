package revik.com.energycostsavingestimator.user.device;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import revik.com.energycostsavingestimator.config.ErrorResponse;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(path = "/api/devices", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Devices", description = "Operations for managing user devices")
@SecurityRequirement(name = "bearerAuth")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @Operation(summary = "Create a new device", description = "Creates a device in the specified room")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Device created successfully",
                    content = @Content(schema = @Schema(implementation = Device.class))),
            @ApiResponse(responseCode = "404", description = "Room not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden – you do not own this room",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<Device> createDevice(
            @RequestBody DeviceCreateRequest req,
            Principal principal
    ) {
        String username = principal.getName();
        Device created = deviceService.create(req, username);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Get devices by room ID", description = "Returns all devices for a given room")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Devices retrieved successfully",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Device.class)))),
            @ApiResponse(responseCode = "404", description = "Room not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden – you do not own this room",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Device>> getDevicesByRoom(
            @PathVariable Long roomId,
            Principal principal
    ) {
        String username = principal.getName();
        List<Device> devices = deviceService.getByRoom(roomId, username);
        return ResponseEntity.ok(devices);
    }

    @Operation(summary = "Delete a device by ID", description = "Deletes the specified device")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Device deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Device not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden – you do not own this device",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @DeleteMapping("/{deviceId}")
    @ResponseStatus(code = org.springframework.http.HttpStatus.NO_CONTENT)
    public void deleteDevice(
            @PathVariable Long deviceId,
            Principal principal
    ) {
        String username = principal.getName();
        deviceService.delete(deviceId, username);
    }
}
