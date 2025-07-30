import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { corsOptionsDelegate } from './app/middleware/cors';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import { trackPageView } from './app/middleware/fbConversionTracker';
import routes from './app/routes';

import fs from 'fs';
import path from 'path';

const app: Application = express();

// Replace your static serving with this more robust version
app.use('/tmp', (req, res, next) => {
   const filePath = path.join('/tmp', req.path.replace(/^\/tmp\//, ''));

   fs.promises
      .access(filePath, fs.constants.F_OK)
      .then(() => {
         res.sendFile(filePath, {
            headers: {
               'Cache-Control': 'public, max-age=300',
            },
         });
      })
      .catch(() => {
         // File not found - proceed to 404 handler
         next();
      });
});
// Enable CORS
app.use(cors(corsOptionsDelegate));
app.options('*', cors(corsOptionsDelegate));

// Parse cookies and JSON body
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(
   express.urlencoded({
      extended: true,
      limit: '100mb',
      parameterLimit: 100000, // Increase if you have many form fields
   })
);

// Track page views with Facebook Conversion API
app.use(trackPageView);

// application routes
app.get('/', (req: Request, res: Response) => {
   res.send('Server is running');
});

// use routes
app.use('/api/v1', routes);

// globalErrorHandler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Not Found',
      errorMessages: [
         {
            path: req.originalUrl,
            message: 'API Not Found',
         },
      ],
   });
   next();
});

export default app;
