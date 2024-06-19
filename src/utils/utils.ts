export const isMyBirthday = (birthday: Date): boolean => {
  const today = new Date();

  const todayDay = today.getDate();
  const todayMonth = today.getMonth(); // Months are zero-indexed (January = 0)

  // Get birthday date components (assuming birthday is a Date object)
  const birthdayDay = birthday.getDate();
  const birthdayMonth = birthday.getMonth();

  // Check if day and month match
  return todayDay === birthdayDay && todayMonth === birthdayMonth;
};
