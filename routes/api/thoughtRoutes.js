const router = require('express').Router();
const {
  getThought,
  createThought,
  getSingleThought,
  updateCourse,
  deleteCourse,
} = require('../../controllers/thoughtController.js');

// /api/thoughts
router.route('/').get(getThought).post(createThought);

// /api/courses/:courseId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
