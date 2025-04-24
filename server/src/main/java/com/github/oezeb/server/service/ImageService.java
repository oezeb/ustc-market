package com.github.oezeb.server.service;

import com.github.oezeb.server.entity.Image;
import com.github.oezeb.server.exception.BadRequestException;
import com.github.oezeb.server.repository.ImageRepository;
import lombok.AllArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.name.Rename;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImageService {
    final ImageRepository imageRepository;
    final Path uploadPath;

    @Transactional
    public List<Image> uploadImages(MultipartFile[] files) {
        var images = new ArrayList<Image>();
        try {
            for (MultipartFile file : files) {
                Image image = imageRepository.save(Image.builder().fileName(uploadImage(file)).build());
                images.add(image);
            }
        } catch (Exception e) {
            for (Image image : images) {
                try {
                    Files.delete(uploadPath.resolve(image.getFileName()));
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
            throw new RuntimeException(e);
        }
        return images;
    }

    public void deleteImage(long id) {
        imageRepository.findById(id).ifPresent(image -> {
            try {
                Files.delete(uploadPath.resolve(image.getFileName()));
                imageRepository.deleteById(id);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }

    String uploadImage(MultipartFile file) throws IOException {
        if (!file.getContentType().startsWith("image/"))
            throw new BadRequestException("Only images are allowed");

        String fileName = uploadFile(file);
        Path filePath = uploadPath.resolve(fileName);
        Thumbnails.of(filePath.toFile())
                .size(300, 300)
                .toFiles(uploadPath.toFile(), Rename.PREFIX_DOT_THUMBNAIL);

        return fileName;
    }

    String uploadFile(MultipartFile file) throws IOException {
        String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        String fileName = UUID.randomUUID() + ext;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}
