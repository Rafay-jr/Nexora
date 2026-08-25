import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { Event, PaginatedResponse } from '../../types';
import EventCard from '../../components/events/EventCard';
import TiltCard from '../../components/3d/TiltCard';
import { EventCardSkeleton } from '../../components/common/SkeletonLoader';
import ScrollReveal from '../../components/common/ScrollReveal';
import CustomSelect from '../../components/common/CustomSelect';

const mockEventsList: Event[] = [
  {
    id: 1,
    title: 'Nexora CodeSprint 2026 Hackathon',
    description: 'A 24-hour intensive coding hackathon focused on AI and web solutions for campus innovation.',
    category: 'technical',
    event_date: '2026-08-31',
    start_time: '09:00:00',
    end_time: '21:00:00',
    venue: 'Main Auditorium & CS Lab 3',
    max_participants: 50,
    registration_deadline: '2026-08-30 23:59:00',
    status: 'approved',
    organizer_id: 2,
    confirmed_registrations: 50,
    available_seats: 0,
    is_full: true,
    organizer: { id: 2, name: 'Prof. Rajesh Sharma', email: 'organizer@eventsphere.test', role: 'organizer' }
  },
  {
    id: 2,
    title: 'Symphony 2026 Annual Cultural Night',
    description: 'Annual grand cultural night featuring music performances, dance competitions, and theatrical drama.',
    category: 'cultural',
    event_date: '2026-09-07',
    start_time: '17:00:00',
    end_time: '22:00:00',
    venue: 'Open Air Amphitheatre',
    max_participants: 50,
    registration_deadline: '2026-09-06 18:00:00',
    status: 'approved',
    organizer_id: 3,
    confirmed_registrations: 45,
    available_seats: 5,
    is_full: false,
    organizer: { id: 3, name: 'Dr. Meera Verma', email: 'meera@eventsphere.test', role: 'organizer' }
  },
  {
    id: 3,
    title: 'Intercollegiate Badminton & Futsal Championship',
    description: 'Multi-sport intercollegiate tournament bringing together top student athletes across the region.',
    category: 'sports',
    event_date: '2026-09-13',
    start_time: '08:00:00',
    end_time: '18:00:00',
    venue: 'Indoor Sports Complex',
    max_participants: 40,
    registration_deadline: '2026-09-12 20:00:00',
    status: 'approved',
    organizer_id: 3,
    confirmed_registrations: 0,
    available_seats: 40,
    is_full: false,
    organizer: { id: 3, name: 'Dr. Meera Verma', email: 'meera@eventsphere.test', role: 'organizer' }
  }
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'technical', label: 'Technical Fests & CodeSprints' },
  { value: 'cultural', label: 'Cultural Events & Nights' },
  { value: 'sports', label: 'Sports Meets & Championships' },
  { value: 'workshop', label: 'Workshops & Bootcamps' },
  { value: 'seminar', label: 'Academic Seminars' },
  { value: 'competition', label: 'Intercollegiate Competitions' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active & Open' },
  { value: 'completed', label: 'Completed Events' },
  { value: 'cancelled', label: 'Cancelled Events' },
];

const EventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>(mockEventsList);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'active');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (department) params.append('department', department);
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      params.append('page', page.toString());

      const res = await api.get<PaginatedResponse<Event>>(`/events?${params.toString()}`);
      if (res.data?.data && res.data.data.length > 0) {
        setEvents(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setEvents(mockEventsList);
      }
    } catch (err) {
      console.error(err);
      setEvents(mockEventsList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, department, status, search, startDate, endDate, page]);

  const clearFilters = () => {
    setCategory('');
    setDepartment('');
    setStatus('active');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 relative z-10 font-sans">
      <ScrollReveal direction="up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-poppins">College Events Directory</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Explore upcoming, ongoing, and past events organized by departments</p>
        </div>
      </ScrollReveal>

      {/* Filter Bar (relative z-40 so dropdowns open OVER media cards) */}
      <ScrollReveal direction="up" delay={100} className="relative z-40">
        <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl shadow-md dark:shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-poppins">
              <Filter className="w-4 h-4" />
              <span>Filter Events</span>
            </div>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Search Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title, description, venue..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Category</label>
              <CustomSelect
                options={categoryOptions}
                value={category}
                onChange={(val) => setCategory(val)}
                placeholder="All Categories"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Status</label>
              <CustomSelect
                options={statusOptions}
                value={status}
                onChange={(val) => setStatus(val)}
                placeholder="All Statuses"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Organizing Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Events Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md relative z-10">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">No events match your criteria.</p>
          <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Reset filters to view all events
          </button>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <ScrollReveal key={event.id} direction="up" delay={idx * 80}>
                <TiltCard maxTilt={8}>
                  <EventCard event={event} />
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-xl disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-bold"
              >
                Previous
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-xl disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-bold"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
