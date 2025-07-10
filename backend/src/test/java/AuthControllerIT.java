package revik.com.energycostsavingestimator.auth;
import java.math.BigDecimal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import revik.com.energycostsavingestimator.Auth.AuthController;
import revik.com.energycostsavingestimator.Auth.AuthRequest;
import revik.com.energycostsavingestimator.config.JwtUtil;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @MockBean UserRepository users;
    @MockBean JwtUtil jwt;


    @Test
    void registerSuccess() throws Exception {
        var req = new AuthRequest(
                "new@example.com", "Str0ng!", "Ivan", "Ivanov", "USD", new BigDecimal("0.20")
        );

        given(users.findByEmail("new@example.com")).willReturn(Optional.empty());
        given(users.save(ArgumentMatchers.any(User.class))).willAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });
        given(jwt.generateToken(any(User.class))).willReturn("jwt-token");

        mvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }


    @Test
    void registerDuplicateEmail() throws Exception {
        var req = new AuthRequest(
                "dup@example.com", "Str0ng!", "Ivan", "Ivanov", "EUR", new BigDecimal("0.18")
        );
        given(users.findByEmail("dup@example.com"))
                .willReturn(Optional.of(new User()));

        mvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }
}

