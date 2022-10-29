package com.workoutplanner.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.workoutplanner.app.IntegrationTest;
import com.workoutplanner.app.domain.ExerciseType;
import com.workoutplanner.app.repository.ExerciseTypeRepository;
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
 * Integration tests for the {@link ExerciseTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExerciseTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/exercise-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExerciseTypeRepository exerciseTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExerciseTypeMockMvc;

    private ExerciseType exerciseType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExerciseType createEntity(EntityManager em) {
        ExerciseType exerciseType = new ExerciseType().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return exerciseType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExerciseType createUpdatedEntity(EntityManager em) {
        ExerciseType exerciseType = new ExerciseType().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return exerciseType;
    }

    @BeforeEach
    public void initTest() {
        exerciseType = createEntity(em);
    }

    @Test
    @Transactional
    void createExerciseType() throws Exception {
        int databaseSizeBeforeCreate = exerciseTypeRepository.findAll().size();
        // Create the ExerciseType
        restExerciseTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isCreated());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ExerciseType testExerciseType = exerciseTypeList.get(exerciseTypeList.size() - 1);
        assertThat(testExerciseType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testExerciseType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createExerciseTypeWithExistingId() throws Exception {
        // Create the ExerciseType with an existing ID
        exerciseType.setId(1L);

        int databaseSizeBeforeCreate = exerciseTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExerciseTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExerciseTypes() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        // Get all the exerciseTypeList
        restExerciseTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(exerciseType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getExerciseType() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        // Get the exerciseType
        restExerciseTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, exerciseType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(exerciseType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingExerciseType() throws Exception {
        // Get the exerciseType
        restExerciseTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExerciseType() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();

        // Update the exerciseType
        ExerciseType updatedExerciseType = exerciseTypeRepository.findById(exerciseType.getId()).get();
        // Disconnect from session so that the updates on updatedExerciseType are not directly saved in db
        em.detach(updatedExerciseType);
        updatedExerciseType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restExerciseTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExerciseType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExerciseType))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
        ExerciseType testExerciseType = exerciseTypeList.get(exerciseTypeList.size() - 1);
        assertThat(testExerciseType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExerciseType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, exerciseType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExerciseTypeWithPatch() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();

        // Update the exerciseType using partial update
        ExerciseType partialUpdatedExerciseType = new ExerciseType();
        partialUpdatedExerciseType.setId(exerciseType.getId());

        restExerciseTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExerciseType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExerciseType))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
        ExerciseType testExerciseType = exerciseTypeList.get(exerciseTypeList.size() - 1);
        assertThat(testExerciseType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testExerciseType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateExerciseTypeWithPatch() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();

        // Update the exerciseType using partial update
        ExerciseType partialUpdatedExerciseType = new ExerciseType();
        partialUpdatedExerciseType.setId(exerciseType.getId());

        partialUpdatedExerciseType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restExerciseTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExerciseType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExerciseType))
            )
            .andExpect(status().isOk());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
        ExerciseType testExerciseType = exerciseTypeList.get(exerciseTypeList.size() - 1);
        assertThat(testExerciseType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExerciseType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, exerciseType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExerciseType() throws Exception {
        int databaseSizeBeforeUpdate = exerciseTypeRepository.findAll().size();
        exerciseType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExerciseTypeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(exerciseType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExerciseType in the database
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExerciseType() throws Exception {
        // Initialize the database
        exerciseTypeRepository.saveAndFlush(exerciseType);

        int databaseSizeBeforeDelete = exerciseTypeRepository.findAll().size();

        // Delete the exerciseType
        restExerciseTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, exerciseType.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExerciseType> exerciseTypeList = exerciseTypeRepository.findAll();
        assertThat(exerciseTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
