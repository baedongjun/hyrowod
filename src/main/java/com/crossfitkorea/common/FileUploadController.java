package com.crossfitkorea.common;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/upload")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "파일 업로드 API")
public class FileUploadController {

    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.region:ap-northeast-2}")
    private String region;

    @Operation(summary = "S3 Presigned URL 발급 (이미지 업로드용)")
    @GetMapping("/presigned")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPresignedUrl(
        @RequestParam String filename
    ) {
        String ext = filename.contains(".")
            ? filename.substring(filename.lastIndexOf('.'))
            : "";
        String key = "uploads/" + UUID.randomUUID() + ext;

        PutObjectRequest objectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(resolveContentType(ext))
            .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(r ->
            r.signatureDuration(Duration.ofMinutes(10))
             .putObjectRequest(objectRequest)
        );

        String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;

        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "presignedUrl", presigned.url().toString(),
            "fileUrl", fileUrl
        )));
    }

    private String resolveContentType(String ext) {
        return switch (ext.toLowerCase()) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png"          -> "image/png";
            case ".gif"          -> "image/gif";
            case ".webp"         -> "image/webp";
            default              -> "application/octet-stream";
        };
    }
}
