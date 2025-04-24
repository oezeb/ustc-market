package com.github.oezeb.server.repository;

import com.github.oezeb.server.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository  extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
}
