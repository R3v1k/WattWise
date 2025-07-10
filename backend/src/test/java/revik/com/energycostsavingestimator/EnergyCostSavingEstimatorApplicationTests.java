package revik.com.energycostsavingestimator;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.context.annotation.Import;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class EnergyCostSavingEstimatorApplicationTests {

    @Test
    void contextLoads() {
    }

}