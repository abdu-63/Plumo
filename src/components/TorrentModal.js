'use client';

import { X, Info, FileText } from 'lucide-react';
import styles from './TorrentModal.module.css';

export default function TorrentModal({ torrents, onClose }) {
    if (!torrents || torrents.length === 0) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>Torrents</div>

                <div className={styles.infoBox}>
                    <Info className={styles.infoIcon} size={24} />
                    <div className={styles.infoContent}>
                        <h4>Comment télécharger des torrents ?</h4>
                        <p>
                            Nous vous recommandons l'utilisation de <a href="https://transmissionbt.com/" target="_blank" rel="noopener noreferrer"><span className={styles.highlight}>Transmission</span></a> pour télécharger en torrent sur votre appareil.
                        </p>
                    </div>
                </div>

                <div className={styles.torrentList}>
                    {torrents.map((torrent, index) => (
                        <a
                            key={index}
                            href={torrent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.torrentButton}
                        >
                            <FileText className={styles.fileIcon} size={20} />
                            <span>{torrent.name}</span>
                        </a>
                    ))}
                </div>

                <button className={styles.closeButton} onClick={onClose}>
                    FERMER
                </button>
            </div>
        </div>
    );
}
