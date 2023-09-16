#!/bin/bash
# entrypoint-script.sh

# If any command fails, exit immediately
set -e

# Echo all executed commands to terminal
set -x

# Run migrations or other pre-start tasks here, e.g.
# npm run migrate

# Start the web application
npm start

tail -f /dev/null  # keep container running