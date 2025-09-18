package com.examly.springapp.service;

import com.examly.springapp.dto.ReportDTO;
import com.examly.springapp.model.Report;
import com.examly.springapp.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import javax.imageio.ImageIO;
import java.util.Map;
import java.util.HashMap;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final String UPLOAD_DIR = "uploads/reports/";

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Report addReport(Report report) {
        report.setGeneratedDate(LocalDateTime.now());
        return reportRepository.save(report);
    }
    
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    public List<Report> getReportsByType(String type) {
        return reportRepository.findByType(type);
    }

    public List<Report> getReportsByGeneratedBy(String generatedBy) {
        return reportRepository.findByGeneratedBy(generatedBy);
    }
    
    public String updateReport(Long id, ReportDTO reportDTO) {
        return reportRepository.findById(id).map(existing -> {
            existing.setType(reportDTO.getType());
            existing.setParameters(reportDTO.getParameters());
            existing.setGeneratedBy(reportDTO.getGeneratedBy());
            existing.setReportUrl(reportDTO.getReportUrl());
            existing.setFormat(reportDTO.getFormat());
            reportRepository.save(existing);
            return "Report updated successfully";
        }).orElse("Report not found");
    }

    public Report addReportFromDTO(ReportDTO reportDTO) {
        Report report = new Report();
        report.setType(reportDTO.getType());
        report.setParameters(reportDTO.getParameters());
        report.setGeneratedBy(reportDTO.getGeneratedBy());
        report.setReportUrl(reportDTO.getReportUrl());
        report.setFormat(reportDTO.getFormat());
        report.setGeneratedDate(LocalDateTime.now());
        return reportRepository.save(report);
    }

    public String deleteReport(Long reportId) {
        return reportRepository.findById(reportId).map(existing -> {
            reportRepository.delete(existing);
            return "Report deleted successfully";
        }).orElse("Report not found");
    }

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IOException("File is empty");
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);
        return filePath.toString();
    }

    public byte[] getFile(String path) throws IOException {
        if (path == null || path.isEmpty()) {
            throw new IOException("File path is null or empty");
        }
        try {
            Path filePath = Paths.get(path);
            if (!Files.exists(filePath)) {
                throw new IOException("File not found: " + path);
            }
            return Files.readAllBytes(filePath);
        } catch (Exception e) {
            throw new IOException("Error reading file: " + e.getMessage());
        }
    }
    
    public byte[] generatePieChart(Report report) throws IOException {
        try {
            if (report == null || report.getParameters() == null || report.getParameters().trim().isEmpty()) {
                throw new IOException("Invalid report data for pie chart generation");
            }
            
            Map<String, Double> data = parseChartData(report.getParameters());
            if (data.isEmpty()) {
                throw new IOException("No valid data found in parameters for pie chart");
            }
            
            int width = 400;
            int height = 400;
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = image.createGraphics();
            
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setColor(Color.WHITE);
            g2d.fillRect(0, 0, width, height);
            
            double total = data.values().stream().mapToDouble(Double::doubleValue).sum();
            if (total <= 0) {
                throw new IOException("Invalid data values for pie chart");
            }
            
            int centerX = width / 2;
            int centerY = height / 2;
            int radius = Math.min(width, height) / 3;
            
            Color[] colors = {Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.ORANGE, Color.PINK, Color.CYAN, Color.MAGENTA};
            int colorIndex = 0;
            double startAngle = 0;
            
            for (Map.Entry<String, Double> entry : data.entrySet()) {
                double angle = (entry.getValue() / total) * 360;
                g2d.setColor(colors[colorIndex % colors.length]);
                g2d.fillArc(centerX - radius, centerY - radius, radius * 2, radius * 2, 
                           (int) startAngle, (int) angle);
                
                double labelAngle = Math.toRadians(startAngle + angle / 2);
                int labelX = (int) (centerX + (radius + 30) * Math.cos(labelAngle));
                int labelY = (int) (centerY + (radius + 30) * Math.sin(labelAngle));
                
                g2d.setColor(Color.BLACK);
                g2d.setFont(new Font("Arial", Font.PLAIN, 12));
                String label = entry.getKey() + " (" + String.format("%.1f", (entry.getValue() / total) * 100) + "%)";
                g2d.drawString(label, labelX - 30, labelY);
                
                startAngle += angle;
                colorIndex++;
            }
            
            g2d.dispose();
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IOException("Error generating pie chart: " + e.getMessage());
        }
    }
    
    private Map<String, Double> parseChartData(String parameters) {
        Map<String, Double> data = new HashMap<>();
        try {
            String[] pairs = parameters.split(",");
            for (String pair : pairs) {
                String[] keyValue = pair.split(":");
                if (keyValue.length == 2) {
                    String key = keyValue[0].trim();
                    double value = Double.parseDouble(keyValue[1].trim());
                    data.put(key, value);
                }
            }
        } catch (Exception e) {
            // Return empty map if parsing fails
        }
        return data;
    }
}
