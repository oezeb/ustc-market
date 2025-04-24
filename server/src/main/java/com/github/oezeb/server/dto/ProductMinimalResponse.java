package com.github.oezeb.server.dto;

import com.github.oezeb.server.entity.Category;
import com.github.oezeb.server.entity.Image;
import com.github.oezeb.server.entity.Product;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public class ProductMinimalResponse {
    public Long id;
    public UserMinimalResponse user;
    public String name;
    public String description;
    public Integer price;
    public Category category;
    public Boolean sold;
    public List<Image> images;

    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public static ProductMinimalResponse fromProduct(Product product) {
        return ProductMinimalResponse.builder()
                .id(product.getId())
                .user(UserMinimalResponse.fromUser(product.getUser()))
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .sold(product.isSold())
                .images(product.getImages())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
