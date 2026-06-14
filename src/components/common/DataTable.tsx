import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th key={column.key + '-' + index} className="px-6 py-4 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-400 dark:text-gray-500">
                  Không có dữ liệu để hiển thị.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td key={column.key + '-' + colIndex} className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {column.render
                        ? column.render(row, rowIndex)
                        : (row[column.key as keyof T] as unknown as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
