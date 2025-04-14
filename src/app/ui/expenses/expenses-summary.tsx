'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/src/app/lib/types';
import { convertToCAD, formatCurrency } from '@/src/app/lib/currency';

interface ExpensesSummaryProps {
  expenses: Transaction[];
}

export function ExpensesSummary({ expenses }: ExpensesSummaryProps) {
  // Group expenses by category and sort by value (descending)
  const categoryData = expenses.reduce((acc, expense) => {
    const amountInCAD = convertToCAD(expense.amount, expense.currency);
    const existingCategory = acc.find(item => item.name === expense.category);
    
    if (existingCategory) {
      existingCategory.value += amountInCAD;
    } else {
      acc.push({
        name: expense.category,
        value: amountInCAD
      });
    }
    return acc;
  }, [] as { name: string; value: number }[])
  .sort((a, b) => b.value - a.value); // Sort by value in descending order

  // Calculate total expenses
  const totalExpenses = categoryData.reduce((sum, category) => sum + category.value, 0);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
      
      <div className="h-[400px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total expenses in the center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="text-sm text-gray-500">Total Expenses</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (CAD)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category, index) => (
                <tr key={category.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatCurrency(category.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {((category.value / totalExpenses) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}