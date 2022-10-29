package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.WorkoutBreakdown;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WorkoutBreakdown entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkoutBreakdownRepository extends JpaRepository<WorkoutBreakdown, Long> {}
