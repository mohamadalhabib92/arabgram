type Target = { id: number; press: () => void };
type Listener = (id: number | null) => void;

let seq = 1;
const targets: Target[] = [];
let cursor = -1;
const listeners = new Set<Listener>();
const searches: Array<() => void> = [];

function currentId(): number | null {
  return targets[cursor]?.id ?? null;
}

function emit() {
  const id = currentId();
  for (const listener of listeners) listener(id);
}

export function bindKeyTarget(press: () => void, onFocus: (focused: boolean) => void): () => void {
  const id = seq++;
  targets.push({ id, press });
  const listener: Listener = (active) => onFocus(active === id);
  listeners.add(listener);
  listener(currentId());
  return () => {
    listeners.delete(listener);
    const index = targets.findIndex((item) => item.id === id);
    if (index >= 0) targets.splice(index, 1);
    if (cursor >= targets.length) cursor = targets.length - 1;
    emit();
  };
}

export function moveKeyTarget(step: number) {
  if (!targets.length) return;
  if (cursor < 0) cursor = step > 0 ? 0 : targets.length - 1;
  else cursor = (cursor + step + targets.length) % targets.length;
  emit();
}

export function activateKeyTarget() {
  if (cursor < 0) return;
  targets[cursor]?.press();
}

export function registerSearch(focus: () => void): () => void {
  searches.push(focus);
  return () => {
    const index = searches.indexOf(focus);
    if (index >= 0) searches.splice(index, 1);
  };
}

export function focusSearch() {
  searches[searches.length - 1]?.();
}

export function hasSearch(): boolean {
  return searches.length > 0;
}

export function resetKeyTargets() {
  targets.length = 0;
  cursor = -1;
  listeners.clear();
  searches.length = 0;
  seq = 1;
}
