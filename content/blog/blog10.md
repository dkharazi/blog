### Cluster Components
- What is a spark application?
	- It is a user-defined spark program
	- This program can be in the form of a jar or py file
	- We run the program using `spark-submit` command
		- In Python, we can just call `$ spark-submit test.py data.txt`
		- ...Example...
- What components are associated with running a spark application?
	- A cluster
		- A cluster contains:
			- A driver program
			- Executors on the cluster
	- A driver program
	- Executors on the cluster

### References
- [Pass python files in place of jar files in client mode](https://spark.apache.org/docs/latest/submitting-applications.html#launching-applications-with-spark-submit)
- [Example](https://www.tutorialkart.com/apache-spark/submit-spark-application-python-example/)
- [Cluster manager types](https://spark.apache.org/docs/latest/cluster-overview.html#cluster-manager-types)
