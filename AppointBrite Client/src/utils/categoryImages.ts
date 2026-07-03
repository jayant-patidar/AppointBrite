export const getDefaultImageForCategory = (category?: string) => {
  const c = (category || '').toLowerCase();
  
  if (c.includes('salon') || c.includes('hair') || c.includes('barber') || c.includes('beauty')) {
    return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('restaurant') || c.includes('food') || c.includes('cafe') || c.includes('dining')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('clinic') || c.includes('health') || c.includes('medical') || c.includes('doctor')) {
    return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('dental') || c.includes('dentist')) {
    return 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('spa') || c.includes('massage')) {
    return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('fitness') || c.includes('gym') || c.includes('workout') || c.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
  }
  if (c.includes('auto') || c.includes('mechanic') || c.includes('car')) {
    return 'https://images.unsplash.com/photo-1486495146682-1c42b36b41fa?auto=format&fit=crop&w=800&q=80';
  }
  
  // Generic fallback for any other business
  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';
};
