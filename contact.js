(() => {
  const user = [109, 117, 100, 114, 111, 108, 106, 117, 98].map(String.fromCharCode).join('');
  const host = [103, 109, 97, 105, 108, 46, 99, 111, 109].map(String.fromCharCode).join('');
  const address = `${user}@${host}`;
  const target = document.querySelector('[data-email-link]');
  if (target) {
    target.href = `mailto:${address}`;
    target.textContent = address;
  }
})();
