const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.categoryById = (req, res, next, id) => {
  Category.findById(id)   
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400).json({
          error: 'Category not found',
        });
      }
      req.category = category; // adds category object in req with category info
      next();
    });
};

exports.read = (req, res) => {
  return res.json(req.category)
}


exports.create = async (req, res) => {
  const category = await new Category(req.body);
  await category.save((err, data) => {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      })
    }
    
    res.status(200).json({data});
  });
  
};

exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err,data) => {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      })
    }
    res.json(data)
  })
};

exports.remove = (req, res, next) => {
  let category = req.category;
  category.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json({ message: 'Category deleted successfully' });
  });
};

exports.list = (req, res) => {
  Category.find().exec((err,data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(data)
  })
}

