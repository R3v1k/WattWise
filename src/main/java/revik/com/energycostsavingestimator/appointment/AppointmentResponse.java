package revik.com.energycostsavingestimator.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
   Long id,
   LocalDate appointmentDate,
   LocalTime appointmentTime
) {}
