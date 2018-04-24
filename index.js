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
    let inValues = []
    for (let propertyName in arg) {
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
    let conditionArray = []
    this.query.filters.forEach(column => {
      if (column.hasOwnProperty('conditions')) {
        column.conditions.forEach(condition => {
          let generatedCondition = this._getSQLClause(column.column, condition)
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
    if (!this.query.hasOwnProperty('sort') || this.query.sort === undefined || this.query.sort === {}) {
      return ' ORDER BY sort_order '
    }

    let dbQuery = ''
    if (this.query.sort.order === 'ASC') {
      dbQuery += ' ORDER BY `' + this.query.sort.column + '` ASC'
    } else if (this.query.sort.order === 'DESC') {
      dbQuery += ' ORDER BY `' + this.query.sort.column + '` DESC'
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

class ResizedColumn {
  constructor() {
    this.column = '',
    this.size = 0
  }
}

class RowResized {
  constructor() {
    this.row = 0,
    this.size = 0
  }
}

class MergedCells {
  constructor() {
    this.mergedParent = {},
    this.mergedCells = []
  }
}

class UnmergedCells {
  constructor() {
    this.mergedParent = {},
    this.mergedCells = []
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
  RowResized: RowResized,
  /** @class */
  CreatedColumn: CreatedColumn,
  /** @class */
  ColumnMoved: ColumnMoved,
  /** @class */
  ResizedColumn: ResizedColumn,
  /** @class */
  MergedCells: MergedCells,
  /** @class */
  UnmergedCells: UnmergedCells,
  /** @class */
  SearchParams: SearchParams,
}
