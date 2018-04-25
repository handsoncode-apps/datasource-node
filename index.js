class QueryBuilder {
  constructor(query, tablename) {
    this.query = query;
    this.tablename = tablename ? `${tablename}.` : '';
  }

  _joinCondition(columnName, operator, arg) {
    return (arg === null || arg === undefined) ?
      `${columnName} ${operator}`
      :
      `${columnName} ${operator} "${arg}"`;
  }

  _byValueCondition(columnName, arg) {
    let inValues = [];
    Object.keys(arg).forEach((key) => {
      inValues.push(`"${arg[key]}"`);
    });
    return `${columnName} IN (${inValues.join(', ')})`;
  }

  _betweenCondition(columnName, operator, args) {
    return `${columnName} ${operator} ${args[0]} AND ${args[2]}`;
  }

  _getSQLClause(columnName, condition) {
    columnName = this.tablename + columnName;
    switch (condition.name) {
      case 'eq':
        return this._joinCondition(columnName, '=', condition.args[0]);
      case 'neq':
        return this._joinCondition(columnName, '!=', condition.args[0]);
      case 'empty':
        return this._joinCondition(columnName, 'IS NULL');
      case 'not_empty':
        return this._joinCondition(columnName, 'IS NOT NULL');
      case 'begins_with':
        return this._joinCondition(columnName, 'LIKE', `${condition.args[0]}%`);
      case 'ends_with':
        return this._joinCondition(columnName, 'LIKE', `%${condition.args[0]}`);
      case 'contains':
        return this._joinCondition(columnName, 'LIKE', `%${condition.args[0]}%`);
      case 'not_contains':
        return this._joinCondition(columnName, 'NOT LIKE', `%${condition.args[0]}%`);
      case 'by_value':
        return this._byValueCondition(columnName, condition.args[0]);
      case 'gt':
        return this._joinCondition(columnName, '>', Number(condition.args[0]));
      case 'gte':
        return this._joinCondition(columnName, '>=', `${condition.args[0]}`);
      case 'lt':
        return this._joinCondition(columnName, '<', `${condition.args[0]}`);
      case 'lte':
        return this._joinCondition(columnName, '<=', `${condition.args[0]}`);
      case 'between':
        return this._betweenCondition(columnName, 'BETWEEN', `${condition.args}`);
      case 'not_between':
        return this._betweenCondition(columnName, 'NOT BETWEEN', `${condition.args}`);

      default:
        return '';
    }
  }

  _buildWhereClause() {
    if (!this.query.filters) {
      return '';
    }
    let conditionArray = [];
    this.query.filters.forEach((column) => {
      if (column.conditions) {
        column.conditions.forEach((condition) => {
          let generatedCondition = this._getSQLClause(column.column, condition);
          if (generatedCondition !== '') {
            conditionArray.push(generatedCondition);
          }
        });
      }
    });
    if (conditionArray.length > 0) {
      return ` WHERE ${conditionArray.join(' AND ')}`;
    }
    return '';
  }

  buildQuery(sql, order = true) {
    if (order) {
      return sql + this._buildWhereClause() + this._buildOrderClause();
    }
    return sql + this._buildWhereClause();
  }

  _buildOrderClause() {
    if (!this.query.sort || this.query.sort === {}) {
      return ' ORDER BY sort_order ';
    }

    let dbQuery = '';
    if (this.query.sort.order === 'ASC') {
      dbQuery += ` ORDER BY \`${this.query.sort.column}\` ASC`;
    } else if (this.query.sort.order === 'DESC') {
      dbQuery += ` ORDER BY \`${this.query.sort.column}\` DESC`;
    }
    return dbQuery;
  }
}

/**
 * DataSource node integration
 * @namespace dataSource
 * */
module.exports = {
  QueryBuilder
};
