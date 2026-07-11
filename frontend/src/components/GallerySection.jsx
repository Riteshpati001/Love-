import React, { useState } from 'react';
import { Lock, FileAudio, FileImage, Film } from 'lucide-react';
import { apiFetch } from '../utils/api';
import GlassCard from './GlassCard';

const GallerySection = ({ slug, media, onNext }) => {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch(`/api/proposals/slug/${slug}/unlock-gallery`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setUnlocked(true);
      } else {
        setError(data.message || 'Incorrect decryption gallery code.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 z-10">
      {!unlocked ? (
        <div className="max-w-md mx-auto">
          <GlassCard className="text-center">
            <div className="mx-auto w-16 h-16 bg-rose-100 flex items-center justify-center rounded-full text-rose-600 mb-6">
              <Lock size={28} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Password-Protected Gallery</h2>
            <p className="text-sm text-slate-600 mb-6">
              Unlock private romantic photo memories, personal recordings, and audio updates. Enter the secret code shared by your sender.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Enter Gallery Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 text-center text-lg"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-semibold transition-all shadow-md"
              >
                {loading ? 'Decrypting...' : 'Access Shared Gallery'}
              </button>
            </form>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-rose-100 pb-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-rose-700 script-font">Memory Box Gallery</h2>
              <p className="text-sm text-slate-500 mt-1">Uploaded securely for you. Automatically expires in 15 days.</p>
            </div>
            <button
              onClick={onNext}
              className="mt-4 md:mt-0 px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 font-semibold text-sm transition-all shadow-md shadow-rose-100 animate-pulse"
            >
              Continue Journey
            </button>
          </div>

          {media && media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {media.map((file) => (
                <div key={file._id} className="bg-white/60 rounded-2xl overflow-hidden border border-pink-100 p-2 shadow-sm transition-transform hover:scale-[1.02]">
                  {file.fileType === 'image' && (
                    <img
                      src={file.url}
                      alt="Romantic Memory"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}
                  {file.fileType === 'video' && (
                    <video
                      src={file.url}
                      controls
                      className="w-full h-48 object-cover rounded-xl bg-black"
                    />
                  )}
                  {file.fileType === 'audio' && (
                    <div className="w-full h-48 flex flex-col justify-center items-center bg-rose-50/50 rounded-xl p-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4">
                        <FileAudio size={24} />
                      </div>
                      <audio src={file.url} controls className="w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg">This gallery memory chest is currently empty.</p>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default GallerySection;
