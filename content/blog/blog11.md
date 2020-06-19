---
title: "PySpark Test"
date: "2020-04-10"
draft: false
katex: true
---

## Defining Components
- Job...
- Task...
	- Each executor has several *task slots*
	- These slots are used to run tasks in parallel
	- These tasks are implemented as threads (not CPU core)
	- Meaning, they don't need to correspond to the number of CPU cores on a machine
- Executor
	- Can only be one executor per worker
- Spark context
	- Only one spark context per JVM

---

## Cluster Components
- Definitions from Cluster Mode Overview

## Components of a Driver Program
- Scheduler
- Spark context
- Spark application

## Responsibilities of the Driver Program
- Requests for executor processes from the cluster manager
- Requests for CPU and memory resources
- Breaks an application into stages and tasks
- Sends tasks to executors
- Collects results from executors

## Responsibilities of the Spark Context
- Acts as the entry point for users to interact with Spark
- Connects to Spark from an application
- Configures a session (not masters or workers)
- Manages job execution
- Loads and saves files
- Set the number executors allocated to an application
- Set the number of cores per executor
- etc.

## Responsibilities of the Spark Scheduler
- Performs *job scheduling*
	- Decides which executors run which tasks
	- This doesn't involve the cluster manager

## Responsibilities of the Cluster Manager
- Instructs workers to start executor processes
	- Initiates start of executor processes
- Accepts applications to be run (entrypoint into the cluster)
- Start and stop processes in the cluster
- Set the maximum number of CPUs that executor processes can use
- Performs *cluster resource scheduling*
	- Divides cluster resources among several applications running in a cluster
	- This includes allocating CPU and memory resources to executors
	- Specifically, it schedules worker resources
		- Workers will need to know which CPU cores to spawn executors on

## Summarizing Different Roles between Spark Scheduler and Cluster Manager
- Essentially, the driver has a bunch of tasks that need to be run
- Then, the cluster manager will map these tasks to actual executors(CPU resources)
	- This is cluster resource scheduling
	- This involves directing workers to start up executors first
- Then, the scheduler will decide which executors will run which of its tasks
	- The scheduler will be communicating directly with the executors
	- Not communicating with the resource manager

## Responsibilities of Workers
- Launch executors
- Launch the driver process when deploy-mode=cluster
- Monitor executors

## Responsibilities of Executors
1. Accept tasks from the driver program
2. Executes those tasks
3. Returns the results to the driver

## Types of Cluster Managers
- `Standalone:` Spark Master
- `YARN:` Application Master

---

### Defining Cluster Modes
- The driver program can be run in either:
	1. Cluster-deploy mode
		- The driver process runs in the client's JVM process
		- Meaning, the driver program runs on the client's machine
		- This is the same machine as the one that called `spark-submit`
		- Typically, this implies the driver process sits outside of the cluster
		- Then, the driver program communicates with the executors inside the cluster
	2. Client-deploy mode
		- The driver process runs as a separate JVM process in the cluster
		- Meaning, the driver program doesn't run on the client's machine
		- Instead, it runs on a machine within the cluster
		- Typically, this implies the driver process sits on a worker node within the cluster
		- Then, the cluster manager manages its resources (mostly JVM heap memory)

## Launching Applications in Client Mode
1. Client's JVM process submits an application to the master
2. The driver is launched
3. The master instructs workers to start executor processes for the application
4. Workers launch executor JVMs
5. The driver and executors communicate independent of the master and worker processes

```
14:43:01 INFO
SparkContext: Submitted application: Spark Pi

14:43:02 INFO
Utils: Successfully started service 'sparkDriver'

14:43:03 INFO
StandaloneAppClient: Connecting to master

14:43:04 INFO
StandaloneSchedulerBackend: Connected to Spark cluster

14:43:05 INFO
Master: Registered app Spark Pi

14:43:06 INFO
Master: Launching executor on worker

14:43:07 INFO
Worker: Asked to launch executor

14:43:08 INFO
ExecutorRunner: Launched

14:43:09 INFO
StandaloneAppClient: Executor added on worker

14:43:10 INFO
StandaloneSchedulerBackend: Granted executor ID

14:43:11 INFO
StandaloneAppClient: Executor is now RUNNING

14:43:12 INFO
SparkContext: Starting job

...

14:43:13 INFO
DAGScheduler: Job finished

14:43:14 INFO
StandaloneSchedulerBackend: Shutting down all executors

14:43:15 INFO
Worker: Asked to kill executor

14:43:16 INFO
ExecutorRunner: Killing process!

14:43:17 INFO
Master: Removing app

14:43:18 INFO
SparkContext: Successfully stopped SparkContext
```

![standaloneclient](/img/standalone-client.svg)

## Launching Applications in Cluster Mode
1. Client's JVM process submits an application to the master
2. Master instructs one of its workers to launch a driver
3. That worker launches a driver JVM
4. Master instructs workers to start executor processes for the application
5. Workers launch executor JVMs
6. The driver and executors communicate independent of the master and worker processes

```
14:43:01 INFO
Master: Driver submitted

14:43:02 INFO
Master: Launching driver

14:43:03 INFO
Worker: Asked to launch driver

14:43:04 INFO
DriverRunner: Launched

14:43:05 INFO
Utils: Successfully started service 'driverClient'

14:43:06 INFO
ClientEndpoint: Driver successfully submitted

14:43:07 INFO
SparkContext: Submitted application: Spark Pi

14:43:08 INFO
Utils: Successfully started service 'sparkDriver'

14:43:11 INFO
StandaloneAppClient: Connecting to master

14:43:10 INFO
StandaloneSchedulerBackend: Connected to Spark cluster

14:43:12 INFO
Master: Registered app Spark Pi

14:43:13 INFO
Master: Launching executor on worker

14:43:14 INFO
Worker: Asked to launch executor

14:43:15 INFO
ExecutorRunner: Launched

14:43:16 INFO
StandaloneAppClient: Executor added on worker

14:43:17 INFO
StandaloneSchedulerBackend: Granted executor ID

14:43:18 INFO
StandaloneAppClient: Executor is now RUNNING

14:43:19 INFO
SparkContext: Starting job

...

14:43:20 INFO
DAGScheduler: Job finished

14:43:21 INFO
StandaloneSchedulerBackend: Shutting down all executors

14:43:22 INFO
Worker: Asked to kill executor

14:43:23 INFO
ExecutorRunner: Killing process!

14:43:24 INFO
Worker: Driver exited successfully

14:43:25 INFO
Master: Removing app

14:43:26 INFO
SparkContext: Successfully stopped SparkContext
```

![standalonecluster](/img/standalone-cluster.svg)

## Setup

1. Download [Spark 2.4.6](https://apache.claz.org/spark/spark-2.4.6/spark-2.4.6-bin-hadoop2.7.tgz)
2. Create the file `./conf/spark-defaults.conf`:

```conf
spark.master=spark://localhost:7077
spark.eventLog.enabled=true
spark.eventLog.dir=<sparkdir>/tmp/spark-events/
spark.history.fs.logDirectory=<sparkdir>/tmp/spark-events/
spark.driver.memory=5g
```

3. Create a Spark application:

```python
# test.py
>>> from pyspark import SparkContext
>>> file = "~/data.txt"  # path of data
>>> masterurl = 'spark://192.168.1.8:7077'
>>> sc = SparkContext(masterurl, 'myapp')
>>> data = sc.textFile(file).cache()
>>> num_a = data.filter(lambda s: 'a' in s).count()
>>> print(num_a)
>>> sc.stop()
```

## Starting a Master Daemon in Standalone Mode

- Description

```bash
$ ./sbin/start-master.sh 
```

## Starting a Worker Daemon in Standalone Mode

- Description

```bash
$ ./sbin/start-slave.sh spark://192.168.1.8:7077
```

## Starting a History Daemon

- Description of operational services
- Contains information about jobs

```bash
$ ./sbin/start-history-server.sh
```

## Launching a Spark Application

- Description

```bash
$ ./bin/spark-submit \
    --master spark://192.168.1.8:7077 \
    test.py
```

Notice, launching an application in client mode doesn't seem to trigger a driver according to the master's web UI. This doesn't mean a driver isn't actually launched in client mode. The driver is still launched within the `spark-submit` process. However, the master's web UI omits driver information if the application is running in client mode.

So, we may want to launch an application in cluster mode now. However, running an application in cluster mode would give us the following error:

```bash
$ ./bin/spark-submit \
    --master spark://192.168.1.8:7077 \
    --deploy-mode cluster
    test.py
Exception in thread "main" org.apache.spark.SparkException: Cluster deploy mode is currently not supported for python applications on standalone clusters.
```

As of Spark 2.4.6, we can't run python applications in cluster mode when running a standalone cluster manager. This is a good opportunity for us to experiment with other resource managers. Let's use YARN to run our python application in cluster mode.

### YARN

## Stopping Daemons

```bash
$ ./sbin/stop-master.sh
$ ./sbin/stop-slave.sh
$ ./sbin/stop-history-server.sh 
```

--------------SEPARATE BLOG: 10.2.3 Data-locality considerations
--------------NEXT BLOG: Do one with YARN instead of standalone

## References
- [Web UI for Drivers and Applications](https://stackoverflow.com/a/34587430/12777044)
- [Submitting a Spark Application](https://spark.apache.org/docs/latest/submitting-applications.html#launching-applications-with-spark-submit)
- [Types of Cluster Managers](https://spark.apache.org/docs/latest/cluster-overview.html#cluster-manager-types)
- [Spark Standalone Mode](https://spark.apache.org/docs/latest/spark-standalone.html)
- [Spark Web Interfaces](https://www.ibm.com/support/knowledgecenter/en/SS3H8V_1.1.0/com.ibm.izoda.v1r1.azka100/topics/azkic_c_webUIs.htm)
- [Difference between Cluster and Client Modes](https://stackoverflow.com/a/51763002/12777044)
- [Spark in Action Textbook](http://file.allitebooks.com/20180419/Spark%20in%20Action.pdf)
