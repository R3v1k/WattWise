package revik.com.energycostsavingestimator.energysavings;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/energy", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Energy", description = "Energy consumption & savings calculator")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor

public class EnergyCalculationController {

    private final EnergyCalculatorService calculatorService;

    @Operation(summary = "Calculate energy savings",
            description = "Returns consumption and savings comparing dumb and IoT device usage")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Calculation successful")
    })
    @GetMapping("/savings")
    public EnergySavingsResponse calculateSavings(
            @RequestParam double power,
            @RequestParam double timeOn,
            @RequestParam double timeUsed,
            @RequestParam double tariff
    ) {
        var req = new EnergySavingsRequest(power, timeOn, timeUsed, tariff);
        return calculatorService.calculateSavings(req);
    }
}