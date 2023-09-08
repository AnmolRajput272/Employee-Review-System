const Employee = require("../models/employee");
const Review = require("../models/review");
const ReviewAssignment = require("../models/reviewAssignment");

async function getEmployeeDetails(employeeId){
    return await Employee.findOne({ where: { "id" : employeeId } });
}

function empObjToJSON(empObj){
    return {
      "id":empObj["id"],
      "firstName": empObj["firstName"],
      "lastName": empObj["lastName"],
      "email": empObj["email"],
      "password": empObj["password"],
      "isAdmin": empObj["isAdmin"]
    }
  }

const adminController = {
    renderAdminDashboard:async (req, res) => {
        res.render('adminDashboard');
    },
    renderAddEmployeePage:async (req, res) => {
        res.render('addEmployee');
    },
    renderEditEmployeePage:async (req, res) => {
        const employeeId = req.params.id;
        const employeeDetails = await getEmployeeDetails(employeeId);
        res.render('editEmployee',{"employee":{...empObjToJSON(employeeDetails),"saved":false}});
    },
    getAllEmployees:async (req, res) => {
        try {
          const employees = await Employee.findAll();
          res.json(employees);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllReviewees:async (req, res) => {
        try {
          const reviewerId = parseInt(req.params.reviewerId);
          const employees = await Employee.findAll({ where: {"isAdmin":false} });
      
          const reviews = await ReviewAssignment.findAll({
            where: { reviewerId: reviewerId },
            include: [
              { 
                model: Review
              },
              {
                model: Employee, // Include reviewer details
                as: 'reviewer', // Alias for the reviewer
              },
              {
                model: Employee, // Include reviewee details
                as: 'reviewee', // Alias for the reviewee
              }
            ],
          });
          
          const allReviews = reviews.map((review,index)=>review["reviewee"]["id"]);
          allReviews.push(reviewerId);
          const employees_data = employees.map((employee)=> empObjToJSON(employee)).filter((employee)=>!allReviews.includes(employee["id"]));
          res.json(employees_data);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    addEmployee:async (req, res) => {
        try {
          const { firstName, lastName, email, password, isAdmin } = req.body;
          const newEmployee = await Employee.create({
            firstName,
            lastName,
            email,
            password,
            isAdmin,
          });
          res.json(newEmployee);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    editEmployee:async (req, res) => {
        const employeeId = req.params.id;
        try {
          const { firstName, lastName, email, isAdmin } = req.body;
          const employee = await Employee.findByPk(employeeId);
          if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          await employee.update({ firstName, lastName, email, isAdmin });
          res.render('editEmployee',{"employee":{...empObjToJSON(employee),"saved":true}});
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteEmployee:async (req, res) => {
        const employeeId = req.params.id;
        try {
          const employee = await Employee.findByPk(employeeId);
          if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          await employee.destroy();
          res.json({ message: 'Employee deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllUsersReviews:async (req, res) => {
        try {
          const reviews = await Review.findAll();
          res.json(reviews);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    assignReview:async (req, res) => {
        try {
          const { reviewerId, revieweeId } = req.body;
          const title = 'Feedback';
          const feedback = '';
          const status = 'Pending';
      
          const review = await Review.create({ title, feedback, status });
          await ReviewAssignment.create({
            reviewerId,
            revieweeId,
            reviewId: review.id,
          });
          res.json(review);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = adminController;