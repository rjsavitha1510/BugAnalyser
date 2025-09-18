package com.examly.springapp.repository;

import com.examly.springapp.model.BugAttachment;
import com.examly.springapp.model.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugAttachmentRepository extends JpaRepository<BugAttachment, Long> {
    List<BugAttachment> findByBug(Bug bug);
}
