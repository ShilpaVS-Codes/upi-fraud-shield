package com.safepay.backend.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.OptionalInt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fazecast.jSerialComm.SerialPort;

@Service
public class FingerprintReader {

    private final String portName;

    public FingerprintReader(@Value("${safepay.fingerprint.port:COM5}") String portName) {
        this.portName = portName;
    }

    public synchronized OptionalInt match() throws IOException, InterruptedException {
        return scan("MATCH", "MATCH");
    }

    public synchronized boolean enroll(int slot) throws IOException, InterruptedException {
        if (slot < 2 || slot > 65535) {
            throw new IllegalArgumentException("Invalid fingerprint enrollment slot");
        }

        OptionalInt enrolled = scan("ENROLL " + slot, "ENROLLED");
        if (enrolled.isEmpty()) {
            return false;
        }
        if (enrolled.getAsInt() != slot) {
            throw new IOException("Reader enrolled a different fingerprint slot");
        }
        return true;
    }

    private OptionalInt scan(String request, String success)
            throws IOException, InterruptedException {
        SerialPort port = SerialPort.getCommPort(portName);
        port.setComPortParameters(115200, 8, SerialPort.ONE_STOP_BIT, SerialPort.NO_PARITY);
        port.setComPortTimeouts(SerialPort.TIMEOUT_READ_SEMI_BLOCKING, 25000, 0);

        if (!port.openPort()) {
            throw new IOException("Could not open fingerprint reader on " + portName);
        }

        try {
            Thread.sleep(2000);
            port.flushIOBuffers();

            byte[] command = (request + "\n").getBytes(StandardCharsets.US_ASCII);
            if (port.writeBytes(command, command.length) != command.length) {
                throw new IOException("Could not send fingerprint scan command");
            }

            BufferedReader input = new BufferedReader(
                    new InputStreamReader(port.getInputStream(), StandardCharsets.US_ASCII));

            String line;
            while ((line = input.readLine()) != null) {
                String result = line.trim();
                if (request.startsWith("ENROLL ") && result.equals("ERR SLOT_OCCUPIED")) {
                    return OptionalInt.empty();
                }
                if (result.matches(success + " [0-9]{1,5}")) {
                    return OptionalInt.of(Integer.parseInt(result.substring(success.length() + 1)));
                }
                if (request.equals("MATCH") && result.equals("NO_MATCH")) {
                    return OptionalInt.empty();
                }
                if (result.startsWith("ERR ")) {
                    throw new IOException("Fingerprint reader returned " + result);
                }
            }

            throw new IOException("Fingerprint reader disconnected before returning a result");
        } finally {
            port.closePort();
        }
    }
}
