import request from 'superagent';
import app from '../../src/app.js';

describe('POST /shorten', () => {
  it('returns 201 with a shortUrl', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('shortUrl');
    expect(res.body).toHaveProperty('code');
  });

  it('returns 400 for missing url', async () => {
    const res = await request(app).post('/shorten').send({});
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid URL', async () => {
    const res = await request(app).post('/shorten').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
  });
});

describe('GET /:code', () => {
  it('redirects to the long URL', async () => {
    const { body } = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com/page' });

    const res = await request(app).get(`/${body.code}`);
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('https://example.com/page');
  });

  it('returns 404 for unknown code', async () => {
    const res = await request(app).get('/NOTREAL');
    expect(res.status).toBe(404);
  });
});

describe('GET /stats/:code', () => {
  it('returns stats for a valid code', async () => {
    const { body } = await request(app)
      .post('/shorten')
      .send({ url: 'https://example.com/stats-test' });

    const res = await request(app).get(`/stats/${body.code}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('click_count');
    expect(res.body).toHaveProperty('long_url');
  });
});