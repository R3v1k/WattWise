package revik.com.energycostsavingestimator.user.device;

public record DeviceResponse(
        Long id,
        String name,
        double powerWatts,
        double usageHoursPerDay,
        Long roomId,
        String roomName
) {}
