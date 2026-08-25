import React, { useState, useEffect } from 'react';
import { Bookmark, Image, Calendar, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { BookmarkItem, SavedMediaItem } from '../../types';
import EventCard from '../../components/events/EventCard';

const SavedMediaPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [savedMedia, setSavedMedia] = useState<SavedMediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [bmRes, mediaRes] = await Promise.all([
        api.get('/participant/bookmarks'),
        api.get('/participant/saved-media')
      ]);
      setBookmarks(bmRes.data || []);
      setSavedMedia(mediaRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveMedia = async (mediaId: number) => {
    try {
      await api.post('/participant/saved-media', { media_id: mediaId });
      setSavedMedia(prev => prev.filter(m => m.media_id !== mediaId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading saved items...</div>;

  return (
    <div className="space-y-10">
      {/* Bookmarked Events */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Saved Events & Bookmarks</h1>
          <p className="text-sm text-gray-600 mt-1">Bookmarked events and saved gallery media</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
            No events bookmarked yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarks.map(bm => (
              <EventCard key={bm.id} event={bm.event} />
            ))}
          </div>
        )}
      </div>

      {/* Saved Gallery Media */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Saved Gallery Photos</h3>

        {savedMedia.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
            No gallery media saved to profile yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedMedia.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative group">
                <img
                  src={item.media?.file_url}
                  alt={item.media?.caption || 'Saved photo'}
                  className="w-full aspect-video object-cover"
                />
                <button
                  onClick={() => handleRemoveMedia(item.media_id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.media?.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMediaPage;
