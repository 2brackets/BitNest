import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogViewerComponent } from '../log-viewer/log-viewer.component';


@Component({
  selector: 'app-footer',
  imports: [CommonModule, LogViewerComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public isExpanded: boolean = false;
  public activeTab: 'logs' | 'terminal' | null = null;

  public toggleExpand(tab: 'logs' | 'terminal'): void {
    if (this.activeTab === tab) {
      this.isExpanded = !this.isExpanded;
      if (!this.isExpanded) {
        this.activeTab = null; 
      }
    } else {
      this.activeTab = tab;
      this.isExpanded = true;
  }
}

  public closeExpand(): void {
    this.isExpanded = false;
    this.activeTab = null;
  }
}