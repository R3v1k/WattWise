package revik.com.energycostsavingestimator.deviceUsageStat;

public record DeviceUsageStat(
        String deviceName,
        double avgDumbHoursPerDay,
        double avgSmartHoursPerDay
) {}
