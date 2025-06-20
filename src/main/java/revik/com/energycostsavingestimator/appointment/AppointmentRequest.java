package revik.com.energycostsavingestimator.appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentRequest(
        LocalDate appoinmentDate,
        LocalTime appointmentTime
) {}
