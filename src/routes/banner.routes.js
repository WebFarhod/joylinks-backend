const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const AdminMiddleware = require("../middlewares/admin.middleware");
const UserMiddleware = require("../middlewares/user.middleware");

router.post("/", AdminMiddleware, bannerController.createBanner);

router.get("/", UserMiddleware, bannerController.getBanners);

router.get("/:id", UserMiddleware, bannerController.getBannerById);

router.put("/:id", AdminMiddleware, bannerController.updateBanner);

router.delete("/:id", AdminMiddleware, bannerController.deleteBanner);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - title
 *         - img
 *         - course_id
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the banner
 *         title:
 *           type: string
 *           description: The title of the banner
 *         img:
 *           type: string
 *           description: The image URL of the banner
 *         course_id:
 *           type: string
 *           description: The id of the associated course
 *         is_active:
 *           type: string
 *           description: The id of the associated course
 *       example:
 *         id: 603d2149e773f2a3990b47f5
 *         title: New Course Available
 *         img: https://example.com/banner.jpg
 *         course_id: 603d2149e773f2a3990b47f6
 */

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: API for managing banners
 */

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Banner'
 *     responses:
 *       201:
 *         description: Banner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Failed to create banner
 *
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     parameters:
 *       - name: is_active
 *         in: query
 *         required: false
 *         description: Filter banners by active status
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Failed to retrieve banners
 */

/**
 * @swagger
 * /banners/{id}:
 *   get:
 *     summary: Get a banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to retrieve
 *     responses:
 *       200:
 *         description: Banner found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Failed to retrieve banner
 *
 *   put:
 *     summary: Update a banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Banner'
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Failed to update banner
 *
 *   delete:
 *     summary: Delete a banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the banner to delete
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Failed to delete banner
 */
