package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.SportDiscipline;
import com.workoutplanner.app.domain.User;
import com.workoutplanner.app.domain.UserDetails;
import com.workoutplanner.app.repository.UserDetailsRepository;
import com.workoutplanner.app.repository.UserRepository;
import com.workoutplanner.app.service.UserService;
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
 * REST controller for managing UserDetails.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserDetailsResource {

    private final Logger log = LoggerFactory.getLogger(UserDetailsResource.class);

    private static final String ENTITY_NAME = "userDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserDetailsRepository userDetailsRepository;

    private final UserRepository userRepository;
    private final UserService userService;

    public UserDetailsResource(UserDetailsRepository userDetailsRepository, UserRepository userRepository, UserService userService) {
        this.userDetailsRepository = userDetailsRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /user-details} : Create a new userDetails.
     *
     * @param userDetails the userDetails to create.
     */
    @PostMapping("/user-details")
    public ResponseEntity<UserDetails> createUserDetails(@RequestBody UserDetails userDetails) throws URISyntaxException {
        log.debug("REST request to save UserDetails : {}", userDetails);
        if (userDetails.getId() != null) {
            throw new BadRequestAlertException("A new userDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(userDetails.getUser())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        Long userId = userDetails.getUser().getId();
        userRepository.findById(userId).ifPresent(userDetails::user);
        UserDetails result = userDetailsRepository.save(userDetails);
        return ResponseEntity.created(new URI("/api/user-details/" + result.getId())).body(result);
    }

    /**
     * {@code PUT  /user-details/:id} : Updates an existing userDetails.
     *
     * @param id the id of the userDetails to save.
     * @param userDetails the userDetails to update.
     */
    @PutMapping("/user-details/{id}")
    public ResponseEntity<UserDetails> updateUserDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserDetails userDetails
    ) throws URISyntaxException {
        log.debug("REST request to update UserDetails : {}, {}", id, userDetails);
        if (userDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserDetails result = userDetailsRepository.save(userDetails);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET  /user-details} : get all the userDetails.
     */
    @GetMapping("/user-details")
    @Transactional(readOnly = true)
    public List<UserDetails> getAllUserDetails() {
        log.debug("REST request to get all UserDetails");
        return userDetailsRepository.findAll();
    }

    /**
     * {@code GET  /user-details/:id} : get the user details by id.
     *
     * @param id the id of the userDetails to retrieve.
     */
    @GetMapping("/user-details/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<UserDetails> getUserDetails(@PathVariable Long id) {
        log.debug("REST request to get UserDetails : {}", id);
        Optional<UserDetails> userDetails = userDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userDetails);
    }

    /**
     * {@code POST /user-details/sport-discipline}: updates favourite sport discipline
     * @param sportDiscipline new favourite discipline
     */
    @PostMapping("/user-details/sport-discipline")
    public void updateFavouriteDiscipline(@RequestBody SportDiscipline sportDiscipline) {
        log.debug("REST request to change favourite sport discipline");
        Long userId = userService.getUserWithAuthorities().get().getId();
        Optional<UserDetails> user = userDetailsRepository.findById(userId);
        if (user.isPresent()) {
            user.get().setSportDiscipline(sportDiscipline);
            userDetailsRepository.save(user.get());
        }
    }

    /**
     * {@code GET /user-details/sport-discipline}: get user's favourite sport discipline
     */
    @GetMapping("/user-details/sport-discipline")
    public SportDiscipline getUsersFavouriteSportDiscipline() {
        log.debug("REST request to get user's favourite sport discipline");
        Long userId = userService.getUserWithAuthorities().get().getId();
        Optional<UserDetails> user = userDetailsRepository.findById(userId);
        return user.get().getSportDiscipline();
    }
}
