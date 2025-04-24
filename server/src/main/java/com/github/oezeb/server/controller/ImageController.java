package com.github.oezeb.server.controller;

import com.github.oezeb.server.entity.Image;
import com.github.oezeb.server.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@AllArgsConstructor
public class ImageController {
    final ImageService imageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<Image> uploadImages(@RequestParam("image") MultipartFile[] files) throws IOException {
        return imageService.uploadImages(files);
    }
}
