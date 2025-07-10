package revik.com.energycostsavingestimator.appointment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AppointmentServiceTest {

    @Mock AppointmentRepository appointmentRepository;
    @Mock UserRepository userRepository;
    @InjectMocks AppointmentService service;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
    }

    @Test
    void shouldSaveAppointmentOnValidInput() {
        var req = new AppointmentRequest("555-1234", "john@example.com");
        var saved = new Appointment(null, user, req.phone(), req.email());
        saved.setId(42L);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(saved);

        var res = service.book(1L, req);

        assertThat(res.id()).isEqualTo(42L);
        verify(appointmentRepository).save(any());
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        var req = new AppointmentRequest("555-1234", "john@example.com");
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.book(99L, req))
                .isInstanceOf(ResponseStatusException.class);
    }
}
