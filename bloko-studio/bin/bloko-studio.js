#!/usr/bin/env node

import { startStudio } from '../server.js';

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 4173;
startStudio(port);
