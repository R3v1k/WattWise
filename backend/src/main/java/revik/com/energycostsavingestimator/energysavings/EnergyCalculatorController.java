package revik.com.energycostsavingestimator.energysavings;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
public class EnergyCalculatorController {

    private final EnergyCalculatorService service;

    @GetMapping("/room/{roomId}")
    public double roomDaily(@PathVariable Long roomId,
                            @RequestParam double tariffPerHour) {
        return service.calcRoomDailySaving(roomId, tariffPerHour);
    }

    @GetMapping("/user/{userId}")
    public double userDaily(@PathVariable Long userId,
                            @RequestParam double tariffPerHour) {
        return service.calcUserDailySaving(userId, tariffPerHour);
    }
}