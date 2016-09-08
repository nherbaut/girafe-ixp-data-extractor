#!/usr/bin/env python
import pandas as pd
import os
import sys
import matplotlib.pyplot as plt

print("open %s"%sys.argv[1])
if not os.path.isfile(sys.argv[1]):
  print "file unknown"
  raise ValueError

df=pd.read_csv(sys.argv[1],names=["time","values"])
ts=pd.Series(df["values"].values,index=pd.to_datetime(df["time"]))
ts.plot()
plt.show()
#name = raw_input("Enter for quit ")
print("Finish")
