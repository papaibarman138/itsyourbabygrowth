const STORAGE_KEY = "baby_growth_children";

export const saveChild = async (child) => {
  const existing =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const newChild = {
    ...child,
    id: Date.now(),
  };

  existing.push(newChild);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing)
  );

  return newChild;
};

export const getChildren = async () => {
  return (
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  );
};

export const deleteChild = async (id) => {
  const existing =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const updated = existing.filter(
    (child) => child.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return true;
};

export const db = {
  saveChild,
  getChildren,
  deleteChild,
};
