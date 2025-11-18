'use client';

/**
 * ModalPortal - PERMANENT MODAL LAYERING SOLUTION
 *
 * This component uses React portals to render modals at the root level
 * of the DOM, completely independent of parent containers, stacking contexts,
 * or any layout wrappers (including ZeminentLayout).
 *
 * This ensures modals ALWAYS appear above everything else, no matter what
 * future layout, theme, or component changes are made.
 *
 * Architecture guarantees:
 * - Modals render outside the normal DOM hierarchy
 * - Never affected by parent z-index, overflow, transform, or filters
 * - Works permanently across all pages and integrations
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    setMounted(true);

    // Get or create the modal-root container
    let root = document.getElementById('modal-root');

    // Fallback: if modal-root doesn't exist, create it dynamically
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      root.setAttribute('data-modal-portal', 'true');
      document.body.appendChild(root);
    }

    setModalRoot(root);

    return () => {
      setMounted(false);
    };
  }, []);

  // Don't render on server (Next.js SSR safety)
  if (!mounted || !modalRoot) return null;

  // Render children into the modal-root portal
  return createPortal(children, modalRoot);
};

export default ModalPortal;
