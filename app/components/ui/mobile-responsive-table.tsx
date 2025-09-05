
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileTableProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface MobileTableCellProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  primary?: boolean;
}

// Mobile-first responsive table container
export function MobileTable({ children, className }: MobileTableProps) {
  return (
    <div className={cn('space-y-3 sm:space-y-0', className)}>
      {/* Mobile View */}
      <div className="block sm:hidden space-y-3">
        {children}
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
}

// Mobile card-style row
export function MobileTableRow({ children, className, onClick }: MobileTableRowProps) {
  return (
    <>
      {/* Mobile Card Layout */}
      <Card 
        className={cn(
          'block sm:hidden bg-white/80 backdrop-blur-sm border border-brand-sky/30 hover:shadow-lg transition-all duration-200',
          onClick && 'cursor-pointer hover:scale-[1.02]',
          className
        )}
        onClick={onClick}
      >
        <CardContent className="p-4 space-y-3">
          {children}
        </CardContent>
      </Card>
      
      {/* Desktop Table Row */}
      <tr 
        className={cn(
          'hidden sm:table-row border-b border-gray-200 hover:bg-gray-50 transition-colors',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        {children}
      </tr>
    </>
  );
}

// Mobile cell with label
export function MobileTableCell({ label, children, className, primary }: MobileTableCellProps) {
  return (
    <>
      {/* Mobile Field Layout */}
      <div className={cn('block sm:hidden', className)}>
        {label && (
          <div className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider">
            {label}
          </div>
        )}
        <div className={cn(
          'text-sm',
          primary && 'font-semibold text-brand-navy text-base'
        )}>
          {children}
        </div>
      </div>
      
      {/* Desktop Table Cell */}
      <td className={cn('hidden sm:table-cell px-4 py-3 text-sm', className)}>
        {children}
      </td>
    </>
  );
}

// Table header for desktop
export function MobileTableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <thead className={cn('hidden sm:table-header-group bg-gray-50', className)}>
      <tr>
        {children}
      </tr>
    </thead>
  );
}

export function MobileTableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn('px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

// Table body wrapper
export function MobileTableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tbody className={cn('hidden sm:table-row-group divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
}
