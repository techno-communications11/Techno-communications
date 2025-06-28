const getInitials = (name) => {
  if (!name) return 'N/A';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default getInitials;
