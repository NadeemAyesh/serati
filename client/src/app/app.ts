import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomAlertComponent } from './shared/components/custom-alert.component';

@Component({
  imports: [RouterOutlet, CustomAlertComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('سيرتي');
}
