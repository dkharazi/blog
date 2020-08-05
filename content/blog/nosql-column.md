---
title: "NoSQL Basics: Column-Family Databases"
date: "2020-02-27"
draft: false
katex: true
---

## Introduction to Cassandra
- Cassandra
        - Cassandra is Key-value, column-family database
        - Sharding using consistent hashing (scalability)
        - Writes to multiple nodes for backups (availability)
        - Use of quorum for general consensus (consistency)
        - Column-family database (Good for analytical data)
        - Compaction to reduce updated keys (set up as batch job)
