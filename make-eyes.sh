#!/usr/bin/env bash

for i in 128 48 32 16; do
  convert -background none -density 400 eye.svg -resize ${i}x${i} images/chrome-eye-${i}.png
done
