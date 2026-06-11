import { Note } from './Note.tsx';
import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { MIN_NOTE_HEIGHT, MIN_NOTE_WIDTH } from './constants.ts';

interface NoteConfig {
  id: number;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const initialConfig: NoteConfig = {
  id: 0,
  text: '',
  x: 100,
  y: 100,
  width: 200,
  height: 200,
};

export function Canvas() {
  const [notes, setNotes] = useState<NoteConfig[]>([]);
  const [nextNoteId, setNextNoteId] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [newNoteConfig, setNewNoteConfig] = useState<NoteConfig>(initialConfig);

  const createNewNote = () => {
    const newNote = { ...newNoteConfig, id: nextNoteId, text: `Note #${nextNoteId}` };
    setNotes([...notes, newNote]);
    setNextNoteId((prevNoteId) => prevNoteId + 1);
    resetNoteConfig();
  };

  const resetNoteConfig = () => {
    setNewNoteConfig(initialConfig);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const handleOnSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewNote();
    closeSettings();
  };

  return (
    <div className="w-screen h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 relative overflow-hidden">
      <button
        className="cursor-pointer text-base hover:bg-amber-100 transition-transform fixed top-5 left-5 z-1000 flex gap-5 items-center bg-white px-6 py-3 rounded-xl shadow-md"
        onClick={openSettings}
      >
        Create new note
      </button>
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-2000">
          <div className="bg-white p-8 rounded-xl min-w-75 shadow-lg">
            <h3 className="mb-5 text-gray-800 text-xl font-semibold">Create New Note</h3>
            <form onSubmit={handleOnSubmit}>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 text-sm">Position X:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={newNoteConfig.x}
                  onChange={(e) => setNewNoteConfig({ ...newNoteConfig, x: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 text-sm">Position Y:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={newNoteConfig.y}
                  onChange={(e) => setNewNoteConfig({ ...newNoteConfig, y: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 text-sm">Width:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={newNoteConfig.width}
                  onChange={(e) => setNewNoteConfig({ ...newNoteConfig, width: parseInt(e.target.value) })}
                  min={MIN_NOTE_WIDTH}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-gray-600 text-sm">Height:</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  value={newNoteConfig.height}
                  onChange={(e) => setNewNoteConfig({ ...newNoteConfig, height: parseInt(e.target.value) })}
                  min={MIN_NOTE_HEIGHT}
                  required
                />
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 rounded cursor-pointer text-sm hover:bg-green-600 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={closeSettings}
                  className="flex-1 bg-red-500 text-white py-2 rounded cursor-pointer text-sm hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notes.map(({ id, text, x, y, width, height }) => (
        <Note
          key={id}
          text={text}
          x={x}
          y={y}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}
