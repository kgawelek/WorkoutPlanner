package com.workoutplanner.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.workoutplanner.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SportDisciplineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SportDiscipline.class);
        SportDiscipline sportDiscipline1 = new SportDiscipline();
        sportDiscipline1.setId(1L);
        SportDiscipline sportDiscipline2 = new SportDiscipline();
        sportDiscipline2.setId(sportDiscipline1.getId());
        assertThat(sportDiscipline1).isEqualTo(sportDiscipline2);
        sportDiscipline2.setId(2L);
        assertThat(sportDiscipline1).isNotEqualTo(sportDiscipline2);
        sportDiscipline1.setId(null);
        assertThat(sportDiscipline1).isNotEqualTo(sportDiscipline2);
    }
}
