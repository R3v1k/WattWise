package revik.com.energycostsavingestimator.Auth;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import revik.com.energycostsavingestimator.config.ErrorResponse;
import revik.com.energycostsavingestimator.config.JwtUtil;
import revik.com.energycostsavingestimator.user.Role;
import revik.com.energycostsavingestimator.user.User;
import revik.com.energycostsavingestimator.user.UserRepository;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController implements AuthApiDocs {

    private final UserRepository userRepository;
    private final JwtUtil jwt;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwt) {
        this.userRepository = userRepository;
        this.jwt = jwt;
    }

    @Override
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (!(isEmailValid(req.email()) && isPasswordValid(req.password()))) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("error", "Invalid email or password"));
        }

        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity
                    .status(409)
                    .body(new ErrorResponse("error", "User with this email already exists"));
        }

        User user = new User();
        user.setEmail(req.email());
        user.setPassword(enc.encode(req.password()));
        user.setRoles(Set.of(Role.USER));
        user.setFirstName(req.firstName());
        user.setLastName(req.lastName());
        user.setCurrency(req.currency());
        user.setPricePerWatt(req.pricePerWatt());

        userRepository.save(user);

        String token = jwt.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }


    @Override
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest req) {
        if (req.email() == null || req.email().isBlank() ||
                req.password() == null || req.password().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(new ErrorResponse("error", "Null request"));
        }

        User u = userRepository.findByEmail(req.email()).orElse(null);
        if (u == null || !enc.matches(req.password(), u.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body(new ErrorResponse("error", "Invalid password or email"));
        }

        String token = jwt.generateToken(u);

        return ResponseEntity.ok(new AuthResponse(token));
    }


    private boolean isEmailValid(String email) {
        String emailTemplate = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return email != null && email.matches(emailTemplate);
    }

    private boolean isPasswordValid(String password) {
        String passwordTemplate = "^(?=.*[A-Z])(?=.*[!@#*()\\-]).{6,}$";
        return password != null && password.matches(passwordTemplate);
    }
}
