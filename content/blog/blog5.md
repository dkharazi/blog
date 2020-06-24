---
title: "Pandas Performance Test with pyarrow"
date: "2020-01-02"
draft: false
katex: true
---

### What is data serialization?
- is usually slow and seems unnecessary
- why data serialization?
	- 10:29 - https://www.youtube.com/watch?v=Hqi_Bw_0y8Q
	- https://research.cs.wisc.edu/mist/SoftwareSecurityCourse/Chapters/3_5-Serialization.pdf


### Goal of apache arrow
- avoid data serialization
	- why? can be slow
	- how? standardizing in-memory data
		- zero-overhead memory sharing
		- able to reuse algorithms
		- 8:35 https://www.youtube.com/watch?v=Hqi_Bw_0y8Q

### Benefits of Apache arrow
- https://stackoverflow.com/a/56481636/12777044

### What does it currently look like in Python?
- 10:29 - https://www.youtube.com/watch?v=Hqi_Bw_0y8Q

### How bad could it be?
	- Scenario 1: pyspark
		- https://arrow.apache.org/blog/2017/07/26/spark-arrow/
		- https://towardsdatascience.com/a-gentle-introduction-to-apache-arrow-with-apache-spark-and-pandas-bb19ffe0ddae
		- converting in-memory rdd to in-memory df: https://stackoverflow.com/a/25348534/12777044
	- Scenario 2: test reading in large dictionaries or csvs
		- https://ursalabs.org/blog/fast-pandas-loading/
	
### How does Arrow do this?:
		- Doesn't need to perform data serialization or deserialization when moving data from one application to another
		- https://stackoverflow.com/a/56481636/12777044

## Problem
At Cloudera, I started looking at Impala, Kudu, Spark, Parquet, and other such big data storage and analysis systems. Since Python and pandas had never been involved with any of these projects, building integrations with them was difficult. The single biggest problem was data interchange, particularly moving large tabular datasets from one process's memory space to another's. It was extremely expensive, and there was no standard solution for doing it. RPC-oriented serialization protocols like Thrift and Protocol Buffers were too slow and too general purpose.
https://wesmckinney.com/blog/apache-arrow-pandas-internals/

---

References
- [wes pandas loading](https://ursalabs.org/blog/fast-pandas-loading/)
- [blockmanager](https://uwekorn.com/2020/05/24/the-one-pandas-internal.html)
- [pandas under the hood](http://www.jeffreytratner.com/slides/pandas-under-the-hood-pydata-seattle-2015.pdf)
- [What is Blockmanager](https://wesmckinney.com/blog/apache-arrow-pandas-internals/)
- [speed test cython/numpy](https://stackoverflow.com/questions/7596612/benchmarking-python-vs-c-using-blas-and-numpy)
- [Arrow and Parquet](https://stackoverflow.com/a/56481636/12777044)
- [Why do we need Arrow and Parquet?](https://www.dremio.com/webinars/columnar-roadmap-apache-parquet-and-arrow/)
- [Why not use pickles?](https://arrow.apache.org/docs/python/ipc.html)
- [Why arrow is great for pandas?](https://wesmckinney.com/blog/pandas-and-apache-arrow/)
- [](https://blog.cloudera.com/introducing-apache-arrow-a-fast-interoperable-in-memory-columnar-data-structure-standard/#:~:text=Apache%20Arrow%20is%20an%20in,by%20engineers%20building%20data%20systems.&text=A%20columnar%20memory%2Dlayout%20permitting,SIMD%20optimizations%20with%20modern%20processors.)
- [Example performance test](https://towardsdatascience.com/the-best-format-to-save-pandas-data-414dca023e0d)
- [Why Parquet?](https://stackoverflow.com/a/48097717/12777044)
- [2017 Outlook](https://wesmckinney.com/blog/outlook-for-2017/)
