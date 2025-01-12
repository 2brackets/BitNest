package com.bitnest.backend.controller.terminal;

public class CmdTerminal extends AbstractTerminal {

    public CmdTerminal() {}

    @Override
    public String getTerminalPrompt() throws Exception {
        String[] cmdCommand = {"cmd.exe", "/c", "cd"};
        return String.format("%s>", execute(cmdCommand).trim());
    }

    @Override
    public String executeCommand(String command) throws Exception {
        String[] cmdCommand = {"cmd.exe", "/c", command};
        return execute(cmdCommand);
    }
}
