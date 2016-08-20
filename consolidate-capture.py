#!/usr/bin/env python
import argparse
import pandas as pd
import sys
import os

parser = argparse.ArgumentParser(description='consolidate and resample capture from bulk cvs file')
parser.add_argument('-f', "--file")
parser.add_argument('-r', "--resample")
parser.add_argument('-o', "--output",required=True)
args = parser.parse_args()

if not os.path.isfile(args.file):
  print "file unknown"
  raise ValueError
df=pd.read_csv(args.file,names=["time","values"])
ts=pd.Series(df["values"].values,index=pd.to_datetime(df["time"]))
ts.resample(args.resample).mean().bfill().to_csv(args.output)

