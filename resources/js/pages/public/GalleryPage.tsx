import React, { useState, useEffect } from 'react';
import { Image, Video, Bookmark, Tag, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { MediaGallery } from '../../types';
import { useAuth } from '../../context/AuthContext';
import ScrollReveal from '../../components/common/ScrollReveal';

const mockMediaList: MediaGallery[] = [
  {
    id: 1,
    title: 'Nexora CodeSprint 2026 Grand Finale',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    category: 'technical',
    department: 'Computer Science',
    year: 2026
  },
  {
    id: 2,
    title: 'Symphony 2026 Annual Cultural Night',
    media_type: 'video',
    media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    category: 'cultural',
    department: 'Cultural Club',
    year: 2026
  },
  {
    id: 3,
    title: 'Intercollegiate Badminton & Futsal Championship',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    category: 'sports',
    department: 'Sports Council',
    year: 2026
  },
  {
    id: 4,
    title: 'Generative AI & LLM Bootcamp Hands-On Session',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    category: 'workshop',
    department: 'AI & Data Science',
    year: 2026
  },
  {
    id: 5,
    title: 'Robotics & Drone Racing Arena Highlights',
    media_type: 'video',
    media_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    category: 'technical',
    department: 'Robotics Society',
    year: 2026
  },
  {
    id: 6,
    title: 'Annual Campus Music Fest & Live Concert',
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    category: 'cultural',
    department: 'Fine Arts Dept',
    year: 2026
  }
];

const GalleryPage: React.FC = () => {
  const { user } = useAuth();
  const [mediaList, setMediaList] = useState<MediaGallery[]>(mockMediaList);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setMediaList(res.data);
        } else {
          setMediaList(mockMediaList);
        }

        if (user) {
          try {
            const savedRes = await api.get('/participant/saved-media');
            setSavedIds(savedRes.data?.map((m: any) => m.media_id || m.id) || []);
          } catch (e) {
            // fallback
          }
        }
      } catch (err) {
        console.error(err);
        setMediaList(mockMediaList);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [user]);

  const handleToggleSave = async (mediaId: number) => {
    if (!user) return;
    try {
      const res = await api.post('/participant/save-media', { media_id: mediaId });
      if (res.data?.saved) {
        setSavedIds([...savedIds, mediaId]);
      } else {
        setSavedIds(savedIds.filter(id => id !== mediaId));
      }
    } catch (err) {
      if (savedIds.includes(mediaId)) {
        setSavedIds(savedIds.filter(id => id !== mediaId));
      } else {
        setSavedIds([...savedIds, mediaId]);
      }
    }
  };

  const filteredMedia = selectedCategory === 'all'
    ? mediaList
    : mediaList.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-8 relative z-10 font-sans">
      <ScrollReveal direction="up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-poppins">Campus Media Gallery</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">High-quality photos & videos from technical fests, cultural nights, and sports meets</p>
        </div>
      </ScrollReveal>

      {/* Category Pills */}
      <ScrollReveal direction="up" delay={100}>
        <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'technical', label: 'Technical Fests' },
            { id: 'cultural', label: 'Cultural Events' },
            { id: 'sports', label: 'Sports Meets' },
            { id: 'workshop', label: 'Workshops & Bootcamps' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 font-bold">Loading media gallery...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm font-bold shadow-md">
          No media archives available in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMedia.map((media, idx) => {
            const isSaved = savedIds.includes(media.id);
            return (
              <ScrollReveal key={media.id} direction="up" delay={idx * 80}>
                <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md dark:shadow-xl group hover:border-blue-500 transition-all duration-300">
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={media.media_url}
                      alt={media.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                      {media.media_type === 'video' ? <Video className="w-3 h-3 text-cyan-400" /> : <Image className="w-3 h-3 text-blue-400" />}
                      {media.media_type}
                    </div>

                    {user && (
                      <button
                        onClick={() => handleToggleSave(media.id)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition ${
                          isSaved ? 'bg-amber-500 text-white border-amber-400 shadow-md' : 'bg-slate-900/70 text-white border-white/20 hover:bg-slate-900'
                        }`}
                        title="Save to My Media"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="p-5 space-y-2 bg-white dark:bg-slate-900">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 px-2.5 py-0.5 rounded-full">
                      {media.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition font-poppins">
                      {media.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-semibold">
                      {media.department || 'Campus Board'} • {media.year}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
