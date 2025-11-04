'use client';

export default function LocaleSwitcher() {
  const handleLocaleChange = (locale: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('locale', locale);
    window.location.href = url.toString();
  };

  return (
    <div data-testid="locale-switcher">
      <button onClick={() => handleLocaleChange('en')} data-locale="en">
        English
      </button>
      <button onClick={() => handleLocaleChange('fr')} data-locale="fr">
        Français
      </button>
    </div>
  );
}
