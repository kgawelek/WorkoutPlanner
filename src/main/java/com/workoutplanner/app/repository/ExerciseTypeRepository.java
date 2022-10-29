package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.ExerciseType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExerciseType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExerciseTypeRepository extends JpaRepository<ExerciseType, Long> {}
