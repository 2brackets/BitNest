package com.bitnest.backend.controller;

import com.bitnest.backend.controller.terminal.AbstractTerminal;
import com.bitnest.backend.controller.terminal.CmdTerminal;
import com.bitnest.backend.utils.SystemChecker;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/terminal")
public class TerminalController {

    private AbstractTerminal useTerminal;

    @PostMapping("/command")
    public ResponseEntity<String> handleCommand(@RequestBody String command) {
        return ResponseEntity.ok("Command executed: " + command);
    }

    @PostMapping("/setTerminal")
    public ResponseEntity<String> setTerminal(@RequestParam String terminal) {
        if (terminal.equalsIgnoreCase("cmd")) {
            useTerminal = new CmdTerminal();
            return ResponseEntity.ok("Terminal is set to CMD");
        }
        return ResponseEntity.badRequest().body("Terminal was not found");
    }

    @GetMapping("/terminalPrompt")
    public ResponseEntity<String> getTerminalPrompt() {
        try {
            return ResponseEntity.ok(useTerminal.getTerminalPrompt());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/available")
    public List<String> getAvailableTerminals() {
        Map<String, Boolean> terminals = SystemChecker.getAvailableSystems();
        List<String> terminalNames = new ArrayList<>();
        for (String key : terminals.keySet()) {
            if (terminals.get(key)) {
                terminalNames.add(key);
            }
        }
        return terminalNames;
    }
}
