import express from "express";
import axios from "axios";

const apiRouter = express.Router();

// Base URL for the FBI wanted API
const FBI_API_URL = process.env.FBI_WANTED_API_URL;

/**
 * @route GET /api/wanted
 * @desc Get all wanted persons with optional filters
 * @queryParams {string} field_offices - Filter by FBI field office
 * @queryParams {number} page - Pagination support
 */
apiRouter.get("/api/wanted", async (req, res) => {
  try {
    const { field_offices, page } = req.query;
    const response = await axios.get(FBI_API_URL, {
      params: { field_offices, page },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching wanted list:", error.message);
    res.status(500).json({ error: "Failed to fetch wanted list" });
  }
});

/**
 * @route GET /api/wanted/:uid
 * @desc Get details of a specific wanted person by UID
 */
apiRouter.get("/api/wanted/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const response = await axios.get(`${FBI_API_URL}/${uid}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching wanted person:", error.message);
    res.status(404).json({ error: "Wanted person not found" });
  }
});

/**
 * @route GET /api/wanted/search
 * @desc Search wanted persons by name
 * @queryParams {string} name - Search term for wanted persons
 */
apiRouter.get("/api/wanted/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }
    const response = await axios.get(FBI_API_URL, { params: { title: name } });
    res.json(response.data);
  } catch (error) {
    console.error("Error searching wanted persons:", error.message);
    res.status(500).json({ error: "Failed to search wanted persons" });
  }
});

export default apiRouter;
