// src/test/java/revik/com/energycostsavingestimator/room/RoomControllerIT.java
package revik.com.energycostsavingestimator.room;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;  // 👈 static-import ниже
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import revik.com.energycostsavingestimator.config.JwtUtil;
import revik.com.energycostsavingestimator.user.room.*;
import revik.com.energycostsavingestimator.config.JwtFilter;

import java.util.Collections;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;

@WebMvcTest(RoomController.class)
@AutoConfigureMockMvc      // фильтры Security не нужны в slice-тесте
class RoomControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @MockBean JwtFilter jwtFilter;   // сам фильтр
    @MockBean JwtUtil      jwtUtil;            // глушим зависимость JwtFilter
    @MockBean RoomService  service;

    @Test
    @WithMockUser(roles = "ADMIN")
    void adminCanGetAllRooms() throws Exception {
        given(service.getAllRooms()).willReturn(Collections.emptyList());

        mvc.perform(get("/api/rooms"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user1", roles = "USER")
    void UnauthorisedUserDeletesOwnRoom() throws Exception {
        willDoNothing().given(service).deleteRoom(42L, "user1");

        mvc.perform(delete("/api/rooms/42")).andExpect(status().isForbidden());
    }
}
