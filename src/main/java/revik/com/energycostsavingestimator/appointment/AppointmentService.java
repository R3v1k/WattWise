package revik.com.energycostsavingestimator.appointment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.time.LocalTime;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private static final LocalTime MIN = LocalTime.of(8, 0);
    private static final LocalTime MAX = LocalTime.of(22, 0);

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse book(Long userId, AppointmentRequest req) {

        if (req.appointmentTime().isBefore(MIN) || req.appointmentTime().isAfter(MAX)) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "appointmentTime must be between " + MIN + " and " + MAX
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        var ap = new Appointment();
        ap.setUser(user);
        ap.setAppointmentDate(req.appoinmentDate());
        ap.setAppointmentTime(req.appointmentTime());

        var saved = appointmentRepository.save(ap);
        return new AppointmentResponse(
                saved.getId(),
                saved.getAppointmentDate(),
                saved.getAppointmentTime()
        );
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listByUserId(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        return appointmentRepository.findAllByUserId(userId).stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getAppointmentDate(),
                        a.getAppointmentTime()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getById(Long userId, Long appointmentId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        var ap = appointmentRepository.findByIdAndUserId(appointmentId, userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Appointment not found"));

        return new AppointmentResponse(
                ap.getId(),
                ap.getAppointmentDate(),
                ap.getAppointmentTime()
        );
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
