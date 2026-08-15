'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AiMatchedListing } from './types';

export function useAiSearch() {
  const { language, t } = useLanguage();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiResults, setAiResults] = useState<AiMatchedListing[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [lastAiPrompt, setLastAiPrompt] = useState('');

  const handleAiSearch = async () => {
    const query = aiQuery.trim();
    if (!query) return;

    setLastAiPrompt(query);
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiResponse('');
    setAiResults([]);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, language }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiResponse(typeof data.text === 'string' ? data.text : '');
        setAiResults(Array.isArray(data.results) ? data.results : []);
      } else {
        setAiResponse(data.error ? String(data.error) : t.searchDashboard.aiErrorGeneric);
      }
    } catch (err) {
      console.error(err);
      setAiResponse(t.searchDashboard.aiErrorGeneric);
    } finally {
      setIsAiLoading(false);
    }
  };

  const closeAiModal = () => {
    if (isAiLoading) return;
    setIsAiModalOpen(false);
  };

  return {
    aiQuery,
    setAiQuery,
    aiResponse,
    aiResults,
    isAiLoading,
    isAiModalOpen,
    lastAiPrompt,
    handleAiSearch,
    closeAiModal,
  };
}
