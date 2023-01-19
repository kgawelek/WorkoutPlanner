package com.workoutplanner.app.service.statistics;

import static java.util.stream.Collectors.counting;

import com.workoutplanner.app.domain.*;
import com.workoutplanner.app.domain.enumeration.Status;
import com.workoutplanner.app.domain.enumeration.WorkoutType;
import com.workoutplanner.app.repository.UserDetailsRepository;
import com.workoutplanner.app.repository.WorkoutRepository;
import com.workoutplanner.app.service.UserService;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

/**
 * Service class for calculating user statistics
 */
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
            newStatistics.setUser(userDetailsRepository.findById(user.get().getId()).get());
            newStatistics.setNrOfAbandonedWorkouts(findNumberOfAbandonedWorkouts(workouts));
            newStatistics.setNrOfPlannedWorkouts(findNumberOfPlannedWorkouts(workouts));
            newStatistics.setNrOfCompletedWorkouts(findNumberOfCompletedWorkouts(workouts));
            newStatistics.setNrOfWorkouts(workouts.size());
            newStatistics.setTotalWorkoutsDuration(findCompletedWorkoutsDuration(workouts));

            newStatistics.setFavouriteSportDiscipline(findFavouriteSportDiscipline(workouts));
            newStatistics.setLongestCyclingDistance(findLongestDistanceInDiscipline(workouts, "CYCLING"));
            newStatistics.setLongestRunningDistance(findLongestDistanceInDiscipline(workouts, "RUNNING"));
            newStatistics.setLongestWorkout(findLongestWorkoutDuration(workouts));

            newStatistics.setTotalDistance(findTotalDistance(workouts));
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

    private String findFavouriteSportDiscipline(List<Workout> workouts) {
        Optional<Map.Entry<SportDiscipline, Long>> discipline = workouts
            .stream()
            .filter(workout -> workout.getSportDiscipline() != null)
            .collect(Collectors.groupingBy(Workout::getSportDiscipline, counting()))
            .entrySet()
            .stream()
            .max(Map.Entry.comparingByValue());

        return discipline.isPresent() ? discipline.get().getKey().getName() : StringUtils.EMPTY;
    }

    private double findLongestDistanceInDiscipline(List<Workout> workouts, String discipline) {
        Double result = 0.0;
        List<Workout> filteredWorkouts = workouts
            .stream()
            .filter(workout ->
                workout.getSportDiscipline() != null &&
                discipline.equalsIgnoreCase(workout.getSportDiscipline().getName()) &&
                workout.getStatus().equals(Status.COMPLETED)
            )
            .collect(Collectors.toList());
        if (filteredWorkouts.size() > 0) {
            Map<Workout, Double> mapWorkoutDistance = new HashMap<>();
            for (var w : filteredWorkouts) {
                Double tmp = 0.0;
                for (var i : w.getWorkoutBreakdowns()) {
                    if ("km".equalsIgnoreCase(i.getDistanceUnit()) && i.getDistance() != null) {
                        tmp += i.getDistance();
                    } else if ("m".equalsIgnoreCase(i.getDistanceUnit()) && i.getDistance() != null) {
                        tmp += i.getDistance() / 1000.0;
                    }
                }
                mapWorkoutDistance.put(w, tmp);
            }
            result = mapWorkoutDistance.entrySet().stream().max(Comparator.comparing(Map.Entry::getValue)).get().getValue();
        }
        return result;
    }

    private String findLongestWorkoutDuration(List<Workout> workouts) {
        return workouts
            .stream()
            .filter(workout -> workout.getStatus().equals(Status.COMPLETED))
            .max(Comparator.comparing(Workout::getDuration))
            .get()
            .getDuration()
            .toString()
            .replace("PT", "");
    }

    private Duration findCompletedWorkoutsDuration(List<Workout> workouts) {
        Duration sum = Duration.ZERO;
        List<Workout> filteredWorkouts = workouts
            .stream()
            .filter(workout -> workout.getStatus().equals(Status.COMPLETED) && workout.getDuration() != null)
            .collect(Collectors.toList());
        for (var workout : filteredWorkouts) {
            sum = sum.plus(workout.getDuration());
        }

        return sum;
    }

    private double findTotalDistance(List<Workout> workouts) {
        List<Workout> filteredWorkouts = workouts
            .stream()
            .filter(workout -> workout.getStatus().equals(Status.COMPLETED) && workout.getType().equals(WorkoutType.INTERVAL))
            .collect(Collectors.toList());
        Double result = 0.0;
        for (var w : filteredWorkouts) {
            for (var i : w.getWorkoutBreakdowns()) {
                if ("km".equalsIgnoreCase(i.getDistanceUnit()) && i.getDistance() != null) {
                    result += i.getDistance();
                } else if ("m".equalsIgnoreCase(i.getDistanceUnit()) && i.getDistance() != null) {
                    result += i.getDistance() / 1000.0;
                }
            }
        }
        return result;
    }
}
