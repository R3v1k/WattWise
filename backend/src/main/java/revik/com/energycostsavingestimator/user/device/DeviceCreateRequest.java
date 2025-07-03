package revik.com.energycostsavingestimator.user.device;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record DeviceCreateRequest(
        @Schema(description = "Name of the device", example = "Air Conditioner")
        @NotNull
        String name,

        @Schema(description = "Power consumption in watts", example = "1500")
        @Min(0)
        double powerWatts,

        @Schema(description = "Average usage hours per day", example = "5")
        @Min(0)
        double usageHoursPerDay,

        @Schema(description = "ID of the room to which the device belongs", example = "1")
        @NotNull
        Long roomId
) {}