function slugify(text) {
    if (!text) return ''; // Evita erro se text for undefined
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }