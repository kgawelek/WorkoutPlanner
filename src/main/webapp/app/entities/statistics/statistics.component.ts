import { Component, OnInit } from '@angular/core';
import { IStatistics } from './statistics.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IWorkout } from '../workout/workout.model';

@Component({
  selector: 'jhi-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  constructor(private http: HttpClient) {}

  statistics: IStatistics | null = null;

  ngOnInit(): void {
    this.http.get<IStatistics>('api/statistics').subscribe((data: IStatistics) => (this.statistics = { ...data }));
  }
}
