package revik.com.energycostsavingestimator.deviceUsageStat;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/usage-stats",
        produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "UsageStats", description = "Average daily usage of popular devices")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class DeviceUsageController {

    private final DeviceUsageService usageService;

    @Operation(summary = "25 devices list",
            description = "Returns for each device the average hours per day\n" +
                    "of a dumb (always-on) version and a smart version")
    @ApiResponse(responseCode = "200", description = "Statistics returned")
    @GetMapping
    public List<DeviceUsageStat> listUsageStats() {
        return usageService.getAll();
    }
}
