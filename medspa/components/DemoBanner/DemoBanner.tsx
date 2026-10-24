// @ts-nocheck Transitional conversion: preserve the existing Medspa component API.
import React from 'react';

/**
 * Slim fixed banner pinned to the very top of the page indicating this is a
 * demo site. Sits above the (fixed) navbar; App.css offsets the navbar by the
 * banner height and the hero clears it via padding.
 */
export default function DemoBanner({ label = 'Demo Site' }) {
  return (
    <div
      className="demo-banner"
      role="note"
      aria-label={label}
    >
      <span className="demo-banner-dot" aria-hidden="true" />
      <span className="demo-banner-text">{label}</span>
    </div>
  );
}