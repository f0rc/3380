export const getRole = (role: number) => {
  switch (role) {
    case 1:
      return "Clerk";
    case 2:
      return "Driver";
    case 3:
      return "Manager";
    case 4:
      return "Admin";
    default:
      return "Unknown";
  }
};
