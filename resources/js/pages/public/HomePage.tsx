import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Sparkles, ArrowRight, ShieldCheck, Tag, Megaphone, Zap, Code2, Music, Trophy, Laptop, GraduationCap, Swords, ChevronRight, Layers, Users, QrCode, CheckCircle2, MessageSquare, Star, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';
import { Event, NotificationItem } from '../../types';
import EventCard from '../../components/events/EventCard';
import HeroCanvas3D from '../../components/3d/HeroCanvas3D';
import TiltCard from '../../components/3d/TiltCard';
import { EventCardSkeleton } from '../../components/common/SkeletonLoader';
import ScrollReveal from '../../components/common/ScrollReveal';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hover focus state for Interactive Feature Cards & Spheres
  const [hoveredSphere, setHoveredSphere] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, annRes] = await Promise.all([
          api.get('/events?status=active'),
          api.get('/announcements')
        ]);
        setEvents(eventsRes.data.data || []);
        // Clean legacy title text
        const annList = (annRes.data || []).map((a: NotificationItem) => ({
          ...a,
          title: a.title?.replace('EventSphere', 'Nexora'),
          message: a.message?.replace('EventSphere', 'Nexora')
        }));
        setAnnouncements(annList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 relative">
      {/* Hero Banner with 3D Canvas (Deep Dark Glass for Dark Mode, Vibrant Gradient for Light Mode) */}
      <ScrollReveal direction="up">
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 dark:bg-none dark:bg-slate-900/90 text-white p-8 sm:p-14 shadow-2xl border border-blue-400/30 dark:border-slate-800 backdrop-blur-2xl">
          <HeroCanvas3D />

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 dark:bg-blue-500/20 border border-white/30 dark:border-blue-400/30 text-white dark:text-blue-200 text-xs font-bold tracking-wide backdrop-blur-md glow-indigo">
              <Sparkles className="w-4 h-4 text-blue-200 dark:text-blue-400" />
              <span>Nexora 3D Digital Campus Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight font-poppins text-white">
              Elevate College Events in <span className="text-gradient">Real-Time 3D</span>
            </h1>

            <p className="text-blue-100 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Discover, Participate and Celebrate Every College Event. Experience instant seat updates, paperless QR check-ins, and verified e-certificates in one unified portal.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 btn-neon-gradient px-7 py-3.5 rounded-2xl text-sm font-bold shadow-lg text-white"
              >
                Explore Live Events
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md text-white border border-white/30 dark:border-white/20 font-bold px-7 py-3.5 rounded-2xl hover:bg-white/25 dark:hover:bg-white/20 transition text-sm"
              >
                Student Portal Signup
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Announcements Ticker */}
      {announcements.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
            <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 font-poppins">Campus Announcements</h4>
              <div className="space-y-1">
                {announcements.slice(0, 2).map(ann => (
                  <p key={ann.id} className="text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-amber-700 dark:text-amber-300">{ann.title}:</strong> {ann.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Executive Dual-Tone Vector Icon Spheres (Focus Center Scale Accordion) */}
      <section className="space-y-6">
        <ScrollReveal direction="up">
          <div className="flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" /> Vector Curated Spheres
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">Interactive Event Spheres</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Hover cards to expand into center focus with side parallax scale</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 py-2">
          {[
            {
              name: 'Technical',
              cat: 'technical',
              icon: Code2,
              stat: 'Hackathons & AI',
              ringBg: 'bg-cyan-500/10 border-cyan-400/40 text-cyan-400 glow-cyan',
              pillBg: 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
            },
            {
              name: 'Cultural',
              cat: 'cultural',
              icon: Music,
              stat: 'Fests & Drama',
              ringBg: 'bg-purple-500/10 border-purple-400/40 text-purple-400 glow-purple',
              pillBg: 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
            },
            {
              name: 'Sports',
              cat: 'sports',
              icon: Trophy,
              stat: 'Meets & Futsal',
              ringBg: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-400 glow-emerald',
              pillBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
            },
            {
              name: 'Workshops',
              cat: 'workshop',
              icon: Laptop,
              stat: 'Hands-on Labs',
              ringBg: 'bg-amber-500/10 border-amber-400/40 text-amber-400',
              pillBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
            },
            {
              name: 'Seminars',
              cat: 'seminar',
              icon: GraduationCap,
              stat: 'Keynotes & Talks',
              ringBg: 'bg-blue-500/10 border-blue-400/40 text-blue-400 glow-indigo',
              pillBg: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400'
            },
            {
              name: 'Competitions',
              cat: 'competition',
              icon: Swords,
              stat: 'Leagues & Contests',
              ringBg: 'bg-rose-500/10 border-rose-400/40 text-rose-400',
              pillBg: 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
            },
          ].map((c, idx) => {
            const IconComponent = c.icon;
            const isHovered = hoveredSphere === idx;
            const isAnyHovered = hoveredSphere !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <ScrollReveal key={c.cat} direction="up" delay={idx * 70}>
                <div
                  onMouseEnter={() => setHoveredSphere(idx)}
                  onMouseLeave={() => setHoveredSphere(null)}
                  className={`transition-all duration-500 ease-out transform ${
                    isHovered
                      ? 'scale-110 -translate-y-2 z-30 shadow-2xl'
                      : isDimmed
                      ? 'scale-95 opacity-75 blur-[0.3px] z-10'
                      : 'scale-100 z-10'
                  }`}
                >
                  <TiltCard maxTilt={15}>
                    <Link
                      to={`/events?category=${c.cat}`}
                      className={`block p-5 rounded-3xl text-center transition-all duration-300 relative overflow-hidden ${
                        isHovered
                          ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-2xl glow-indigo'
                          : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md'
                      }`}
                    >
                      <div className="mx-auto mb-3 relative w-16 h-16 flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-full border-2 ${c.ringBg} ${isHovered ? 'scale-125' : ''} transition-transform duration-300`}></div>
                        <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center">
                          <IconComponent className={`w-6 h-6 text-cyan-600 dark:text-cyan-300 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className={`text-sm font-black transition font-poppins ${isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {c.name}
                        </h4>
                        <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${c.pillBg}`}>
                          {c.stat}
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="space-y-6">
        <ScrollReveal direction="up">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins">Upcoming Fest & Academic Schedule</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Real-time availability and capacity tracking</p>
            </div>
            <Link to="/events" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All ({events.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-bold shadow-md">
            No active events available right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.slice(0, 6).map((event, idx) => (
              <ScrollReveal key={event.id} direction="up" delay={idx * 100}>
                <TiltCard maxTilt={8}>
                  <EventCard event={event} />
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Platform Capabilities Grid (Interactive Center Focus Scale Accordion) */}
      <section className="space-y-6 pt-4">
        <ScrollReveal direction="up">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 px-3 py-1 rounded-full">
              Enterprise Campus Governance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-poppins">Why Nexora Leads Digital Campus Events</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Hover any card to bring it into center focus while neighbor cards scale down</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch py-4">
          {[
            {
              title: 'Live Capacity Counter',
              desc: 'Real-time venue slot tracking with automatic waitlist queue promotion when seats open up.',
              badge: 'Auto Queue Active',
              icon: Users,
              color: 'blue'
            },
            {
              title: '3D Contactless QR Pass',
              desc: 'Paperless check-in tokens issued to students for instant entrance scanner validation.',
              badge: 'Encrypted Token',
              icon: QrCode,
              color: 'purple'
            },
            {
              title: 'Signed E-Certificates',
              desc: 'Verified digital achievement credentials signed by faculty chairs and directly downloadable.',
              badge: 'Faculty Signed',
              icon: Award,
              color: 'emerald'
            },
            {
              title: 'Multi-Role Governance',
              desc: 'Dedicated portals for Student Participants, Faculty Organizers, and System Admins.',
              badge: 'SSL Protected',
              icon: ShieldCheck,
              color: 'amber'
            }
          ].map((f, idx) => {
            const IconComp = f.icon;
            const isHovered = hoveredFeature === idx;
            const isAnyHovered = hoveredFeature !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <ScrollReveal key={idx} direction="up" delay={idx * 80} className="h-full">
                <div
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`h-full transition-all duration-500 ease-out transform ${
                    isHovered
                      ? 'scale-108 -translate-y-3 z-30 shadow-2xl'
                      : isDimmed
                      ? 'scale-95 opacity-70 blur-[0.4px] z-10'
                      : 'scale-100 z-10'
                  }`}
                >
                  <TiltCard maxTilt={10} className="h-full">
                    <div className={`p-6 rounded-3xl shadow-md h-full flex flex-col justify-between transition-all duration-300 ${
                      isHovered
                        ? 'bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-2xl glow-indigo'
                        : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800'
                    }`}>
                      <div className="space-y-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                          isHovered ? 'scale-115 rotate-3' : ''
                        } ${
                          f.color === 'blue' ? 'bg-blue-500/15 border border-blue-400/40 text-blue-500' :
                          f.color === 'purple' ? 'bg-purple-500/15 border border-purple-400/40 text-purple-500' :
                          f.color === 'emerald' ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-500' :
                          'bg-amber-500/15 border border-amber-400/40 text-amber-500'
                        }`}>
                          <IconComp className="w-7 h-7" />
                        </div>
                        <div className="space-y-2">
                          <h3 className={`text-lg font-black font-poppins transition ${isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                            {f.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {f.desc}
                          </p>
                        </div>
                      </div>
                      <div className={`pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex justify-between items-center text-[11px] font-black ${
                        f.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        f.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        f.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-amber-600 dark:text-amber-400'
                      }`}>
                        <span>{f.badge}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1 scale-125' : ''}`} />
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Student & Faculty Testimonials */}
      <section className="space-y-6 pt-4">
        <ScrollReveal direction="up">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/30 px-3 py-1 rounded-full">
                Campus Voices
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-poppins mt-2">What Students & Faculty Say</h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {[
            {
              name: 'Aarav Patel',
              role: 'Computer Science Student',
              text: 'Nexora made registering for CodeSprint 2026 instant! The 3D QR check-in token on my phone meant zero waiting lines at the CS lab entrance.',
              rating: 5
            },
            {
              name: 'Prof. Rajesh Sharma',
              role: 'Faculty Convener & Organizer',
              text: 'Publishing hackathons and tracking venue seat capacity in real-time has cut down administrative overhead by 90%. Excellent platform!',
              rating: 5
            },
            {
              name: 'Meera Verma',
              role: 'Cultural Committee Chair',
              text: 'Issuing verified e-certificates directly to attendees after Symphony Night was effortless. Students love downloading their digital achievements.',
              rating: 5
            }
          ].map((t, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 100} className="h-full">
              <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md h-full flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">"{t.text}"</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 font-poppins">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Call-To-Action Banner */}
      <ScrollReveal direction="up">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-black font-poppins text-white">Ready to Experience Campus Events?</h2>
            <p className="text-xs sm:text-sm text-blue-100">Join Nexora today to reserve event seats, access 3D passes, and claim official e-certificates.</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="bg-white text-slate-900 font-black text-xs px-6 py-3.5 rounded-2xl hover:bg-slate-100 transition shadow-lg flex items-center gap-1.5"
            >
              Get Started Now <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HomePage;
