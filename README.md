

### T.O. Middlware => @oresoftware/t.o.middleware

##### Installation

>
>```bash
>npm i @oresoftare/t.o.middleware
>```
>

### Example

```js

import tomw from '@oresoftare/t.o.middleware';

const app = express();

app.use(tomw({ms:3000}, (req, res) => {
     res.json({error: 'timeout'})
}));

// or more simply:

app.use(tomw(3000, (req, res) => {
     res.json({error: 'timeout'})
}));

```
