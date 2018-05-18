# Cloud Databases

This list is taken from https://github.com/apex/up/wiki#databases.

 - [Managed Databases](#managed-databases)
 - [Serverless Databases](#serverless-databases)

### Managed Databases

Hosted & managed databases usually require that you scale the cluster manually, and in some cases tune for performance or stability, thus manual intervention may be required.

- [AWS Elasticsearch](https://aws.amazon.com/elasticsearch-service/) - Managed analytics and full-text search
- [AWS RDS](https://aws.amazon.com/rds/) - Managed MySQL and Postgres
- [AWS ElastiCache](https://aws.amazon.com/elasticache/) - Redis & Memcached
- [Compose](https://www.compose.com/) - Myriad of managed databases (MongoDB, Redis, Postgres, etc)
- [Google Cloud SQL](https://cloud.google.com/sql/) - Fully-Managed PostgreSQL & MySQL
- [InfluxDB](https://www.influxdata.com/) - Timeseries database for low latency analytics
- [Elastic Cloud](https://www.elastic.co/cloud) - Elasticsearch provided by its creators

### Serverless Databases

A "serverless" database is elastic and scales on-demand with your workload, and typically require no tuning of any kind.

- [AWS Aurora](https://aws.amazon.com/rds/aurora/) - scale MySQL & Postgres
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/) - Document database with auto-scaling (though there is a delay)
- [Azure Cosmos](https://azure.microsoft.com/en-ca/services/cosmos-db/) - Multi-model globally distributed  (document, mongo protocol, graph)
- [Firebase Cloud Firestore](https://firebase.googleblog.com/2017/10/introducing-cloud-firestore.html) - Replicated document store
- [Firebase Realtime Database](https://firebase.google.com/products/database/) - Realtime NoSQL database
- [Google BigQuery](https://cloud.google.com/bigquery) - Serverless analytics for massive scale and low cost
- [Google Cloud Datastore](https://cloud.google.com/datastore/) - Highly Scalable NoSQL Database
- [Google Cloud Spanner](https://cloud.google.com/spanner/) - Horizontally scalable, strongly consistent, relational database
- [Graph.cool](https://www.graph.cool/) - Serverless GraphQL as a service
- [FaunaDB](https://fauna.com/) - Globally distributed
