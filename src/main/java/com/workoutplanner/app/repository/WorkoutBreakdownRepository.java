package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.Workout;
import com.workoutplanner.app.domain.WorkoutBreakdown;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the WorkoutBreakdown entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkoutBreakdownRepository extends JpaRepository<WorkoutBreakdown, Long> {
    @Query("SELECT w FROM WorkoutBreakdown w WHERE w.workout.id = ?1")
    List<WorkoutBreakdown> findWorkoutBreakdownByWorkout(Long id);
}
