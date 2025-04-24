package com.github.oezeb.server.dto;

import com.github.oezeb.server.entity.Product;
import lombok.Builder;
import org.springframework.data.jpa.domain.Specification;

import static com.github.oezeb.server.helper.ProductSpecifications.*;

@Builder
public class ProductFilter {
    public Long userId;
    public String query;
    public Long categoryId;
    public Boolean sold;

    public Specification<Product> getSpec() {
        return Specification.allOf(belongsToUser(userId), hasNameLike(query), hasCategory(categoryId), isSold(sold));
    }
}
