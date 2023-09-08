const Employee = require("../models/employee");
const Review = require("../models/review");
const ReviewAssignment = require("../models/reviewAssignment");
const { generateToken } = require("../middleware/authentication");

async function getAllReviews(revieweeId){
    const reviews = await ReviewAssignment.findAll({
      where: { revieweeId: revieweeId },
      include: [
        { 
          model: Review,
          where: {
            status: 'Completed'
          }
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
    
    const allReviews = reviews.map((review,index)=>{
      return {
        "title":review["Review"]["title"],
        "feedback":review["Review"]["feedback"],
        "status":review["Review"]["status"],
        "revieweeEmail" : review["reviewee"]["email"],
        "reviewerEmail" : review["reviewer"]["email"]
      }
    });
  
    return allReviews;
}
  
async function getAllPendingReviews(reviewerId){
    const reviews = await ReviewAssignment.findAll({
      where: { reviewerId: reviewerId },
      include: [
        { 
          model: Review,
          where: {
            status: 'Pending'
          }
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
    
    const allReviews = reviews.map((review,index)=>{
      return {
        "id":review["Review"]["id"],
        "title":review["Review"]["title"],
        "feedback":review["Review"]["feedback"],
        "status":review["Review"]["status"],
        "revieweeEmail" : review["reviewee"]["email"]
      }
    });
  
    return allReviews;
}

const userController = {
    renderLoginPage:(req, res) => {
        res.render('login');
    },
    renderPendingReviewsPage:async (req, res) => {
        const employeeId = req.user.id;
        try {
          const reviews = await getAllPendingReviews(employeeId);
          res.render('pendingReviews',{"pendingReviews":reviews})
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    renderAllReviewsPage:async (req, res) => {
        const employeeId = req.user.id;
        try {
          const reviews = await getAllReviews(employeeId);
          res.render('allReviews',{"reviews":reviews})
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    renderUserDashboard:async (req, res) => {
        res.render('userDashboard')
    },
    submitReview: async (req, res) => {
        const reviewAssignmentId = req.params.id;
        const feedback = req.body.feedback;
        try {
          const reviewAssignment = await ReviewAssignment.findByPk(
            reviewAssignmentId,
            { include: [{ model: Review }] }
          );
          if (!reviewAssignment) {
            return res.status(404).json({ error: 'Review assignment not found' });
          }
          reviewAssignment.Review.feedback = feedback;
          reviewAssignment.Review.status = 'Completed';
          await reviewAssignment.Review.save();
          res.render('userDashboard')
          // res.json(reviewAssignment.Review);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    },
    login:async (req, res) => {
        console.log(req.body)
        const { email, password } = req.body;
        try {
          const user = await Employee.findOne({ where: { email } });
          if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
          }
          let isPasswordValid = false;
          if(user.password === password) isPasswordValid = true;
          else{
            return res.status(401).json({ error: 'Authentication failed : Password invalid.' });
          }
          const token = generateToken(user);
          res.json({ "token" : token, "isAdmin":user.isAdmin });
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = userController;