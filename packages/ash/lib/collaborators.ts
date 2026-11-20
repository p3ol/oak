import type { Collaborator } from './types';

// Velvet is left out: it's the color of the local selection
const PALETTE = [
  'var(--junipero-grapefruit)',
  'var(--junipero-lime)',
  'var(--junipero-sunglow)',
  'var(--junipero-grapefruit-active)',
  'var(--junipero-lime-active)',
  'var(--junipero-sunglow-active)',
];

const hash = (value: string) =>
  [...value].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);

export const getCollaboratorColor = (collaborator: Collaborator) =>
  collaborator.color ||
  PALETTE[Math.abs(hash(String(collaborator.id))) % PALETTE.length];

export const getCollaboratorInitial = (collaborator: Collaborator) =>
  (collaborator.name || '?').trim().charAt(0).toUpperCase();

/** Collaborators selecting the given element */
export const getSelectingCollaborators = (
  collaborators: Collaborator[],
  id: string,
) => collaborators.filter(c => c.selectedId === id);
