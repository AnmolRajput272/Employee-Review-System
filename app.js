const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require("./models/sequelize");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async () => {
  await sequelize.sync(); // Creates tables if they don't exist
})();

app.use('/admin',adminRoutes);
app.use('/employee',userRoutes);

app.get('/',(req, res) => {
  res.render('login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});