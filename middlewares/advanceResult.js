const advanceResult = (model, populate) => async (req, res, next) => {
  // copy req.query for modifications
  const reqQuery = { ...req.query };

  // convert $in values to an array
  Object.keys(reqQuery).forEach((key) => {
    if (reqQuery[key].in) reqQuery[key].in = reqQuery[key].in.split(',');
  });

  // remove fields
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((field) => delete reqQuery[field]);

  // create operators ($gt, $gte, etc)
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (match) => `$${match}`);

  // parse the queryStr
  let query = model.find(JSON.parse(queryStr));

  // select field value extraction
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIdx).limit(limit);

  // populate
  if (populate) {
    query = query.populate(populate);
  }

  // executing query
  const results = await query;

  // pagination result
  const pagination = {};
  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advanceResult = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

export default advanceResult;
