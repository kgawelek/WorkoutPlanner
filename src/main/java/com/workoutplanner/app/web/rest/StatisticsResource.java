package com.workoutplanner.app.web.rest;

import com.workoutplanner.app.domain.UserStatistics;
import com.workoutplanner.app.domain.Workout;
import com.workoutplanner.app.service.statistics.StatisticsService;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing UserStatistics.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StatisticsResource {

    private final Logger log = LoggerFactory.getLogger(StatisticsResource.class);

    private static final String ENTITY_NAME = "statistics";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private StatisticsService statisticsService;

    public StatisticsResource(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    /**
     * {@code GET  /statistics} : get the statistics.
     */
    @GetMapping("/statistics")
    public UserStatistics getStatistics() {
        log.debug("REST request to get statistics");
        return statisticsService.getUserStatistics();
    }
}
