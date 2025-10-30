require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true, message: 'GeoGuard API' }));

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
