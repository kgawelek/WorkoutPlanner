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
 * REST controller for managing SportDiscipline.
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
     * {@code POST  /sport-disciplines} : Create a new sport discipline.
     *
     * @param sportDiscipline the sportDiscipline to create.
     */
    @PostMapping("/sport-disciplines")
    public ResponseEntity<SportDiscipline> createSportDiscipline(@RequestBody SportDiscipline sportDiscipline) throws URISyntaxException {
        log.debug("REST request to save SportDiscipline : {}", sportDiscipline);
        if (sportDiscipline.getId() != null) {
            throw new BadRequestAlertException("A new sportDiscipline cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SportDiscipline result = sportDisciplineRepository.save(sportDiscipline);
        return ResponseEntity.created(new URI("/api/sport-disciplines/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /sport-disciplines/:id} : Updates an existing sportDiscipline.
     *
     * @param id the id of the sportDiscipline to save.
     * @param sportDiscipline the sportDiscipline to update.
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
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /sport-disciplines} : get all sport disciplines.
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
     */
    @GetMapping("/sport-disciplines/{id}")
    public ResponseEntity<SportDiscipline> getSportDiscipline(@PathVariable Long id) {
        log.debug("REST request to get SportDiscipline : {}", id);
        Optional<SportDiscipline> sportDiscipline = sportDisciplineRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sportDiscipline);
    }

    /**
     * {@code DELETE  /sport-disciplines/:id} : delete the sport discipline by id.
     *
     * @param id the id of the sportDiscipline to delete.
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
