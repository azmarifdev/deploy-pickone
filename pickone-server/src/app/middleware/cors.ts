const origins = [
   'http://localhost:3000',
   'http://localhost:3001',
   'http://localhost:4000',
   'http://localhost:5000',
   'https://admin-frontend-xi-ten.vercel.app',
   'https://pickone-client-site.vercel.app',
   // Development server
   'http://103.213.38.213',
   'http://103.213.38.213:3000',
   'http://103.213.38.213:4000',
   'http://103.213.38.213:5000',
   'http://103.213.38.213:80',
];

export const corsOptionsDelegate = function (req: any, callback: any) {
   const origin = req.header('Origin');
   let corsOptions;
   if (origins.some(allowedOrigin => origin?.startsWith(allowedOrigin))) {
      corsOptions = {
         origin,
         credentials: true,
         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
         allowedHeaders: ['Content-Type', 'Authorization'],
         exposedHeaders: ['Content-Disposition'],
      };
   } else corsOptions = { origin: false };

   callback(null, corsOptions);
};
