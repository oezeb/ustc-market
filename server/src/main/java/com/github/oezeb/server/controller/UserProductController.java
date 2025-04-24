package com.github.oezeb.server.controller;

import com.github.oezeb.server.dto.ProductFilter;
import com.github.oezeb.server.dto.ProductRequest;
import com.github.oezeb.server.dto.ProductResponse;
import com.github.oezeb.server.entity.User;
import com.github.oezeb.server.exception.ForbiddenException;
import com.github.oezeb.server.service.JwtService;
import com.github.oezeb.server.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/products")
@AllArgsConstructor
public class UserProductController {
    final ProductService productService;
    final JwtService jwtService;

    @GetMapping
    public Page<ProductResponse> getProducts(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean sold,
            Pageable pageable
    ) {
        var user = jwtService.verifyToken(jwt);
        var filter = ProductFilter.builder()
                .userId(user.id)
                .query(query)
                .categoryId(categoryId)
                .sold(sold)
                .build();
        return productService.getProducts(filter, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@productSecurity.isOwner(#jwt, #id)")
    public ProductResponse getProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable long id
    ) {
        return productService.getProduct(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ProductRequest productRequest
    ) {
        var user = jwtService.verifyToken(jwt);
        if (productRequest.user != null && productRequest.user.getId() != user.id)
            throw new ForbiddenException("Can't assign product to another user.");

        productRequest.user = User.builder().id(user.id).build();
        return productService.createProduct(productRequest);
    }

    @PutMapping("/{id}")
    @PreAuthorize("@productSecurity.isOwner(#jwt, #id)")
    public ProductResponse updateProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable long id,
            @RequestBody ProductRequest productRequest
    ) {
        var user = jwtService.verifyToken(jwt);
        if (productRequest.user != null && productRequest.user.getId() != user.id)
            throw new ForbiddenException("Can't change product owner.");

        productRequest.user = User.builder().id(user.id).build();
        return productService.updateProduct(id, productRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("@productSecurity.isOwner(#jwt, #id)")
    public void deleteProduct(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable long id
    ) {
        productService.deleteProduct(id);
    }
}


