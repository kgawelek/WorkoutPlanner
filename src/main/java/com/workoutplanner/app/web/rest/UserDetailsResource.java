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
