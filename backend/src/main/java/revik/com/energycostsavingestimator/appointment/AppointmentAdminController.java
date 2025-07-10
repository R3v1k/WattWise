package revik.com.energycostsavingestimator.appointment;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api/admin/appointments")
@RestController
@RequiredArgsConstructor
public class AppointmentAdminController {

    private final AppointmentService appointmentService;

    @GetMapping(path = "/api/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
}
