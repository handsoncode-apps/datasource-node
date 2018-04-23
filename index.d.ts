export declare namespace DataSourceConnector {
  class UpdatedData {
    public changes: Array<any>;
    public source: string;
  }
  
  class CreatedRow {
    public index: number;
    public amount: number;
    public source: string;
  }
  
  class RowMoved {
    public rowsMoved: Array<any>;
    public target: number;
  }
  
  class CreatedColumn {
    public index: number;
    public amount: number;
    public source: string;
  }
  
  class ColumnMoved {
    public columns : Array<any>;
    public target: number;
  }
  
  class SearchParams {
    public sort : Array<any>;
    public filter : Array<any>;
  }

  class CellMeta {
    public row: number;
    public column: string;
  }
}

declare class Order {
  column: string;
  sort: string;
}

declare class Conditions {
  column: string;
  conditions: Array<Condition>;
}

declare class Condition {
  name: string;
  args: Array<Array<string>>
}


