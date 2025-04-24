package com.github.oezeb.server.helper;

import com.github.oezeb.server.service.JwtService;
import com.github.oezeb.server.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component("productSecurity")
@AllArgsConstructor
public class ProductSecurity {
    final ProductService productService;
    final JwtService jwtService;

    public boolean isOwner(Jwt jwt, long productId) {
        var user = jwtService.verifyToken(jwt);
        var product = productService.getProduct(productId);
        return Objects.equals(product.user.id, user.id);
    }
}
