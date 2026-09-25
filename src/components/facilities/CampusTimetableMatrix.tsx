import React, { useState } from 'react';
import {
  Building2,
  Cpu,
  Calendar,
  Clock,
  MapPin,
  Bot,
  Terminal,
  Layers,
  CheckCircle2,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { TimetableSlot, LabFacility } from '../../types/erp';

export const CampusTimetableMatrix: React.FC = () => {
  const { facilities, timetableSlots, batches, faculty } = useERP();

  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  const daysList: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const filteredSlots = timetableSlots.filter((slot) => {
    const matchesFacility = selectedFacilityId === 'all' || slot.facilityId === selectedFacilityId;
    const matchesDay = selectedDay === 'all' || slot.day === selectedDay;
    return matchesFacility && matchesDay;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Campus Operations</span>
            <span aria-hidden="true">·</span>
            <span>Laboratory Hardware & Master Timetable</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Neural Facilities & Weekly Timetable
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            GPU compute node allocation, robotics arenas, and scheduled cohort sessions
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="bg-[#06121E] text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Campus Facilities</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-[#06121E] text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-[#18314E] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Weekdays</option>
            {daysList.map((d) => (
              <option key={d} value={d}>
                {d === 'Mon'
                  ? 'Monday'
                  : d === 'Tue'
                  ? 'Tuesday'
                  : d === 'Wed'
                  ? 'Wednesday'
                  : d === 'Thu'
                  ? 'Thursday'
                  : d === 'Fri'
                  ? 'Friday'
                  : 'Saturday'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Facilities Hardware Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="p-4 rounded-xl bg-[#091827] border border-[#162D47] space-y-3 hover:border-[#C59B27]/40 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#142A42] border border-[#C59B27]/30 flex items-center justify-center text-[#DFB142] shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {fac.status}
              </span>
            </div>

            <div>
              <h2 className="text-xs font-bold text-white leading-tight">{fac.name}</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {fac.building} · {fac.roomNumber}
              </p>
            </div>

            <div className="p-2 rounded bg-[#071321] border border-[#13273E] text-[10px] text-slate-300 font-mono leading-tight">
              {fac.computeSpecs}
            </div>

            <div className="pt-2 border-t border-[#13273E] flex items-center justify-between text-[11px] text-slate-400">
              <span>Station Capacity:</span>
              <span className="font-bold text-white">{fac.capacity} Workbenches</span>
            </div>
          </div>
        ))}
      </div>

      {/* Master Timetable Schedule Grid */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#DFB142]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Weekly Laboratory & Lecture Allocation Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredSlots.length} Booked Lab Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-xl bg-[#0B1C2E] border border-[#183350] hover:border-[#20446D] transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#142A42] text-[#DFB142] border border-[#C59B27]/30">
                    {slot.day}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{slot.batchCode}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                  <Clock className="w-3 h-3 text-[#DFB142]" />
                  <span>{slot.timeSlot}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200 leading-snug">{slot.programTitle}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-[#C59B27] shrink-0" />
                  <span className="truncate">{slot.facilityName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#142940] flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Faculty Lead:</span>
                <span className="font-bold text-[#DFB142]">{slot.instructorName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
