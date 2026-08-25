import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Tag, QrCode, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { Event } from '../../types';
import CapacityBadge from './CapacityBadge';

const categoryColors: Record<string, string> = {
  technical: 'bg-slate-950/90 text-blue-400 border-blue-500/50',
  cultural: 'bg-slate-950/90 text-purple-400 border-purple-500/50',
  sports: 'bg-slate-950/90 text-emerald-400 border-emerald-500/50',
  workshop: 'bg-slate-950/90 text-amber-400 border-amber-500/50',
  seminar: 'bg-slate-950/90 text-cyan-400 border-cyan-500/50',
  competition: 'bg-slate-950/90 text-rose-400 border-rose-500/50',
};

const categoryThumbnails: Record<string, string> = {
  technical: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  cultural: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
  workshop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
  seminar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
  competition: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const thumbnail = categoryThumbnails[event.category] || categoryThumbnails.technical;

  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between h-full group shadow-md dark:shadow-xl font-sans">
      
      {/* Event Header Banner Image */}
      <div className="relative aspect-video bg-slate-950 overflow-hidden">
        <img
          src={thumbnail}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider border backdrop-blur-md shadow-md ${categoryColors[event.category] || 'bg-slate-950/90 text-white border-white/20'}`}>
            <Tag className="w-3 h-3" />
            {event.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <CapacityBadge
            maxParticipants={event.max_participants}
            confirmedCount={event.confirmed_registrations}
            availableSeats={event.available_seats}
            isFull={event.is_full}
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-black text-white">
          <span className="bg-slate-950/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
            <Sparkles className="w-3 h-3 text-cyan-400" /> On-Campus Fest
          </span>
          <span className="bg-slate-950/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-xl flex items-center gap-1 text-emerald-400 shadow-md">
            <ShieldCheck className="w-3 h-3" /> Verified Slot
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-3">
        <h3 className="text-base font-black text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition font-poppins">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Filled Center Feature Highlights Section */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold">
              <QrCode className="w-3.5 h-3.5" /> 3D Pass QR Verification
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-extrabold">
              <Award className="w-3.5 h-3.5" /> E-Certificate
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round(((event.confirmed_registrations || 0) / (event.max_participants || 1)) * 100))}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">{formattedDate}</span>
            <span className="text-slate-400">•</span>
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold">{event.start_time?.substring(0, 5)} - {event.end_time?.substring(0, 5)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate font-semibold">{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs shrink-0">
        <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[150px]">
          By <strong className="text-slate-800 dark:text-slate-200">{event.organizer?.name || 'Department'}</strong>
        </span>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-1 font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition shrink-0"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
