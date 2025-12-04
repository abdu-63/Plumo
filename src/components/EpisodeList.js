'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, X } from 'lucide-react';
import styles from './EpisodeList.module.css';
import dynamic from 'next/dynamic';
import { useWatchHistory } from '@/hooks/useWatchHistory';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false });

export default function EpisodeList({ episodes, series, seasons, initialEpisodeId, initialTimestamp, initialSeasonIndex }) {
    const [selectedLanguage, setSelectedLanguage] = useState('VOSTFR');
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [activeSeasonIndex, setActiveSeasonIndex] = useState(initialSeasonIndex || 0);
    const { addToHistory } = useWatchHistory();

    useEffect(() => {
        if (initialEpisodeId) {
            // Find the episode and season
            let foundEpisode = null;
            let foundSeasonIndex = 0;

            if (seasons) {
                // If initialSeasonIndex is provided, look there first
                if (typeof initialSeasonIndex !== 'undefined' && seasons[initialSeasonIndex]) {
                    const ep = seasons[initialSeasonIndex].episodes.find(e => e.id === Number(initialEpisodeId));
                    if (ep) {
                        foundEpisode = ep;
                        foundSeasonIndex = Number(initialSeasonIndex);
                    }
                }

                // Fallback: search all seasons if not found yet
                if (!foundEpisode) {
                    for (let index = 0; index < seasons.length; index++) {
                        const season = seasons[index];
                        // Convert initialEpisodeId to number for comparison as it comes from URL as string
                        const ep = season.episodes.find(e => e.id === Number(initialEpisodeId));
                        if (ep) {
                            foundEpisode = ep;
                            foundSeasonIndex = index;
                            break; // Stop after first match to avoid overwriting with later seasons
                        }
                    }
                }
            } else if (episodes || series?.episodes) {
                const eps = episodes || series.episodes;
                // Convert initialEpisodeId to number for comparison
                const ep = eps.find(e => e.id === Number(initialEpisodeId));
                if (ep) {
                    foundEpisode = ep;
                }
            }

            if (foundEpisode) {
                setActiveSeasonIndex(foundSeasonIndex);
                setSelectedEpisode({ ...foundEpisode, initialTimestamp });
            }
        }
    }, [initialEpisodeId, initialSeasonIndex, seasons, episodes, series, initialTimestamp]);

    const currentEpisodes = seasons
        ? (seasons[activeSeasonIndex]?.episodes || [])
        : (episodes || series?.episodes || []);

    const handleEpisodeClick = (ep) => {
        setSelectedEpisode(ep);
        if (series) {
            addToHistory(series, ep, undefined, activeSeasonIndex);
        }
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedEpisode) {
            document.body.style.overflow = 'hidden';

            // Auto-switch language if current selection is not available for this episode
            const hasVF = !!selectedEpisode.videoUrlVF;
            const hasVOSTFR = !!selectedEpisode.videoUrlVOSTFR;

            if (selectedLanguage === 'VOSTFR' && !hasVOSTFR && hasVF) {
                setSelectedLanguage('VF');
            } else if (selectedLanguage === 'VF' && !hasVF && hasVOSTFR) {
                setSelectedLanguage('VOSTFR');
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedEpisode, selectedLanguage]);

    const getVideoUrl = (episode) => {
        if (!episode) return '';
        if (selectedLanguage === 'VF' && episode.videoUrlVF) return episode.videoUrlVF;
        if (selectedLanguage === 'VOSTFR' && episode.videoUrlVOSTFR) return episode.videoUrlVOSTFR;
        // Fallback to the other if selected is missing
        if (episode.videoUrlVF) return episode.videoUrlVF;
        if (episode.videoUrlVOSTFR) return episode.videoUrlVOSTFR;
        return episode.videoUrl || ''; // Legacy fallback
    };

    return (
        <>
            {seasons && seasons.length > 1 && (
                <div className={styles.seasonSelector}>
                    <h3 className={styles.seasonTitle}>Saisons</h3>
                    <div className={styles.seasonTabs}>
                        {seasons.map((season, index) => (
                            <button
                                key={index}
                                className={`${styles.seasonTab} ${activeSeasonIndex === index ? styles.activeTab : ''}`}
                                onClick={() => setActiveSeasonIndex(index)}
                            >
                                {season.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.grid}>
                {currentEpisodes.map((ep) => (
                    <div
                        key={ep.id}
                        className={styles.card}
                        onClick={() => handleEpisodeClick(ep)}
                    >
                        <div className={styles.thumbnailContainer}>
                            <div
                                className={styles.thumbnail}
                                style={{
                                    backgroundColor: '#222',
                                    backgroundImage: ep.image ? `url("${ep.image}")` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                            <div className={styles.playOverlay}>
                                <Play fill="white" size={32} />
                            </div>
                        </div>

                        <div className={styles.info}>
                            <div className={styles.header}>
                                <h3 className={styles.title}>{ep.title}</h3>
                                <span className={styles.duration}>{ep.duration}</span>
                            </div>

                            {ep.episodesInclus && (
                                <div className={styles.meta}>
                                    <span>Episodes {ep.episodesInclus}</span>
                                </div>
                            )}

                            <p className={styles.description}>{ep.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEpisode && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEpisode(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', paddingBottom: 0, position: 'relative', zIndex: 20 }}>
                            <div className={styles.languageSelector} style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: selectedEpisode.videoUrlVOSTFR ? 'pointer' : 'not-allowed',
                                        backgroundColor: selectedLanguage === 'VOSTFR' ? '#e50914' : '#333',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        opacity: selectedEpisode.videoUrlVOSTFR ? 1 : 0.5
                                    }}
                                    onClick={() => selectedEpisode.videoUrlVOSTFR && setSelectedLanguage('VOSTFR')}
                                    disabled={!selectedEpisode.videoUrlVOSTFR}
                                >
                                    VOSTFR
                                </button>
                                <button
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: selectedEpisode.videoUrlVF ? 'pointer' : 'not-allowed',
                                        backgroundColor: selectedLanguage === 'VF' ? '#e50914' : '#333',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        opacity: selectedEpisode.videoUrlVF ? 1 : 0.5
                                    }}
                                    onClick={() => selectedEpisode.videoUrlVF && setSelectedLanguage('VF')}
                                    disabled={!selectedEpisode.videoUrlVF}
                                >
                                    VF
                                </button>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedEpisode(null)}
                                style={{ position: 'static' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#000' }}>
                            <VideoPlayer
                                src={getVideoUrl(selectedEpisode)}
                                title={selectedEpisode.title}
                                initialTimestamp={selectedEpisode.initialTimestamp}
                                poster={selectedEpisode.image}
                            />
                        </div>

                        <div style={{ padding: '1.5rem', position: 'relative', zIndex: 20 }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedEpisode.title}</h2>
                            {selectedEpisode.episodesInclus && (
                                <p style={{ color: '#a0a0a0', marginBottom: '1rem', fontWeight: 500 }}>
                                    Episodes {selectedEpisode.episodesInclus}
                                </p>
                            )}
                            <p style={{ color: '#aaa' }}>{selectedEpisode.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
