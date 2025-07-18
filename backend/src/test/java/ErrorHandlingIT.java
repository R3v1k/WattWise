package revik.com.energycostsavingestimator;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;   // ← new
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ErrorHandlingIT {

    @Autowired MockMvc mvc;

    @Test
    @WithMockUser          // ← добавлено
    void unknownEndpointShouldReturn404() throws Exception {
        mvc.perform(get("/does-not-exist"))
                .andExpect(status().isNotFound());
    }
}
