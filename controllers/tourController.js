const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(val);
  if (parseInt(val) > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'invalid id',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  // console.log(req.params);
  let id = req.params.id * 1;
  // console.log(typeof id);
  let tour = tours.find((tour) => tour.id === id);
  // console.log(tour);
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  } else {
    res.status(200).json({
      status: 'success',
      tour,
    });
  }
};

exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
      console.log(err);
    }
  );
};

exports.updateTour = (req, res) => {
  let id = req.params.id * 1;
  let tour = tours.find((tour) => tour.id === id);
  let data = req.body;
  console.log(!data);
  if (tour && data) {
    tour = { ...tour, ...data };
    tours.push(tour);

    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json}`,
      JSON.stringify(tours),
      (err) => console.log(err)
    );

    return res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  }
  res.status(400).json({
    status: 'fail',
    msg: "can't find the tour or the request body is empty",
  });
};
