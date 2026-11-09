import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomAlertComponent } from './shared/components/custom-alert.component';
import { JobBotComponent } from './shared/components/job-bot/job-bot.component';

@Component({
  imports: [RouterOutlet, CustomAlertComponent, JobBotComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('سيرتي');
}
