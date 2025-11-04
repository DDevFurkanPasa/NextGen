'use client';

export default function LocaleSwitcher() {
  const handleLocaleChange = (locale: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('locale', locale);
    window.location.href = url.toString();
  };

  return (
    <div data-testid="locale-switcher" style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={() => handleLocaleChange('en')} 
        data-locale="en"
        style={{
          minWidth: '60px',
          minHeight: '60px',
          width: '60px',
          height: '60px',
          padding: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          fontSize: '16px',
          backgroundColor: '#1d4ed8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button 
        onClick={() => handleLocaleChange('fr')} 
        data-locale="fr"
        style={{
          minWidth: '60px',
          minHeight: '60px',
          width: '60px',
          height: '60px',
          padding: '16px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          fontSize: '16px',
          backgroundColor: '#1d4ed8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        aria-label="Switch to French"
      >
        FR
      </button>
    </div>
  );
}
