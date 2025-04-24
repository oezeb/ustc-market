package com.github.oezeb.server.service;

import com.github.oezeb.server.dto.ProductFilter;
import com.github.oezeb.server.dto.ProductRequest;
import com.github.oezeb.server.dto.ProductResponse;
import com.github.oezeb.server.entity.Product;
import com.github.oezeb.server.exception.NotFoundException;
import com.github.oezeb.server.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
@AllArgsConstructor
public class ProductService {
    final ProductRepository productRepository;

    public <T> Page<T> getProducts(ProductFilter productFilter, Pageable pageable, Function<Product, T> mapper) {
        return productRepository.findAll(productFilter.getSpec(), pageable)
                .map(mapper);
    }

    public Page<ProductResponse> getProducts(ProductFilter productFilter, Pageable pageable) {
        return getProducts(productFilter, pageable, ProductResponse::fromProduct);
    }

    public <T> T getProduct(long id, Function<Product, T> mapper) {
        return productRepository.findById(id).map(mapper)
                .orElseThrow(() -> new NotFoundException("No product found with id: " + id));
    }

    public ProductResponse getProduct(long id) {
        return getProduct(id, ProductResponse::fromProduct);
    }

    public ProductResponse createProduct(ProductRequest productRequest) {
        return ProductResponse.fromProduct(productRepository.save(Product.builder()
                .name(productRequest.name)
                .description(productRequest.description)
                .price(productRequest.price)
                .category(productRequest.category)
                .user(productRequest.user)
                .images(productRequest.images)
                .sold(productRequest.sold)
                .build()));
    }

    public ProductResponse updateProduct(long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No product found with id: " + id));
        product.setName(productRequest.name);
        product.setDescription(productRequest.description);
        product.setPrice(productRequest.price);
        product.setCategory(productRequest.category);
        product.setUser(productRequest.user);
        product.setSold(productRequest.sold);
        product.setImages(productRequest.images);
        return ProductResponse.fromProduct(productRepository.save(product));
    }

    public void deleteProduct(long id) {
        productRepository.deleteById(id);
    }
}
