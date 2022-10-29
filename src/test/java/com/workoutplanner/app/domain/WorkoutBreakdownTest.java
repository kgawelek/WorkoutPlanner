package com.workoutplanner.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.workoutplanner.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WorkoutBreakdownTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkoutBreakdown.class);
        WorkoutBreakdown workoutBreakdown1 = new WorkoutBreakdown();
        workoutBreakdown1.setId(1L);
        WorkoutBreakdown workoutBreakdown2 = new WorkoutBreakdown();
        workoutBreakdown2.setId(workoutBreakdown1.getId());
        assertThat(workoutBreakdown1).isEqualTo(workoutBreakdown2);
        workoutBreakdown2.setId(2L);
        assertThat(workoutBreakdown1).isNotEqualTo(workoutBreakdown2);
        workoutBreakdown1.setId(null);
        assertThat(workoutBreakdown1).isNotEqualTo(workoutBreakdown2);
    }
}
