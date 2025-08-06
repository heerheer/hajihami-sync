import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => 'Hello hajihami-sync!')
  .get('/health', () => 'OK')
  .get('/ping', () => 'pong')
  .get('/version', () => '1.0.0')
  .get('/info', () => ({
    name: 'hajihami-sync',
    version: '1.0.0',
    description: 'A simple Elysia application for hajihami-sync',
  }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);