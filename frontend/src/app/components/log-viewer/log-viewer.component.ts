import { Component } from '@angular/core';
import { LogFilterService } from '../../Core/services/log-filter.service';
import { LoggerService } from '../../Core/services/logger.service';

@Component({
  selector: 'app-log-viewer',
  imports: [],
  templateUrl: './log-viewer.component.html',
  styleUrl: './log-viewer.component.scss'
})
export class LogViewerComponent {

  public filteredLogs: string[] = [];
  private allLogs: string[] = [];
  private searchTerm: string = ''; 

  constructor(
    private logFilterService: LogFilterService,
    private loggerService: LoggerService) {}

  public ngOnInit(): void {
    this.allLogs = this.loggerService.getLogs();
    this.applyFilters(); 
  }

  public onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase(); 
    if(this.searchTerm.length >= 2){ this.applyFilters(); }
    if (this.searchTerm.length === 0) { this.applyFilters();} 
  }

  public onFilterChange(key: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.logFilterService.setFilter(key, input.checked);
    this.applyFilters();
  }

  public getFilter(key: string): boolean {
    return this.logFilterService.getFilterValue(key);
  }

  private applyFilters(): void {
    this.filteredLogs = this.allLogs.filter(log => {
      const levelMatch = 
        (this.getFilter('info') && log.includes('[Info]')) ||
        (this.getFilter('warning') && log.includes('[Warning]')) ||
        (this.getFilter('error') && log.includes('[Error]'));
      const searchMatch = log.toLowerCase().includes(this.searchTerm);
      return levelMatch && searchMatch;
    });
  }
  
}
