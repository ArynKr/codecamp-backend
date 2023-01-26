const logger = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(
    `[${req.method}]\t${req.protocol}://${req.get('host')}${req.originalUrl}`,
  );
  next();
};

export default logger;
