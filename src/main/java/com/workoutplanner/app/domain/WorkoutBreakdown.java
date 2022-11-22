package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A WorkoutBreakdown.
 */
@Entity
@Table(name = "workout_breakdown")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WorkoutBreakdown implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "duration")
    private Double duration;

    @Column(name = "distance_unit")
    private String distanceUnit;

    @Column(name = "notes")
    private String notes;

    @Column(name = "min_value")
    private Double minValue;

    @Column(name = "max_value")
    private Double maxValue;

    @Column(name = "range_unit")
    private String rangeUnit;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "workoutRating", "exercises", "workoutBreakdowns", "sportDiscipline", "userDetails" },
        allowSetters = true
    )
    private Workout workout;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public WorkoutBreakdown id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getDistance() {
        return this.distance;
    }

    public WorkoutBreakdown distance(Double distance) {
        this.setDistance(distance);
        return this;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getDuration() {
        return this.duration;
    }

    public WorkoutBreakdown duration(Double duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getDistanceUnit() {
        return this.distanceUnit;
    }

    public WorkoutBreakdown distanceUnit(String distanceUnit) {
        this.setDistanceUnit(distanceUnit);
        return this;
    }

    public void setDistanceUnit(String distanceUnit) {
        this.distanceUnit = distanceUnit;
    }

    public String getNotes() {
        return this.notes;
    }

    public WorkoutBreakdown notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getMinValue() {
        return this.minValue;
    }

    public WorkoutBreakdown minValue(Double minValue) {
        this.setMinValue(minValue);
        return this;
    }

    public void setMinValue(Double minValue) {
        this.minValue = minValue;
    }

    public Double getMaxValue() {
        return this.maxValue;
    }

    public WorkoutBreakdown maxValue(Double maxValue) {
        this.setMaxValue(maxValue);
        return this;
    }

    public void setMaxValue(Double maxValue) {
        this.maxValue = maxValue;
    }

    public String getRangeUnit() {
        return this.rangeUnit;
    }

    public WorkoutBreakdown rangeUnit(String rangeUnit) {
        this.setRangeUnit(rangeUnit);
        return this;
    }

    public void setRangeUnit(String rangeUnit) {
        this.rangeUnit = rangeUnit;
    }

    public Workout getWorkout() {
        return this.workout;
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }

    public WorkoutBreakdown workout(Workout workout) {
        this.setWorkout(workout);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkoutBreakdown)) {
            return false;
        }
        return id != null && id.equals(((WorkoutBreakdown) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WorkoutBreakdown{" +
            "id=" + getId() +
            ", distance=" + getDistance() +
            ", duration=" + getDuration() +
            ", distanceUnit='" + getDistanceUnit() + "'" +
            ", notes='" + getNotes() + "'" +
            ", minValue=" + getMinValue() +
            ", maxValue=" + getMaxValue() +
            ", rangeUnit='" + getRangeUnit() + "'" +
            "}";
    }
}
