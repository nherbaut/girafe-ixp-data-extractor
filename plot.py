#!/usr/bin/env python
import pandas as pd
import os
import sys
import matplotlib.pyplot as plt

for datafile in sys.argv[1:]:
    print("open %s" % datafile)
    if not os.path.isfile(datafile):
        print "file unknown"
        raise ValueError
    df = pd.read_csv(datafile, names=["time", "values"])
    ts = pd.Series(df["values"].values, index=pd.to_datetime(df["time"]))
    ts.plot()
    plt.show()
print("Finish")
