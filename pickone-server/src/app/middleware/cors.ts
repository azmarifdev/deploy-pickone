const origins = [
   'http://localhost:3000',
   'http://localhost:3001',
   'https://admin-frontend-xi-ten.vercel.app',
   'https://pickone-client-site.vercel.app',
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
