#!/usr/bin/env bash

rm -rf TabMonitor TabMonitor.zip
mkdir TabMonitor
cp -r LICENSE.md README.md images/ manifest.json popup.css popup.html popup.js worker.js TabMonitor/
zip -r TabMonitor.zip TabMonitor/
