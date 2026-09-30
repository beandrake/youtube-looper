REM - This is a batch script.
REM - Lines that start with REM are informational comments, not code that runs.

REM start a local (not online) server, using the files in the current directory
start python -m http.server 8000

REM opens a private Firefox window to our webpage
start firefox --private-window "http://localhost:8000/index.html"

REM I prefer a private session for this because whenever I listen to music on
REM my signed in YouTube account, YouTube floods my recommendations with music
REM and I don't want that.
