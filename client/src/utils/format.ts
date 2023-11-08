export const formatDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split(", ");
  const timeArr = time.split(":");
  let hours = Number(timeArr[0]);
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = ((hours + 11) % 12) + 1;
  timeArr[0] = String(hours);
  timeArr.splice(-1);
  return `${[date, timeArr.join(":")].join(", ")} ${suffix}`;
};
