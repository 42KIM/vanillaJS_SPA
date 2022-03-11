const pushState = (nextPath) => {
  history.pushState(null, null, nextPath);

  const urlChangeEvent = new CustomEvent('urlChange');

  window.dispatchEvent(urlChangeEvent);
};

export { pushState };
