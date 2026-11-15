# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection transfer_events for transfer_initiated and transfer_settled events. These are fictional event examples based on transfer, account, customer.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related account, customer details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "transfer_initiated",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "transfer",
        "key": {
            "transfer_id": 3001
        },
        "snapshot": {
            "transfer_id": 3001,
            "source_account_id": 2001,
            "destination_account_id": 2002,
            "amount": 125.5,
            "status": "settled",
            "created_at": "2025-03-01T14:00:00Z",
            "idempotency_key": "synthetic-transfer-0001"
        }
    },
    "embedded": {
        "account": [
            {
                "key": {
                    "account_id": 2001
                },
                "snapshot": {
                    "account_id": 2001,
                    "customer_id": 1001,
                    "account_number": "SYN-USD-0001",
                    "balance": 1250.75,
                    "status": "active",
                    "opened_on": "2025-01-12"
                },
                "via": [
                    "transfer.source_account_id → account"
                ]
            },
            {
                "key": {
                    "account_id": 2002
                },
                "snapshot": {
                    "account_id": 2002,
                    "customer_id": 1002,
                    "account_number": "SYN-USD-0002",
                    "balance": 800,
                    "status": "active",
                    "opened_on": "2025-02-16"
                },
                "via": [
                    "transfer.destination_account_id → account"
                ]
            }
        ],
        "customer": [
            {
                "key": {
                    "customer_id": 1001
                },
                "snapshot": {
                    "customer_id": 1001,
                    "full_name": "Avery Morgan",
                    "email": "avery.morgan@example.test",
                    "created_at": "2025-01-10T09:30:00Z"
                },
                "via": [
                    "transfer.source_account_id → account.customer_id → customer"
                ]
            },
            {
                "key": {
                    "customer_id": 1002
                },
                "snapshot": {
                    "customer_id": 1002,
                    "full_name": "Riley Chen",
                    "email": "riley.chen@example.test",
                    "created_at": "2025-02-14T11:45:00+00:00"
                },
                "via": [
                    "transfer.destination_account_id → account.customer_id → customer"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("transfer_events").find({"eventType":"transfer_initiated"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "transfer_initiated",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "transfer_id": 3001
    }
  },
  {
    "_id": "event_000003",
    "eventType": "transfer_initiated",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "transfer_id": 3002
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("transfer_events").find({"source.key.transfer_id":3001}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "transfer_initiated",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "transfer_id": 3001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "transfer_settled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "transfer_id": 3001
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("transfer_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "transfer_initiated",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "transfer_id": 3001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "transfer_settled",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "transfer_id": 3001
    }
  },
  {
    "_id": "event_000003",
    "eventType": "transfer_initiated",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "transfer_id": 3002
    }
  },
  {
    "_id": "event_000004",
    "eventType": "transfer_settled",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "transfer_id": 3002
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("transfer_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| transfer_initiated | 2 |
| transfer_settled | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run BABAYEMI_EMMANUEL_301909201_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/BABAYEMI_EMMANUEL_301909201_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

