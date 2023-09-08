const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/authentication");

router.get('/dashboard', adminController.renderAdminDashboard);

router.get('/add-employee', adminController.renderAddEmployeePage);

router.get('/edit-employee/:id', adminController.renderEditEmployeePage);

// List All Employees:
router.get('/employees', authenticateAdmin, adminController.getAllEmployees);

// List All Employees:
router.get('/available-reviewee/:reviewerId', authenticateAdmin, adminController.getAllReviewees);

// Add Employee
router.post('/employees/add', authenticateAdmin, adminController.addEmployee);


// Edit Employee:
router.post('/employees/edit/:id', authenticateAdmin, adminController.editEmployee);


// Delete Employee
router.delete('/employees/delete/:id', authenticateAdmin, adminController.deleteEmployee);


// List Reviews
router.get('/reviews', authenticateAdmin, adminController.getAllUsersReviews);

// Assign Review
router.post('/reviews/assign', authenticateAdmin, adminController.assignReview);

module.exports = router;