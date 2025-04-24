package com.github.oezeb.server.dto;

import com.github.oezeb.server.entity.Category;
import com.github.oezeb.server.entity.Image;
import com.github.oezeb.server.entity.User;
import lombok.Builder;

import java.util.List;

@Builder
public class ProductRequest {
    public User user;
    public String name;
    public String description;
    public Integer price;
    public Category category;
    public Boolean sold;
    public List<Image> images;
}
