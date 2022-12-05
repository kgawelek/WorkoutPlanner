package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SportDiscipline.
 */
@Entity
@Table(name = "sport_discipline")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SportDiscipline implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "sportDiscipline")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "workouts", "sportDiscipline" }, allowSetters = true)
    private Set<UserDetails> userDetails = new HashSet<>();

    @OneToMany(mappedBy = "sportDiscipline")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "workoutRating", "exercises", "workoutBreakdowns", "sportDiscipline", "userDetails" },
        allowSetters = true
    )
    private Set<Workout> workouts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SportDiscipline id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public SportDiscipline name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<UserDetails> getUserDetails() {
        return this.userDetails;
    }

    public void setUserDetails(Set<UserDetails> userDetails) {
        if (this.userDetails != null) {
            this.userDetails.forEach(i -> i.setSportDiscipline(null));
        }
        if (userDetails != null) {
            userDetails.forEach(i -> i.setSportDiscipline(this));
        }
        this.userDetails = userDetails;
    }

    public SportDiscipline userDetails(Set<UserDetails> userDetails) {
        this.setUserDetails(userDetails);
        return this;
    }

    public SportDiscipline addUserDetails(UserDetails userDetails) {
        this.userDetails.add(userDetails);
        userDetails.setSportDiscipline(this);
        return this;
    }

    public SportDiscipline removeUserDetails(UserDetails userDetails) {
        this.userDetails.remove(userDetails);
        userDetails.setSportDiscipline(null);
        return this;
    }

    public Set<Workout> getWorkouts() {
        return this.workouts;
    }

    public void setWorkouts(Set<Workout> workouts) {
        if (this.workouts != null) {
            this.workouts.forEach(i -> i.setSportDiscipline(null));
        }
        if (workouts != null) {
            workouts.forEach(i -> i.setSportDiscipline(this));
        }
        this.workouts = workouts;
    }

    public SportDiscipline workouts(Set<Workout> workouts) {
        this.setWorkouts(workouts);
        return this;
    }

    public SportDiscipline addWorkout(Workout workout) {
        this.workouts.add(workout);
        workout.setSportDiscipline(this);
        return this;
    }

    public SportDiscipline removeWorkout(Workout workout) {
        this.workouts.remove(workout);
        workout.setSportDiscipline(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SportDiscipline)) {
            return false;
        }
        return id != null && id.equals(((SportDiscipline) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SportDiscipline{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
