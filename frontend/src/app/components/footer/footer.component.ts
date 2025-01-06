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
  private readonly standardHeight: number = 20;

  public isExpanded: boolean = false;
  public activeTab: 'logs' | 'terminal' | null = null;
  public footerHeight: number = this.standardHeight;   

  private expandedHeight: number = 200; 
  private minHeight: number = 100;   
  private maxHeight: number = 600;   

  public toggleExpand(tab: 'logs' | 'terminal'): void {
    if (this.activeTab === tab) {
      this.isExpanded = !this.isExpanded;

      if (!this.isExpanded) {
        this.footerHeight = this.standardHeight;
        this.activeTab = null; 
      } else {
        this.footerHeight = this.expandedHeight;
      }
    } else {
      this.activeTab = tab;
      this.isExpanded = true;
      this.footerHeight = this.expandedHeight;
    }
  }

  public closeExpand(): void {
    this.isExpanded = false;
    this.footerHeight = this.standardHeight; 
    this.activeTab = null;
  }

  public onMouseDown(event: MouseEvent): void {
    if (!this.isExpanded) return; 
    const startY = event.clientY;
    const startHeight = this.footerHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      this.footerHeight = Math.min(this.maxHeight, Math.max(this.minHeight, startHeight + deltaY));
      this.expandedHeight = this.footerHeight;
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}