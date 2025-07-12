function getDefaultRoute(role) {
  switch (role) {
    case "admin":
      return "/adminhome";
    case "hr":
      return "/hrhome";
    case "trainer":
      return "/trainerhome";
    case "interviewer":
      return "/interviewerdashboard";
    case "screening_manager":
      return "/screeinghome";
    case "direct_hiring":
      return "/directhiring";
    case "market_manager":
      return "/markethome";
    default:
      return "/";
  }
}

export default getDefaultRoute;