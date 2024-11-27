const testService = require("../services/test.service");

class TestController {
  async createTest(req, res, next) {
    try {
      const data = await testService.create(req.body, req.user);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async checkTest(req, res, next) {
    try {
      const data = await testService.checkTest(req.query, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getTestById(req, res, next) {
    try {
      const data = await testService.getById(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getTestByLessonId(req, res, next) {
    try {
      // console.log(req.query.lessonId);

      const data = await testService.getTestByLessonId(req.query.lessonId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateTest(req, res, next) {
    try {
      const data = await testService.update(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteTest(req, res, next) {
    try {
      const data = await testService.delete(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TestController();
