import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this.query.search) {
      const search = this.query.search as string;
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      };

      this.modelQuery = this.modelQuery.find(searchQuery);
    }

    return this;
  }

  sortBy() {
    if (this.query.sortBy) {
      const sortBy = this.query.sortBy as string;
      const sortOrder = this.query.sortOrder === 'desc' ? -1 : 1;

      this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    }

    return this;
  }

  filter() {
    if (this.query.filter) {
      const author = this.query.filter as string;

      this.modelQuery = this.modelQuery.find({ author });
    }

    return this;
  }
}

export default QueryBuilder;
