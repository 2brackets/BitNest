import { Component, ElementRef, ViewChild } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

@Component({
  selector: 'app-terminal',
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {
  @ViewChild('terminal', { static: true }) terminalDiv!: ElementRef
  private readonly MAX_HISTORY: number = 100;
  private terminal!: Terminal;
  private fitAddon!: FitAddon;
  private commandHistory: string[] = []; 
  private historyIndex: number = -1; 
  private inputBuffer: string = '';
  private terminalPrompt: string = '';

  private readonly ANSI_COLORS: { [key: string]: string } = {
    reset: `\x1b[39m`,
    blue: '\x1b[38;2;0;150;255m',
    darkGray: '\x1b[38;2;120;120;120m',
    yellow: '\x1b[93m', 
  };

  ngAfterViewInit(): void {
    const backgroundColor: string = '#121517';
    const textColor: string ='#a7aaac' ;

    this.terminal = new Terminal({
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      fontSize: 14, 
      lineHeight: 1.2, 
      letterSpacing: 1, 
      cursorStyle: 'block',
      cursorBlink: false,
      theme: {
        background: backgroundColor,
        foreground: textColor,
      },
      fontWeight: '500',
      fontWeightBold: '700', 
    });

    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
  
    this.terminal.open(this.terminalDiv.nativeElement);
    this.fitAddon.fit();
    
    this.terminalPrompt = 'C:\\> '
    this.terminal.writeln('BitNest Terminal version 0.0.1');
    this.terminal.write(this.terminalPrompt);

    this.terminal.onData(data => this.handleInput(data))
  }

  private handleInput(data: string): void {
    switch (data) {
      case '\r': 
        this.terminal.write('\r\n'); 
        this.addCommandoToHistory(this.inputBuffer)
        this.processCommand(this.inputBuffer)
        this.inputBuffer = '';
        this.historyIndex = -1; 
        this.terminal.write(this.terminalPrompt); 
        break;
      case '\u007F': 
        if (this.inputBuffer.length > 0) {
          this.inputBuffer = this.inputBuffer.slice(0, -1);
          this.terminal.write('\b \b'); 
        }
        break;
      case '\x1b[A':
        if(this.commandHistory.length > 0) {
          if (this.historyIndex === -1) {
            this.historyIndex = this.commandHistory.length - 1;
          }
          else if (this.historyIndex > 0) {
            this.historyIndex--;
          }
          this.terminal.write(this.setCommandFromHistory())
        }
        break;
        case '\x1b[B': 
        if (this.commandHistory.length > 0 && this.historyIndex !== -1) {
          if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++; 
          } else {
            this.historyIndex = -1; 
          }
          this.terminal.write(this.setCommandFromHistory());
        }
        break;
        default:
          this.inputBuffer += data;
          const newText = `${this.terminalPrompt}${this.highlightInput(this.inputBuffer)}`;
          this.terminal.write(`\x1b[2K\r${newText}`);
        break;
    }
  }

  private addCommandoToHistory(commando: string): void {
    this.commandHistory.push(commando)
    if(this.commandHistory.length > this.MAX_HISTORY){
      this.commandHistory.shift();
    }
  }

  private processCommand(command: string): void {
    if (command.trim()) {
      this.terminal.write(`You entered: ${command}\r\n`);
      console.log('send to backend ' + command)
    } else {
      this.terminal.write('No command entered.\r\n');
    }
  }

  private setCommandFromHistory(): string {
    this.terminal.write('\r' + ' '.repeat(this.inputBuffer.length + 10) + '\r'); // Clear line
    this.inputBuffer = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
    return this.terminalPrompt + this.highlightInput(this.inputBuffer);
  }

  private highlightInput(input: string): string {
    let isWithinQuotes = false;
    return input.split(' ').map((word) => {
      if (isWithinQuotes || word.startsWith('"')) {
        if (word.endsWith('"') && !word.endsWith('\\"')) {
          isWithinQuotes = false;
        } else {
          isWithinQuotes = true;
        }
        return `${this.ANSI_COLORS['blue']}${word}${this.ANSI_COLORS['reset']}`; 
      } else if (word.startsWith('-')) {
        return `${this.ANSI_COLORS['darkGray']}${word}${this.ANSI_COLORS['reset']}`; 
      } else if (input.indexOf(word) === 0) {
        return `${this.ANSI_COLORS['yellow']}${word}${this.ANSI_COLORS['reset']}`; 
      } else {
        return word; 
      }
    }).join(' ');
  }
}
