package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.WorkoutBreakdown;
import com.workoutplanner.app.repository.WorkoutBreakdownRepository;
import com.workoutplanner.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing WorkoutBreakdown.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkoutBreakdownResource {

    private final Logger log = LoggerFactory.getLogger(WorkoutBreakdownResource.class);

    private static final String ENTITY_NAME = "workoutBreakdown";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkoutBreakdownRepository workoutBreakdownRepository;

    public WorkoutBreakdownResource(WorkoutBreakdownRepository workoutBreakdownRepository) {
        this.workoutBreakdownRepository = workoutBreakdownRepository;
    }

    /**
     * {@code POST  /workout-breakdowns} : Create a new workout breakdown.
     *
     * @param workoutBreakdown the workoutBreakdown to create.
     */
    @PostMapping("/workout-breakdowns")
    public ResponseEntity<WorkoutBreakdown> createWorkoutBreakdown(@RequestBody WorkoutBreakdown workoutBreakdown)
        throws URISyntaxException {
        log.debug("REST request to save WorkoutBreakdown : {}", workoutBreakdown);
        if (workoutBreakdown.getId() != null) {
            throw new BadRequestAlertException("A new workoutBreakdown cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Integer exerciseOrder = workoutBreakdown.getWorkout().getExercises() != null
            ? workoutBreakdown.getWorkout().getExercises().size()
            : 0;
        workoutBreakdown.setOrder(exerciseOrder);
        WorkoutBreakdown result = workoutBreakdownRepository.save(workoutBreakdown);
        return ResponseEntity.created(new URI("/api/workout-breakdowns/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /workout-breakdowns/:id} : Updates an existing workout breakdown.
     *
     * @param id the id of the workoutBreakdown to save.
     * @param workoutBreakdown the workoutBreakdown to update.
     */
    @PutMapping("/workout-breakdowns/{id}")
    public ResponseEntity<WorkoutBreakdown> updateWorkoutBreakdown(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WorkoutBreakdown workoutBreakdown
    ) throws URISyntaxException {
        log.debug("REST request to update WorkoutBreakdown : {}, {}", id, workoutBreakdown);
        if (workoutBreakdown.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workoutBreakdown.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutBreakdownRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WorkoutBreakdown result = workoutBreakdownRepository.save(workoutBreakdown);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /workout-breakdowns} : get all the workoutBreakdowns.
     */
    @GetMapping("/workout-breakdowns")
    public List<WorkoutBreakdown> getAllWorkoutBreakdowns() {
        log.debug("REST request to get all WorkoutBreakdowns");
        return workoutBreakdownRepository.findAll();
    }

    /**
     * {@code GET  /workout-breakdowns/:id} : get the workout breakdown by id.
     */
    @GetMapping("/workout-breakdowns/{id}")
    public ResponseEntity<WorkoutBreakdown> getWorkoutBreakdown(@PathVariable Long id) {
        log.debug("REST request to get WorkoutBreakdown : {}", id);
        Optional<WorkoutBreakdown> workoutBreakdown = workoutBreakdownRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workoutBreakdown);
    }

    /**
     * {@code DELETE  /workout-breakdowns/:id} : delete the workout breakdown by id.
     *
     * @param id the id of the workoutBreakdown to delete.
     */
    @DeleteMapping("/workout-breakdowns/{id}")
    public ResponseEntity<Void> deleteWorkoutBreakdown(@PathVariable Long id) {
        log.debug("REST request to delete WorkoutBreakdown : {}", id);
        workoutBreakdownRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
