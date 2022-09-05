function isDataToday(date: string) {
  const dateNow = new Date().toLocaleDateString();
  return (date === dateNow);
}
export default isDataToday;
