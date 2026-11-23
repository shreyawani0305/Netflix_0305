import React, { useEffect, useRef } from 'react';

/**
 * Profile dropdown menu anchored beneath the profile avatar.
 * Features:
 * - Dark theme (#1a1a1a) with 16px rounded corners & soft shadow
 * - Profile list with colorful rounded-square avatars:
 *   Profile 1 (Blue), Profile 2 (Teal), Profile 3 (Red), and Children (Rainbow)
 * - Navigation links with icons:
 *   Manage Profiles (pencil), Transfer Profile, Account, Help Centre
 * - Divider line followed by "Sign out of Netflix"
 * - Closes on outside click or Escape key
 * - Keyboard navigation (Arrow Up/Down, Home, End, Escape, Enter)
 */
export default function ProfileMenu({ isOpen, onClose, anchorRef }) {
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        if (anchorRef.current) {
          anchorRef.current.focus();
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  // Arrow key navigation between menu items
  const handleMenuKeyDown = (e) => {
    const focusableElements = menuRef.current?.querySelectorAll(
      'button, [tabindex="0"], a'
    );
    if (!focusableElements || focusableElements.length === 0) return;

    const list = Array.from(focusableElements);
    const currentIndex = list.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % list.length;
      list[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + list.length) % list.length;
      list[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      list[list.length - 1]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="profile-dropdown-panel"
      role="menu"
      aria-label="Profile and account settings"
      onKeyDown={handleMenuKeyDown}
    >
      {/* Upward decorative caret pointing to avatar */}
      <div className="profile-dropdown-caret" aria-hidden="true" />

      {/* Profiles List */}
      <ul className="profile-list" role="group" aria-label="Profiles">
        <li role="none">
          <button
            type="button"
            className="profile-item-btn"
            role="menuitem"
            onClick={onClose}
          >
            <div className="profile-avatar avatar-blue" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="#ffffff">
                <circle cx="10" cy="11" r="2.5" />
                <circle cx="22" cy="11" r="2.5" />
                <path d="M9 19c2 4 12 4 14 0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="profile-name">Profile 1</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="profile-item-btn"
            role="menuitem"
            onClick={onClose}
          >
            <div className="profile-avatar avatar-teal" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="#ffffff">
                <circle cx="10" cy="11" r="2.5" />
                <circle cx="22" cy="11" r="2.5" />
                <path d="M10 20c2.5 3 9.5 3 12 0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="profile-name">Profile 2</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="profile-item-btn"
            role="menuitem"
            onClick={onClose}
          >
            <div className="profile-avatar avatar-red" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="#ffffff">
                <circle cx="10" cy="11" r="2.5" />
                <circle cx="22" cy="11" r="2.5" />
                <path d="M10 20c2 3.5 10 3.5 12 0" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="profile-name">Profile 3</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="profile-item-btn"
            role="menuitem"
            onClick={onClose}
          >
            <div className="profile-avatar avatar-kids" aria-hidden="true">
              <span className="kids-label">KIDS</span>
            </div>
            <span className="profile-name">Children</span>
          </button>
        </li>
      </ul>

      {/* Account Settings and Links */}
      <ul className="profile-actions-list" role="group" aria-label="Account actions">
        <li role="none">
          <button
            type="button"
            className="menu-action-btn"
            role="menuitem"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Manage Profiles</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="menu-action-btn"
            role="menuitem"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <polyline points="17 11 19 13 23 9" />
            </svg>
            <span>Transfer Profile</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="menu-action-btn"
            role="menuitem"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Account</span>
          </button>
        </li>

        <li role="none">
          <button
            type="button"
            className="menu-action-btn"
            role="menuitem"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Help Centre</span>
          </button>
        </li>
      </ul>

      <hr className="profile-menu-divider" />

      {/* Sign Out Button */}
      <div className="profile-signout-wrapper">
        <button
          type="button"
          className="signout-btn"
          role="menuitem"
          onClick={onClose}
        >
          Sign out of Netflix
        </button>
      </div>
    </div>
  );
}
