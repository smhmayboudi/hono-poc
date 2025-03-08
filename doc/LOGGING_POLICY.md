# Logging Policy

## Environment Context

Add the environment and other relevant contexts to each log entry using log.assign
or directly - embedding it in the log call.

## Function Entry Logging

Log at the start of each function using log.info.

## Debug Logs

Use log.debug within control structures, loops, and after assignments to capture
detailed application flow.

## Trace Logs

Use log.trace for detailed logs when interacting with third-party libraries or APIs.

## Consistent Structure

Maintain consistency by always including env and context (or similar fields) in
each log statement.
