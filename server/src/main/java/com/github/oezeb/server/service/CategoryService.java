package com.github.oezeb.server.service;

import com.github.oezeb.server.entity.Category;
import com.github.oezeb.server.exception.NotFoundException;
import com.github.oezeb.server.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CategoryService {
    final CategoryRepository categoryRepository;

    public Page<Category> getCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Category getCategory(long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No category found with id: " + id));
    }
}
