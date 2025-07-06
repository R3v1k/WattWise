package revik.com.energycostsavingestimator.device;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import revik.com.energycostsavingestimator.config.JwtUtil;
import revik.com.energycostsavingestimator.config.JwtFilter;
import revik.com.energycostsavingestimator.user.device.Device;
import revik.com.energycostsavingestimator.user.device.DeviceService;
import revik.com.energycostsavingestimator.user.device.DeviceController;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DeviceController.class)
@AutoConfigureMockMvc
class DeviceControllerIT {

    @Autowired MockMvc mvc;
    @MockBean
    JwtUtil jwtUtil;
    @MockBean JwtFilter jwtFilter;
    @MockBean DeviceService service;

    @Test
    void addDeviceReturnsCreatedDevice() throws Exception {
        Device dev = new Device();
        dev.setId(99L);

        given(service.addDevice(eq(7L), eq(3L))).willReturn(dev);

        mvc.perform(post("/api/devices")
                        .param("roomId", "7")
                        .param("dumbDeviceId", "3")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}
