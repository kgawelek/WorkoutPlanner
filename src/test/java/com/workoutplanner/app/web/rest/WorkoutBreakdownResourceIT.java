package com.workoutplanner.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.workoutplanner.app.IntegrationTest;
import com.workoutplanner.app.domain.WorkoutBreakdown;
import com.workoutplanner.app.repository.WorkoutBreakdownRepository;
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
 * Integration tests for the {@link WorkoutBreakdownResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorkoutBreakdownResourceIT {

    private static final Double DEFAULT_DISTANCE = 1D;
    private static final Double UPDATED_DISTANCE = 2D;

    private static final Double DEFAULT_DURATION = 1D;
    private static final Double UPDATED_DURATION = 2D;

    private static final String DEFAULT_DISTANCE_UNIT = "AAAAAAAAAA";
    private static final String UPDATED_DISTANCE_UNIT = "BBBBBBBBBB";

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final Double DEFAULT_MIN_VALUE = 1D;
    private static final Double UPDATED_MIN_VALUE = 2D;

    private static final Double DEFAULT_MAX_VALUE = 1D;
    private static final Double UPDATED_MAX_VALUE = 2D;

    private static final String DEFAULT_RANGE_UNIT = "AAAAAAAAAA";
    private static final String UPDATED_RANGE_UNIT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/workout-breakdowns";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkoutBreakdownRepository workoutBreakdownRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkoutBreakdownMockMvc;

    private WorkoutBreakdown workoutBreakdown;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkoutBreakdown createEntity(EntityManager em) {
        WorkoutBreakdown workoutBreakdown = new WorkoutBreakdown()
            .distance(DEFAULT_DISTANCE)
            .duration(DEFAULT_DURATION)
            .distanceUnit(DEFAULT_DISTANCE_UNIT)
            .notes(DEFAULT_NOTES)
            .minValue(DEFAULT_MIN_VALUE)
            .maxValue(DEFAULT_MAX_VALUE)
            .rangeUnit(DEFAULT_RANGE_UNIT);
        return workoutBreakdown;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkoutBreakdown createUpdatedEntity(EntityManager em) {
        WorkoutBreakdown workoutBreakdown = new WorkoutBreakdown()
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION)
            .distanceUnit(UPDATED_DISTANCE_UNIT)
            .notes(UPDATED_NOTES)
            .minValue(UPDATED_MIN_VALUE)
            .maxValue(UPDATED_MAX_VALUE)
            .rangeUnit(UPDATED_RANGE_UNIT);
        return workoutBreakdown;
    }

    @BeforeEach
    public void initTest() {
        workoutBreakdown = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeCreate = workoutBreakdownRepository.findAll().size();
        // Create the WorkoutBreakdown
        restWorkoutBreakdownMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isCreated());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeCreate + 1);
        WorkoutBreakdown testWorkoutBreakdown = workoutBreakdownList.get(workoutBreakdownList.size() - 1);
        assertThat(testWorkoutBreakdown.getDistance()).isEqualTo(DEFAULT_DISTANCE);
        assertThat(testWorkoutBreakdown.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testWorkoutBreakdown.getDistanceUnit()).isEqualTo(DEFAULT_DISTANCE_UNIT);
        assertThat(testWorkoutBreakdown.getNotes()).isEqualTo(DEFAULT_NOTES);
        assertThat(testWorkoutBreakdown.getMinValue()).isEqualTo(DEFAULT_MIN_VALUE);
        assertThat(testWorkoutBreakdown.getMaxValue()).isEqualTo(DEFAULT_MAX_VALUE);
        assertThat(testWorkoutBreakdown.getRangeUnit()).isEqualTo(DEFAULT_RANGE_UNIT);
    }

    @Test
    @Transactional
    void createWorkoutBreakdownWithExistingId() throws Exception {
        // Create the WorkoutBreakdown with an existing ID
        workoutBreakdown.setId(1L);

        int databaseSizeBeforeCreate = workoutBreakdownRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkoutBreakdownMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWorkoutBreakdowns() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        // Get all the workoutBreakdownList
        restWorkoutBreakdownMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workoutBreakdown.getId().intValue())))
            .andExpect(jsonPath("$.[*].distance").value(hasItem(DEFAULT_DISTANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION.doubleValue())))
            .andExpect(jsonPath("$.[*].distanceUnit").value(hasItem(DEFAULT_DISTANCE_UNIT)))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)))
            .andExpect(jsonPath("$.[*].minValue").value(hasItem(DEFAULT_MIN_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].maxValue").value(hasItem(DEFAULT_MAX_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].rangeUnit").value(hasItem(DEFAULT_RANGE_UNIT)));
    }

    @Test
    @Transactional
    void getWorkoutBreakdown() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        // Get the workoutBreakdown
        restWorkoutBreakdownMockMvc
            .perform(get(ENTITY_API_URL_ID, workoutBreakdown.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workoutBreakdown.getId().intValue()))
            .andExpect(jsonPath("$.distance").value(DEFAULT_DISTANCE.doubleValue()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION.doubleValue()))
            .andExpect(jsonPath("$.distanceUnit").value(DEFAULT_DISTANCE_UNIT))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES))
            .andExpect(jsonPath("$.minValue").value(DEFAULT_MIN_VALUE.doubleValue()))
            .andExpect(jsonPath("$.maxValue").value(DEFAULT_MAX_VALUE.doubleValue()))
            .andExpect(jsonPath("$.rangeUnit").value(DEFAULT_RANGE_UNIT));
    }

    @Test
    @Transactional
    void getNonExistingWorkoutBreakdown() throws Exception {
        // Get the workoutBreakdown
        restWorkoutBreakdownMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWorkoutBreakdown() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();

        // Update the workoutBreakdown
        WorkoutBreakdown updatedWorkoutBreakdown = workoutBreakdownRepository.findById(workoutBreakdown.getId()).get();
        // Disconnect from session so that the updates on updatedWorkoutBreakdown are not directly saved in db
        em.detach(updatedWorkoutBreakdown);
        updatedWorkoutBreakdown
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION)
            .distanceUnit(UPDATED_DISTANCE_UNIT)
            .notes(UPDATED_NOTES)
            .minValue(UPDATED_MIN_VALUE)
            .maxValue(UPDATED_MAX_VALUE)
            .rangeUnit(UPDATED_RANGE_UNIT);

        restWorkoutBreakdownMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorkoutBreakdown.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorkoutBreakdown))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
        WorkoutBreakdown testWorkoutBreakdown = workoutBreakdownList.get(workoutBreakdownList.size() - 1);
        assertThat(testWorkoutBreakdown.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testWorkoutBreakdown.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testWorkoutBreakdown.getDistanceUnit()).isEqualTo(UPDATED_DISTANCE_UNIT);
        assertThat(testWorkoutBreakdown.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testWorkoutBreakdown.getMinValue()).isEqualTo(UPDATED_MIN_VALUE);
        assertThat(testWorkoutBreakdown.getMaxValue()).isEqualTo(UPDATED_MAX_VALUE);
        assertThat(testWorkoutBreakdown.getRangeUnit()).isEqualTo(UPDATED_RANGE_UNIT);
    }

    @Test
    @Transactional
    void putNonExistingWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workoutBreakdown.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkoutBreakdownWithPatch() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();

        // Update the workoutBreakdown using partial update
        WorkoutBreakdown partialUpdatedWorkoutBreakdown = new WorkoutBreakdown();
        partialUpdatedWorkoutBreakdown.setId(workoutBreakdown.getId());

        partialUpdatedWorkoutBreakdown
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION)
            .notes(UPDATED_NOTES)
            .minValue(UPDATED_MIN_VALUE)
            .maxValue(UPDATED_MAX_VALUE);

        restWorkoutBreakdownMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkoutBreakdown.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkoutBreakdown))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
        WorkoutBreakdown testWorkoutBreakdown = workoutBreakdownList.get(workoutBreakdownList.size() - 1);
        assertThat(testWorkoutBreakdown.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testWorkoutBreakdown.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testWorkoutBreakdown.getDistanceUnit()).isEqualTo(DEFAULT_DISTANCE_UNIT);
        assertThat(testWorkoutBreakdown.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testWorkoutBreakdown.getMinValue()).isEqualTo(UPDATED_MIN_VALUE);
        assertThat(testWorkoutBreakdown.getMaxValue()).isEqualTo(UPDATED_MAX_VALUE);
        assertThat(testWorkoutBreakdown.getRangeUnit()).isEqualTo(DEFAULT_RANGE_UNIT);
    }

    @Test
    @Transactional
    void fullUpdateWorkoutBreakdownWithPatch() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();

        // Update the workoutBreakdown using partial update
        WorkoutBreakdown partialUpdatedWorkoutBreakdown = new WorkoutBreakdown();
        partialUpdatedWorkoutBreakdown.setId(workoutBreakdown.getId());

        partialUpdatedWorkoutBreakdown
            .distance(UPDATED_DISTANCE)
            .duration(UPDATED_DURATION)
            .distanceUnit(UPDATED_DISTANCE_UNIT)
            .notes(UPDATED_NOTES)
            .minValue(UPDATED_MIN_VALUE)
            .maxValue(UPDATED_MAX_VALUE)
            .rangeUnit(UPDATED_RANGE_UNIT);

        restWorkoutBreakdownMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkoutBreakdown.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkoutBreakdown))
            )
            .andExpect(status().isOk());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
        WorkoutBreakdown testWorkoutBreakdown = workoutBreakdownList.get(workoutBreakdownList.size() - 1);
        assertThat(testWorkoutBreakdown.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testWorkoutBreakdown.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testWorkoutBreakdown.getDistanceUnit()).isEqualTo(UPDATED_DISTANCE_UNIT);
        assertThat(testWorkoutBreakdown.getNotes()).isEqualTo(UPDATED_NOTES);
        assertThat(testWorkoutBreakdown.getMinValue()).isEqualTo(UPDATED_MIN_VALUE);
        assertThat(testWorkoutBreakdown.getMaxValue()).isEqualTo(UPDATED_MAX_VALUE);
        assertThat(testWorkoutBreakdown.getRangeUnit()).isEqualTo(UPDATED_RANGE_UNIT);
    }

    @Test
    @Transactional
    void patchNonExistingWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workoutBreakdown.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkoutBreakdown() throws Exception {
        int databaseSizeBeforeUpdate = workoutBreakdownRepository.findAll().size();
        workoutBreakdown.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkoutBreakdownMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workoutBreakdown))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkoutBreakdown in the database
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkoutBreakdown() throws Exception {
        // Initialize the database
        workoutBreakdownRepository.saveAndFlush(workoutBreakdown);

        int databaseSizeBeforeDelete = workoutBreakdownRepository.findAll().size();

        // Delete the workoutBreakdown
        restWorkoutBreakdownMockMvc
            .perform(delete(ENTITY_API_URL_ID, workoutBreakdown.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkoutBreakdown> workoutBreakdownList = workoutBreakdownRepository.findAll();
        assertThat(workoutBreakdownList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
