import express from "express";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const apiRouter = express.Router();


// Base URL for the FBI wanted API
const FBI_API_URL = process.env['FBI_WANTED_API_URL'];
const FBI_WANTED_API_UID_URL = process.env['FBI_WANTED_API_UID_URL'];
/**
 * @route GET /api/wanted
 * @desc Get all wanted persons with optional filters
 * @queryParams {string} field_offices - Filter by FBI field office
 * @queryParams {number} page - Pagination support
 */
// Route to fetch wanted persons with search criteria and pagination
apiRouter.get("/api/wanted", async (req, res) => {
  try {
    const cacheKey = `wanted_${JSON.stringify(req.query)}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.json({ success: true, data: cachedData, cached: true });
    }
    // Extract query parameters for search criteria and pagination
    const { sex, age_min, age_max, nationality, page = 1, limit = 10 } = req.query;

    // Build the query parameters for the FBI API
    const params = {
      page: parseInt(page, 10), // Current page
      pageSize: parseInt(limit, 10), // Number of items per page
    };

    // Add optional search criteria if provided
    if (sex) params.sex = sex;
    if (age_min) params.age_min = parseInt(age_min, 10);
    if (age_max) params.age_max = parseInt(age_max, 10);
    if (nationality) params.nationality = nationality;

    // Make the request to the FBI API
    console.log('FBI_API_URL', FBI_API_URL);
    const response = await axios.get(FBI_API_URL, {
      params,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "http://www.fbi.gov",
      },
    });

    // Extract data from the FBI API response
    const { total, items } = response.data;

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

        const result = {
          success: true,
          data: items,
          pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit, 10),
          },
        };
        //update cache
        //setCache(cacheKey, result);

    // Return the paginated response
    res.json(result);
  } catch (error) {
    console.error("Error fetching wanted persons:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch data from the FBI API" });
  }
});


apiRouter.get("/api/wanted/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    console.log('FBI_API_URL_PERSON', `${FBI_WANTED_API_UID_URL}`);

    const response = await axios.get(`${FBI_WANTED_API_UID_URL}/${uid}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "http://www.fbi.gov",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching wanted person:", error.message);
    res.status(500).json({ error: "Failed to fetch data from the FBI API" });
  }
});



// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // xpires after 5 minutes

const getFromCache = (key) => {
  const cachedData = cache.get(key);
  if (!cachedData) return null;
  if (Date.now() > cachedData.expiry) {
    cache.delete(key);
    return null;
  }
  return cachedData.data;
};

const setCache = (key, data) => {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
};


export default apiRouter;
