package com.workoutplanner.app.domain;

import java.time.Duration;

/**
 * Class that holds information about user statistics
 */
public class UserStatistics {

    private UserDetails user;

    private SportDiscipline favouriteSportDiscipline;
    private Double longestCyclingDistance;
    private Double longestRunningDistance;
    private Duration longestWorkout;
    private Integer nrOfAbandonedWorkouts;
    private Integer nrOfCompletedWorkouts;
    private Integer nrOfPlannedWorkouts;

    public UserDetails getUser() {
        return user;
    }

    public void setUser(UserDetails user) {
        this.user = user;
    }

    public SportDiscipline getFavouriteSportDiscipline() {
        return favouriteSportDiscipline;
    }

    public void setFavouriteSportDiscipline(SportDiscipline favouriteSportDiscipline) {
        this.favouriteSportDiscipline = favouriteSportDiscipline;
    }

    public Double getLongestCyclingDistance() {
        return longestCyclingDistance;
    }

    public void setLongestCyclingDistance(Double longestCyclingDistance) {
        this.longestCyclingDistance = longestCyclingDistance;
    }

    public Double getLongestRunningDistance() {
        return longestRunningDistance;
    }

    public void setLongestRunningDistance(Double longestRunningDistance) {
        this.longestRunningDistance = longestRunningDistance;
    }

    public Duration getLongestWorkout() {
        return longestWorkout;
    }

    public void setLongestWorkout(Duration longestWorkout) {
        this.longestWorkout = longestWorkout;
    }

    public Integer getNrOfAbandonedWorkouts() {
        return nrOfAbandonedWorkouts;
    }

    public void setNrOfAbandonedWorkouts(Integer nrOfAbandonedWorkouts) {
        this.nrOfAbandonedWorkouts = nrOfAbandonedWorkouts;
    }

    public Integer getNrOfCompletedWorkouts() {
        return nrOfCompletedWorkouts;
    }

    public void setNrOfCompletedWorkouts(Integer nrOfCompletedWorkouts) {
        this.nrOfCompletedWorkouts = nrOfCompletedWorkouts;
    }

    public Integer getNrOfPlannedWorkouts() {
        return nrOfPlannedWorkouts;
    }

    public void setNrOfPlannedWorkouts(Integer nrOfPlannedWorkouts) {
        this.nrOfPlannedWorkouts = nrOfPlannedWorkouts;
    }
}