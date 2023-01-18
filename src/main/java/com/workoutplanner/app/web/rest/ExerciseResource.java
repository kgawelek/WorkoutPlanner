package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.Exercise;
import com.workoutplanner.app.repository.ExerciseRepository;
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
 * REST controller for managing Exercise.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExerciseResource {

    private final Logger log = LoggerFactory.getLogger(ExerciseResource.class);

    private static final String ENTITY_NAME = "exercise";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExerciseRepository exerciseRepository;

    public ExerciseResource(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    /**
     * {@code POST  /exercises} : Create a new exercise.
     *
     * @param exercise the exercise to save.
     */
    @PostMapping("/exercises")
    public ResponseEntity<Exercise> createExercise(@RequestBody Exercise exercise) throws URISyntaxException {
        log.debug("REST request to save Exercise : {}", exercise);
        if (exercise.getId() != null) {
            throw new BadRequestAlertException("A new exercise cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Integer exerciseOrder = exercise.getWorkout().getExercises() != null ? exercise.getWorkout().getExercises().size() : 0;
        exercise.setOrder(exerciseOrder);
        Exercise result = exerciseRepository.save(exercise);
        return ResponseEntity.created(new URI("/api/exercises/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /exercises/:id} : Updates existing exercise.
     *
     * @param id the id of the exercise to update.
     * @param exercise the exercise to update.
     */
    @PutMapping("/exercises/{id}")
    public ResponseEntity<Exercise> updateExercise(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Exercise exercise
    ) throws URISyntaxException {
        log.debug("REST request to update Exercise : {}, {}", id, exercise);
        if (exercise.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exercise.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Exercise result = exerciseRepository.save(exercise);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /exercises} : get all exercises.
     *
     */
    @GetMapping("/exercises")
    public List<Exercise> getAllExercises() {
        log.debug("REST request to get all Exercises");
        return exerciseRepository.findAll();
    }

    /**
     * {@code GET  /exercises/:id} : get the exercise by id.
     *
     * @param id the id of the exercise to retrieve.
     */
    @GetMapping("/exercises/{id}")
    public ResponseEntity<Exercise> getExercise(@PathVariable Long id) {
        log.debug("REST request to get Exercise : {}", id);
        Optional<Exercise> exercise = exerciseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(exercise);
    }

    /**
     * {@code DELETE  /exercises/:id} : delete the exercise by id.
     *
     * @param id the id of the exercise to delete.
     */
    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        log.debug("REST request to delete Exercise : {}", id);
        exerciseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
