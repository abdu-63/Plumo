'use client';

import { useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import TorrentModal from '@/components/TorrentModal';
import styles from '@/app/productions/[id]/page.module.css';

export default function SeriesHero({ series }) {
    const [showTorrentModal, setShowTorrentModal] = useState(false);

    return (
        <div
            className={styles.hero}
            style={{ backgroundImage: `url(${series.backgroundImage || series.image})` }}
        >
            <div className={styles.overlay}>
                <div className={styles.content}>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={32} />
                    </Link>
                    <div className={styles.posterWrapper}>
                        <img src={series.image} alt={series.title} className={styles.poster} />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.headerActions}>
                            {series.torrents && series.torrents.length > 0 && (
                                <>
                                    <button
                                        className={styles.torrentButton}
                                        onClick={() => setShowTorrentModal(true)}
                                    >
                                        Afficher le torrent
                                    </button>
                                    {showTorrentModal && (
                                        <TorrentModal
                                            torrents={series.torrents}
                                            onClose={() => setShowTorrentModal(false)}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        <div className={styles.titleRow}>
                            <h1 className={styles.title}>{series.title}</h1>
                            <FavoriteButton series={series} />
                        </div>

                        <div className={styles.meta}>
                            <span>VOSTFR | VF</span>
                        </div>

                        <p className={styles.synopsis}>{series.synopsis}</p>

                        <div className={styles.footerInfo}>
                            <div className={styles.kaieurs}>
                                <span className={styles.label}>Kaïeur(s)</span>
                                <span className={styles.value}>{series.kaieurs || 'Inconnu'}</span>
                            </div>

                            {series.wikiUrl && (
                                <a
                                    href={series.wikiUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.wikiLink}
                                >
                                    Guide des épisodes de la série
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
