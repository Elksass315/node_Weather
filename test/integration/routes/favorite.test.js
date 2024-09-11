const request = require('supertest');
const express = require('express');
const favoriteRouter = require('../../../routes/favorite'); // Your route file
const Favorite = require('../../../model/favorite'); // Mongoose model
const auth = require('../../../middleware/auth'); // Your auth middleware

// Mock the auth middleware
jest.mock('../../../middleware/auth', () => (req, res, next) => {
    req.user = { _id: 'user123' }; // Simulate an authenticated user
    next();
});

// Mock the Favorite model
jest.mock('../../../model/favorite');

const app = express();
app.use(express.json());
app.use('/favorites', favoriteRouter);

describe('Favorite City Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('POST /favorites', () => {
        it('should return 401 if no city is provided', async () => {
            const response = await request(app)
                .post('/favorites')
                .send({});

            expect(response.status).toBe(401);
            expect(response.text).toBe('No city provided');
        });

        it('should add a new city to an existing favorite list', async () => {
            const mockFavorite = {
                user: 'user123',
                favoriteCity: ['Paris'],
                save: jest.fn().mockResolvedValue(true), // Mock save
            };

            Favorite.findOne.mockResolvedValue(mockFavorite); // Mock existing favorite

            const response = await request(app)
                .post('/favorites')
                .send({ city: 'London' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('City added to favorites');
            expect(mockFavorite.save).toHaveBeenCalled();
            expect(mockFavorite.favoriteCity).toContain('London');
        });

    });

    describe('DELETE /favorites', () => {
        it('should return 404 if no favorite cities exist for user', async () => {
            Favorite.findOne.mockResolvedValue(null); // No favorite cities found

            const response = await request(app)
                .delete('/favorites')
                .send({ city: 'New York' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No favorite cities found for user');
        });

        it('should remove a city from the favorite list', async () => {
            const mockFavorite = {
                user: 'user123',
                favoriteCity: ['Paris', 'London'],
                save: jest.fn().mockResolvedValue(true), // Mock save
            };

            Favorite.findOne.mockResolvedValue(mockFavorite); // Mock existing favorite

            const response = await request(app)
                .delete('/favorites')
                .send({ city: 'London' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('City removed from favorites');
            expect(mockFavorite.favoriteCity).not.toContain('London');
        });

        it('should not change the favorite list if city does not exist', async () => {
            const mockFavorite = {
                user: 'user123',
                favoriteCity: ['Paris'],
                save: jest.fn().mockResolvedValue(true), // Mock save
            };

            Favorite.findOne.mockResolvedValue(mockFavorite); // Mock existing favorite

            const response = await request(app)
                .delete('/favorites')
                .send({ city: 'London' });

            expect(response.status).toBe(200);
            expect(mockFavorite.save).toHaveBeenCalled();
            expect(mockFavorite.favoriteCity).toHaveLength(1);
            expect(mockFavorite.favoriteCity).toContain('Paris');
        });
    });
});
