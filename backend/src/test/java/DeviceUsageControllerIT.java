package revik.com.energycostsavingestimator.deviceUsageStat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DeviceUsageControllerIT {

    @Autowired MockMvc mvc;

    @Test
    @WithMockUser
    void listShouldReturn25Records() throws Exception {
        mvc.perform(get("/api/usage-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(25));
    }

    @Test
    @WithMockUser
    void listShouldContainRefrigerator() throws Exception {
        mvc.perform(get("/api/usage-stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.deviceName=='Refrigerator')]").exists());
    }
}
