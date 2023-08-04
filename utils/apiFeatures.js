class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.query };
    const execute = ["page", "limit", "sort", "fields", "keyword"];
    execute.forEach((q) => delete queryObj[q]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.query.keyword) {
      const query = {
        $or: [
          { title: { $regex: this.query.keyword, $options: "i" } },
          { description: { $regex: this.query.keyword, $options: "i" } },
        ],
      };

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(docsCount) {
    const page = parseInt(this.query.page,10) || 1;
    const limit = parseInt(this.query.limit,10) || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const paginationResult = {};

    paginationResult.limit = limit;
    paginationResult.currentPage = page;
    paginationResult.numberOfPages = Math.ceil(docsCount / limit);

    if (endIndex < docsCount) {
      paginationResult.next = page + 1;
    }

    if (skip > 0) {
      paginationResult.previous = page - 1;
    }
    
    this.paginationResult = paginationResult;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
