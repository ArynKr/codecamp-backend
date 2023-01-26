/**
 * @desc        get all bootcamps
 * @route       GET /api/v1/bootcamps
 * @access      Public
 */
export const getBootcamps = (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

/**
 * @desc        get single bootcamps
 * @route       GET /api/v1/bootcamps/:id
 * @access      Public
 */
export const getBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: 'Show single bootcamps' });
};

/**
 * @desc        create new bootcamp
 * @route       POST /api/v1/bootcamps
 * @access      Private
 */
export const createBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: 'New bootcamp created' });
};

/**
 * @desc        Update a bootcamp
 * @route       PUT /api/v1/bootcamps/:id
 * @access      Private
 */
export const updateBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: 'bootcamp updated' });
};

/**
 * @desc        delete a bootcamp
 * @route       DELETE /api/v1/bootcamps/:id
 * @access      Private
 */
export const deleteBootcamp = (req, res) => {
  res.status(200).json({ success: true, msg: 'bootcamp deleted' });
};
