package com.bitnest.backend.controller.terminal;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public abstract class AbstractTerminal {
    private String baseCommand;

    protected String execute(String[] command) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        } catch (IOException e) {
            //logger.error("Error executing command: {}", String.join(" ", command), e);
            throw e;
        } finally {
            process.destroy();
        }
        return output.toString().trim();
    }

    public abstract String getTerminalPrompt() throws Exception;
    public abstract String executeCommand(String command) throws Exception;
}
