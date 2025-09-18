package com.examly.springapp.repository;

import com.examly.springapp.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByType(String type);
    List<Report> findByGeneratedBy(String generatedBy);
    List<Report> findByFormat(String format);
}
