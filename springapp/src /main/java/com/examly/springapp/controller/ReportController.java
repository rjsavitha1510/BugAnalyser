package com.examly.springapp.controller;

import com.examly.springapp.dto.ReportDTO;
import com.examly.springapp.model.Report;
import com.examly.springapp.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<String> addReport(@RequestBody ReportDTO reportDTO) {
        try {
            Report report = reportService.addReportFromDTO(reportDTO);
            return ResponseEntity.ok("Report created successfully with ID: " + report.getReportId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating report: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateReport(@PathVariable Long id, @RequestBody ReportDTO reportDTO) {
        try {
            String result = reportService.updateReport(id, reportDTO);
            if (result.contains("successfully")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating report: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadReport(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam String type,
            @RequestParam String parameters,
            @RequestParam String generatedBy,
            @RequestParam String format) {

        try {
            Report report = new Report();
            report.setType(type);
            report.setParameters(parameters);
            report.setGeneratedBy(generatedBy);
            report.setFormat(format);

            if (file != null && !file.isEmpty()) {
                String path = reportService.saveFile(file);
                report.setReportUrl(path);
            }

            reportService.addReport(report);
            return ResponseEntity.ok("Report uploaded successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER','ROLE_TESTER','ROLE_DEVELOPER')")
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER','ROLE_TESTER','ROLE_DEVELOPER')")
    @GetMapping("/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        try {
            Optional<Report> report = reportService.getReportById(id);
            if (report.isPresent()) {
                return ResponseEntity.ok(report.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER','ROLE_TESTER','ROLE_DEVELOPER')")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Report>> getReportsByType(@PathVariable String type) {
        try {
            return ResponseEntity.ok(reportService.getReportsByType(type));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER','ROLE_TESTER','ROLE_DEVELOPER')")
    @GetMapping("/creator/{generatedBy}")
    public ResponseEntity<List<Report>> getReportsByCreator(@PathVariable String generatedBy) {
        try {
            return ResponseEntity.ok(reportService.getReportsByGeneratedBy(generatedBy));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(@PathVariable Long id) {
        try {
            String result = reportService.deleteReport(id);
            if (result.contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting report: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_STAKEHOLDER')")
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long id) {
        try {
            Optional<Report> reportOpt = reportService.getReportById(id);
            if (!reportOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Report report = reportOpt.get();
            
            // Handle pie chart generation
            if ("piechart".equalsIgnoreCase(report.getType())) {
                try {
                    byte[] chartData = reportService.generatePieChart(report);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" +
                                    report.getType() + "_" + report.getReportId() + ".png\"")
                            .contentType(MediaType.IMAGE_PNG)
                            .body(chartData);
                } catch (Exception e) {
                    return ResponseEntity.status(400).body(("Chart generation failed: " + e.getMessage()).getBytes());
                }
            }
            
            // Check if report has a file URL
            if (report.getReportUrl() == null || report.getReportUrl().trim().isEmpty()) {
                // Generate a sample file for demonstration
                String content = "Report ID: " + report.getReportId() + "\n" +
                               "Type: " + report.getType() + "\n" +
                               "Parameters: " + report.getParameters() + "\n" +
                               "Generated By: " + report.getGeneratedBy() + "\n" +
                               "Generated Date: " + report.getGeneratedDate() + "\n" +
                               "Format: " + report.getFormat();
                
                String filename = report.getType() + "_" + report.getReportId() + ".txt";
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(content.getBytes());
            }
            
            // Try to read the actual file
            try {
                byte[] data = reportService.getFile(report.getReportUrl());
                
                String filename = report.getType() + "_" + report.getReportId();
                if (report.getFormat() != null && !report.getFormat().trim().isEmpty()) {
                    filename += "." + report.getFormat().toLowerCase();
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(data);
            } catch (Exception e) {
                // If file doesn't exist, generate a sample file
                String content = "Report ID: " + report.getReportId() + "\n" +
                               "Type: " + report.getType() + "\n" +
                               "Parameters: " + report.getParameters() + "\n" +
                               "Generated By: " + report.getGeneratedBy() + "\n" +
                               "Generated Date: " + report.getGeneratedDate() + "\n" +
                               "Format: " + report.getFormat() + "\n\n" +
                               "Note: Original file not found. This is a generated report summary.";
                
                String filename = report.getType() + "_" + report.getReportId() + "_summary.txt";
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(content.getBytes());
            }
                    
        } catch (Exception e) {
            return ResponseEntity.status(500).body(("Download error: " + e.getMessage()).getBytes());
        }
    }
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/piechart")
    public ResponseEntity<String> createPieChart(@RequestBody ReportDTO reportDTO) {
        try {
            if (!"piechart".equalsIgnoreCase(reportDTO.getType())) {
                reportDTO.setType("piechart");
            }
            Report report = reportService.addReportFromDTO(reportDTO);
            return ResponseEntity.ok("Pie chart report created successfully with ID: " + report.getReportId());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating pie chart: " + e.getMessage());
        }
    }
}
