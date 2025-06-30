package revik.com.energycostsavingestimator.appointment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/users/{userId}/appointments",
        produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Appointments", description = "Manage user appointments")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Operation(summary = "Book an appointment for a user")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Appointment booked"),
            @ApiResponse(responseCode = "400", description = "Invalid time"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public AppointmentResponse bookAppointment(
            @PathVariable Long userId,
            @RequestBody AppointmentRequest request
    ) {
        return appointmentService.book(userId, request);
    }

    @Operation(summary = "List all appointments for a user")
    @ApiResponse(responseCode = "200", description = "Appointments returned")
    @GetMapping
    public List<AppointmentResponse> listAppointments(
            @PathVariable Long userId
    ) {
        return appointmentService.listByUserId(userId);
    }

    @Operation(summary = "Get a specific appointment by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Appointment found"),
            @ApiResponse(responseCode = "404", description = "User or appointment not found")
    })
    @GetMapping("/{appointmentId}")
    public AppointmentResponse getAppointment(
            @PathVariable Long userId,
            @PathVariable Long appointmentId
    ) {
        return appointmentService.getById(userId, appointmentId);
    }
}
