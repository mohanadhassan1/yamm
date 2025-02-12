import React from 'react';
import { 
  Table as TableUI,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Decision } from '@/models';

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
  }[];
  onStatusChange?: (id: string, status: boolean) => void;
  onDecisionChange?: (id: string, decision: Decision) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps<T>) {

  return (
    <div className="w-full">
      <TableUI>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={`${row.id}-${String(column.key)}`}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableUI>
      
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
