'use client';

import Link from 'next/link';
import { Search, User, MonitorPlay, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Debounce function to limit URL updates
    const updateSearch = (term) => {
        if (term.trim()) {
            router.push(`/?q=${encodeURIComponent(term)}`);
        } else {
            router.push('/');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear previous timeout
        if (window.searchTimeout) {
            clearTimeout(window.searchTimeout);
        }

        // Set new timeout for 300ms
        window.searchTimeout = setTimeout(() => {
            updateSearch(value);
        }, 300);
    };

    const toggleSearch = () => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setSearchQuery('');
            router.push('/');
        } else {
            setIsSearchOpen(true);
        }
    };

    const isTransparent = pathname?.startsWith('/productions/');

    return (
        <nav className={`${styles.navbar} ${isTransparent ? styles.transparent : ''}`}>
            <Link href="/" className={styles.logo}>
                <img src="/logo.png" alt="Plumo Logo" style={{ height: '32px', width: 'auto' }} />
            </Link>

            <div className={styles.navLinks}>
                <Link href="/" className={`${styles.navLink} ${styles.active}`}>
                    Accueil
                </Link>
                <Link href="/favoris" className={styles.navLink}>
                    Favoris
                </Link>
            </div>

            <div className={styles.actions}>
                {isSearchOpen ? (
                    <div className={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={handleInputChange}
                            autoFocus
                        />
                        <button type="button" className={styles.iconButton} onClick={toggleSearch}>
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <button className={styles.iconButton} onClick={toggleSearch}>
                        <Search size={20} />
                    </button>
                )}
                {!mounted || status === 'loading' ? (
                    <div style={{ width: '32px', height: '32px' }}></div>
                ) : session ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <button
                            onClick={() => signOut()}
                            className={styles.authButton}
                        >
                            Déconnexion
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn('discord')}
                        className={styles.authButton}
                    >
                        Connexion (Discord)
                    </button>
                )}
                <button className={styles.iconButton}>
                    <User size={20} />
                </button>
            </div>
        </nav >
    );
}
