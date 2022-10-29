package com.workoutplanner.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.workoutplanner.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WorkoutRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkoutRating.class);
        WorkoutRating workoutRating1 = new WorkoutRating();
        workoutRating1.setId(1L);
        WorkoutRating workoutRating2 = new WorkoutRating();
        workoutRating2.setId(workoutRating1.getId());
        assertThat(workoutRating1).isEqualTo(workoutRating2);
        workoutRating2.setId(2L);
        assertThat(workoutRating1).isNotEqualTo(workoutRating2);
        workoutRating1.setId(null);
        assertThat(workoutRating1).isNotEqualTo(workoutRating2);
    }
}
