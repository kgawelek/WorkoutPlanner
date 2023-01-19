package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.workoutplanner.app.domain.enumeration.RatingScale;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Class representing WorkoutRating.
 */
@Entity
@Table(name = "workout_rating")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WorkoutRating implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "rate")
    private RatingScale rate;

    @JsonIgnoreProperties(
        value = { "workoutRating", "exercises", "workoutBreakdowns", "sportDiscipline", "userDetails" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "workoutRating")
    private Workout workout;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public WorkoutRating id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public WorkoutRating comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public RatingScale getRate() {
        return this.rate;
    }

    public WorkoutRating rate(RatingScale rate) {
        this.setRate(rate);
        return this;
    }

    public void setRate(RatingScale rate) {
        this.rate = rate;
    }

    public Workout getWorkout() {
        return this.workout;
    }

    public void setWorkout(Workout workout) {
        if (this.workout != null) {
            this.workout.setWorkoutRating(null);
        }
        if (workout != null) {
            workout.setWorkoutRating(this);
        }
        this.workout = workout;
    }

    public WorkoutRating workout(Workout workout) {
        this.setWorkout(workout);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkoutRating)) {
            return false;
        }
        return id != null && id.equals(((WorkoutRating) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WorkoutRating{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", rate='" + getRate() + "'" +
            "}";
    }
}
