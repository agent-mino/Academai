'use client';

import { useEffect, useState } from 'react';
import { HistoryItem } from '@/lib/types';
import { getHistory } from '@/lib/utils';

export function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // localStorage is only available after hydration, so this has to run in an effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(getHistory());
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">History (last 10)</h2>
      <ul className="list-disc pl-5">
        {history.map((item, i) => (
          <li key={i}>
            {item.mode} - {new Date(item.timestamp).toLocaleString()} - {item.preview}...
          </li>
        ))}
      </ul>
    </div>
  );
}