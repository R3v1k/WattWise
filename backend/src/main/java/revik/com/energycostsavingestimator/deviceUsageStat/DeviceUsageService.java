package revik.com.energycostsavingestimator.deviceUsageStat;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceUsageService {

    private final List<DeviceUsageStat> stats = List.of(
            new DeviceUsageStat("Refrigerator",       24.0, 22.0),
            new DeviceUsageStat("Washing Machine",     1.0,  0.8),
            new DeviceUsageStat("Dishwasher",          1.0,  0.8),
            new DeviceUsageStat("Microwave Oven",      0.2,  0.15),
            new DeviceUsageStat("Electric Kettle",     0.3,  0.25),
            new DeviceUsageStat("Television",          4.0,  3.0),
            new DeviceUsageStat("Desktop Computer",    5.0,  4.0),
            new DeviceUsageStat("Laptop",              6.0,  5.0),
            new DeviceUsageStat("Router/Modem",       24.0, 20.0),
            new DeviceUsageStat("LED Lamp",            6.0,  4.0),
            new DeviceUsageStat("Vacuum Cleaner",      0.5,  0.4),
            new DeviceUsageStat("Air Conditioner",     8.0,  6.0),
            new DeviceUsageStat("Space Heater",        6.0,  5.0),
            new DeviceUsageStat("Electric Stove",      2.0,  1.8),
            new DeviceUsageStat("Coffee Maker",        0.3,  0.25),
            new DeviceUsageStat("Toaster",             0.1,  0.08),
            new DeviceUsageStat("Blender",             0.1,  0.08),
            new DeviceUsageStat("Hair Dryer",          0.2,  0.15),
            new DeviceUsageStat("Iron",                0.2,  0.18),
            new DeviceUsageStat("Ceiling Fan",         6.0,  5.0),
            new DeviceUsageStat("Gaming Console",      2.0,  1.5),
            new DeviceUsageStat("Printer",             0.1,  0.08),
            new DeviceUsageStat("Water Heater",       24.0, 20.0),
            new DeviceUsageStat("Electric Shower",     0.5,  0.4),
            new DeviceUsageStat("Electric Oven",       2.0,  1.8)
    );

    public List<DeviceUsageStat> getAll() {
        return stats;
    }
}
