import request from 'supertest';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import apiRouter from '../routes/apiRouter';

dotenv.config();

// Mock axios to avoid real API calls
jest.mock('axios');

// Set up the Express app
const app = express();
app.use(apiRouter);

describe('GET /api/wanted', () => {
  it('should return paginated wanted persons with optional filters', async () => {
    const mockedFbiApiResponse = {
      data: {
        total: 100,
        items: [{ name: 'John Doe', age: 35, sex: 'Male' }, { name: 'Jane Doe', age: 29, sex: 'Female' }],
      },
    };

    axios.get.mockResolvedValue(mockedFbiApiResponse);

    const response = await request(app)
      .get('/api/wanted')
      .query({ sex: 'Male', age_min: 30, page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.totalItems).toBe(100);
    expect(response.body.pagination.totalPages).toBe(10);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      params: {
        sex: 'Male',
        age_min: 30,
        page: 1,
        pageSize: 10,
      },
    }));
  });

  it('should return an error if the FBI API request fails', async () => {
    axios.get.mockRejectedValue(new Error('FBI API failure'));

    const response = await request(app).get('/api/wanted');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Failed to fetch data from the FBI API');
  });
});

describe('GET /api/wanted/:uid', () => {
  it('should return a single wanted person by UID', async () => {
    const mockedFbiApiPersonResponse = {
      data: { name: 'John Doe', age: 35, sex: 'Male' },
    };

    axios.get.mockResolvedValue(mockedFbiApiPersonResponse);

    const response = await request(app).get('/api/wanted/b953c05b852a4b719c0a152ef8a73ffd');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
    expect(response.body.age).toBe(35);
    expect(response.body.sex).toBe('Male');
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      headers: expect.objectContaining({
        'User-Agent': expect.any(String),
        Referer: expect.any(String),
      }),
    }));
  });

  it('should return an error if the FBI API request fails for a specific person', async () => {
    axios.get.mockRejectedValue(new Error('FBI API failure'));

    const response = await request(app).get('/api/wanted/12345');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch data from the FBI API');
  });
});
