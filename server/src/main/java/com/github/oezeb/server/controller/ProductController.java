package com.github.oezeb.server.controller;

import com.github.oezeb.server.dto.ProductFilter;
import com.github.oezeb.server.dto.ProductMinimalResponse;
import com.github.oezeb.server.exception.NotFoundException;
import com.github.oezeb.server.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {
    final ProductService productService;

    @GetMapping
    public Page<ProductMinimalResponse> getProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long categoryId,
            Pageable pageable
    ) {
        var filter = ProductFilter.builder()
                .userId(userId)
                .query(query)
                .categoryId(categoryId)
                .sold(false)
                .build();
        return productService.getProducts(filter, pageable, ProductMinimalResponse::fromProduct);
    }

    @GetMapping("/{id}")
    public ProductMinimalResponse getProduct(@PathVariable long id) {
        var product = productService.getProduct(id, ProductMinimalResponse::fromProduct);
        if (product.sold) throw new NotFoundException("Product not found.");
        return product;
    }
}
