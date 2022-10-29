package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.SportDiscipline;
import com.workoutplanner.app.repository.SportDisciplineRepository;
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
 * REST controller for managing {@link com.workoutplanner.app.domain.SportDiscipline}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SportDisciplineResource {

    private final Logger log = LoggerFactory.getLogger(SportDisciplineResource.class);

    private static final String ENTITY_NAME = "sportDiscipline";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SportDisciplineRepository sportDisciplineRepository;

    public SportDisciplineResource(SportDisciplineRepository sportDisciplineRepository) {
        this.sportDisciplineRepository = sportDisciplineRepository;
    }

    /**
     * {@code POST  /sport-disciplines} : Create a new sportDiscipline.
     *
     * @param sportDiscipline the sportDiscipline to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sportDiscipline, or with status {@code 400 (Bad Request)} if the sportDiscipline has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sport-disciplines")
    public ResponseEntity<SportDiscipline> createSportDiscipline(@RequestBody SportDiscipline sportDiscipline) throws URISyntaxException {
        log.debug("REST request to save SportDiscipline : {}", sportDiscipline);
        if (sportDiscipline.getId() != null) {
            throw new BadRequestAlertException("A new sportDiscipline cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SportDiscipline result = sportDisciplineRepository.save(sportDiscipline);
        return ResponseEntity
            .created(new URI("/api/sport-disciplines/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sport-disciplines/:id} : Updates an existing sportDiscipline.
     *
     * @param id the id of the sportDiscipline to save.
     * @param sportDiscipline the sportDiscipline to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sportDiscipline,
     * or with status {@code 400 (Bad Request)} if the sportDiscipline is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sportDiscipline couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sport-disciplines/{id}")
    public ResponseEntity<SportDiscipline> updateSportDiscipline(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SportDiscipline sportDiscipline
    ) throws URISyntaxException {
        log.debug("REST request to update SportDiscipline : {}, {}", id, sportDiscipline);
        if (sportDiscipline.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sportDiscipline.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sportDisciplineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SportDiscipline result = sportDisciplineRepository.save(sportDiscipline);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sportDiscipline.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sport-disciplines/:id} : Partial updates given fields of an existing sportDiscipline, field will ignore if it is null
     *
     * @param id the id of the sportDiscipline to save.
     * @param sportDiscipline the sportDiscipline to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sportDiscipline,
     * or with status {@code 400 (Bad Request)} if the sportDiscipline is not valid,
     * or with status {@code 404 (Not Found)} if the sportDiscipline is not found,
     * or with status {@code 500 (Internal Server Error)} if the sportDiscipline couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sport-disciplines/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SportDiscipline> partialUpdateSportDiscipline(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SportDiscipline sportDiscipline
    ) throws URISyntaxException {
        log.debug("REST request to partial update SportDiscipline partially : {}, {}", id, sportDiscipline);
        if (sportDiscipline.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sportDiscipline.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sportDisciplineRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SportDiscipline> result = sportDisciplineRepository
            .findById(sportDiscipline.getId())
            .map(existingSportDiscipline -> {
                if (sportDiscipline.getName() != null) {
                    existingSportDiscipline.setName(sportDiscipline.getName());
                }

                return existingSportDiscipline;
            })
            .map(sportDisciplineRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sportDiscipline.getId().toString())
        );
    }

    /**
     * {@code GET  /sport-disciplines} : get all the sportDisciplines.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sportDisciplines in body.
     */
    @GetMapping("/sport-disciplines")
    public List<SportDiscipline> getAllSportDisciplines() {
        log.debug("REST request to get all SportDisciplines");
        return sportDisciplineRepository.findAll();
    }

    /**
     * {@code GET  /sport-disciplines/:id} : get the "id" sportDiscipline.
     *
     * @param id the id of the sportDiscipline to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sportDiscipline, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sport-disciplines/{id}")
    public ResponseEntity<SportDiscipline> getSportDiscipline(@PathVariable Long id) {
        log.debug("REST request to get SportDiscipline : {}", id);
        Optional<SportDiscipline> sportDiscipline = sportDisciplineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sportDiscipline);
    }

    /**
     * {@code DELETE  /sport-disciplines/:id} : delete the "id" sportDiscipline.
     *
     * @param id the id of the sportDiscipline to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sport-disciplines/{id}")
    public ResponseEntity<Void> deleteSportDiscipline(@PathVariable Long id) {
        log.debug("REST request to delete SportDiscipline : {}", id);
        sportDisciplineRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
