import React, { useState } from 'react';
import { VaultDocument } from '../types/index';
import { Search, X, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface AiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: VaultDocument[];
  onSelectDocument: (doc: VaultDocument) => void;
}

export const AiSearchModal: React.FC<AiSearchModalProps> = ({
  isOpen,
  onClose,
  documents,
  onSelectDocument
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultAnswer, setResultAnswer] = useState<string | null>(null);
  const [matchedDocIds, setMatchedDocIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const sampleQueries = [
    'Which of my insurance policies expire this year?',
    'Show my active loans and EMI schedules.',
    'Who is nominated on my SIP investment?',
    'Where is my Flat 402 property deed stored?'
  ];

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setIsSearching(true);
    setResultAnswer(null);

    try {
      const res = await fetch('/api/ai/search-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      const data = await res.json();
      setIsSearching(false);

      if (res.ok) {
        setResultAnswer(data.answer);
        setMatchedDocIds(data.matchedDocumentIds || []);
      }
    } catch (err) {
      setIsSearching(false);
      setResultAnswer('Search failed. Please try again.');
    }
  };

  const matchedDocs = documents.filter(d => matchedDocIds.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171C1A]/50 p-4">
      <div className="bg-white border border-[#DDE1DD] rounded-[10px] max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B726E] hover:text-[#171C1A] p-1 rounded hover:bg-[#F7F7F3] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#174C45] font-bold text-lg mb-1">
          <Search className="w-5 h-5 text-[#174C45]" />
          <span>Record Index Query</span>
        </div>
        <p className="text-xs text-[#6B726E] font-medium mb-4">
          Query your verified records in natural language. Search runs server-side on structured metadata.
        </p>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative mb-4"
        >
          <input
            type="text"
            placeholder="Ask about renewal dates, policies, or nominees..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-[#F7F7F3] border border-[#DDE1DD] rounded-[7px] pl-4 pr-12 py-3 text-xs text-[#171C1A] focus:outline-none focus:border-[#174C45]"
          />
          <button
            type="submit"
            disabled={isSearching || !query}
            className="absolute right-2 top-2 p-1.5 rounded-[5px] bg-[#174C45] text-white hover:bg-[#123e38] disabled:opacity-40 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Sample Prompts */}
        {!resultAnswer && !isSearching && (
          <div className="space-y-2 mb-6">
            <div className="text-[11px] font-bold text-[#6B726E] uppercase tracking-wider">
              Sample Queries:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(sq)}
                  className="px-3 py-1.5 rounded-[7px] bg-[#F7F7F3] border border-[#DDE1DD] hover:border-[#174C45] text-xs text-[#171C1A] font-medium transition-colors cursor-pointer text-left"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isSearching && (
          <div className="p-8 text-center text-xs font-bold text-[#174C45]">
            Querying structured record index...
          </div>
        )}

        {/* Search Results */}
        {resultAnswer && !isSearching && (
          <div className="space-y-4">
            <div className="p-4 rounded-[7px] bg-[#EBF0EE] border border-[#B9CDC6] text-xs text-[#171C1A] leading-relaxed font-medium">
              <div className="font-bold text-[#174C45] mb-1 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-[#174C45]" />
                <span>Record Intelligence Result:</span>
              </div>
              <p>{resultAnswer}</p>
            </div>

            {matchedDocs.length > 0 && (
              <div>
                <div className="text-xs font-bold text-[#6B726E] mb-2">Matching Vault Records ({matchedDocs.length}):</div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {matchedDocs.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onSelectDocument(doc);
                        onClose();
                      }}
                      className="p-3 rounded-[7px] bg-white border border-[#DDE1DD] hover:border-[#174C45] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-[#174C45] shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-[#171C1A]">{doc.title}</div>
                          <div className="text-[10px] text-[#6B726E] font-medium">{doc.category} • {doc.extractedData.provider}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6B726E]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

