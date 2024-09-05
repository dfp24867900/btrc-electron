import { isNumber, sumBy } from 'lodash'
import type {
  TableColumns,
  CommonColumnInfo
} from 'naive-ui/es/data-table/src/interface'

export const COLUMN_WIDTH_CONFIG = {
  selection: {
    width: 50
  },
  index: {
    width: 50,
    ellipsis: {
      tooltip: true
    }
  },
  status: {
    width: 160
  },
  tableType: {
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  linkName: {
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  linkEllipsis: {
    style: 'max-width: 180px;line-height: 1.5'
  },
  name: {
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  state: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  type: {
    width: 130,
    ellipsis: {
      tooltip: true
    }
  },
  version: {
    width: 80,
    ellipsis: {
      tooltip: true
    }
  },
  time: {
    width: 180,
    ellipsis: {
      tooltip: true
    }
  },
  timeZone: {
    width: 220,
    ellipsis: {
      tooltip: true
    }
  },
  operation: (number: number): CommonColumnInfo => ({
    fixed: 'right',
    width: Math.max(30 * number + 12 * (number - 1) + 24, 100),
    ellipsis: {
      tooltip: true
    }
  }),
  exeIdent: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  userName: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  ruleType: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  note: {
    width: 180,
    ellipsis: {
      tooltip: true
    }
  },
  dryRun: {
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  times: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  duration: {
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  yesOrNo: {
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  size: {
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  tag: {
    width: 160,
    ellipsis: {
      tooltip: true
    }
  },
  description: {
    width: 300,
    ellipsis: {
      tooltip: true
    }
  }
}

export const calculateTableWidth = (columns: TableColumns) =>
  sumBy(columns, (column) => (isNumber(column.width) ? column.width : 0))

export const DefaultTableWidth = 1800
