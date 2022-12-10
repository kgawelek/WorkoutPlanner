package com.workoutplanner.app.service.statistics;

import static java.util.stream.Collectors.counting;

import com.workoutplanner.app.domain.*;
import com.workoutplanner.app.domain.enumeration.Status;
import com.workoutplanner.app.repository.UserDetailsRepository;
import com.workoutplanner.app.repository.WorkoutRepository;
import com.workoutplanner.app.service.UserService;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;
    private final UserDetailsRepository userDetailsRepository;

    public StatisticsService(WorkoutRepository workoutRepository, UserService userService, UserDetailsRepository userDetailsRepository) {
        this.workoutRepository = workoutRepository;
        this.userService = userService;
        this.userDetailsRepository = userDetailsRepository;
    }

    public UserStatistics getUserStatistics() {
        UserStatistics newStatistics = new UserStatistics();
        Optional<User> user = userService.getUserWithAuthorities();
        if (user.isPresent()) {
            List<Workout> workouts = workoutRepository.findWorkoutByUserDetails(userService.getUserWithAuthorities().get().getId());

            newStatistics.setNrOfAbandonedWorkouts(findNumberOfAbandonedWorkouts(workouts));
            newStatistics.setNrOfPlannedWorkouts(findNumberOfPlannedWorkouts(workouts));
            newStatistics.setNrOfCompletedWorkouts(findNumberOfCompletedWorkouts(workouts));

            newStatistics.setFavouriteSportDiscipline(findFavouriteSportdiscipline(workouts));
            newStatistics.setLongestCyclingDistance(findLongestDistanceInDiscipline(workouts, "CYCLING"));
            newStatistics.setLongestRunningDistance(findLongestDistanceInDiscipline(workouts, "RUNNING"));
            newStatistics.setLongestWorkout(findLongestWorkoutDuration(workouts));
        }

        return newStatistics;
    }

    private Integer findNumberOfCompletedWorkouts(List<Workout> workouts) {
        return workouts.stream().filter(workout -> workout.getStatus().equals(Status.COMPLETED)).collect(Collectors.toList()).size();
    }

    private Integer findNumberOfPlannedWorkouts(List<Workout> workouts) {
        return workouts.stream().filter(workout -> workout.getStatus().equals(Status.PLANNED)).collect(Collectors.toList()).size();
    }

    private Integer findNumberOfAbandonedWorkouts(List<Workout> workouts) {
        return workouts.stream().filter(workout -> workout.getStatus().equals(Status.ABANDONED)).collect(Collectors.toList()).size();
    }

    private String findFavouriteSportdiscipline(List<Workout> workouts) {
        return workouts
            .stream()
            .collect(Collectors.groupingBy(Workout::getSportDiscipline, counting()))
            .entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .get()
            .getKey()
            .getName();
    }

    private double findLongestDistanceInDiscipline(List<Workout> workouts, String discipline) {
        Double result = 0.0;
        List<Workout> filteredWorkouts = workouts
            .stream()
            .filter(workout -> workout.getSportDiscipline() != null && discipline.equalsIgnoreCase(workout.getSportDiscipline().getName()))
            .collect(Collectors.toList());
        if (filteredWorkouts.size() > 0) {
            Map<Workout, Double> mapWorkoutDistance = new HashMap<>();
            for (var w : filteredWorkouts) {
                mapWorkoutDistance.put(w, w.getWorkoutBreakdowns().stream().mapToDouble(WorkoutBreakdown::getDistance).sum());
            }
            result = mapWorkoutDistance.entrySet().stream().max(Comparator.comparing(Map.Entry::getValue)).get().getValue();
        }
        return result;
    }

    private String findLongestWorkoutDuration(List<Workout> workouts) {
        return workouts.stream().max(Comparator.comparing(Workout::getDuration)).get().getDuration().toString();
    }
}
