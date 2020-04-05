/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';

const Wreck = require('@hapi/wreck');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes: {
      cors: true
    }
  });

  const stockCache = server.cache({
    expiresIn: 60 * 60 * 1000,
    segment: 'stockCacheSegment',
    generateFunc: async (id: any) => {
      const promise = Wreck.request(
        'get',
        `https://sandbox.iexapis.com/beta/stock/${id.stock}/chart/${id.period}?token=${id.token}`
      );
      try {
        const res = await promise;
        const body = await Wreck.read(res);
        return body.toString();
      }
      catch (err) {
        return '';
      }
    },
    generateTimeout: 5000
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/api/beta/stock/{stock}/chart/{period}',
    handler: async (request, h) => {
      const { stock, period } = request.params;
      const token = request.query.token;
      const id = `${stock}:${period}`;

      const cacheObject: any = {
        id,
        stock,
        period,
        token
      }

      return await stockCache.get(cacheObject);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
