import { Elysia } from 'elysia';

export const app = new Elysia({aot:false})
  .onError(({ code, error }: any) => {
    return  {
      success: false,
      message: "An error has occurred while requesting",
      code: `${error.status} (${code})`,
    };
  })

  .get('/', () => 'Hello hajihami-sync!')
  .get('/health', () => 'OK')
  .get('/ping', () => 'pong')
  .get('/version', () => '1.0.0')
  .get('/info', () => ({
    name: 'hajihami-sync',
    version: '1.0.0',
    description: 'A simple Elysia application for hajihami-sync',
  }))



console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);