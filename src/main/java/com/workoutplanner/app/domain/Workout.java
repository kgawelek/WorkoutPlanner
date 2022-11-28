package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.workoutplanner.app.domain.enumeration.Status;
import com.workoutplanner.app.domain.enumeration.WorkoutType;
import java.io.Serializable;
import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Workout.
 */
@Entity
@Table(name = "workout")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Workout implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private Instant date;

    @Column(name = "duration")
    private Duration duration;

    @Column(name = "comment")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private WorkoutType type;

    @JsonIgnoreProperties(value = { "workout" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private WorkoutRating workoutRating;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "workout")
    @JsonIgnoreProperties(value = { "workout" }, allowSetters = true)
    private Set<Exercise> exercises = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "workout")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "workout" }, allowSetters = true)
    private Set<WorkoutBreakdown> workoutBreakdowns = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "userDetails", "workouts" }, allowSetters = true)
    private SportDiscipline sportDiscipline;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "workouts", "sportDiscipline" }, allowSetters = true)
    private UserDetails userDetails;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Workout id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Workout date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Duration getDuration() {
        return this.duration;
    }

    public Workout duration(Duration duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getComment() {
        return this.comment;
    }

    public Workout comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Status getStatus() {
        return this.status;
    }

    public Workout status(Status status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public WorkoutType getType() {
        return this.type;
    }

    public Workout type(WorkoutType type) {
        this.setType(type);
        return this;
    }

    public void setType(WorkoutType type) {
        this.type = type;
    }

    public WorkoutRating getWorkoutRating() {
        return this.workoutRating;
    }

    public void setWorkoutRating(WorkoutRating workoutRating) {
        this.workoutRating = workoutRating;
    }

    public Workout workoutRating(WorkoutRating workoutRating) {
        this.setWorkoutRating(workoutRating);
        return this;
    }

    public Set<Exercise> getExercises() {
        return this.exercises;
    }

    public void setExercises(Set<Exercise> exercises) {
        if (this.exercises != null) {
            this.exercises.forEach(i -> i.setWorkout(null));
        }
        if (exercises != null) {
            exercises.forEach(i -> i.setWorkout(this));
        }
        this.exercises = exercises;
    }

    public Workout exercises(Set<Exercise> exercises) {
        this.setExercises(exercises);
        return this;
    }

    public Workout addExercise(Exercise exercise) {
        this.exercises.add(exercise);
        exercise.setWorkout(this);
        return this;
    }

    public Workout removeExercise(Exercise exercise) {
        this.exercises.remove(exercise);
        exercise.setWorkout(null);
        return this;
    }

    public Set<WorkoutBreakdown> getWorkoutBreakdowns() {
        return this.workoutBreakdowns;
    }

    public void setWorkoutBreakdowns(Set<WorkoutBreakdown> workoutBreakdowns) {
        if (this.workoutBreakdowns != null) {
            this.workoutBreakdowns.forEach(i -> i.setWorkout(null));
        }
        if (workoutBreakdowns != null) {
            workoutBreakdowns.forEach(i -> i.setWorkout(this));
        }
        this.workoutBreakdowns = workoutBreakdowns;
    }

    public Workout workoutBreakdowns(Set<WorkoutBreakdown> workoutBreakdowns) {
        this.setWorkoutBreakdowns(workoutBreakdowns);
        return this;
    }

    public Workout addWorkoutBreakdown(WorkoutBreakdown workoutBreakdown) {
        this.workoutBreakdowns.add(workoutBreakdown);
        workoutBreakdown.setWorkout(this);
        return this;
    }

    public Workout removeWorkoutBreakdown(WorkoutBreakdown workoutBreakdown) {
        this.workoutBreakdowns.remove(workoutBreakdown);
        workoutBreakdown.setWorkout(null);
        return this;
    }

    public SportDiscipline getSportDiscipline() {
        return this.sportDiscipline;
    }

    public void setSportDiscipline(SportDiscipline sportDiscipline) {
        this.sportDiscipline = sportDiscipline;
    }

    public Workout sportDiscipline(SportDiscipline sportDiscipline) {
        this.setSportDiscipline(sportDiscipline);
        return this;
    }

    public UserDetails getUserDetails() {
        return this.userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public Workout userDetails(UserDetails userDetails) {
        this.setUserDetails(userDetails);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Workout)) {
            return false;
        }
        return id != null && id.equals(((Workout) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Workout{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", duration='" + getDuration() + "'" +
            ", comment='" + getComment() + "'" +
            ", status='" + getStatus() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
