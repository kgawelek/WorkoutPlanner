package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.Exercise;
import com.workoutplanner.app.domain.Workout;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Exercise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    @Query("SELECT e FROM Exercise e WHERE e.workout.id = ?1")
    List<Exercise> findExerciseByWorkout(Long id);
}
