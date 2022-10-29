package com.workoutplanner.app.repository;

import com.workoutplanner.app.domain.SportDiscipline;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SportDiscipline entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SportDisciplineRepository extends JpaRepository<SportDiscipline, Long> {}
