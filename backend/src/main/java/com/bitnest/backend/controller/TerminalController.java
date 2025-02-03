package com.bitnest.backend.controller;

import com.bitnest.backend.controller.terminal.AbstractTerminal;
import com.bitnest.backend.controller.terminal.CmdTerminal;
import com.bitnest.backend.dto.GenericResponse;
import com.bitnest.backend.utils.SystemChecker;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("api/terminal")
public class TerminalController {

    private AbstractTerminal useTerminal = new CmdTerminal();

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
    public ResponseEntity<GenericResponse<String>> getTerminalPrompt() {
        try {
            return ResponseEntity.ok(
                    createResponse(useTerminal.getTerminalPrompt(), true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createResponse(null, false));
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

    private <T> GenericResponse<T> createResponse(T data, boolean success) {
        return GenericResponse.<T>builder()
                .success(success)
                .message(success ? "Successfully retrieved from backend" : "Operation failed")
                .data(data)
                .build();
    }

}
