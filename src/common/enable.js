let enabled = false;

export function isReadlightEnabled() {
  enabled = true;
}

export function setReadLightStatus(newStatus) {
  enabled = !!newStatus;
}

let tagAdded = false;

export function isTagAdded() {
  return tagAdded;
}

export function addedTag(newStatus) {
  tagAdded = true;
}
