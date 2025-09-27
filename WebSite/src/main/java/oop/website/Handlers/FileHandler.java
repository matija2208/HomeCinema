package oop.website.Handlers;

import jakarta.websocket.server.PathParam;
import oop.website.Config.StorageConfig;
import oop.website.Utilities.FFmpegUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/files")
public class FileHandler {

    private final StorageConfig config;
    private final String rootPath;
    private final File ffmpeg;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    public FileHandler(StorageConfig config) throws IOException {
        this.config = config;
        this.rootPath = config.getPath();

        File ffmpegTamp = FFmpegUtils.extractFfmpegBinary();

        this.ffmpeg = ffmpegTamp;

        System.out.println("ffmpeg path: " + ffmpeg.getAbsolutePath());

        File root = new File(rootPath);
        System.out.println("FileLocation: " + root.getAbsolutePath());
        if (!root.exists()) {
            if (!root.mkdirs()) {
                throw new RuntimeException("Error creating root directory");
            }
        }

        File tmp = new File(root, "tmp");
        if (!tmp.exists()) {
            if (!tmp.mkdirs()) {
                throw new RuntimeException("Error creating tmp directory");
            }
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            int lastIndex = file.getOriginalFilename().lastIndexOf(".");
            if (lastIndex == -1) {return null;}

            String extension=file.getOriginalFilename().substring(lastIndex);

            String fileName = UUID.randomUUID().toString();
            File dest = new File(rootPath + File.separator + fileName + extension);
            dest.createNewFile();
            file.transferTo(dest);

            if(extension.equals(".avi")
                    ||extension.equals(".mov")
                    ||extension.equals(".wmv")
                    ||extension.equals(".mkv")
                    ||extension.equals(".webm")
                    ||extension.equals(".flv")
                    ||extension.equals(".ogm")
                    ||extension.equals(".mpg")
                    ||extension.equals(".mpeg")
                    ||extension.equals(".ogv")
                    ||extension.equals(".m4v"))//MOV, AVI, WMV, MKV, WebM, and FLV .ogm  .mpg  .ogv  .mpeg .m4v
            {
                String comm = ffmpeg.getAbsolutePath()+ " -i "+ rootPath + File.separator + fileName+extension+ " -c:v "+ " libx264 "+ " -c:a "+ " aac "+ rootPath + File.separator + fileName+".mp4";
                System.out.println(comm);
                ProcessBuilder pb = new ProcessBuilder(ffmpeg.getAbsolutePath(), "-i", rootPath + File.separator + fileName+extension, "-c:v", "libx264", "-c:a", "aac", rootPath + File.separator+"tmp"+File.separator + fileName+".mp4","-y");
                pb.redirectErrorStream(true);
                Process p = pb.start();

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println(line); // optional: log to file instead
                    }
                }

                p.waitFor();
                dest.delete();


                Path sourcePath = Paths.get(rootPath + File.separator+"tmp"+File.separator + fileName+".mp4");
                Path targetPath = Paths.get(rootPath + File.separator + fileName+".mp4");
                Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);

                extension=".mp4";
            }

            System.out.println("File saved at: " + dest.getAbsolutePath());

            return fileName+extension;
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
            if (fileName == null || fileName.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            Path path = Paths.get(rootPath + File.separator + fileName);
            Resource resource = new UrlResource(path.toUri());
            String mimeType = Files.probeContentType(path);
            if (mimeType == null) mimeType = "application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/clean")
    @ResponseBody
    public ResponseEntity<Object> clean()
    {
        try
        {
            String sql =    "select concat(fileName,fileExtension) as fileName\n" +
                            "from files\n" +
                            "left join (select distinct fileId as id from movies\n" +
                                        "union all select distinct posterId as id from movies\n" +
                                        "union all select distinct posterId as id from series\n" +
                                        "union all select distinct fileId as id from episodes) as usedIds on usedIds.id=files.id\n" +
                            "where usedIds.id is null;";

            List<String> fileNames = jdbcTemplate.queryForList(sql,String.class);

            System.out.println(Arrays.toString(fileNames.toArray()));

            for (String fileName : fileNames)
            {
                File file = new File(rootPath + File.separator + fileName);
                if(file.exists())
                    file.delete();

                String sql1 = "DELETE FROM files WHERE fileName=?";
                fileName=fileName.substring(0,fileName.lastIndexOf('.'));

                jdbcTemplate.update(sql1,fileName);
            }

            return ResponseEntity.ok().build();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/saveTimeStamp")
    @ResponseBody
    public ResponseEntity<Object> saveTimeStamp(@PathParam("timeStamp") String timeStamp, @PathParam("fileName") String fileName)
    {
        try
        {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            System.out.println(username);
            System.out.println(timeStamp);
            System.out.println(fileName);

            if(username==null||timeStamp==null ||timeStamp.trim().isEmpty()||fileName==null|| fileName.trim().isEmpty())
                return ResponseEntity.badRequest().build();

            SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate).withCatalogName("HomeCinema").withProcedureName("saveWatchingTime");

            call.execute(username,timeStamp,fileName);

            return ResponseEntity.ok().build();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}