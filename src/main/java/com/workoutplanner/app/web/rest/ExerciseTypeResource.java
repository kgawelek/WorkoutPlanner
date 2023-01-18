package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.ExerciseType;
import com.workoutplanner.app.repository.ExerciseTypeRepository;
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
 * REST controller for managing ExerciseType.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExerciseTypeResource {

    private final Logger log = LoggerFactory.getLogger(ExerciseTypeResource.class);

    private static final String ENTITY_NAME = "exerciseType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExerciseTypeRepository exerciseTypeRepository;

    public ExerciseTypeResource(ExerciseTypeRepository exerciseTypeRepository) {
        this.exerciseTypeRepository = exerciseTypeRepository;
    }

    /**
     * {@code POST  /exercise-types} : Create a new exerciseType.
     *
     * @param exerciseType the exerciseType to create.
     */
    @PostMapping("/exercise-types")
    public ResponseEntity<ExerciseType> createExerciseType(@RequestBody ExerciseType exerciseType) throws URISyntaxException {
        log.debug("REST request to save ExerciseType : {}", exerciseType);
        if (exerciseType.getId() != null) {
            throw new BadRequestAlertException("A new exerciseType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExerciseType result = exerciseTypeRepository.save(exerciseType);
        return ResponseEntity.created(new URI("/api/exercise-types/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /exercise-types/:id} : Updates an existing exerciseType.
     *
     * @param id the id of the exerciseType to save.
     * @param exerciseType the exerciseType to update.
     */
    @PutMapping("/exercise-types/{id}")
    public ResponseEntity<ExerciseType> updateExerciseType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExerciseType exerciseType
    ) throws URISyntaxException {
        log.debug("REST request to update ExerciseType : {}, {}", id, exerciseType);
        if (exerciseType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExerciseType result = exerciseTypeRepository.save(exerciseType);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /exercise-types} : get all the exercise types.
     */
    @GetMapping("/exercise-types")
    public List<ExerciseType> getAllExerciseTypes() {
        log.debug("REST request to get all ExerciseTypes");
        return exerciseTypeRepository.findAll();
    }

    /**
     * {@code GET  /exercise-types/:id} : get the exercise type by id.
     */
    @GetMapping("/exercise-types/{id}")
    public ResponseEntity<ExerciseType> getExerciseType(@PathVariable Long id) {
        log.debug("REST request to get ExerciseType : {}", id);
        Optional<ExerciseType> exerciseType = exerciseTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(exerciseType);
    }

    /**
     * {@code DELETE  /exercise-types/:id} : delete the exercise type by id.
     */
    @DeleteMapping("/exercise-types/{id}")
    public ResponseEntity<Void> deleteExerciseType(@PathVariable Long id) {
        log.debug("REST request to delete ExerciseType : {}", id);
        exerciseTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
