import React, { useState } from 'react';
import { useUserData } from '../context/UserDataContext';
import './DevAdminPanel.css';

export default function DevAdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUserData();

  const downloadData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      source: 'This browser localStorage (streambox-user)',
      data: userData,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streambox-user-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        type="button"
        className="dev-admin-trigger"
        aria-label="Open local admin data panel"
        aria-expanded={isOpen}
        title="Local admin data"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42"/><circle cx="12" cy="12" r="5"/></svg>
      </button>
      {isOpen && (
        <div className="dev-admin-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <aside className="dev-admin-panel" role="dialog" aria-modal="true" aria-labelledby="dev-admin-title">
            <header className="dev-admin-header">
              <div><p>DEVELOPMENT ONLY</p><h2 id="dev-admin-title">Local data</h2></div>
              <button type="button" className="dev-admin-close" onClick={() => setIsOpen(false)} aria-label="Close admin panel">×</button>
            </header>
            <p className="dev-admin-note">This is data saved in this browser. It is not collected from other users or sent to a server.</p>
            <dl className="dev-admin-stats">
              <div><dt>My List</dt><dd>{userData.myList.length}</dd></div>
              <div><dt>Liked titles</dt><dd>{userData.liked.length}</dd></div>
              <div><dt>Watch progress</dt><dd>{Object.keys(userData.progress).length}</dd></div>
              <div><dt>Trailers watched</dt><dd>{userData.trailers.length}</dd></div>
            </dl>
            <section className="dev-admin-data" aria-label="Saved user data preview">
              <h3>Saved data preview</h3>
              <pre>{JSON.stringify(userData, null, 2)}</pre>
            </section>
            <button type="button" className="dev-admin-export" onClick={downloadData}>Download JSON export</button>
          </aside>
        </div>
      )}
    </>
  );
}
