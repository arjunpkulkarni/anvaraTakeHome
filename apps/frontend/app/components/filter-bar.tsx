interface FilterBarProps<T extends string> {
  filters: readonly T[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  labels?: Record<T, string>;
}

export function FilterBar<T extends string>({ 
  filters, 
  activeFilter, 
  onFilterChange,
  labels 
}: FilterBarProps<T>) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ 
        display: 'inline-flex', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            style={{
              padding: '8px 24px',
              borderRadius: '8px',
              backgroundColor: activeFilter === filter ? 'white' : 'transparent',
              color: activeFilter === filter ? '#111827' : '#6b7280',
              fontWeight: '500',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeFilter === filter ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {labels?.[filter] || filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
