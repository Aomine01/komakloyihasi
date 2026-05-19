'use client';

import { useEffect } from 'react';

export default function ConsoleGreeting() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(
        '%c KO\'MAK ',
        'color: #00766a; font-weight: 800; font-size: 16px; border: 2px dashed #00766a; padding: 20px 40px; border-radius: 4px; background-color: transparent;'
      );

      console.log(
        `%cOrzularga qanot beramiz · © ${new Date().getFullYear()} · komakloyihasi.uz`,
        'color: #6B7280; font-size: 12px; font-family: monospace;'
      );
    }
  }, []);

  return null;
}
