package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.WorkoutRating;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WorkoutRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkoutRatingRepository extends JpaRepository<WorkoutRating, Long> {}
