// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("transfer_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("transfer_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "transfer_initiated",
                    "transfer_settled"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "transfer"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "transfer_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("transfer_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "transfer_settled",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "risk_score": "illustrative risk_score",
                "review_reason": "illustrative review_reason",
                "channel": "illustrative channel"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "transfer_initiated",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "transfer",
            "key": {
                "transfer_id": 3002
            },
            "snapshot": {
                "transfer_id": 3002,
                "source_account_id": 2002,
                "destination_account_id": 2001,
                "amount": 40,
                "status": "pending",
                "created_at": "2025-03-02T08:15:00-05:00",
                "idempotency_key": "synthetic-transfer-0002"
            }
        },
        "embedded": {
            "account": [
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
                        "transfer.source_account_id → account"
                    ]
                },
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
                        "transfer.destination_account_id → account"
                    ]
                }
            ],
            "customer": [
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
                        "transfer.source_account_id → account.customer_id → customer"
                    ]
                },
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
                        "transfer.destination_account_id → account.customer_id → customer"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "web"
        }
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "transfer_settled",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "transfer",
            "key": {
                "transfer_id": 3002
            },
            "snapshot": {
                "transfer_id": 3002,
                "source_account_id": 2002,
                "destination_account_id": 2001,
                "amount": 40,
                "status": "pending",
                "created_at": "2025-03-02T08:15:00-05:00",
                "idempotency_key": "synthetic-transfer-0002"
            }
        },
        "embedded": {
            "account": [
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
                        "transfer.source_account_id → account"
                    ]
                },
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
                        "transfer.destination_account_id → account"
                    ]
                }
            ],
            "customer": [
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
                        "transfer.source_account_id → account.customer_id → customer"
                    ]
                },
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
                        "transfer.destination_account_id → account.customer_id → customer"
                    ]
                }
            ]
        },
        "references": {},
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "risk_score": "illustrative risk_score",
                "review_reason": "illustrative review_reason",
                "channel": "illustrative channel"
            }
        }
    }
]));
  await db.getCollection("transfer_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("transfer_events").find({"eventType":"transfer_initiated"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("transfer_events").find({"source.key.transfer_id":3001}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("transfer_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("transfer_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("transfer_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("transfer_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("transfer_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
