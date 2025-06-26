package revik.com.energycostsavingestimator.user.device.smartdevice;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import revik.com.energycostsavingestimator.user.device.DeviceResponse;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users/{userId}/smart-devices",
        produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "SmartDevices", description = "Manage smart device groups and their dumb devices")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class SmartDeviceController {

    private final SmartDeviceService service;

    @Operation(summary = "Create new smart device group")
    @ApiResponse(responseCode = "200", description = "Created")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public SmartDeviceResponse create(
            @PathVariable Long userId,
            @RequestBody SmartDeviceRequest req
    ) {
        return service.create(userId, req);
    }

    @Operation(summary = "List all smart devices for a user")
    @ApiResponse(responseCode = "200", description = "OK")
    @GetMapping
    public List<SmartDeviceResponse> list(
            @PathVariable Long userId
    ) {
        return service.list(userId);
    }

    @Operation(summary = "Assign an existing dumb device to smart device")
    @ApiResponse(responseCode = "200", description = "Assigned")
    @PostMapping(path = "/{smartDeviceId}/devices",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public void assign(
            @PathVariable Long userId,
            @PathVariable Long smartDeviceId,
            @RequestBody DeviceAssignmentRequest req
    ) {
        service.assignDevice(userId, smartDeviceId, req);
    }

    @Operation(summary = "List dumb devices in a smart device group")
    @ApiResponse(responseCode = "200", description = "OK")
    @GetMapping("/{smartDeviceId}/devices")
    public List<DeviceResponse> listDevices(
            @PathVariable Long userId,
            @PathVariable Long smartDeviceId
    ) {
        return service.listDevices(userId, smartDeviceId);
    }

    @Operation(summary = "Remove a dumb device from a smart device group")
    @ApiResponse(responseCode = "204", description = "Removed")
    @DeleteMapping("/{smartDeviceId}/devices/{deviceId}")
    public void removeDevice(
            @PathVariable Long userId,
            @PathVariable Long smartDeviceId,
            @PathVariable Long deviceId
    ) {
        service.removeDevice(userId, smartDeviceId, deviceId);
    }
}

