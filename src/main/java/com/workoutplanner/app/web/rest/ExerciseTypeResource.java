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
 * REST controller for managing {@link com.workoutplanner.app.domain.ExerciseType}.
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
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exerciseType, or with status {@code 400 (Bad Request)} if the exerciseType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
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
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseType,
     * or with status {@code 400 (Bad Request)} if the exerciseType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exerciseType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
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
     * {@code PATCH  /exercise-types/:id} : Partial updates given fields of an existing exerciseType, field will ignore if it is null
     *
     * @param id the id of the exerciseType to save.
     * @param exerciseType the exerciseType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exerciseType,
     * or with status {@code 400 (Bad Request)} if the exerciseType is not valid,
     * or with status {@code 404 (Not Found)} if the exerciseType is not found,
     * or with status {@code 500 (Internal Server Error)} if the exerciseType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exercise-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExerciseType> partialUpdateExerciseType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExerciseType exerciseType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExerciseType partially : {}, {}", id, exerciseType);
        if (exerciseType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exerciseType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exerciseTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExerciseType> result = exerciseTypeRepository
            .findById(exerciseType.getId())
            .map(existingExerciseType -> {
                if (exerciseType.getName() != null) {
                    existingExerciseType.setName(exerciseType.getName());
                }
                if (exerciseType.getDescription() != null) {
                    existingExerciseType.setDescription(exerciseType.getDescription());
                }

                return existingExerciseType;
            })
            .map(exerciseTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, exerciseType.getId().toString())
        );
    }

    /**
     * {@code GET  /exercise-types} : get all the exerciseTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exerciseTypes in body.
     */
    @GetMapping("/exercise-types")
    public List<ExerciseType> getAllExerciseTypes() {
        log.debug("REST request to get all ExerciseTypes");
        return exerciseTypeRepository.findAll();
    }

    /**
     * {@code GET  /exercise-types/:id} : get the "id" exerciseType.
     *
     * @param id the id of the exerciseType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exerciseType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exercise-types/{id}")
    public ResponseEntity<ExerciseType> getExerciseType(@PathVariable Long id) {
        log.debug("REST request to get ExerciseType : {}", id);
        Optional<ExerciseType> exerciseType = exerciseTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(exerciseType);
    }

    /**
     * {@code DELETE  /exercise-types/:id} : delete the "id" exerciseType.
     *
     * @param id the id of the exerciseType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
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
