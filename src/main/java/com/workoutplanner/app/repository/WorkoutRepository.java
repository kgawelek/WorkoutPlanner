package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.Workout;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Workout entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    @Query("SELECT w FROM Workout w WHERE w.userDetails.id = ?1")
    List<Workout> findWorkoutByUserDetails(Long id);
}
