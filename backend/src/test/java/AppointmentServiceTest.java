package revik.com.energycostsavingestimator.appointment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;      // ← new
import org.mockito.quality.Strictness;                // ← new
import org.springframework.web.server.ResponseStatusException;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)     // ← new
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
    void shouldRejectWhenTimeBefore8AM() {
        var req = new AppointmentRequest(LocalDate.now(), LocalTime.of(7, 30));

        assertThatThrownBy(() -> service.book(1L, req))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void shouldRejectWhenTimeAfter10PM() {
        var req = new AppointmentRequest(LocalDate.now(), LocalTime.of(23, 0));

        assertThatThrownBy(() -> service.book(1L, req))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void shouldSaveAppointmentOnValidInput() {
        var req   = new AppointmentRequest(LocalDate.of(2025, 1, 1), LocalTime.of(10, 0));
        var saved = new Appointment(null, user, req.appoinmentDate(), req.appointmentTime());
        saved.setId(42L);

        when(appointmentRepository.save(any(Appointment.class))).thenReturn(saved);

        var res = service.book(1L, req);

        assertThat(res.id()).isEqualTo(42L);
        verify(appointmentRepository).save(any());
    }
}
