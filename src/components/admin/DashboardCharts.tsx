import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export interface MonthlyData {
  month: string;
  candidatures: number;
  benevoles: number;
  messages: number;
  newsletter: number;
}

export interface PieData {
  name: string;
  value: number;
}

interface Props {
  monthlyData: MonthlyData[];
  pieData: PieData[];
}

const DashboardCharts: React.FC<Props> = ({ monthlyData, pieData }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Area chart — tendance globale */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-gray-200 bg-white p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Tendance mensuelle</h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
            {new Date().getFullYear()}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="gCand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gBen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Area type="monotone" dataKey="candidatures" stroke="#0d9488" fill="url(#gCand)" name="Candidatures" />
            <Area type="monotone" dataKey="benevoles" stroke="#3b82f6" fill="url(#gBen)" name="Bénévoles" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar chart — messages & newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl border border-gray-200 bg-white p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Messages & Newsletter</h3>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
            Mensuel
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
            <Bar dataKey="messages" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={14} name="Messages" />
            <Bar dataKey="newsletter" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={14} name="Newsletter" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pie — répartition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2"
      >
        <h3 className="mb-4 text-sm font-bold text-gray-800">Répartition globale</h3>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <ResponsiveContainer width={280} height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name} <span className="font-bold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
