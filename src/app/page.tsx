import LandingClient from './components/LandingClient';

async function getSettings() {
  try {
    const res = await fetch('http://localhost:3000/api/settings', { cache: 'no-store' });
    if (!res.ok) {
      console.error("Failed to fetch settings, returning default.");
      return { instagramUrl: '#' };
    }
    const settings = await res.json();
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { instagramUrl: '#' };
  }
}

export default async function Home() {
  const settings = await getSettings();
  return <LandingClient instagramUrl={settings.instagramUrl} />;
}
