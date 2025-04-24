package com.github.oezeb.server.helper;

import com.github.oezeb.server.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {
    public static Specification<Product> hasNameLike(String query) {
        if (isBlank(query)) return null;
        return (root, query1, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%");
    }

    public static Specification<Product> hasCategory(Long categoryId) {
        if (categoryId == null) return null;
        return (root, query1, cb) ->
                cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> isSold(Boolean sold) {
        if (sold == null) return null;
        return (root, query1, cb) ->
                cb.equal(root.get("sold"), sold);
    }

    public static Specification<Product> belongsToUser(Long userId) {
        if (userId == null) return null;
        return (root, query1, cb) ->
                cb.equal(root.get("user").get("id"), userId);
    }

    static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
