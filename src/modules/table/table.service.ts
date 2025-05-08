import { Injectable } from '@nestjs/common';
import * as table from 'cli-table3';

@Injectable()
export class TableService {
  display(data: Record<string, any>) {
    const tableConfig = new table({
      head: ['Chave', 'Valor'],
      truncate: '…',
      colWidths: [20, 40],
    });

    Object.keys(data).forEach((key) => {
      tableConfig.push([key, this.formatValue(data[key])]);
    });

    console.log(tableConfig.toString());
  }

  private formatValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }
}
