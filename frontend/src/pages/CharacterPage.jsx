import { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';

const SKILLS = [
  'attack','hitpoints','mining','strength','agility','smithing',
  'defence','herblore','fishing','ranged','thieving','cooking',
  'prayer','crafting','firemaking','magic','fletching','woodcutting',
  'runecraft','slayer','farming','construction','hunter','sailing'
];

const SKILL_ICONS = {
  attack: '⚔️', hitpoints: '❤️', mining: '⛏️', strength: '💪',
  agility: '🏃', smithing: '🔨', defence: '🛡️', herblore: '⚗️',
  fishing: '🎣', ranged: '🏹', thieving: '🦝', cooking: '🍳',
  prayer: '🙏', crafting: '🧵', firemaking: '🔥', magic: '🧙',
  fletching: '🏹', woodcutting: '🪓', runecraft: '🔮', slayer: '💀',
  farming: '🌱', construction: '🏠', hunter: '🐾', sailing: '⛵'
};

function xpForLevel(level) {
  if (level <= 1) return 0;
  if (level > 99) return 13034431;
  let xp = 0;
  for (let i = 1; i < level; i++) {
    xp += Math.floor(i + 300 * Math.pow(2, i / 7));
  }
  return Math.floor(xp / 4);
}

export function ProgressBar({ start, current, target }) {
  const startXP = start ? xpForLevel(start) : 0;
  const currentXP = xpForLevel(current);
  const targetXP = xpForLevel(target);
  
  let pct = 0;
  if (targetXP > startXP) {
    pct = Math.min(100, Math.max(0, ((currentXP - startXP) / (targetXP - startXP)) * 100));
  } else if (targetXP > 0) {
    pct = Math.min(100, Math.round((currentXP / targetXP) * 100));
  }
  
  return (
    <div className="mt-1">
      <div className="w-full bg-gray-800 rounded-full h-1.5 border border-gray-700 overflow-hidden relative">
        <div className="bg-amber-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-500">
        <span>Goal Progress: {Math.round(pct)}%</span>
        <span>{targetXP.toLocaleString()} XP</span>
      </div>
    </div>
  );
}

export const ACCOUNT_TYPES = [
  { value: 'Main', label: 'Main', icon: '👑', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { value: 'Alt', label: 'Alt', icon: '🔄', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { value: 'Ironman', label: 'Ironman', icon: '🛡️', badge: 'bg-slate-400/20 text-slate-300 border-slate-400/40' },
  { value: 'Hardcore Iron', label: 'Hardcore', icon: '💀', badge: 'bg-red-500/20 text-red-300 border-red-500/40' },
  { value: 'Ultimate Iron', label: 'Ultimate', icon: '🎒', badge: 'bg-zinc-300/20 text-zinc-100 border-zinc-300/40' },
  { value: 'Group Iron', label: 'Group Iron', icon: '🤝', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { value: 'Pure', label: 'Pure', icon: '⚔️', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { value: 'Skiller', label: 'Skiller', icon: '🔨', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
];

export function getAccountTypeMeta(type) {
  return ACCOUNT_TYPES.find(t => t.value === type) || ACCOUNT_TYPES[0];
}

function CharacterSlot({ slot, character, onSelect, isActive, onEditAccount, onDeleteClick }) {
  if (!character) {
    return (
      <button onClick={() => onSelect(slot)}
        className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-amber-500/50 hover:bg-gray-800/30 transition-all min-h-[160px]">
        <span className="text-3xl">➕</span>
        <span className="text-gray-400 text-sm font-medium">Slot {slot}</span>
        <span className="text-xs text-gray-500">Click to create</span>
      </button>
    );
  }

  const typeMeta = getAccountTypeMeta(character.account_type);

  return (
    <div onClick={() => onSelect(character.id)}
      className={`rounded-xl p-5 cursor-pointer transition-all border flex flex-col justify-between min-h-[160px] ${
        isActive
          ? 'border-amber-500/60 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
          : 'border-gray-800 bg-gray-900/50 hover:bg-gray-800/50'
      }`}>
      <div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-white truncate text-base">{character.name}</h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${typeMeta.badge}`}>
                <span>{typeMeta.icon}</span>
                <span>{typeMeta.label}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">Combat {character.combat_level} · {character.total_level} total</p>
          </div>
          {isActive && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 shrink-0 font-medium">
              Active
            </span>
          )}
        </div>
        <p className="text-sm text-emerald-400 font-medium">{new Intl.NumberFormat().format(character.current_gp ?? 0)} GP</p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/80 text-xs">
        <button
          onClick={(e) => { e.stopPropagation(); onEditAccount(character); }}
          className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-amber-500/10">
          ✎ Edit Account
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDeleteClick(character); }}
          className="text-red-400/80 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-500/10">
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}

export default function CharacterPage() {
  const { characters, activeCharacterId, setActiveCharacterId, refreshCharacters } = useCharacter();
  const [selectedChar, setSelectedChar] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newGoal, setNewGoal] = useState({ skill: 'attack', current_level: 1, target_level: 10 });
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [createSlot, setCreateSlot] = useState(null);
  const [newName, setNewName] = useState('');
  const [createAccountType, setCreateAccountType] = useState('Main');
  const [editAccountModalChar, setEditAccountModalChar] = useState(null);
  const [editAccountForm, setEditAccountForm] = useState({ name: '', account_type: 'Main' });
  const [deleteConfirmChar, setDeleteConfirmChar] = useState(null);

  // When characters load, select active one
  useEffect(() => {
    if (activeCharacterId && !selectedChar) {
      fetchCharacterDetail(activeCharacterId);
    }
  }, [activeCharacterId]); // eslint-disable-line

  const fetchCharacterDetail = async (id) => {
    const res = await fetch(`/api/characters/${id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedChar(data);
      setEditForm({ ...data, ...data.skills });
    }
  };

  const handleSlotClick = async (slotOrId) => {
    const existing = characters.find(c => c.id === slotOrId || c.slot === slotOrId);
    if (existing) {
      setActiveCharacterId(existing.id);
      await fetchCharacterDetail(existing.id);
    } else {
      // Creating new
      setCreateSlot(slotOrId);
      setNewName('');
      setCreateAccountType('Main');
    }
  };

  const [createError, setCreateError] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreateError('');
    try {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          slot: createSlot,
          account_type: createAccountType,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        setCreateError(err.detail ?? 'Failed to create character');
        return;
      }
      const newChar = await res.json();
      // Close modal first
      setCreateSlot(null);
      setCreateError('');
      setCreateAccountType('Main');
      // Refresh list then immediately load the new character
      await refreshCharacters();
      setActiveCharacterId(newChar.id);
      await fetchCharacterDetail(newChar.id);
    } catch (e) {
      setCreateError(e.message ?? 'Network error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        alert(`Failed to delete character: ${err.detail ?? 'Unknown error'}`);
        return;
      }
      const remaining = characters.filter(c => c.id !== id);
      if (activeCharacterId === id) {
        setActiveCharacterId(remaining[0]?.id ?? null);
      }
      if (selectedChar?.id === id) {
        if (remaining.length > 0) {
          await fetchCharacterDetail(remaining[0].id);
        } else {
          setSelectedChar(null);
          setEditForm({});
        }
      }
      await refreshCharacters();
      setDeleteConfirmChar(null);
      setEditAccountModalChar(null);
    } catch (e) {
      alert(`Network error: ${e.message}`);
    }
  };

  const handleOpenEditAccount = (char) => {
    setEditAccountModalChar(char);
    setEditAccountForm({
      name: char.name,
      account_type: char.account_type || 'Main',
    });
  };

  const handleSaveAccountModal = async () => {
    if (!editAccountModalChar || !editAccountForm.name.trim()) return;
    try {
      const res = await fetch(`/api/characters/${editAccountModalChar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editAccountForm.name.trim(),
          account_type: editAccountForm.account_type,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        alert(`Failed to save: ${err.detail ?? 'Unknown error'}`);
        return;
      }
      await refreshCharacters();
      if (selectedChar?.id === editAccountModalChar.id) {
        await fetchCharacterDetail(editAccountModalChar.id);
      }
      setEditAccountModalChar(null);
    } catch (e) {
      alert(`Network error: ${e.message}`);
    }
  };

  const handleSave = async () => {
    if (!selectedChar) return;
    setSaving(true);
    try {
      const body = {};
      ['name', 'account_type', 'combat_level', 'total_level', 'current_gp', ...SKILLS].forEach(k => {
        if (editForm[k] !== undefined) body[k] = editForm[k];
      });
      const res = await fetch(`/api/characters/${selectedChar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }));
        alert(`Failed to save: ${err.detail ?? 'Unknown error'}`);
        return;
      }
      await fetchCharacterDetail(selectedChar.id);
      await refreshCharacters();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert(`Network error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async () => {
    if (!selectedChar) return;
    await fetch(`/api/characters/${selectedChar.id}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal),
    });
    await fetchCharacterDetail(selectedChar.id);
  };

  const handleCompleteGoal = async (goalId, completed) => {
    await fetch(`/api/characters/${selectedChar.id}/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    await fetchCharacterDetail(selectedChar.id);
  };

  const handleSaveEditedGoal = async (goalId, updates) => {
    await fetch(`/api/characters/${selectedChar.id}/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    setEditingGoal(null);
    await fetchCharacterDetail(selectedChar.id);
  };

  const handleDeleteGoal = async (goalId) => {
    await fetch(`/api/characters/${selectedChar.id}/goals/${goalId}`, { method: 'DELETE' });
    await fetchCharacterDetail(selectedChar.id);
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedChar) return;
    await fetch(`/api/characters/${selectedChar.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText.trim() }),
    });
    setNoteText('');
    await fetchCharacterDetail(selectedChar.id);
  };

  const slots = [1, 2, 3];

  const handleMoveGoal = async (index, direction) => {
    const activeGoals = selectedChar.goals.filter(g => !g.completed);
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === activeGoals.length - 1) return;
    
    const newGoals = [...activeGoals];
    const temp = newGoals[index];
    newGoals[index] = newGoals[index + direction];
    newGoals[index + direction] = temp;
    
    // optimistic update
    setSelectedChar(c => ({...c, goals: [...newGoals, ...c.goals.filter(g => g.completed)]}));
    
    await fetch(`/api/characters/${selectedChar.id}/goals/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal_ids: newGoals.map(g => g.id) }),
    });
    await fetchCharacterDetail(selectedChar.id);
  };

  const hasChanges = selectedChar ? (
    ['name', 'account_type', 'combat_level', 'total_level', 'current_gp'].some(k => editForm[k] !== selectedChar[k]) ||
    SKILLS.some(skill => editForm[skill] !== selectedChar.skills?.[skill])
  ) : false;

  return (
    <div className="pb-16">

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
          📋 Character Recorder
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage up to 3 OSRS characters</p>
      </header>

      {/* Create modal */}
      {createSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-white mb-4 text-lg">Create Character (Slot {createSlot})</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Character Name</label>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="e.g. BeanzCraftz"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Account Type</label>
                <select
                  value={createAccountType}
                  onChange={e => setCreateAccountType(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {createError && (
              <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
                ⚠ {createError}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={handleCreate} className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded-lg text-sm transition-colors">Create</button>
              <button onClick={() => { setCreateSlot(null); setCreateError(''); }} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editAccountModalChar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <span>✎</span> Edit Account (Slot {editAccountModalChar.slot})
              </h3>
              <button
                onClick={() => setEditAccountModalChar(null)}
                className="text-gray-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Account Name</label>
                <input
                  autoFocus
                  type="text"
                  value={editAccountForm.name}
                  onChange={e => setEditAccountForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. BeanzCraftz"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">Change or correct the display name for this character slot.</p>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map(t => {
                    const isSelected = editAccountForm.account_type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setEditAccountForm(f => ({ ...f, account_type: t.value }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                          isSelected
                            ? `${t.badge} ring-1 ring-amber-400/50 shadow-sm`
                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                        }`}>
                        <span className="text-sm">{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeCharacterId !== editAccountModalChar.id && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveCharacterId(editAccountModalChar.id)}
                    className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors">
                    ★ Set as Active Character
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  const target = editAccountModalChar;
                  setEditAccountModalChar(null);
                  setDeleteConfirmChar(target);
                }}
                className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 font-medium transition-colors">
                🗑️ Delete Account...
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditAccountModalChar(null)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAccountModal}
                  disabled={!editAccountForm.name.trim()}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold rounded-lg text-xs transition-colors">
                  Save Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmChar && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/40 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-white text-lg">Remove Character</h3>
                <p className="text-xs text-gray-400">Slot {deleteConfirmChar.slot} · {deleteConfirmChar.name}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Are you sure you want to delete <strong className="text-amber-400">{deleteConfirmChar.name}</strong>?
            </p>
            <p className="text-red-400 text-xs mb-6 bg-red-500/10 border border-red-500/20 p-3 rounded-lg leading-relaxed">
              This will permanently delete this character and all its recorded stats, active goals, session logs, and completed quest progress. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirmChar(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmChar.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-red-600/30">
                Yes, Delete Character
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {slots.map(slot => {
          const char = characters.find(c => c.slot === slot);
          return (
            <CharacterSlot key={slot} slot={slot} character={char}
              onSelect={handleSlotClick} isActive={char?.id === activeCharacterId}
              onEditAccount={handleOpenEditAccount}
              onDeleteClick={(c) => setDeleteConfirmChar(c)} />
          );
        })}
      </div>

      {/* Selected character editor */}
      {selectedChar && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Stats form */}
          <div className="xl:col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <h2 className="font-bold text-white text-lg">📊 Stats — {selectedChar.name}</h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getAccountTypeMeta(editForm.account_type || selectedChar.account_type).badge}`}>
                  {getAccountTypeMeta(editForm.account_type || selectedChar.account_type).icon} {editForm.account_type || selectedChar.account_type || 'Main'}
                </span>
              </div>
              <button onClick={handleSave} disabled={saving || (!hasChanges && !saving && !saved)}
                className={`text-black font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  saved ? 'bg-emerald-500' :
                  hasChanges ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-amber-500 hover:bg-amber-400 disabled:opacity-50'
                }`}>
                {saving ? 'Saving…' : saved ? '✓ Saved!' : (hasChanges ? 'Save Changes!' : 'Save Changes')}
              </button>
            </div>

            {/* Name / Account Type / combat / total / GP */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Account Type</label>
                <select
                  value={editForm.account_type ?? 'Main'}
                  onChange={e => setEditForm(f => ({ ...f, account_type: e.target.value }))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500">
                  {ACCOUNT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Combat Lvl</label>
                <input
                  type="number"
                  step="any"
                  value={editForm.combat_level ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, combat_level: Number(e.target.value) }))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Total Lvl</label>
                <input
                  type="number"
                  value={editForm.total_level ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, total_level: Number(e.target.value) }))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Cash Stack (GP)</label>
                <input
                  type="number"
                  value={editForm.current_gp ?? ''}
                  onChange={e => setEditForm(f => ({ ...f, current_gp: Number(e.target.value) }))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Skill grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {SKILLS.map(skill => (
                <div key={skill} className="bg-gray-950 rounded-lg p-2 text-center">
                  <div className="text-base mb-1">{SKILL_ICONS[skill]}</div>
                  <label className="text-xs text-gray-400 block mb-1 capitalize">{skill}</label>
                  <input
                    type="number" min="1" max="99"
                    value={editForm[skill] ?? 1}
                    onChange={e => setEditForm(f => ({ ...f, [skill]: Number(e.target.value) }))}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-1 py-1 text-white text-sm text-center focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Goals + Notes column */}
          <div className="space-y-6">
            {/* Goals */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col max-h-[600px]">
              <h2 className="font-bold text-white mb-4 shrink-0">🎯 Active Goals</h2>

              <div className="overflow-y-auto flex-1 pr-2 space-y-4 min-h-[100px]">
                {selectedChar.goals?.filter(g => !g.completed).map((goal, index) => (
                  <div key={goal.id}>
                    {editingGoal === goal.id ? (
                      <div className="flex gap-2 items-center bg-gray-950 p-2 rounded">
                        <span className="text-sm font-medium text-white capitalize w-20">{SKILL_ICONS[goal.skill]} {goal.skill}</span>
                        <input type="number" id={`edit-target-${goal.id}`} defaultValue={goal.target_level} min="2" max="99"
                          className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500" />
                        <button onClick={() => handleSaveEditedGoal(goal.id, { target_level: Number(document.getElementById(`edit-target-${goal.id}`).value) })}
                          className="text-xs text-emerald-400 ml-auto">Save</button>
                        <button onClick={() => setEditingGoal(null)}
                          className="text-xs text-gray-500">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <button onClick={() => handleMoveGoal(index, -1)} className="text-gray-500 hover:text-white leading-none text-[10px]">▲</button>
                              <button onClick={() => handleMoveGoal(index, 1)} className="text-gray-500 hover:text-white leading-none text-[10px]">▼</button>
                            </div>
                            <span className="text-sm font-medium text-white capitalize">
                              {SKILL_ICONS[goal.skill]} {goal.skill} <span className="text-gray-400 font-normal">Lvl {editForm[goal.skill] ?? goal.current_level} / {goal.target_level}</span>
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingGoal(goal.id)}
                              className="text-xs text-blue-400/80 hover:text-blue-300 transition-colors">✎ Edit</button>
                            <button onClick={() => handleCompleteGoal(goal.id, goal.completed)}
                              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">✓ Done</button>
                            <button onClick={() => handleDeleteGoal(goal.id)}
                              className="text-xs text-red-400/60 hover:text-red-400 transition-colors">✕</button>
                          </div>
                        </div>
                        <ProgressBar start={goal.current_level} current={editForm[goal.skill] ?? goal.current_level} target={goal.target_level} />
                      </>
                    )}
                  </div>
                ))}
                
                {selectedChar.goals?.filter(g => !g.completed).length === 0 && (
                  <p className="text-gray-500 text-sm">No active goals yet.</p>
                )}
              </div>

              {/* Add goal form */}
              <div className="mt-4 pt-4 border-t border-gray-800 shrink-0">
                <p className="text-xs text-gray-400 mb-2">Add New Goal</p>
                <div className="flex gap-2 flex-wrap items-end">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Skill</label>
                    <select value={newGoal.skill} onChange={e => setNewGoal(g => ({ ...g, skill: e.target.value }))}
                      className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500 h-8">
                      {SKILLS.map(s => <option key={s} value={s}>{SKILL_ICONS[s]} {s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">From Lvl</label>
                    <input type="number" min="1" max="98" placeholder="1"
                      value={newGoal.current_level}
                      onChange={e => setNewGoal(g => ({ ...g, current_level: Number(e.target.value) }))}
                      className="w-16 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">To Lvl</label>
                    <input type="number" min="2" max="99" placeholder="10"
                      value={newGoal.target_level}
                      onChange={e => setNewGoal(g => ({ ...g, target_level: Number(e.target.value) }))}
                      className="w-16 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-amber-500 h-8" />
                  </div>
                  <button onClick={handleAddGoal}
                    className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 px-3 h-8 rounded text-sm transition-colors mt-auto">
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-5">
              <h2 className="font-bold text-white mb-3">📝 Daily Notes</h2>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="What did you accomplish today? Goals for tomorrow?"
                rows={3}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
              <button onClick={handleAddNote}
                className="mt-2 w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 py-2 rounded-lg text-sm font-medium transition-colors">
                Save Note
              </button>
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {selectedChar.notes?.map(n => (
                  <div key={n.id} className="bg-gray-950 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 mb-1">{new Date(n.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-300">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
