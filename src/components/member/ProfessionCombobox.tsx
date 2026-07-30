import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Briefcase, Check, ChevronDown, Search } from 'lucide-react';
import { normalizeProfessionSearch } from '../../utils/professionSearch';

export interface ProfessionOption {
  value: string;
  label: string;
}

interface ProfessionComboboxProps {
  id: string;
  value: string;
  options: ProfessionOption[];
  onChange: (value: string) => void;
  hasError?: boolean;
  describedBy?: string;
  disabled?: boolean;
}

const ProfessionCombobox: React.FC<ProfessionComboboxProps> = ({
  id,
  value,
  options,
  onChange,
  hasError = false,
  describedBy,
  disabled = false,
}) => {
  const generatedId = useId();
  const listboxId = `${id}-options-${generatedId.replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedOption = options.find((option) => option.value === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(selectedOption?.label ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeProfessionSearch(query);
    if (!normalizedQuery) return options;
    return options.filter((option) =>
      normalizeProfessionSearch(option.label).includes(normalizedQuery),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) setQuery(selectedOption?.label ?? '');
  }, [open, selectedOption?.label]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || filteredOptions.length === 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, filteredOptions.length, open]);

  const selectOption = (option: ProfessionOption) => {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        filteredOptions.length ? Math.min(index + 1, filteredOptions.length - 1) : -1,
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        filteredOptions.length
          ? index <= 0
            ? filteredOptions.length - 1
            : index - 1
          : -1,
      );
      return;
    }
    if (event.key === 'Enter' && open && filteredOptions[activeIndex]) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex]);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setQuery(selectedOption?.label ?? '');
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Briefcase
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && filteredOptions[activeIndex]
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          aria-invalid={hasError}
          aria-describedby={describedBy}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          value={query}
          placeholder="Rechercher une profession…"
          onFocus={() => {
            setOpen(true);
            if (selectedOption) setQuery('');
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (value) onChange('');
          }}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-11 text-base text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${
            hasError
              ? 'border-red-300 ring-4 ring-red-50 focus:border-red-500'
              : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-50'
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? 'Fermer la liste des professions' : 'Ouvrir la liste des professions'}
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-teal-700"
        >
          {open ? <Search size={17} /> : <ChevronDown size={17} />}
        </button>
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Professions disponibles"
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)]"
        >
          <div className="max-h-56 overflow-y-auto overscroll-contain p-1.5 sm:max-h-72">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const selected = option.value === value;
                const active = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                      active
                        ? 'bg-teal-50 text-teal-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && <Check size={16} className="shrink-0 text-teal-700" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center">
                <Search size={20} className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm font-bold text-slate-700">Aucune profession trouvée</p>
                <p className="mt-1 text-xs text-slate-500">Essayez un autre mot ou une partie du métier.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionCombobox;
