package com.workoutplanner.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.workoutplanner.app.IntegrationTest;
import com.workoutplanner.app.domain.SportDiscipline;
import com.workoutplanner.app.repository.SportDisciplineRepository;
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
 * Integration tests for the {@link SportDisciplineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SportDisciplineResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sport-disciplines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SportDisciplineRepository sportDisciplineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSportDisciplineMockMvc;

    private SportDiscipline sportDiscipline;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SportDiscipline createEntity(EntityManager em) {
        SportDiscipline sportDiscipline = new SportDiscipline().name(DEFAULT_NAME);
        return sportDiscipline;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SportDiscipline createUpdatedEntity(EntityManager em) {
        SportDiscipline sportDiscipline = new SportDiscipline().name(UPDATED_NAME);
        return sportDiscipline;
    }

    @BeforeEach
    public void initTest() {
        sportDiscipline = createEntity(em);
    }

    @Test
    @Transactional
    void createSportDiscipline() throws Exception {
        int databaseSizeBeforeCreate = sportDisciplineRepository.findAll().size();
        // Create the SportDiscipline
        restSportDisciplineMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isCreated());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeCreate + 1);
        SportDiscipline testSportDiscipline = sportDisciplineList.get(sportDisciplineList.size() - 1);
        assertThat(testSportDiscipline.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createSportDisciplineWithExistingId() throws Exception {
        // Create the SportDiscipline with an existing ID
        sportDiscipline.setId(1L);

        int databaseSizeBeforeCreate = sportDisciplineRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSportDisciplineMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isBadRequest());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSportDisciplines() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        // Get all the sportDisciplineList
        restSportDisciplineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sportDiscipline.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getSportDiscipline() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        // Get the sportDiscipline
        restSportDisciplineMockMvc
            .perform(get(ENTITY_API_URL_ID, sportDiscipline.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sportDiscipline.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingSportDiscipline() throws Exception {
        // Get the sportDiscipline
        restSportDisciplineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSportDiscipline() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();

        // Update the sportDiscipline
        SportDiscipline updatedSportDiscipline = sportDisciplineRepository.findById(sportDiscipline.getId()).get();
        // Disconnect from session so that the updates on updatedSportDiscipline are not directly saved in db
        em.detach(updatedSportDiscipline);
        updatedSportDiscipline.name(UPDATED_NAME);

        restSportDisciplineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSportDiscipline.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSportDiscipline))
            )
            .andExpect(status().isOk());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
        SportDiscipline testSportDiscipline = sportDisciplineList.get(sportDisciplineList.size() - 1);
        assertThat(testSportDiscipline.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sportDiscipline.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isBadRequest());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isBadRequest());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSportDisciplineWithPatch() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();

        // Update the sportDiscipline using partial update
        SportDiscipline partialUpdatedSportDiscipline = new SportDiscipline();
        partialUpdatedSportDiscipline.setId(sportDiscipline.getId());

        restSportDisciplineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSportDiscipline.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSportDiscipline))
            )
            .andExpect(status().isOk());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
        SportDiscipline testSportDiscipline = sportDisciplineList.get(sportDisciplineList.size() - 1);
        assertThat(testSportDiscipline.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSportDisciplineWithPatch() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();

        // Update the sportDiscipline using partial update
        SportDiscipline partialUpdatedSportDiscipline = new SportDiscipline();
        partialUpdatedSportDiscipline.setId(sportDiscipline.getId());

        partialUpdatedSportDiscipline.name(UPDATED_NAME);

        restSportDisciplineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSportDiscipline.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSportDiscipline))
            )
            .andExpect(status().isOk());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
        SportDiscipline testSportDiscipline = sportDisciplineList.get(sportDisciplineList.size() - 1);
        assertThat(testSportDiscipline.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sportDiscipline.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isBadRequest());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isBadRequest());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSportDiscipline() throws Exception {
        int databaseSizeBeforeUpdate = sportDisciplineRepository.findAll().size();
        sportDiscipline.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSportDisciplineMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sportDiscipline))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SportDiscipline in the database
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSportDiscipline() throws Exception {
        // Initialize the database
        sportDisciplineRepository.saveAndFlush(sportDiscipline);

        int databaseSizeBeforeDelete = sportDisciplineRepository.findAll().size();

        // Delete the sportDiscipline
        restSportDisciplineMockMvc
            .perform(delete(ENTITY_API_URL_ID, sportDiscipline.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SportDiscipline> sportDisciplineList = sportDisciplineRepository.findAll();
        assertThat(sportDisciplineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
