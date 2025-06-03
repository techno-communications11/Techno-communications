function SanitizePhoneNumber(phoneNumber)
{
    const sanitized = phoneNumber.replace(/[^\d]/g, "");
    const phoneWithoutCountryCode =
      sanitized.length > 10 ? sanitized.slice(-10) : sanitized;
    return phoneWithoutCountryCode.length === 10
      ? phoneWithoutCountryCode
      : "";
  }

  export default SanitizePhoneNumber;