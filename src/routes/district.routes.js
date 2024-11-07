const District = require("../models/district.model");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const df = await District.find();
    console.log(df);

    const { region } = req.query;

    if (!region) {
      return res.status(400).json({ error: "Region name is required" });
    }

    // Log the input region to verify what is being received
    console.log("Input region:", region);

    // Normalize the input by replacing both types of apostrophes with empty string
    const normalizedRegion = region.trim().replace(/['‘’]/g, "");
    console.log("Normalized region:", normalizedRegion);

    // Use regex to allow for case-insensitive and apostrophe-insensitive search
    const regex = new RegExp(normalizedRegion, "i");

    // Query districts using a flexible regex
    const districts = await District.find({
      region: { $regex: regex },
    });

    // Log the query result
    console.log("Query result:", districts);

    if (districts.length === 0) {
      return res
        .status(404)
        .json({ message: "No districts found for the given region" });
    }

    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     District:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the district
 *           example: "64e9b0f6f564af47d84e2b2d"
 *         region:
 *           type: string
 *           description: The name of the region
 *           example: "Farg'ona viloyati"
 *         district:
 *           type: string
 *           description: The name of the district
 *           example: "Quvasoy tumani"
 *         code:
 *           type: string
 *           description: The code representing the district
 *           example: "FAR_QUV"
 */

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get districts by region name
 *     tags: [Districts]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the region to retrieve districts for
 *         example: "Farg'ona viloyati"
 *     responses:
 *       200:
 *         description: A list of districts in the specified region
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *       400:
 *         description: Region name is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Region name is required"
 *       404:
 *         description: No districts found for the specified region
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No districts found for the given region"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
