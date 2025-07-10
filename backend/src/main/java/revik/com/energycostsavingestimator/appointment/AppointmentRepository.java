package revik.com.energycostsavingestimator.appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAllByUserId(Long userid);
    Optional<Appointment> findByIdAndUserId(Long id, Long userId);

}
