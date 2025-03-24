/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Query } from "mongoose";

class QueryBuilder<T> {
  public query: Query<T[], T>;
  private model: Model<T>;
  private queryParams: Record<string, any>;

  constructor(model: Model<T>, queryParams: Record<string, any>) {
    this.model = model;
    this.queryParams = queryParams;
    this.query = this.model.find();
    // console.log("Initial Query Params:", queryParams);
  }

  search(searchableFields: string[]) {
    if (this.queryParams.searchTerm) {
      const searchRegex = new RegExp(this.queryParams.searchTerm, "i");
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: searchRegex,
        })),
      };
      // console.log("Searchable Fields:", searchableFields); // Debug
      // console.log("Search Query:", searchQuery); // Debug
      this.query = this.query.find(searchQuery); // Apply search filter directly
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["searchTerm", "sort", "page", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);
    // console.log("Filter Query:", queryObj);
    this.query = this.query.find(queryObj); // Apply exact filters
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  fields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  async exec() {
    // console.log("Final Query Filter:", this.query.getFilter());
    return await this.query.exec();
  }

  async count() {
    const filterQuery = this.query.getFilter();
    return await this.model.countDocuments(filterQuery);
  }

  async getPaginationMeta() {
    const total = await this.count();
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    const totalPages = Math.ceil(total / limit);
    return { page, limit, total, totalPages };
  }
}

export default QueryBuilder;