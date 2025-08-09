import { useState } from 'react';
import Editor from '../components/Editor';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [bgUrl, setBgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalUrl, setFinalUrl] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, title })
    });
    const json = await resp.json();
    if (json.imageUrl) setBgUrl(json.imageUrl);
    else alert(json.error || 'no image');
    setLoading(false);
  }

  async function handleExport(dataUrl) {
    setLoading(true);
    const resp = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, title })
    });
    const json = await resp.json();
    if (json.imageUrl) setFinalUrl(json.imageUrl);
    else alert(json.error || 'upload failed');
    setLoading(false);
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">AI Thumbnail Studio — Full App (MVP)</h1>
      <p className="mt-2 text-sm text-gray-600">Generate a background with AI, edit in the composer, export and save to DB/S3.</p>

      <form onSubmit={handleGenerate} className="mt-6 space-y-4 max-w-2xl">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Thumbnail title" className="w-full p-3 border rounded" />
        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Describe the background" className="w-full p-3 border rounded h-28" />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Working...' : 'Generate background'}</button>
        </div>
      </form>

      {bgUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Editor</h2>
          <Editor imageUrl={bgUrl} onExport={handleExport} />
        </div>
      )}

      {finalUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Saved thumbnail</h2>
          <img src={finalUrl} alt="final" className="mt-2 border" />
          <a href={finalUrl} download className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded">Download</a>
        </div>
      )}
    </main>
  );
}
