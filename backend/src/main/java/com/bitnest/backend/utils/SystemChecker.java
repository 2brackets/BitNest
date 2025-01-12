package com.bitnest.backend.utils;

import java.io.File;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public class SystemChecker {

    private static final Map<String, Boolean> systemInfo = new HashMap<>();
    private static final String osName = System.getProperty("os.name").toLowerCase();

    public static void initialize() {

        if (osName.contains("win")) {
            System.out.println("Running on Windows...");
            terminalWindows();
        } else if (osName.contains("nix") || osName.contains("nux") || osName.contains("mac")) {
            System.out.println("Running on Linux/Unix/macOS...");
            terminalOther();
        } else {
            System.out.println("Unknown operating system: " + osName);
        }
    }

    private static void terminalWindows() {
        systemInfo.put("cmd.exe", isTerminalInstalled(getPath(new String[]{ "cmd.exe"})));
        systemInfo.put("powershell.exe", isTerminalInstalled(getPath(new String[]{"powershell.exe"})));
        systemInfo.put("wsl.exe", isTerminalInstalled(getPath(new String[]{"wsl.exe"})));
        System.out.println("AvailableSystems: " + getAvailableSystems());
    }

    private static void terminalOther() {
        systemInfo.put("bash", isTerminalInstalled(getPath(new String[]{"bash"})));
        systemInfo.put("zsh", isTerminalInstalled(getPath(new String[]{"zsh"})));
        systemInfo.put("sh", isTerminalInstalled(getPath(new String[]{"sh"})));
    }

    private static String getPath(String[] path) {
        if (Stream.of(path).anyMatch("powershell.exe"::equalsIgnoreCase)) {
            String powershellPath = findInPathPowershell();
            if (powershellPath != null) {
                System.out.println("Found powershell path: " + powershellPath);
                return powershellPath;
            }
        }
        String[] basePath = osName.contains("win")
                ? new String[]{"C:", "Windows", "System32"}
                : new String[]{"bin"};
        String[] fullPath = Stream.concat(Stream.of(basePath), Stream.of(path))
                .toArray(String[]::new);
        return Paths.get(fullPath[0], Arrays.copyOfRange(fullPath, 1, fullPath.length)).toString();
    }

    private static String findInPathPowershell() {
        String pathEnv = System.getenv("PATH");
        if (pathEnv != null) {
            String[] paths = pathEnv.split(File.pathSeparator);
            for (String path : paths) {
                File file = new File(path, "powershell.exe");
                if (file.exists() && file.isFile()) {
                    return file.getAbsolutePath();
                }
            }
        }
        return null;
    }

    private static boolean isTerminalInstalled(String terminalPath) {
        return new File(terminalPath).exists();
    }

    public static boolean isSystemAvailable(String systemName) {
        return systemInfo.getOrDefault(systemName, false);
    }

    public static Map<String, Boolean> getAvailableSystems() {
        return new HashMap<>(systemInfo);
    }


}
