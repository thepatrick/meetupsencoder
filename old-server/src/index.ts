import { Request, Response } from 'express';
import express = require('express');

import { sessionAuth } from './middleware/sessionAuth';
import { registerRoutes } from './routes';
import { createDatabasePool } from './db';

const app = express();
const port = 8080; // default port to listen

app.use(express.json());

const pool = createDatabasePool();

sessionAuth(app);
registerRoutes(app, pool);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
