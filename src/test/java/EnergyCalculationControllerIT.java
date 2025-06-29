package revik.com.energycostsavingestimator.energysavings;

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
class EnergyCalculationControllerIT {

    @Autowired MockMvc mvc;

    @Test
    @WithMockUser
    void shouldReturnCalculatedSavings() throws Exception {
        mvc.perform(get("/api/energy/savings")
                        .param("power", "1500")
                        .param("timeOn", "4")
                        .param("timeUsed", "1")
                        .param("tariff", "0.5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dumbEnergyKwh").value(6))
                .andExpect(jsonPath("$.savedCost").value(2));
    }

    @Test
    @WithMockUser
    void missingParameterShouldReturn400() throws Exception {
        mvc.perform(get("/api/energy/savings")
                        .param("power", "1500")
                        .param("timeOn", "4")
                        .param("timeUsed", "1"))
                .andExpect(status().isBadRequest());
    }
}
