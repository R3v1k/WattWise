package revik.com.energycostsavingestimator.Auth;

import java.math.BigDecimal;
import java.util.Currency;

public record AuthRequest(
        String email,
        String password,
        String firstName,
        String lastName,
        String currency,
        BigDecimal pricePerWatt
) {}
