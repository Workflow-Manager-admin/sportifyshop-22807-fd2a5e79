#!/bin/bash
cd /home/kavia/workspace/code-generation/sportifyshop-22807-fd2a5e79/sports_gear_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

