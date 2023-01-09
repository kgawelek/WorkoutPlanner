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
 * REST controller for managing {@link com.workoutplanner.app.domain.WorkoutBreakdown}.
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
     * {@code POST  /workout-breakdowns} : Create a new workoutBreakdown.
     *
     * @param workoutBreakdown the workoutBreakdown to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workoutBreakdown, or with status {@code 400 (Bad Request)} if the workoutBreakdown has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
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
        return ResponseEntity
            .created(new URI("/api/workout-breakdowns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /workout-breakdowns/:id} : Updates an existing workoutBreakdown.
     *
     * @param id the id of the workoutBreakdown to save.
     * @param workoutBreakdown the workoutBreakdown to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workoutBreakdown,
     * or with status {@code 400 (Bad Request)} if the workoutBreakdown is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workoutBreakdown couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
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
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, workoutBreakdown.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /workout-breakdowns/:id} : Partial updates given fields of an existing workoutBreakdown, field will ignore if it is null
     *
     * @param id the id of the workoutBreakdown to save.
     * @param workoutBreakdown the workoutBreakdown to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workoutBreakdown,
     * or with status {@code 400 (Bad Request)} if the workoutBreakdown is not valid,
     * or with status {@code 404 (Not Found)} if the workoutBreakdown is not found,
     * or with status {@code 500 (Internal Server Error)} if the workoutBreakdown couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/workout-breakdowns/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WorkoutBreakdown> partialUpdateWorkoutBreakdown(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WorkoutBreakdown workoutBreakdown
    ) throws URISyntaxException {
        log.debug("REST request to partial update WorkoutBreakdown partially : {}, {}", id, workoutBreakdown);
        if (workoutBreakdown.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workoutBreakdown.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutBreakdownRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WorkoutBreakdown> result = workoutBreakdownRepository
            .findById(workoutBreakdown.getId())
            .map(existingWorkoutBreakdown -> {
                if (workoutBreakdown.getDistance() != null) {
                    existingWorkoutBreakdown.setDistance(workoutBreakdown.getDistance());
                }
                if (workoutBreakdown.getDuration() != null) {
                    existingWorkoutBreakdown.setDuration(workoutBreakdown.getDuration());
                }
                if (workoutBreakdown.getDistanceUnit() != null) {
                    existingWorkoutBreakdown.setDistanceUnit(workoutBreakdown.getDistanceUnit());
                }
                if (workoutBreakdown.getNotes() != null) {
                    existingWorkoutBreakdown.setNotes(workoutBreakdown.getNotes());
                }
                if (workoutBreakdown.getMinValue() != null) {
                    existingWorkoutBreakdown.setMinValue(workoutBreakdown.getMinValue());
                }
                if (workoutBreakdown.getMaxValue() != null) {
                    existingWorkoutBreakdown.setMaxValue(workoutBreakdown.getMaxValue());
                }
                if (workoutBreakdown.getRangeUnit() != null) {
                    existingWorkoutBreakdown.setRangeUnit(workoutBreakdown.getRangeUnit());
                }
                if (workoutBreakdown.getOrder() != null) {
                    existingWorkoutBreakdown.setOrder(workoutBreakdown.getOrder());
                }

                return existingWorkoutBreakdown;
            })
            .map(workoutBreakdownRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, workoutBreakdown.getId().toString())
        );
    }

    /**
     * {@code GET  /workout-breakdowns} : get all the workoutBreakdowns.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workoutBreakdowns in body.
     */
    @GetMapping("/workout-breakdowns")
    public List<WorkoutBreakdown> getAllWorkoutBreakdowns() {
        log.debug("REST request to get all WorkoutBreakdowns");
        return workoutBreakdownRepository.findAll();
    }

    /**
     * {@code GET  /workout-breakdowns/:id} : get the "id" workoutBreakdown.
     *
     * @param id the id of the workoutBreakdown to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workoutBreakdown, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/workout-breakdowns/{id}")
    public ResponseEntity<WorkoutBreakdown> getWorkoutBreakdown(@PathVariable Long id) {
        log.debug("REST request to get WorkoutBreakdown : {}", id);
        Optional<WorkoutBreakdown> workoutBreakdown = workoutBreakdownRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workoutBreakdown);
    }

    /**
     * {@code DELETE  /workout-breakdowns/:id} : delete the "id" workoutBreakdown.
     *
     * @param id the id of the workoutBreakdown to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/workout-breakdowns/{id}")
    public ResponseEntity<Void> deleteWorkoutBreakdown(@PathVariable Long id) {
        log.debug("REST request to delete WorkoutBreakdown : {}", id);
        workoutBreakdownRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
