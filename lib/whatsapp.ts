export const formatWhatsAppPhone = (phone?: string | null) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith("0")) {
    cleaned = `234${cleaned.slice(1)}`;
  }

  if (cleaned.startsWith("2340")) {
    cleaned = `234${cleaned.slice(4)}`;
  }

  if (cleaned.length === 10) {
    cleaned = `234${cleaned}`;
  }

  return cleaned.length >= 11 ? cleaned : "";
};

export const buildWhatsAppUrl = (phone?: string | null, message?: string) => {
  const formattedPhone = formatWhatsAppPhone(phone);
  if (!formattedPhone) return "";

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${formattedPhone}${query}`;
};
