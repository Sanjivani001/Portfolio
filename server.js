require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Portfolio = require('./models/Portfolio');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.get('/', (req, res) => {
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  res.render('pages/form');
});

app.post('/form', async (req, res) => {
  try {
    const { name, title, about, skills, email, phone, github, linkedin, template } = req.body;

    const projects = Array.isArray(req.body.projectTitle)
      ? req.body.projectTitle.map((_, i) => ({
          title: req.body.projectTitle[i],
          description: req.body.projectDescription[i],
          link: req.body.projectLink[i],
          image: req.body.projectImage[i]
        }))
      : [{
          title: req.body.projectTitle,
          description: req.body.projectDescription,
          link: req.body.projectLink,
          image: req.body.projectImage
        }];

    const portfolio = new Portfolio({
      name, title, about, skills, email, phone, github, linkedin, template,
      projects
    });

    const saved = await portfolio.save();
    res.redirect(`/portfolio/${saved._id}`);
  } catch (err) {
    console.error("❌ Error saving:", err);
    res.send("Error saving your portfolio.");
  }
});

app.get('/portfolio/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).send("Portfolio not found");

    const template = portfolio.template || 'template1';
    res.render(`templates/${template}`, { portfolio });
  } catch (err) {
    console.error("❌ Load error:", err);
    res.status(500).send("Error loading portfolio");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
