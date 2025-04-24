package com.github.oezeb.server.controller;

import com.github.oezeb.server.entity.Category;
import com.github.oezeb.server.service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@AllArgsConstructor
public class CategoryController {
    final CategoryService categoryService;

    @GetMapping
    public Page<Category> getCategories(Pageable pageable) {
        return categoryService.getCategories(pageable);
    }
}
