class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // console.log('filter method')
    const queryObj = { ...this.queryString };
    const excludeFields = ['sort', 'page', 'fields', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    // console.log(queryStr)
    this.query = this.query.find(JSON.parse(queryStr));
    // console.log(this.query)
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(
        JSON.stringify(this.queryString.sort).split(',').join(' ')
      );
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // console.log('fields')
    if (this.queryString.fields) {
      const temp = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(temp);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  // pagination() {
  //   console.log(this.queryString)
  //   const {page, limit}  = req.queryString
  //   const skip = (page - 1) * limit
  //   console.log(skip)
  //   this.query= this.query.skip(skip).limit(limit * 1)
  //   console.log(this.query)
  //   return this
  // }
}

module.exports = APIFeatures;
