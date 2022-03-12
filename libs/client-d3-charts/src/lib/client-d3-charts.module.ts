import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppBarChartComponent } from './components/bar-chart/bar-chart.component';
import { AppForceDirectedChartComponent } from './components/force-directed-chart/force-directed-chart.component';
import { AppPieChartComponent } from './components/pie-chart/pie-chart.component';
import { AppRadarChartComponent } from './components/radar-chart/radar-chart.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AppPieChartComponent, AppRadarChartComponent, AppForceDirectedChartComponent, AppBarChartComponent],
  exports: [AppPieChartComponent, AppRadarChartComponent, AppForceDirectedChartComponent, AppBarChartComponent],
})
export class AppClientD3ChartsModule {}