package oop.website.Utilities;

import java.io.*;
import java.nio.file.*;

public class FFmpegUtils {

    public static File extractFfmpegBinary() throws IOException {
        String ffmpegResourcePath;
        String ffmpegFileName;

        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            ffmpegResourcePath = "ffmpeg/bin/ffmpeg.exe";
            ffmpegFileName = "ffmpeg.exe";
        } else {
            ffmpegResourcePath = "ffmpeg/bin/ffmpeg";
            ffmpegFileName = "ffmpeg";
        }

        InputStream inputStream = FFmpegUtils.class.getClassLoader().getResourceAsStream(ffmpegResourcePath);
        if (inputStream == null) {
            throw new FileNotFoundException("FFmpeg binary not found in resources.");
        }

        // Extract to temp dir
        File tempFile = new File(Files.createTempDirectory("ffmpeg").toFile(), ffmpegFileName);
        Files.copy(inputStream, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        if (!tempFile.setExecutable(true)) {
            throw new IOException("Could not set FFmpeg binary as executable.");
        }

        return tempFile;
    }
}