#!/usr/bin/env bash
/sketch/startSketch.sh &
cd /projects/lightgrid
python main.py --mqtt=aws --clog=false --startwait=10 &
