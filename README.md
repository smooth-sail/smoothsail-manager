# SmoothSail Manager platform set up

## How to run locally

Install the required prerequisites and then follow the steps below.

### Prerequisites

You'll need:

- [Postgres](https://www.postgresql.org/) for the database
- [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream) for relaying reliable messages
- [Node.js](https://nodejs.org/en) to run the project

Run the following commands:

```bash
git clone https://github.com/smooth-sail/smoothsail-manager.git
cd smoothsail-manager
npm install
```

### Configuration

Create a `.env` file with the following:

```
PORT=3000

PGUSER=<username>
PGHOST=localhost
PGDATABASE=<ffdatabasename>
SDKKEYSDB=<sdkkeysdatabasename>
PGPASSWORD=<yourpassword>
PGPORT=5432
SECRET_KEY=<yoursecret> (Must be 32 chars)
NATS_SERVER="nats://localhost:<portnumber>"
LOGLEVEL=info
NODE_ENV=dev
```

- `PORT` is the port the Manager will be running on
- `SDKKEYSDB` and `PGDATABASE` should be the names of databases created on Postgres
- replace anything that has `<>` with your own credentials
- the `SECRET_KEY` will also need to be used for the SmoothSail SDK Service
- if PGPORT is not set it will use default value of 5432
- PGPASSWORD does not have to be set if you don't have a password
- LOGLEVEL desired log level (examples: `verbose`, `info`, `warn`). If not specified, defaults to `warn`
- NODE_ENV - set to `test` before running tests

### Running SmoothSail Manager platform

Before running the Node.js application, it's essential to start the NATS server as a separate service. The NATS server is responsible for message routing and communication. :

```bash
nats-server -js -p <portnumber>
```

From the root of `smoothsail-manager` run the following command to start the manager:

```bash
npm run dev
```

The SmoothSail dashboard will be available at `http://localhost:3000` (unless default port was changed)

You'll need the [SDK Service](https://github.com/smooth-sail/smoothsail-sdk-service) in order to communicate feature flag data to consumer applications. If you haven't yet head on over there to get that running.

# SmoothSail Manager platform API

## SDK keys endpoints

### Get current SDK Key

```http
GET /key
```

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: sdkKey;
}
```

If no key exists in the database, it will create a new valid key.

&nbsp;

_Returns on error:_

Status codes: `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Invalidate existing SDK Key

```http
POST /key
```

&nbsp;

> [!CAUTION]
> Invalidates any existing key

&nbsp;

_Expects:_

no body

&nbsp;

_Returns on success:_
returns a new valid key.

Status code: `200`

```jsx
{
  payload: sdkKey;
}
```

&nbsp;

_Returns on error:_

Status codes: `500`

```jsx
{
  error: error_message;
}
```

<br/><br/><br/>

## Flag endpoints

### Flag Object

```jsx
{
  fKey: string,
  title: string,
  description: string,
  isActive: boolean,
  createdAt: dateTime,
  updatedAt: dateTime,
}
```

<br/><br/>

### Get all flags

```http
GET /api/flags
```

&nbsp;

_Expects:_

no body.

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{ payload: [ flag1, flag2, flag3, … ] } // ASC order by date created
```

&nbsp;

_Returns on error:_

Status codes: `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Get a flag by a flag key

```http
GET /api/flags/:fKey
```

&nbsp;

_Expects:_

no body.

`fKey` ⇒ feature flag key (an HTTP path parameter)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: flag;
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Create a new flag

```http
POST /api/flags
```

&nbsp;

_Expects:_

```jsx
{
  fKey: fKey,
  title: title,
  description: description
}
```

&nbsp;

_Returns on success:_

Status code: `201`

```jsx
{
  payload: flag;
}
```

&nbsp;

_Returns on error:_

Status codes: `400`, `409`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Delete flag

```http
DELETE /api/flags/:fKey
```

&nbsp;

_Expects:_

no body.

`fKey` ⇒ feature flag key (an HTTP path parameter)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  message: "Flag successfully deleted.";
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Change the existing flag

```http
PATCH /api/flags/:fKey
```

&nbsp;

_Expects:_

`fKey` ⇒ key of the feature flag (an HTTP path parameter)

body:

```jsx
{
	action:  action,
	payload: payload
}
```

Supported action types and expected payloads for that action type:

- `body update` ⇒ `{ title, description }`
- `toggle` ⇒ `{ isActive: bool }`
- `segment add` ⇒ `{ sKey }`
- `segment remove` ⇒ `{ sKey }`

where `isActive` is `true` or `false` (desired toggled stated).

&nbsp;

_Returns on success:_

Status code: `200`

Reply body for each action type:

`body update`

```jsx
{
  payload: flag;
}
```

`toggle`

```jsx
{
  payload: flag;
}
```

`segment add`

```jsx
{
  payload: segment;
}
```

`segment remove`

```jsx
{
  payload: {
    message: "Segment was successfully removed.";
  }
}
```

&nbsp;

_Returns on error:_

Status codes: `400`, `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/><br/>

## Segment endpoints

### Segment Object

```jsx
{
	sKey: string,
	title: string,
	description: string,
	rulesOperator: string,
	rules: [
		{
			rKey: integer,
			aKey: string,
			type: 'boolean' || 'string' || 'number',
			operator: string,
			value: bool || string || number,
		},
	]
}
```

<br/><br/>

### Get all segments

```http
GET /api/segments
```

&nbsp;

_Expects:_

no body.

query params supported:

Possible query params: `fKey` to filter for a given flag. Example: `/api/segments?fKey=flag-1`

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{ payload: [ seg1, seg2, seg3, … ] } // sorted by sKey value
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Get a segment by a segment key

```http
GET /api/segments/:sKey
```

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: segment;
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Creta new segment

```http
POST /api/segments
```

&nbsp;

_Expects:_

```jsx
{
  sKey: sKey,
  title: title,
  description: description,
  rulesOperator: rulesOperator
}
```

`description` is optional
`rulesOperator` is optional (default will be used, default value is `all`)
`title` must be unique value

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: segment;
}
```

&nbsp;

> [!NOTE]
> Returns segment with empty rules array. To add rules, you need to create a segment first and then add a rule separately (see below)

&nbsp;

_Returns on error:_

Status codes: `400`, `409`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Delete segment

```http
DELETE /api/segments/:sKey
```

&nbsp;

_Expects:_

no body.

`sKey` ⇒ key of the segment (an HTTP path parameter)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  message: "Segment successfully deleted.";
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `409`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Change existing segment

```http
PATCH /api/segments/:sKey
```

&nbsp;

_Expects:_

sKey ⇒ key of the feature flag (an HTTP path parameter)

body:

```jsx
{
	action: action,
	payload: payload
}
```

Supported action types and expected request body for that action type:

- `body update` ⇒ `{ title, description, rulesOperator }`
- `rule add` ⇒ `{ aKey, operator, value }`
- `rule remove` ⇒ `{ rKey }`
- `rule update` ⇒ `{ operator, value, aKey, rKey }`

&nbsp;

_Returns on success:_

Status code: `200`

Reply body for each action type:

`body update`

```jsx
{
  payload: segment;
}
```

> [!NOTE]
> returned segment does not contain attribute `rules`

`rule add`

```jsx
{
    payload: {
        aKey: aKey,
        rKey: rKey,
        sKey: sKey,
        type: type,
        operator: operator,
        value: value
    }
}
```

`rule remove`

```jsx
{ "message": "Rule successfully deleted." }
```

`rule update`

```jsx
{ payload: {
    rKey: rKey,
    aKey: aKey,
    operator: operator,
    value: value,
    type: type,
    sKey: sKey
    }
}
```

&nbsp;

_Returns on error:_

Status codes: `400`, `404`, `409`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/><br/>

## Attribute endpoints

### Attribute object

```jsx
{
	aKey: string,
	name: string,
	type: 'boolean' || 'string' || 'number',
}
```

<br/><br/>

### Get all attributes

```http
GET /api/attributes
```

&nbsp;

_Expects:_

no body.

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{ payload: [ attr1, attr2, attr3, … ] } // ASC order by date created
```

&nbsp;

_Returns on error:_

Status codes: `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Get attribute by attribute key

```http
GET /api/attributes/:aKey
```

&nbsp;

_Expects:_

no body.

`aKey` ⇒ key of the attribute (an HTTP path parameter)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: attribute;
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Create a new attribute

```http
POST /api/attributes
```

&nbsp;

_Expects:_

```jsx
{
  aKey: aKey,
  name: name,
  type: type
}
```

`name` - optional (default: an empty string)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: attribute;
}
```

&nbsp;

_Returns on error:_

Status codes: `400`, `409`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Delete attribute

```http
DELETE /api/attributes/:aKey
```

&nbsp;

_Expects:_

no body.

`aKey` ⇒ key of the attribute (an HTTP path parameter)

> [!CAUTION]
> If an attribute is used in a rule & if you delete this attribute, all the rules that involve this attribute will be automatically deleted.

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  message: "Attribute successfully deleted.";
}
```

&nbsp;

_Returns on error:_

Status codes: `404`, `500`

```jsx
{
  error: error_message;
}
```

<br/><br/>

### Change existing attribute

```http
PUT /api/attributes/:aKey
```

&nbsp;

_Expects:_

`aKey` ⇒ current key of the attribute (an HTTP path parameter)

Request body:

```jsx
{
    aKey: aKey, // new aKey
    name: name
}
```

`name` is optional (default: an empty string)

&nbsp;

_Returns on success:_

Status code: `200`

```jsx
{
  payload: attribute;
}
```

&nbsp;

_Returns on error:_

Status codes: `400`, `404`, `500`

```jsx
{
  error: error_message;
}
```
