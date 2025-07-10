package revik.com.energycostsavingestimator.Auth;

// Used only for documentation declaration

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/auth")
public interface AuthApiDocs {

    @PostMapping("/register")
    @Operation(
            summary = "User registration",
            description = "Registers a new user and returns JWT token for access",
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "User successfully registered",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "Success",
                                            value = "{ \"accessToken\": \"string\" }"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid password or email format",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "BadRequest",
                                            value = "{ \"status\": \"error\", \"message\": \"Invalid password or" +
                                                    " email format\" }"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "This email is already in use",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "Conflict",
                                            value = "{ \"status\": \"error\", \"message\": \" This email " +
                                                    "is already in use\" }"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> register(@RequestBody AuthRequest request);

    @PostMapping("/login")
    @Operation(
            summary = "User login",
            description = "Authenticates a user and returns a JWT access token",
            responses = {
                    @ApiResponse(responseCode = "200",
                            description = "User successfully authenticated",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "Success",
                                            value = "{ \"accessToken\": \"string\" }"
                                    )
                            )
                    ),
                    @ApiResponse(responseCode = "400",
                            description = "Invalid request format or missing required fields",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "BadRequest",
                                            value = "{ \"error\": \"Invalid request payload\" }"
                                    )
                            )
                    ),
                    @ApiResponse(responseCode = "401",
                            description = "Authentication failed due to invalid credentials",
                            content = @Content(
                                    mediaType = "application/json",
                                    examples = @ExampleObject(
                                            name = "Unauthorized",
                                            value = "{ \"error\": \"Invalid email or password\" }"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> login(@RequestBody LoginRequest request);
}
