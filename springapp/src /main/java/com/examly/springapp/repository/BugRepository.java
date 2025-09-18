package com.examly.springapp.repository;

import com.examly.springapp.model.Bug;
import com.examly.springapp.model.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findByProject_ProjectId(Long projectId);
    Page<Bug> findByPriority(Priority priority, Pageable pageable);
    Page<Bug> findByProject_ProjectId(Long projectId, Pageable pageable);
}
