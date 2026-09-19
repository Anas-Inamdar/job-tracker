package com.jobtracker.repository;

import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByUserId(Long userId, Pageable pageable);

    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);

    Page<JobApplication> findByUserIdAndStatus(Long userId, ApplicationStatus status, Pageable pageable);

    @Query("""
        SELECT ja FROM JobApplication ja
        WHERE ja.user.id = :userId
        AND (:search IS NULL OR LOWER(ja.companyName) LIKE LOWER(CONCAT('%', :search, '%'))
             OR LOWER(ja.jobTitle) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR ja.status = :status)
        """)
    Page<JobApplication> searchByUserIdAndFilters(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") ApplicationStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT ja.status as status, COUNT(ja) as count
        FROM JobApplication ja
        WHERE ja.user.id = :userId
        GROUP BY ja.status
        """)
    List<Object[]> countByUserIdGroupByStatus(@Param("userId") Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    @Query("""
        SELECT ja FROM JobApplication ja
        WHERE ja.user.id = :userId
        AND ja.followUpDate <= CURRENT_DATE
        AND ja.status NOT IN ('OFFER_ACCEPTED', 'OFFER_DECLINED', 'REJECTED', 'WITHDRAWN')
        ORDER BY ja.followUpDate ASC
        """)
    List<JobApplication> findDueFollowUps(@Param("userId") Long userId);
}
