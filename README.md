## Frontend repo
[Autocomplete UI](https://github.com/Yud-Bet/autocomplete-ui)  
[Ceeit on Air](https://autocomplete-ui-psooqiuavq-uc.a.run.app)

## System design
![System design](/assets/system-design.png "System design")
### Trie data structure
With small data we can store it in the relational databases. However, fetching the top k search queries from a relational database is inefficient. The data structure trie (prefix tree) is used to overcome the problem.

![Trie](/assets/trie.png "Trie")

To sort the result we need to store the frequency along with the node.
| Query       | Frequency   |
| ----------- | ----------- |
| tree        | 10          |
| try         | 29          |

### Data gathering service
Updating the tree in realtime is not practical for 2 reasons:
 - Users may enter billions of queries per day. Updating the trie on every query significantly slows down the query service.
 - Top suggestions may not change much once the trie is built. Thus, it is unnecessary to update the trie frequently.
So, we need to build the data gathering service.

![Data gathering service](/assets/data-gathering.png "Data gathering service")

### Query logs
It stores raw data about search queries.
| Query       | Time         |
| ----------- | -----------  |
| tree        | 1668312111347|
| try         | 1668312101354|

### Aggregation services
The query logs is usually very large and data is not in the right format. We need to aggregate data so it can be easily proccess later.

### Aggregated data
| Query       | Frequency         |
| ----------- | -----------  |
| tree        | 1000         |
| try         | 967          |

### Workers
Workers perform asynchronous jobs at regular intervals.

### Trie cache
Cache most recent queries for a faster retrieval.

### Trie DB
Trie is converted to hash table form and save to noSQL database.

### Query services
Service that perform search autocomplete.
We can futher optimize query service by cache the result in the browser.
![Query service](/assets/query-service.png "Query service")

### Shard map manager
The next thing we want to look at is scaling the database.
![Shard map manager](/assets/shard-map-manager.png "Shard map manager")

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
