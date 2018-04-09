class QueryBuilder {
  constructor(query) {
    this.query = query
  }

  _joinCondition(columnName, operator, arg) {
    return (arg === null || arg === undefined) ?
      '`' + columnName + '` ' + operator
      :
      '`' + columnName + '` ' + operator + ' "' + arg + '"'
  }

  _byValueCondition(columnName, arg) {
    var inValues = []
    for (var propertyName in arg) {
      inValues.push('"' + arg[propertyName] + '"')
    }
    return columnName + ' IN (' + inValues.join(', ') + ')'
  }

  _getSQLClause(columnName, condition) {
    switch(condition.name) {
      case 'eq':
        return this._joinCondition(columnName, '=', condition.args[0])
      case 'neq':
        return this._joinCondition(columnName, '!=', condition.args[0])
      case 'empty':
        return this._joinCondition(columnName, 'IS NULL')
      case 'not_empty':
        return this._joinCondition(columnName, 'IS NOT NULL')
      case 'begins_with':
        return this._joinCondition(columnName, 'LIKE', condition.args[0] + '%')
      case 'ends_with':
        return this._joinCondition(columnName, 'LIKE', '%' + condition.args[0])
      case 'contains':
        return this._joinCondition(columnName, 'LIKE', '%' + condition.args[0] + '%')
      case 'not_contains':
        return this._joinCondition(columnName, 'NOT LIKE', '%' + condition.args[0] + '%')
      case 'by_value':
        return this._byValueCondition(columnName, condition.args[0])
      default:
        return ''
    }
  }

  _buildWhereClause() {
    if (!this.query.hasOwnProperty('filters')) {
      return '';
    }
    var conditionArray = []
    this.query.filters.forEach(column => {
      if (column.hasOwnProperty('conditions')) {
        column.conditions.forEach(condition => {
          var generatedCondition = this._getSQLClause(column.column, condition)
          if (generatedCondition !== '') {
            conditionArray.push(generatedCondition)
          }
        })
      }
    })
    if (conditionArray.length > 0) {
      return ' WHERE ' + conditionArray.join(' AND ')
    }
    return '';
  }

  buildQuery(sql) {
    return sql + this._buildWhereClause() + this._buildOrderClause()
  }

  _buildOrderClause() {
    if (!this.query.hasOwnProperty('order') || this.query.order === undefined || this.query.order === {}) {
      return ' ORDER BY sort_order '
    }

    console.log(this.query);

    let dbQuery = ''
    if (this.query.order.order === 'ASC') {
      dbQuery += ' ORDER BY `' + this.query.order.column + '` ASC'
    } else if (this.query.order === 'DESC') {
      dbQuery += ' ORDER BY `' + this.query.order.column + '` DESC'
    }
    return dbQuery
  }
}

class UpdatedData {
  constructor() {
    this.changes = [],
    this.source = ''
  }
}

class CreatedRow {
  constructor() {
    this.index = 0,
    this.amount = 0,
    this.source = ''
  }
}

class RowMoved {
  constructor() {
    this.rowsMoved = [],
    this.target = 0
  }
}

class CreatedColumn {
  constructor() {
    this.index = 0,
    this.amount = 0,
    this.source = ''
  }
}

class ColumnMoved {
  constructor() {
    this.columns = [],
    this.target = 0
  }
}

class SearchParams {
  constructor() {
    this.sort = [],
    this.filter = []
  }
}

/**
 * DataSource node integration
 * @namespace dataSource
 **/
module.exports = {
  QueryBuilder: QueryBuilder,

  /**
   * @typedef {object} UpdatedData
   * @property {object} changes
   * @property {string} source
   * */
  UpdatedData: UpdatedData,
  /** @class */
  CreatedRow: CreatedRow,
  /** @class */
  RowMoved: RowMoved,
  /** @class */
  CreatedColumn: CreatedColumn,
  /** @class */
  ColumnMoved: ColumnMoved,
  /** @class */
  SearchParams: SearchParams,
}
