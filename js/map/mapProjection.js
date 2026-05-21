export const toMapPoint = ([latitude, longitude]) => [latitude + 90, longitude + 180];

export const getPinPosition = ([latitude, longitude]) => ({
  left: `${((longitude + 180) / 360) * 100}%`,
  top: `${((90 - latitude) / 180) * 100}%`
});
