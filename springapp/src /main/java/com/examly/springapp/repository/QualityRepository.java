package com.examly.springapp.repository;

import com.examly.springapp.model.Quality;
import com.examly.springapp.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QualityRepository extends JpaRepository<Quality, Long> {
    List<Quality> findByProject_ProjectId(Long projectId);
}
