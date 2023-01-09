package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.User;
import com.workoutplanner.app.domain.UserDetails;
import com.workoutplanner.app.domain.Workout;
import com.workoutplanner.app.domain.enumeration.Status;
import com.workoutplanner.app.domain.enumeration.WorkoutType;
import com.workoutplanner.app.repository.SportDisciplineRepository;
import com.workoutplanner.app.repository.UserDetailsRepository;
import com.workoutplanner.app.repository.WorkoutRatingRepository;
import com.workoutplanner.app.repository.WorkoutRepository;
import com.workoutplanner.app.service.UserService;
import com.workoutplanner.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.workoutplanner.app.domain.Workout}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkoutResource {

    private final Logger log = LoggerFactory.getLogger(WorkoutResource.class);

    private static final String ENTITY_NAME = "workout";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkoutRepository workoutRepository;
    private final UserService userService;
    private final UserDetailsRepository userDetailsRepository;
    private final WorkoutRatingRepository workoutRatingRepository;
    private final SportDisciplineRepository sportDisciplineRepository;

    public WorkoutResource(
        WorkoutRepository workoutRepository,
        UserService userService,
        UserDetailsRepository userDetailsRepository,
        WorkoutRatingRepository workoutRatingRepository,
        SportDisciplineRepository sportDisciplineRepository
    ) {
        this.workoutRepository = workoutRepository;
        this.userService = userService;
        this.userDetailsRepository = userDetailsRepository;
        this.workoutRatingRepository = workoutRatingRepository;
        this.sportDisciplineRepository = sportDisciplineRepository;
    }

    /**
     * {@code POST  /workouts} : Create a new workout.
     *
     * @param workout the workout to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workout, or with status {@code 400 (Bad Request)} if the workout has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/workouts")
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout) throws URISyntaxException {
        log.debug("REST request to save Workout : {}", workout);
        if (workout.getId() != null) {
            throw new BadRequestAlertException("A new workout cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<User> user = userService.getUserWithAuthorities();
        if (workout.getUserDetails() == null && user.isPresent()) {
            UserDetails userDetails = userDetailsRepository.getReferenceById(user.get().getId());
            workout.setUserDetails(userDetails);
        }

        if (workout.getWorkoutRating() != null && workout.getWorkoutRating().getId() == null) {
            workoutRatingRepository.save(workout.getWorkoutRating());
        }
        if (workout.getStatus() == null) {
            workout.setStatus(Status.PLANNED);
        }
        if (workout.getType() == null) {
            workout.setType(WorkoutType.GENERAL);
        }
        if (!WorkoutType.EXERCISE.equals(workout.getType())) workout.setExercises(new HashSet<>());
        if (!WorkoutType.INTERVAL.equals(workout.getType())) workout.setWorkoutBreakdowns(new HashSet<>());
        Workout result = workoutRepository.save(workout);
        return ResponseEntity
            .created(new URI("/api/workouts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /workouts/:id} : Updates an existing workout.
     *
     * @param id the id of the workout to save.
     * @param workout the workout to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workout,
     * or with status {@code 400 (Bad Request)} if the workout is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workout couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/workouts/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable(value = "id", required = false) final Long id, @RequestBody Workout workout)
        throws URISyntaxException {
        log.debug("REST request to update Workout : {}, {}", id, workout);
        if (workout.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workout.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workoutRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        if (workout.getWorkoutRating() != null && workout.getWorkoutRating().getId() == null) {
            workoutRatingRepository.save(workout.getWorkoutRating());
        }
        if (!WorkoutType.EXERCISE.equals(workout.getType())) workout.setExercises(new HashSet<>());
        if (!WorkoutType.INTERVAL.equals(workout.getType())) workout.setWorkoutBreakdowns(new HashSet<>());
        Workout result = workoutRepository.save(workout);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, workout.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /workouts} : get all the workouts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workouts in body.
     */
    @GetMapping("/workouts")
    public List<Workout> getAllWorkouts() {
        log.debug("REST request to get all Workouts");
        Optional<User> user = userService.getUserWithAuthorities();
        if (
            user.get().getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getName()))
        ) return workoutRepository.findAll(); else return workoutRepository.findWorkoutByUserDetails(
            userService.getUserWithAuthorities().get().getId()
        );
    }

    /**
     * {@code GET  /workouts/:id} : get the "id" workout.
     *
     * @param id the id of the workout to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workout,
     * or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/workouts/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable Long id) {
        log.debug("REST request to get Workout : {}", id);
        Optional<Workout> workout = workoutRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workout);
    }

    /**
     * {@code DELETE  /workouts/:id} : delete the "id" workout.
     *
     * @param id the id of the workout to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        log.debug("REST request to delete Workout : {}", id);
        workoutRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
