---
title: "NoSQL Basics: Graph Databases"
date: "2020-03-01"
draft: false
katex: true
---

## Graph databases
- Good for data that has many complex relationships
        - Indexed based on relationships, rather than individuals
        - So prefer another solution if we want to search for individual pieces of data
        - Prefer graph databases if we'd rather search for relationships
        - It looks for possible connections (hidden or obvious)
- Good for reading results
        - Prefer another solution if we're looking to write data and don't expect to analyze/query results
        - Graph databases handle joins well
- Good for data that constantly changes
        - Specifically, graph databases can add columns to indivudal rows since they may be changing
        - Prefer relational databases if each observation is expected to have constant columns
        - In other words, if the requirements aren't expected to morph over time, prefer relational
- Good for searching a graph for a relationship with a point in mind
        - A graph database is optimized for traversing relationships from a starting data point or set
        - Prefer another solution for searching the graph without a specific relationship in mind
        - For example, graph is good for "What people does Jennifer know?"
        - For example, graph isn't built for "Who does Jennifer know, what does Jennifer know, what does Jennifer like, etc."
        - A good query for a graph db is "MATCH (n:Person {name: ‘Jennifer’})-[r:KNOWS]->(p:Person); RETURN p;"
        - A bad query for a graph db is "MATCH (n); WHERE n.name = 'Jennifer'; RETURN n;"
- Not good for key-value stores
        - A standard lookup operation is best used for key-value or even relational data models
        - More narrowed-down relationship lookups of a key are better suited for graph databases
- Good for storing and retreiving small nodes
        - Graphs are not suited for storing many properties on a single node
        - They are also not suited for storing large values within those properties
        - This is because the query can hop from entity to entity quickly
        - But, it needs extra processing to pull out details for each entity along a search path
https://medium.com/neo4j/how-do-you-know-if-a-graph-database-solves-the-problem-a7da10393f5
