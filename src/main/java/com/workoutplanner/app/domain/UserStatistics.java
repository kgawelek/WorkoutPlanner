package com.workoutplanner.app.domain;

import java.time.Duration;

/**
 * Class that holds information about user statistics
 */
public class UserStatistics {

    private UserDetails user;

    private String favouriteSportDiscipline;
    private Double longestCyclingDistance;
    private Double longestRunningDistance;
    private String longestWorkout;
    private Integer nrOfAbandonedWorkouts;
    private Integer nrOfCompletedWorkouts;
    private Integer nrOfPlannedWorkouts;
    private Integer nrOfWorkouts;
    private Duration totalWorkoutsDuration;
    private Double totalDistance;

    public UserDetails getUser() {
        return user;
    }

    public void setUser(UserDetails user) {
        this.user = user;
    }

    public String getFavouriteSportDiscipline() {
        return favouriteSportDiscipline;
    }

    public void setFavouriteSportDiscipline(String favouriteSportDiscipline) {
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

    public String getLongestWorkout() {
        return longestWorkout;
    }

    public void setLongestWorkout(String longestWorkout) {
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

    public Integer getNrOfWorkouts() {
        return nrOfWorkouts;
    }

    public void setNrOfWorkouts(Integer nrOfWorkouts) {
        this.nrOfWorkouts = nrOfWorkouts;
    }

    public Double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(Double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public Duration getTotalWorkoutsDuration() {
        return totalWorkoutsDuration;
    }

    public void setTotalWorkoutsDuration(Duration totalWorkoutsDuration) {
        this.totalWorkoutsDuration = totalWorkoutsDuration;
    }
}
