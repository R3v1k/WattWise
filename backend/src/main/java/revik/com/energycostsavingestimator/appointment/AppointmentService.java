package revik.com.energycostsavingestimator.appointment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse book(Long userId, AppointmentRequest req) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        Appointment ap = new Appointment();
        ap.setUser(user);
        ap.setPhone(req.phone());
        ap.setEmail(req.email());

        Appointment saved = appointmentRepository.save(ap);

        return new AppointmentResponse(
                saved.getId(),
                saved.getPhone(),
                saved.getEmail()
        );
    }
    @Transactional(readOnly = true)
    public List<AppointmentResponse> listByUserId(Long userId) {

        userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        return appointmentRepository.findAllByUserId(userId).stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getPhone(),
                        a.getEmail()
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
                ap.getPhone(),
                ap.getEmail()
        );
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
