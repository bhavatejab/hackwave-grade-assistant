import React from 'react'
import { cn } from '../../utils/cn'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
    <table className={cn('w-full text-left border-collapse text-sm', className)} {...props}>
      {children}
    </table>
  </div>
)

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <thead
    className={cn(
      'bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider',
      className
    )}
    {...props}
  >
    {children}
  </thead>
)

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className,
  children,
  ...props
}) => (
  <tbody className={cn('divide-y divide-slate-100 dark:divide-slate-800/60', className)} {...props}>
    {children}
  </tbody>
)

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className,
  children,
  onClick,
  ...props
}) => (
  <tr
    onClick={onClick}
    className={cn(
      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
      onClick && 'cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </tr>
)

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <th className={cn('px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300', className)} {...props}>
    {children}
  </th>
)

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className,
  children,
  ...props
}) => (
  <td className={cn('px-5 py-4 text-slate-700 dark:text-slate-300 align-middle', className)} {...props}>
    {children}
  </td>
)
