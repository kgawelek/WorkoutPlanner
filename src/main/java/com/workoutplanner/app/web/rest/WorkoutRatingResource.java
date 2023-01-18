package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.WorkoutRating;
import com.workoutplanner.app.repository.WorkoutRatingRepository;
import com.workoutplanner.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing WorkoutRating.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkoutRatingResource {

    private final Logger log = LoggerFactory.getLogger(WorkoutRatingResource.class);

    private static final String ENTITY_NAME = "workoutRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkoutRatingRepository workoutRatingRepository;

    public WorkoutRatingResource(WorkoutRatingRepository workoutRatingRepository) {
        this.workoutRatingRepository = workoutRatingRepository;
    }

    /**
     * {@code POST  /workout-ratings} : Create a new workout rating.
     *
     * @param workoutRating the workoutRating to create.
     */
    @PostMapping("/workout-ratings")
    public ResponseEntity<WorkoutRating> createWorkoutRating(@RequestBody WorkoutRating workoutRating) throws URISyntaxException {
        log.debug("REST request to save WorkoutRating : {}", workoutRating);
        if (workoutRating.getId() != null) {
            throw new BadRequestAlertException("A new workoutRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkoutRating result = workoutRatingRepository.save(workoutRating);
        return ResponseEntity.created(new URI("/api/workout-ratings/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /workout-ratings/:id} : Updates an existing workout rating.
     *
     * @param id the id of the workoutRating to save.
     * @param workoutRating the workoutRating to update.
     */
    @PutMapping("/workout-ratings/{id}")
    public ResponseEntity<WorkoutRating> updateWorkoutRating(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody WorkoutRating workoutRating
    ) throws URISyntaxException {
        log.debug("REST request to update WorkoutRating : {}, {}", id, workoutRating);
        if (workoutRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workoutRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WorkoutRating result = workoutRatingRepository.save(workoutRating);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /workout-ratings} : get all the workout ratings.
     *
     * @param filter the filter of the request.
     */
    @GetMapping("/workout-ratings")
    public List<WorkoutRating> getAllWorkoutRatings(@RequestParam(required = false) String filter) {
        if ("workout-is-null".equals(filter)) {
            log.debug("REST request to get all WorkoutRatings where workout is null");
            return StreamSupport
                .stream(workoutRatingRepository.findAll().spliterator(), false)
                .filter(workoutRating -> workoutRating.getWorkout() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all WorkoutRatings");
        return workoutRatingRepository.findAll();
    }

    /**
     * {@code GET  /workout-ratings/:id} : get the workout rating by id.
     *
     * @param id the id of the workoutRating to retrieve.
     */
    @GetMapping("/workout-ratings/{id}")
    public ResponseEntity<WorkoutRating> getWorkoutRating(@PathVariable Long id) {
        log.debug("REST request to get WorkoutRating : {}", id);
        Optional<WorkoutRating> workoutRating = workoutRatingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workoutRating);
    }

    /**
     * {@code DELETE  /workout-ratings/:id} : delete the workout rating by id.
     *
     * @param id the id of the workoutRating to delete.
     */
    @DeleteMapping("/workout-ratings/{id}")
    public ResponseEntity<Void> deleteWorkoutRating(@PathVariable Long id) {
        log.debug("REST request to delete WorkoutRating : {}", id);
        workoutRatingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
