const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  image: String
});

const portfolioSchema = new mongoose.Schema({
  name: String,
  title: String,
  about: String,
  skills: String,
  email: String,
  phone: String,
  github: String,
  linkedin: String,
  projects: [projectSchema],
  template: String
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
