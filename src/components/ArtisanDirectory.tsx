import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Artisan } from '../types';
import { CraftAuthenticationModal } from './CraftAuthenticationModal';
import { ArtisanStoryModal } from './ArtisanStoryModal';
import { getArtisanTranslation } from '../utils/translateHelper';

export const ArtisanDirectory: React.FC = () => {
  const {
    artisans,
    language,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    setSelectedArtisan,
    setActiveView
  } = useApp();

  const [authModalArtisan, setAuthModalArtisan] = useState<Artisan | null>(null);
  const [storyModalArtisan, setStoryModalArtisan] = useState<Artisan | null>(null);

  return (
    <div id="artisan-directory-screen" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={() => setActiveView('buyer-marketplace')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 font-bold text-xs hover:bg-stone-200 transition text-stone-800 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.exploreCrafts || 'Back to Marketplace'}</span>
          </button>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {t.meetArtisans || 'Meet Our Master Artisans'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            {t.directFromGenerational || 'Directly supporting 3rd to 6th generation mastercraftsmen across India.'}
          </p>
        </div>

        <button
          onClick={() => {
            isVoiceSpeaking 
              ? stopAudio() 
              : speak('Meet our verified mastercraft artisans from Mysuru, Varanasi, Jaipur, Kondapalli, Kashmir, and Kutch.');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm hover:bg-stone-200 transition self-start sm:self-auto"
        >
          {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isVoiceSpeaking ? t.stopListening : (t.listen || 'Read Directory')}</span>
        </button>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => {
          const translated = getArtisanTranslation(artisan, language);
          const storyToDisplay = translated.story;
          const generationToDisplay = translated.generation;

          return (
            <div
              key={artisan.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-stone-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 bg-stone-100 overflow-hidden">
                  <img 
                    src={artisan.photoUrl} 
                    alt={artisan.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-800 text-white font-bold text-[11px] shadow-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{t.verifiedLineage || 'Verified Lineage'}</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                    {artisan.craftTypeName}
                  </div>
                  
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {artisan.name}
                  </h3>
                  
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-1.5 mt-0.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-stone-700" />
                    <span>{artisan.region}, {artisan.state}</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-semibold text-stone-700">{generationToDisplay}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-2 font-normal italic">
                    "{storyToDisplay}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-stone-50/80 border-t border-stone-100 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedArtisan(artisan);
                      setStoryModalArtisan(artisan);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-100 transition text-center shadow-2xs"
                  >
                    {t.artisanStory || 'Read Story'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedArtisan(artisan);
                      setAuthModalArtisan(artisan);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition text-center"
                  >
                    {t.verifyLineage || 'Verify Lineage'}
                  </button>
                </div>

                <button
                  onClick={() => {
                    speak(`${artisan.name}, mastercraft artisan of ${artisan.craftTypeName} from ${artisan.region}, ${artisan.state}. ${storyToDisplay}`);
                  }}
                  className="w-full py-2 rounded-xl bg-white border border-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 text-stone-700 hover:bg-stone-100 transition"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                  <span>{t.listenToStory || 'Listen to Artisan Voice Bio'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {authModalArtisan && (
        <CraftAuthenticationModal
          artisan={authModalArtisan}
          onClose={() => setAuthModalArtisan(null)}
        />
      )}

      {storyModalArtisan && (
        <ArtisanStoryModal
          onClose={() => setStoryModalArtisan(null)}
        />
      )}

    </div>
  );
};
