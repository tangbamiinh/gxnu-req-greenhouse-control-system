import React, { useState, useEffect } from 'react';
import { Settings, Droplets, Thermometer, Wind, Activity, History } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/status`);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError("Backend Connection Error");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, []);

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-red-950/20 border border-red-500/50 p-8 rounded-3xl text-center backdrop-blur-xl">
        <Activity className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-black text-white mb-2">{error}</h1>
        <p className="text-red-400">Ensure `python main.py` is running on port 8000</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const { current, history, metadata } = data;

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 p-4 md:p-8 font-sans">
      <main className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
              <Settings className="w-8 h-8 text-emerald-400 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Greenhouse OS v2</h1>
              <p className="text-sm text-slate-500 font-mono">{metadata.machine_id} // PF2UML Logic Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700 text-xs font-mono">
              STATUS: <span className="text-emerald-400 animate-pulse">OPTIMIZING</span>
            </div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          </div>
        </header>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Moisture Card */}
          <div className="relative group overflow-hidden bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 transition-all hover:bg-slate-900/60">
            <div className={`absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12`}>
              <Droplets className="w-24 h-24 text-blue-500" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest">
                  <Droplets className="w-4 h-4" /> Soil Moisture
                </span>
                {current.pump_active && (
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded border border-blue-500/30 font-bold animate-pulse">PUMP_ACTIVE</span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white">{current.moisture}</span>
                <span className="text-2xl text-slate-600 font-bold">%</span>
              </div>
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  style={{ width: `${current.moisture}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono tracking-tight">Active Requirement: moisture {'>'} 40.0%</p>
            </div>
          </div>

          {/* Temperature Card */}
          <div className="relative group overflow-hidden bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 transition-all hover:bg-slate-900/60">
            <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12">
              <Thermometer className="w-24 h-24 text-emerald-500" />
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-widest">
                  <Thermometer className="w-4 h-4" /> Air Temperature
                </span>
                {current.fan_active && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-1 rounded border border-emerald-500/30 font-bold animate-pulse">FAN_ACTIVE</span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white">{current.temperature}</span>
                <span className="text-2xl text-slate-600 font-bold">°C</span>
              </div>
              <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${current.temperature > 30 ? 'from-orange-500 to-red-500' : 'from-emerald-600 to-emerald-400'} transition-all duration-1000 ease-out shadow-lg`}
                  style={{ width: `${(current.temperature / 50) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono tracking-tight">Active Requirement: temperature {'<'} 30.0C</p>
            </div>
          </div>

        </div>

        {/* Lower Section: Phenomena Log & Phenomena Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Phenomena Monitor */}
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold uppercase text-slate-400">Phenomena Interface</h3>
            </div>
            <div className="space-y-4">
              {metadata.phenomena_controlled.map(p => (
                <div key={p} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] font-mono text-slate-400">{p}</span>
                  <div className={`w-2 h-2 rounded-full ${(p.includes('Pump') && current.pump_active && p.includes('On')) ||
                    (p.includes('Fan') && current.fan_active && p.includes('On')) ||
                    (p.includes('Pump') && !current.pump_active && p.includes('Off')) ||
                    (p.includes('Fan') && !current.fan_active && p.includes('Off'))
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
                    }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* History Scroll */}
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold uppercase text-slate-400">Execution History</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-600">POLLING: 1500ms</span>
            </div>
            <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left font-mono text-[10px]">
                <thead className="text-slate-500 sticky top-0 bg-slate-900/40 backdrop-blur-md">
                  <tr>
                    <th className="pb-2">TIMESTAMP</th>
                    <th className="pb-2 text-right">MSTR %</th>
                    <th className="pb-2 text-right">TEMP C</th>
                    <th className="pb-2 text-right">ACTUATORS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {history.map((h, i) => (
                    <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                      <td className="py-2 text-slate-400">{h.display_time}</td>
                      <td className="py-2 text-right text-blue-400">{h.moisture}</td>
                      <td className="py-2 text-right text-emerald-400">{h.temperature}</td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-1">
                          {h.pump_active && <Droplets className="w-3 h-3 text-blue-500" />}
                          {h.fan_active && <Wind className="w-3 h-3 text-emerald-500" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <footer className="text-center py-8">
          <p className="text-[10px] text-slate-700 font-mono tracking-widest uppercase">
            Designed for Requirements Engineering // GXNU // 2026
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
