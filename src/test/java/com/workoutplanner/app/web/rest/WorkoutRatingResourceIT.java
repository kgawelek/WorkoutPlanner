package com.workoutplanner.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.workoutplanner.app.IntegrationTest;
import com.workoutplanner.app.domain.WorkoutRating;
import com.workoutplanner.app.domain.enumeration.RatingScale;
import com.workoutplanner.app.repository.WorkoutRatingRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link WorkoutRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorkoutRatingResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final RatingScale DEFAULT_RATE = RatingScale.EFFORTLESS;
    private static final RatingScale UPDATED_RATE = RatingScale.EASY;

    private static final String ENTITY_API_URL = "/api/workout-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkoutRatingRepository workoutRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkoutRatingMockMvc;

    private WorkoutRating workoutRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkoutRating createEntity(EntityManager em) {
        WorkoutRating workoutRating = new WorkoutRating().comment(DEFAULT_COMMENT).rate(DEFAULT_RATE);
        return workoutRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkoutRating createUpdatedEntity(EntityManager em) {
        WorkoutRating workoutRating = new WorkoutRating().comment(UPDATED_COMMENT).rate(UPDATED_RATE);
        return workoutRating;
    }

    @BeforeEach
    public void initTest() {
        workoutRating = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkoutRating() throws Exception {
        int databaseSizeBeforeCreate = workoutRatingRepository.findAll().size();
        // Create the WorkoutRating
        restWorkoutRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isCreated());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeCreate + 1);
        WorkoutRating testWorkoutRating = workoutRatingList.get(workoutRatingList.size() - 1);
        assertThat(testWorkoutRating.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testWorkoutRating.getRate()).isEqualTo(DEFAULT_RATE);
    }

    @Test
    @Transactional
    void createWorkoutRatingWithExistingId() throws Exception {
        // Create the WorkoutRating with an existing ID
        workoutRating.setId(1L);

        int databaseSizeBeforeCreate = workoutRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkoutRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWorkoutRatings() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        // Get all the workoutRatingList
        restWorkoutRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workoutRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].rate").value(hasItem(DEFAULT_RATE.toString())));
    }

    @Test
    @Transactional
    void getWorkoutRating() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        // Get the workoutRating
        restWorkoutRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, workoutRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workoutRating.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.rate").value(DEFAULT_RATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWorkoutRating() throws Exception {
        // Get the workoutRating
        restWorkoutRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWorkoutRating() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();

        // Update the workoutRating
        WorkoutRating updatedWorkoutRating = workoutRatingRepository.findById(workoutRating.getId()).get();
        // Disconnect from session so that the updates on updatedWorkoutRating are not directly saved in db
        em.detach(updatedWorkoutRating);
        updatedWorkoutRating.comment(UPDATED_COMMENT).rate(UPDATED_RATE);

        restWorkoutRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorkoutRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorkoutRating))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
        WorkoutRating testWorkoutRating = workoutRatingList.get(workoutRatingList.size() - 1);
        assertThat(testWorkoutRating.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testWorkoutRating.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void putNonExistingWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workoutRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkoutRatingWithPatch() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();

        // Update the workoutRating using partial update
        WorkoutRating partialUpdatedWorkoutRating = new WorkoutRating();
        partialUpdatedWorkoutRating.setId(workoutRating.getId());

        partialUpdatedWorkoutRating.rate(UPDATED_RATE);

        restWorkoutRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkoutRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkoutRating))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
        WorkoutRating testWorkoutRating = workoutRatingList.get(workoutRatingList.size() - 1);
        assertThat(testWorkoutRating.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testWorkoutRating.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void fullUpdateWorkoutRatingWithPatch() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();

        // Update the workoutRating using partial update
        WorkoutRating partialUpdatedWorkoutRating = new WorkoutRating();
        partialUpdatedWorkoutRating.setId(workoutRating.getId());

        partialUpdatedWorkoutRating.comment(UPDATED_COMMENT).rate(UPDATED_RATE);

        restWorkoutRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkoutRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkoutRating))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
        WorkoutRating testWorkoutRating = workoutRatingList.get(workoutRatingList.size() - 1);
        assertThat(testWorkoutRating.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testWorkoutRating.getRate()).isEqualTo(UPDATED_RATE);
    }

    @Test
    @Transactional
    void patchNonExistingWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workoutRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkoutRating() throws Exception {
        int databaseSizeBeforeUpdate = workoutRatingRepository.findAll().size();
        workoutRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkoutRating in the database
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkoutRating() throws Exception {
        // Initialize the database
        workoutRatingRepository.saveAndFlush(workoutRating);

        int databaseSizeBeforeDelete = workoutRatingRepository.findAll().size();

        // Delete the workoutRating
        restWorkoutRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, workoutRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkoutRating> workoutRatingList = workoutRatingRepository.findAll();
        assertThat(workoutRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
