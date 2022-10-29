package com.workoutplanner.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserDetails.
 */
@Entity
@Table(name = "user_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @OneToMany(mappedBy = "userDetails")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "workoutRating", "exercises", "workoutBreakdowns", "userDetails" }, allowSetters = true)
    private Set<Workout> workouts = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "userDetails" }, allowSetters = true)
    private SportDiscipline sportDiscipline;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserDetails user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Workout> getWorkouts() {
        return this.workouts;
    }

    public void setWorkouts(Set<Workout> workouts) {
        if (this.workouts != null) {
            this.workouts.forEach(i -> i.setUserDetails(null));
        }
        if (workouts != null) {
            workouts.forEach(i -> i.setUserDetails(this));
        }
        this.workouts = workouts;
    }

    public UserDetails workouts(Set<Workout> workouts) {
        this.setWorkouts(workouts);
        return this;
    }

    public UserDetails addWorkout(Workout workout) {
        this.workouts.add(workout);
        workout.setUserDetails(this);
        return this;
    }

    public UserDetails removeWorkout(Workout workout) {
        this.workouts.remove(workout);
        workout.setUserDetails(null);
        return this;
    }

    public SportDiscipline getSportDiscipline() {
        return this.sportDiscipline;
    }

    public void setSportDiscipline(SportDiscipline sportDiscipline) {
        this.sportDiscipline = sportDiscipline;
    }

    public UserDetails sportDiscipline(SportDiscipline sportDiscipline) {
        this.setSportDiscipline(sportDiscipline);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserDetails)) {
            return false;
        }
        return id != null && id.equals(((UserDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserDetails{" +
            "id=" + getId() +
            "}";
    }
}
