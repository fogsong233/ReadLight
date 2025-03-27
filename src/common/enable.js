let enabled = false;

export function isReadlightEnabled() {
  return enabled;
}

export function setReadLightStatus(newStatus) {
  enabled = !!newStatus;
}

let tagAdded = false;

export function isTagAdded() {
  return tagAdded;
}

export function addedTag() {
  tagAdded = true;
}
