package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Config.StorageConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
@RequestMapping("/api/files")
public class FileHandler {

    private final StorageConfig config;
    private final String rootPath;

    @Autowired
    public FileHandler(StorageConfig config) {
        this.config = config;
        this.rootPath = config.getPath();

        File root = new File(rootPath);
        System.out.println("FileLocation: " + root.getAbsolutePath());
        if (!root.exists()) {
            if (!root.mkdirs()) {
                throw new RuntimeException("Error creating root directory");
            }
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            int lastIndex = file.getOriginalFilename().lastIndexOf(".");
            if (lastIndex == -1) {return null;}
            String fileName = UUID.randomUUID().toString() + file.getOriginalFilename().substring(lastIndex);
            File dest = new File(rootPath + File.separator + fileName);
            dest.createNewFile();
            file.transferTo(dest);
            return fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public File returnFile(String fileName) {
        return new File(rootPath + File.separator + fileName);
    }

    public void deleteFile(String fileName) {
        File file = new File(rootPath + File.separator + fileName);
        if (file.exists()) {
            file.delete();
        }
    }

    @GetMapping("/")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathParam("fileName") String fileName)
    {
        try
        {
            Path path = Paths.get(rootPath + File.separator + fileName);
            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }
}