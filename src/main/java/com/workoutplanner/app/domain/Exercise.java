package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Exercise.
 */
@Entity
@Table(name = "exercise")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Exercise implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nr_of_reps")
    private Integer nrOfReps;

    @Column(name = "nr_of_series")
    private Integer nrOfSeries;

    @Column(name = "weight")
    private Double weight;

    @ManyToOne
    @JsonIgnoreProperties(value = { "exercises" }, allowSetters = true)
    private ExerciseType exerciseType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "workoutRating", "exercises", "workoutBreakdowns", "userDetails" }, allowSetters = true)
    private Workout workout;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Exercise id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNrOfReps() {
        return this.nrOfReps;
    }

    public Exercise nrOfReps(Integer nrOfReps) {
        this.setNrOfReps(nrOfReps);
        return this;
    }

    public void setNrOfReps(Integer nrOfReps) {
        this.nrOfReps = nrOfReps;
    }

    public Integer getNrOfSeries() {
        return this.nrOfSeries;
    }

    public Exercise nrOfSeries(Integer nrOfSeries) {
        this.setNrOfSeries(nrOfSeries);
        return this;
    }

    public void setNrOfSeries(Integer nrOfSeries) {
        this.nrOfSeries = nrOfSeries;
    }

    public Double getWeight() {
        return this.weight;
    }

    public Exercise weight(Double weight) {
        this.setWeight(weight);
        return this;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public ExerciseType getExerciseType() {
        return this.exerciseType;
    }

    public void setExerciseType(ExerciseType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public Exercise exerciseType(ExerciseType exerciseType) {
        this.setExerciseType(exerciseType);
        return this;
    }

    public Workout getWorkout() {
        return this.workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public Exercise workout(Workout workout) {
        this.setWorkout(workout);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Exercise)) {
            return false;
        }
        return id != null && id.equals(((Exercise) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Exercise{" +
            "id=" + getId() +
            ", nrOfReps=" + getNrOfReps() +
            ", nrOfSeries=" + getNrOfSeries() +
            ", weight=" + getWeight() +
            "}";
    }
}
