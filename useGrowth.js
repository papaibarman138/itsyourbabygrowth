// Growth prediction utilities based on WHO/CDC reference data
// Includes WHO percentile bands (3rd, 15th, 50th, 85th, 97th) and short-term forecasting

// ── WHO Height Data with Percentile Bands ──
const WHO_HEIGHT_BOYS = [
  { age: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
  { age: 0.25, p3: 57.6, p15: 59.5, p50: 61.4, p85: 63.3, p97: 65.2 },
  { age: 0.5, p3: 63.8, p15: 65.7, p50: 67.6, p85: 69.5, p97: 71.4 },
  { age: 1, p3: 71.8, p15: 73.7, p50: 75.7, p85: 77.7, p97: 79.6 },
  { age: 1.5, p3: 78.4, p15: 80.3, p50: 82.3, p85: 84.3, p97: 86.2 },
  { age: 2, p3: 83.8, p15: 85.8, p50: 87.8, p85: 89.8, p97: 91.8 },
  { age: 3, p3: 91.9, p15: 94.0, p50: 96.1, p85: 98.2, p97: 100.3 },
  { age: 4, p3: 99.1, p15: 101.2, p50: 103.3, p85: 105.4, p97: 107.5 },
  { age: 5, p3: 105.3, p15: 107.7, p50: 110.0, p85: 112.3, p97: 114.7 },
  { age: 6, p3: 111.2, p15: 113.6, p50: 116.0, p85: 118.4, p97: 120.8 },
  { age: 7, p3: 116.6, p15: 119.2, p50: 121.7, p85: 124.2, p97: 126.8 },
  { age: 8, p3: 121.9, p15: 124.6, p50: 127.3, p85: 130.0, p97: 132.7 },
  { age: 9, p3: 127.0, p15: 129.8, p50: 132.6, p85: 135.4, p97: 138.2 },
  { age: 10, p3: 131.8, p15: 134.8, p50: 137.8, p85: 140.8, p97: 143.8 },
  { age: 11, p3: 136.6, p15: 139.9, p50: 143.1, p85: 146.3, p97: 149.6 },
  { age: 12, p3: 142.0, p15: 145.5, p50: 149.1, p85: 152.7, p97: 156.2 },
  { age: 13, p3: 148.2, p15: 152.1, p50: 156.0, p85: 159.9, p97: 163.8 },
  { age: 14, p3: 155.0, p15: 159.1, p50: 163.2, p85: 167.3, p97: 171.4 },
  { age: 15, p3: 160.4, p15: 164.7, p50: 169.0, p85: 173.3, p97: 177.6 },
  { age: 16, p3: 164.6, p15: 169.0, p50: 173.4, p85: 177.8, p97: 182.2 },
  { age: 17, p3: 166.4, p15: 170.8, p50: 175.2, p85: 179.6, p97: 184.0 },
  { age: 18, p3: 167.3, p15: 171.7, p50: 176.1, p85: 180.5, p97: 184.9 },
]

const WHO_HEIGHT_GIRLS = [
  { age: 0, p3: 45.4, p15: 47.3, p50: 49.1, p85: 50.9, p97: 52.8 },
  { age: 0.25, p3: 56.1, p15: 57.9, p50: 59.8, p85: 61.7, p97: 63.5 },
  { age: 0.5, p3: 61.8, p15: 63.8, p50: 65.7, p85: 67.6, p97: 69.6 },
  { age: 1, p3: 70.0, p15: 72.0, p50: 74.0, p85: 76.0, p97: 78.0 },
  { age: 1.5, p3: 76.7, p15: 78.7, p50: 80.7, p85: 82.7, p97: 84.7 },
  { age: 2, p3: 82.2, p15: 84.3, p50: 86.4, p85: 88.5, p97: 90.6 },
  { age: 3, p3: 90.7, p15: 92.9, p50: 95.1, p85: 97.3, p97: 99.5 },
  { age: 4, p3: 98.1, p15: 100.4, p50: 102.7, p85: 105.0, p97: 107.3 },
  { age: 5, p3: 104.7, p15: 107.0, p50: 109.4, p85: 111.8, p97: 114.1 },
  { age: 6, p3: 110.4, p15: 113.0, p50: 115.5, p85: 118.0, p97: 120.6 },
  { age: 7, p3: 115.7, p15: 118.4, p50: 121.1, p85: 123.8, p97: 126.5 },
  { age: 8, p3: 121.0, p15: 123.8, p50: 126.6, p85: 129.4, p97: 132.2 },
  { age: 9, p3: 126.4, p15: 129.3, p50: 132.2, p85: 135.1, p97: 138.0 },
  { age: 10, p3: 132.0, p15: 135.1, p50: 138.3, p85: 141.5, p97: 144.6 },
  { age: 11, p3: 137.5, p15: 140.8, p50: 144.0, p85: 147.2, p97: 150.5 },
  { age: 12, p3: 142.8, p15: 146.3, p50: 149.8, p85: 153.3, p97: 156.8 },
  { age: 13, p3: 146.3, p15: 150.0, p50: 153.7, p85: 157.4, p97: 161.1 },
  { age: 14, p3: 149.1, p15: 152.7, p50: 156.4, p85: 160.1, p97: 163.7 },
  { age: 15, p3: 150.8, p15: 154.4, p50: 158.1, p85: 161.8, p97: 165.4 },
  { age: 16, p3: 151.6, p15: 155.3, p50: 159.0, p85: 162.7, p97: 166.4 },
  { age: 17, p3: 152.3, p15: 156.0, p50: 159.7, p85: 163.4, p97: 167.1 },
  { age: 18, p3: 152.6, p15: 156.3, p50: 160.0, p85: 163.7, p97: 167.4 },
]

const WHO_WEIGHT_BOYS = [
  { age: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { age: 0.25, p3: 4.7, p15: 5.3, p50: 6.0, p85: 6.9, p97: 7.6 },
  { age: 0.5, p3: 6.2, p15: 7.0, p50: 7.9, p85: 8.9, p97: 9.7 },
  { age: 1, p3: 7.8, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
  { age: 1.5, p3: 8.9, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.3 },
  { age: 2, p3: 9.8, p15: 10.8, p50: 12.2, p85: 13.6, p97: 14.8 },
  { age: 3, p3: 11.3, p15: 12.6, p50: 14.3, p85: 16.2, p97: 17.7 },
  { age: 4, p3: 12.7, p15: 14.3, p50: 16.3, p85: 18.5, p97: 20.3 },
  { age: 5, p3: 14.1, p15: 15.9, p50: 18.3, p85: 21.0, p97: 23.4 },
  { age: 6, p3: 15.7, p15: 17.7, p50: 20.5, p85: 23.7, p97: 26.7 },
  { age: 7, p3: 17.4, p15: 19.7, p50: 22.9, p85: 26.8, p97: 30.5 },
  { age: 8, p3: 19.3, p15: 22.0, p50: 25.6, p85: 30.3, p97: 34.7 },
  { age: 9, p3: 21.3, p15: 24.4, p50: 28.6, p85: 34.0, p97: 39.4 },
  { age: 10, p3: 23.5, p15: 27.1, p50: 31.9, p85: 38.2, p97: 44.6 },
  { age: 11, p3: 26.0, p15: 30.1, p50: 35.6, p85: 42.8, p97: 50.0 },
  { age: 12, p3: 29.0, p15: 33.6, p50: 39.9, p85: 47.9, p97: 56.0 },
  { age: 13, p3: 32.6, p15: 37.8, p50: 45.3, p85: 53.3, p97: 61.6 },
  { age: 14, p3: 36.8, p15: 42.6, p50: 50.8, p85: 58.6, p97: 66.2 },
  { age: 15, p3: 41.0, p15: 47.2, p50: 56.0, p85: 63.3, p97: 70.0 },
  { age: 16, p3: 44.8, p15: 51.4, p50: 60.8, p85: 67.5, p97: 73.4 },
  { age: 17, p3: 47.4, p15: 54.4, p50: 64.4, p85: 70.5, p97: 76.0 },
  { age: 18, p3: 49.3, p15: 56.7, p50: 67.0, p85: 73.0, p97: 78.2 },
]

const WHO_WEIGHT_GIRLS = [
  { age: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { age: 0.25, p3: 4.2, p15: 4.7, p50: 5.4, p85: 6.2, p97: 6.8 },
  { age: 0.5, p3: 5.7, p15: 6.4, p50: 7.3, p85: 8.3, p97: 9.1 },
  { age: 1, p3: 7.0, p15: 7.8, p50: 8.9, p85: 10.2, p97: 11.2 },
  { age: 1.5, p3: 8.1, p15: 9.0, p50: 10.2, p85: 11.6, p97: 12.8 },
  { age: 2, p3: 9.0, p15: 10.1, p50: 11.5, p85: 13.1, p97: 14.4 },
  { age: 3, p3: 10.8, p15: 12.2, p50: 13.9, p85: 15.8, p97: 17.4 },
  { age: 4, p3: 12.3, p15: 14.0, p50: 16.1, p85: 18.5, p97: 20.5 },
  { age: 5, p3: 13.7, p15: 15.7, p50: 18.2, p85: 21.2, p97: 23.7 },
  { age: 6, p3: 15.3, p15: 17.5, p50: 20.2, p85: 23.5, p97: 27.1 },
  { age: 7, p3: 17.0, p15: 19.5, p50: 22.4, p85: 26.3, p97: 30.5 },
  { age: 8, p3: 19.0, p15: 21.7, p50: 25.0, p85: 29.7, p97: 34.7 },
  { age: 9, p3: 21.2, p15: 24.3, p50: 28.2, p85: 33.6, p97: 39.5 },
  { age: 10, p3: 23.9, p15: 27.3, p50: 31.9, p85: 38.2, p97: 45.0 },
  { age: 11, p3: 27.2, p15: 31.2, p50: 36.9, p85: 43.8, p97: 51.3 },
  { age: 12, p3: 30.5, p15: 35.2, p50: 41.5, p85: 49.0, p97: 57.0 },
  { age: 13, p3: 33.6, p15: 38.7, p50: 45.8, p85: 53.2, p97: 61.5 },
  { age: 14, p3: 36.3, p15: 41.6, p50: 49.4, p85: 56.5, p97: 64.5 },
  { age: 15, p3: 38.2, p15: 43.8, p50: 52.1, p85: 58.8, p97: 66.5 },
  { age: 16, p3: 39.2, p15: 44.9, p50: 53.5, p85: 60.3, p97: 67.7 },
  { age: 17, p3: 39.7, p15: 45.4, p50: 54.4, p85: 61.2, p97: 68.5 },
  { age: 18, p3: 40.0, p15: 45.7, p50: 55.0, p85: 61.8, p97: 69.0 },
]

// ── WHO BMI-for-Age LMS Reference Data ──
// L (skewness), M (median), S (coefficient of variation)
// Source: WHO Child Growth Standards (0-5y) + WHO Reference (5-19y)
// Age in years

const BMI_LMS_BOYS = [
  { age: 0, L: 0.3487, M: 13.4, S: 0.0926 },
  { age: 0.25, L: -0.0107, M: 17.2, S: 0.0830 },
  { age: 0.5, L: -0.2318, M: 17.3, S: 0.0827 },
  { age: 1, L: -0.3053, M: 17.2, S: 0.0830 },
  { age: 1.5, L: -0.1517, M: 16.7, S: 0.0816 },
  { age: 2, L: -0.0633, M: 16.4, S: 0.0820 },
  { age: 2.5, L: 0.0019, M: 16.1, S: 0.0816 },
  { age: 3, L: -0.0272, M: 15.9, S: 0.0813 },
  { age: 3.5, L: -0.1013, M: 15.7, S: 0.0815 },
  { age: 4, L: -0.1889, M: 15.5, S: 0.0823 },
  { age: 4.5, L: -0.2749, M: 15.4, S: 0.0835 },
  { age: 5, L: -0.3540, M: 15.3, S: 0.0852 },
  { age: 5.5, L: -0.4570, M: 15.3, S: 0.0870 },
  { age: 6, L: -0.5700, M: 15.3, S: 0.0890 },
  { age: 6.5, L: -0.7000, M: 15.4, S: 0.0914 },
  { age: 7, L: -0.8400, M: 15.5, S: 0.0941 },
  { age: 7.5, L: -0.9900, M: 15.6, S: 0.0970 },
  { age: 8, L: -1.1400, M: 15.7, S: 0.1001 },
  { age: 8.5, L: -1.2900, M: 15.9, S: 0.1034 },
  { age: 9, L: -1.4300, M: 16.0, S: 0.1068 },
  { age: 9.5, L: -1.5600, M: 16.2, S: 0.1103 },
  { age: 10, L: -1.6800, M: 16.4, S: 0.1138 },
  { age: 10.5, L: -1.7700, M: 16.7, S: 0.1170 },
  { age: 11, L: -1.8500, M: 17.0, S: 0.1199 },
  { age: 11.5, L: -1.9100, M: 17.3, S: 0.1224 },
  { age: 12, L: -1.9600, M: 17.6, S: 0.1245 },
  { age: 12.5, L: -2.0000, M: 17.9, S: 0.1262 },
  { age: 13, L: -2.0300, M: 18.2, S: 0.1275 },
  { age: 13.5, L: -2.0500, M: 18.6, S: 0.1284 },
  { age: 14, L: -2.0600, M: 19.0, S: 0.1290 },
  { age: 14.5, L: -2.0600, M: 19.4, S: 0.1292 },
  { age: 15, L: -2.0500, M: 19.8, S: 0.1291 },
  { age: 15.5, L: -2.0300, M: 20.2, S: 0.1287 },
  { age: 16, L: -2.0100, M: 20.5, S: 0.1280 },
  { age: 16.5, L: -1.9800, M: 20.9, S: 0.1271 },
  { age: 17, L: -1.9500, M: 21.2, S: 0.1260 },
  { age: 17.5, L: -1.9200, M: 21.6, S: 0.1249 },
  { age: 18, L: -1.8900, M: 21.9, S: 0.1237 },
  { age: 19, L: -1.8300, M: 22.4, S: 0.1214 },
]

const BMI_LMS_GIRLS = [
  { age: 0, L: 0.3809, M: 13.3, S: 0.0935 },
  { age: 0.25, L: 0.1714, M: 16.7, S: 0.0852 },
  { age: 0.5, L: 0.0073, M: 16.8, S: 0.0881 },
  { age: 1, L: -0.0384, M: 16.7, S: 0.0893 },
  { age: 1.5, L: 0.0871, M: 16.2, S: 0.0883 },
  { age: 2, L: 0.1396, M: 15.9, S: 0.0888 },
  { age: 2.5, L: 0.1498, M: 15.7, S: 0.0893 },
  { age: 3, L: 0.1225, M: 15.5, S: 0.0890 },
  { age: 3.5, L: 0.0535, M: 15.4, S: 0.0888 },
  { age: 4, L: -0.0496, M: 15.3, S: 0.0891 },
  { age: 4.5, L: -0.1724, M: 15.2, S: 0.0900 },
  { age: 5, L: -0.3030, M: 15.2, S: 0.0916 },
  { age: 5.5, L: -0.4500, M: 15.2, S: 0.0938 },
  { age: 6, L: -0.6100, M: 15.3, S: 0.0966 },
  { age: 6.5, L: -0.7800, M: 15.4, S: 0.0999 },
  { age: 7, L: -0.9500, M: 15.5, S: 0.1036 },
  { age: 7.5, L: -1.1300, M: 15.7, S: 0.1076 },
  { age: 8, L: -1.3000, M: 15.9, S: 0.1119 },
  { age: 8.5, L: -1.4600, M: 16.1, S: 0.1162 },
  { age: 9, L: -1.6100, M: 16.3, S: 0.1206 },
  { age: 9.5, L: -1.7400, M: 16.6, S: 0.1248 },
  { age: 10, L: -1.8500, M: 16.9, S: 0.1287 },
  { age: 10.5, L: -1.9200, M: 17.2, S: 0.1318 },
  { age: 11, L: -1.9700, M: 17.5, S: 0.1342 },
  { age: 11.5, L: -2.0000, M: 17.9, S: 0.1358 },
  { age: 12, L: -2.0200, M: 18.3, S: 0.1367 },
  { age: 12.5, L: -2.0300, M: 18.7, S: 0.1370 },
  { age: 13, L: -2.0300, M: 19.1, S: 0.1367 },
  { age: 13.5, L: -2.0200, M: 19.5, S: 0.1359 },
  { age: 14, L: -2.0100, M: 19.8, S: 0.1346 },
  { age: 14.5, L: -1.9900, M: 20.1, S: 0.1330 },
  { age: 15, L: -1.9700, M: 20.4, S: 0.1312 },
  { age: 15.5, L: -1.9500, M: 20.6, S: 0.1294 },
  { age: 16, L: -1.9300, M: 20.8, S: 0.1275 },
  { age: 16.5, L: -1.9100, M: 21.0, S: 0.1258 },
  { age: 17, L: -1.8900, M: 21.2, S: 0.1243 },
  { age: 17.5, L: -1.8700, M: 21.4, S: 0.1229 },
  { age: 18, L: -1.8500, M: 21.5, S: 0.1218 },
  { age: 19, L: -1.8100, M: 21.8, S: 0.1199 },
]

// Compute BMI-for-Age z-score using WHO LMS method: z = ((BMI/M)^L - 1) / (L * S)
function getLMSValues(data, age) {
  if (age <= data[0].age) return data[0]
  if (age >= data[data.length - 1].age) return data[data.length - 1]
  for (let i = 0; i < data.length - 1; i++) {
    if (age >= data[i].age && age <= data[i + 1].age) {
      const ratio = (age - data[i].age) / (data[i + 1].age - data[i].age)
      return {
        L: data[i].L + ratio * (data[i + 1].L - data[i].L),
        M: data[i].M + ratio * (data[i + 1].M - data[i].M),
        S: data[i].S + ratio * (data[i + 1].S - data[i].S),
      }
    }
  }
  return data[data.length - 1]
}

function computeZScore(value, L, M, S) {
  if (L === 0) return Math.log(value / M) / S
  return (Math.pow(value / M, L) - 1) / (L * S)
}

function interpolate(data, age, field = 'p50') {
  if (age <= data[0].age) return data[0][field]
  if (age >= data[data.length - 1].age) return data[data.length - 1][field]
  for (let i = 0; i < data.length - 1; i++) {
    if (age >= data[i].age && age <= data[i + 1].age) {
      const ratio = (age - data[i].age) / (data[i + 1].age - data[i].age)
      return data[i][field] + ratio * (data[i + 1][field] - data[i][field])
    }
  }
  return data[data.length - 1][field]
}

// (interpolateBMI removed — replaced by LMS z-score method)

export function getAgeInYears(dob) {
  const birthDate = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) age--
  return age
}

export function getAgeDecimal(dob) {
  const birthDate = new Date(dob)
  const now = new Date()
  return (now - birthDate) / (365.25 * 24 * 60 * 60 * 1000)
}

export function getAgeDisplay(dob) {
  const birthDate = new Date(dob)
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()
  if (now.getDate() < birthDate.getDate()) months--
  if (months < 0) { years--; months += 12 }
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years}y ${months}m`
}

export function predictAdultHeight(gender, currentHeight, ageYears) {
  const heightData = gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
  const expectedNow = interpolate(heightData, ageYears)
  const adultExpected = heightData[heightData.length - 1].p50

  if (ageYears < 0.5 || !currentHeight) {
    return { low: Math.round(adultExpected - 8), high: Math.round(adultExpected + 8) }
  }

  const ratio = currentHeight / expectedNow
  const predicted = Math.round(adultExpected * ratio)
  return { low: predicted - 5, high: predicted + 5 }
}

export function predictHealthyWeight(gender, adultHeightRange) {
  const avgHeight = (adultHeightRange.low + adultHeightRange.high) / 2
  const heightM = avgHeight / 100
  const lowWeight = Math.round(18.5 * heightM * heightM)
  const highWeight = Math.round(24.9 * heightM * heightM)
  return { low: lowWeight, high: highWeight }
}

export function getCurrentBMI(height, weight) {
  if (!height || !weight) return null
  const heightM = height / 100
  return (weight / (heightM * heightM)).toFixed(1)
}

// WHO BMI-for-Age z-score classification using LMS method
// Categories:
//   z < -3: Severe thinness
//   z < -2: Thinness
//   -2 ≤ z ≤ +1: Normal
//   z > +1: Overweight
//   z > +2: Obese
export function getBMIStatus(bmi, age, gender) {
  if (!bmi || age < 0) return null
  const bmiVal = parseFloat(bmi)
  const lmsData = gender === 'boy' ? BMI_LMS_BOYS : BMI_LMS_GIRLS
  const { L, M, S } = getLMSValues(lmsData, age)
  const z = computeZScore(bmiVal, L, M, S)

  if (z < -3) return { label: 'Severe Thinness', color: 'text-red-600', z: z.toFixed(2), category: 'severe-thin' }
  if (z < -2) return { label: 'Thinness', color: 'text-orange-500', z: z.toFixed(2), category: 'thin' }
  if (z <= 1) return { label: 'Normal', color: 'text-emerald-500', z: z.toFixed(2), category: 'normal' }
  if (z <= 2) return { label: 'Overweight', color: 'text-amber-500', z: z.toFixed(2), category: 'overweight' }
  return { label: 'Obese', color: 'text-red-600', z: z.toFixed(2), category: 'obese' }
}

// Get WHO BMI-for-Age LMS values for a given age and gender (for charts/display)
export function getBMILMS(age, gender) {
  const lmsData = gender === 'boy' ? BMI_LMS_BOYS : BMI_LMS_GIRLS
  const { L, M, S } = getLMSValues(lmsData, age)
  // Calculate BMI cutoff values for each z-score threshold
  const zToValue = (z) => {
    if (L === 0) return M * Math.exp(S * z)
    return M * Math.pow(1 + L * S * z, 1 / L)
  }
  return {
    L, M, S,
    minus3: zToValue(-3),
    minus2: zToValue(-2),
    plus1: zToValue(1),
    plus2: zToValue(2),
  }
}

export function getHeightPercentile(gender, age, height) {
  const data = gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
  const expected = interpolate(data, age)
  const sd = expected * 0.06
  const z = (height - expected) / sd
  const percentile = Math.round(normalCDF(z) * 100)
  return Math.max(1, Math.min(99, percentile))
}

export function getWeightPercentile(gender, age, weight) {
  const data = gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS
  const expected = interpolate(data, age)
  const sd = expected * 0.12
  const z = (weight - expected) / sd
  const percentile = Math.round(normalCDF(z) * 100)
  return Math.max(1, Math.min(99, percentile))
}

export function getGrowthCurve(gender, type) {
  if (type === 'height') {
    return gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
  }
  return gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS
}

// ── Short-term Forecast (3m and 6m) ──
// Uses WHO velocity + child's current percentile offset to project forward

export function forecastShortTerm(gender, dob, currentHeight, currentWeight, measurements) {
  const ageYears = getAgeDecimal(dob)
  const heightData = gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
  const weightData = gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS

  const results = { height3m: null, height6m: null, weight3m: null, weight6m: null }

  if (currentHeight) {
    const expectedNow = interpolate(heightData, ageYears)
    const ratio = currentHeight / expectedNow

    // Compute velocity from measurements if available
    let velocity = null
    if (measurements && measurements.length >= 2) {
      const sorted = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date))
      const newest = sorted[sorted.length - 1]
      const oldest = sorted[0]
      if (newest.height && oldest.height) {
        const monthsDiff = (new Date(newest.date) - new Date(oldest.date)) / (30.44 * 24 * 60 * 60 * 1000)
        if (monthsDiff > 0.5) {
          velocity = (newest.height - oldest.height) / monthsDiff // cm per month
        }
      }
    }

    if (velocity && velocity > 0) {
      results.height3m = Math.round((currentHeight + velocity * 3) * 10) / 10
      results.height6m = Math.round((currentHeight + velocity * 6) * 10) / 10
    } else {
      // Use WHO curve projected forward
      const expected3m = interpolate(heightData, ageYears + 0.25)
      const expected6m = interpolate(heightData, ageYears + 0.5)
      results.height3m = Math.round(expected3m * ratio * 10) / 10
      results.height6m = Math.round(expected6m * ratio * 10) / 10
    }
  }

  if (currentWeight) {
    const expectedNow = interpolate(weightData, ageYears)
    const ratio = currentWeight / expectedNow

    let velocity = null
    if (measurements && measurements.length >= 2) {
      const sorted = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date))
      const newest = sorted[sorted.length - 1]
      const oldest = sorted[0]
      if (newest.weight && oldest.weight) {
        const monthsDiff = (new Date(newest.date) - new Date(oldest.date)) / (30.44 * 24 * 60 * 60 * 1000)
        if (monthsDiff > 0.5) {
          velocity = (newest.weight - oldest.weight) / monthsDiff
        }
      }
    }

    if (velocity && velocity > 0) {
      results.weight3m = Math.round((currentWeight + velocity * 3) * 10) / 10
      results.weight6m = Math.round((currentWeight + velocity * 6) * 10) / 10
    } else {
      const expected3m = interpolate(weightData, ageYears + 0.25)
      const expected6m = interpolate(weightData, ageYears + 0.5)
      results.weight3m = Math.round(expected3m * ratio * 10) / 10
      results.weight6m = Math.round(expected6m * ratio * 10) / 10
    }
  }

  return results
}

// Get WHO percentile band values for a specific age/gender
export function getWHOBands(gender, type, age) {
  const data = type === 'height'
    ? (gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS)
    : (gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS)
  return {
    p3: interpolate(data, age, 'p3'),
    p15: interpolate(data, age, 'p15'),
    p50: interpolate(data, age, 'p50'),
    p85: interpolate(data, age, 'p85'),
    p97: interpolate(data, age, 'p97'),
  }
}

// ── WHO Height-for-Age LMS Data (HAZ — for stunting) ──
// Source: WHO Child Growth Standards (0-5y) + WHO Reference (5-19y)
const HAZ_LMS_BOYS = [
  { age: 0, L: 1, M: 49.88, S: 0.03795 },
  { age: 0.25, L: 1, M: 61.42, S: 0.03328 },
  { age: 0.5, L: 1, M: 67.62, S: 0.03169 },
  { age: 1, L: 1, M: 75.75, S: 0.03003 },
  { age: 1.5, L: 1, M: 82.29, S: 0.02924 },
  { age: 2, L: 1, M: 87.81, S: 0.02880 },
  { age: 3, L: 1, M: 96.10, S: 0.02840 },
  { age: 4, L: 1, M: 103.30, S: 0.02810 },
  { age: 5, L: 1, M: 110.00, S: 0.02790 },
  { age: 6, L: 1, M: 116.00, S: 0.02770 },
  { age: 7, L: 1, M: 121.70, S: 0.02760 },
  { age: 8, L: 1, M: 127.30, S: 0.02770 },
  { age: 9, L: 1, M: 132.60, S: 0.02790 },
  { age: 10, L: 1, M: 137.80, S: 0.02830 },
  { age: 11, L: 1, M: 143.10, S: 0.02880 },
  { age: 12, L: 1, M: 149.10, S: 0.02940 },
  { age: 13, L: 1, M: 156.00, S: 0.02970 },
  { age: 14, L: 1, M: 163.20, S: 0.02950 },
  { age: 15, L: 1, M: 169.00, S: 0.02880 },
  { age: 16, L: 1, M: 173.40, S: 0.02790 },
  { age: 17, L: 1, M: 175.20, S: 0.02730 },
  { age: 18, L: 1, M: 176.10, S: 0.02700 },
  { age: 19, L: 1, M: 176.50, S: 0.02690 },
]

const HAZ_LMS_GIRLS = [
  { age: 0, L: 1, M: 49.15, S: 0.03790 },
  { age: 0.25, L: 1, M: 59.80, S: 0.03432 },
  { age: 0.5, L: 1, M: 65.73, S: 0.03280 },
  { age: 1, L: 1, M: 74.00, S: 0.03110 },
  { age: 1.5, L: 1, M: 80.70, S: 0.03010 },
  { age: 2, L: 1, M: 86.40, S: 0.02960 },
  { age: 3, L: 1, M: 95.10, S: 0.02900 },
  { age: 4, L: 1, M: 102.70, S: 0.02860 },
  { age: 5, L: 1, M: 109.40, S: 0.02840 },
  { age: 6, L: 1, M: 115.50, S: 0.02830 },
  { age: 7, L: 1, M: 121.10, S: 0.02830 },
  { age: 8, L: 1, M: 126.60, S: 0.02850 },
  { age: 9, L: 1, M: 132.20, S: 0.02870 },
  { age: 10, L: 1, M: 138.30, S: 0.02900 },
  { age: 11, L: 1, M: 144.00, S: 0.02900 },
  { age: 12, L: 1, M: 149.80, S: 0.02870 },
  { age: 13, L: 1, M: 153.70, S: 0.02830 },
  { age: 14, L: 1, M: 156.40, S: 0.02790 },
  { age: 15, L: 1, M: 158.10, S: 0.02760 },
  { age: 16, L: 1, M: 159.00, S: 0.02750 },
  { age: 17, L: 1, M: 159.70, S: 0.02740 },
  { age: 18, L: 1, M: 160.00, S: 0.02730 },
  { age: 19, L: 1, M: 160.10, S: 0.02720 },
]

// ── WHO Weight-for-Age LMS Data (WAZ — for underweight, 0-10y) ──
const WAZ_LMS_BOYS = [
  { age: 0, L: 0.3487, M: 3.35, S: 0.1469 },
  { age: 0.25, L: 0.2297, M: 6.00, S: 0.1233 },
  { age: 0.5, L: 0.1579, M: 7.93, S: 0.1178 },
  { age: 1, L: 0.0057, M: 9.65, S: 0.1138 },
  { age: 1.5, L: -0.0820, M: 10.91, S: 0.1113 },
  { age: 2, L: -0.1398, M: 12.23, S: 0.1110 },
  { age: 3, L: -0.2108, M: 14.34, S: 0.1138 },
  { age: 4, L: -0.2476, M: 16.34, S: 0.1187 },
  { age: 5, L: -0.2630, M: 18.34, S: 0.1248 },
  { age: 6, L: -0.2598, M: 20.50, S: 0.1316 },
  { age: 7, L: -0.2398, M: 22.90, S: 0.1389 },
  { age: 8, L: -0.2055, M: 25.60, S: 0.1464 },
  { age: 9, L: -0.1597, M: 28.60, S: 0.1540 },
  { age: 10, L: -0.1046, M: 31.90, S: 0.1613 },
]

const WAZ_LMS_GIRLS = [
  { age: 0, L: 0.3809, M: 3.23, S: 0.1425 },
  { age: 0.25, L: 0.2487, M: 5.40, S: 0.1261 },
  { age: 0.5, L: 0.1634, M: 7.30, S: 0.1236 },
  { age: 1, L: 0.0350, M: 8.95, S: 0.1198 },
  { age: 1.5, L: -0.0410, M: 10.20, S: 0.1176 },
  { age: 2, L: -0.0870, M: 11.50, S: 0.1177 },
  { age: 3, L: -0.1330, M: 13.90, S: 0.1216 },
  { age: 4, L: -0.1510, M: 16.10, S: 0.1277 },
  { age: 5, L: -0.1490, M: 18.20, S: 0.1350 },
  { age: 6, L: -0.1290, M: 20.20, S: 0.1432 },
  { age: 7, L: -0.0940, M: 22.40, S: 0.1521 },
  { age: 8, L: -0.0470, M: 25.00, S: 0.1613 },
  { age: 9, L: 0.0090, M: 28.20, S: 0.1701 },
  { age: 10, L: 0.0700, M: 31.90, S: 0.1779 },
]

// ── WHO Weight-for-Height LMS Data (WHZ — for wasting, children 45-120 cm) ──
const WHZ_LMS_BOYS = [
  { height: 45, L: 0.3487, M: 2.44, S: 0.0904 },
  { height: 50, L: 0.3050, M: 3.20, S: 0.0890 },
  { height: 55, L: 0.2100, M: 4.23, S: 0.0880 },
  { height: 60, L: 0.1400, M: 5.91, S: 0.0890 },
  { height: 65, L: 0.0800, M: 7.42, S: 0.0905 },
  { height: 70, L: 0.0200, M: 8.64, S: 0.0920 },
  { height: 75, L: -0.0400, M: 9.64, S: 0.0930 },
  { height: 80, L: -0.1100, M: 10.40, S: 0.0890 },
  { height: 85, L: -0.1800, M: 11.20, S: 0.0870 },
  { height: 90, L: -0.2500, M: 12.20, S: 0.0860 },
  { height: 95, L: -0.3200, M: 13.10, S: 0.0855 },
  { height: 100, L: -0.3900, M: 14.20, S: 0.0860 },
  { height: 105, L: -0.4600, M: 15.40, S: 0.0870 },
  { height: 110, L: -0.5300, M: 16.60, S: 0.0890 },
  { height: 120, L: -0.6700, M: 19.90, S: 0.0940 },
]

const WHZ_LMS_GIRLS = [
  { height: 45, L: 0.3809, M: 2.35, S: 0.0895 },
  { height: 50, L: 0.3200, M: 3.10, S: 0.0880 },
  { height: 55, L: 0.2200, M: 4.02, S: 0.0875 },
  { height: 60, L: 0.1400, M: 5.58, S: 0.0890 },
  { height: 65, L: 0.0700, M: 7.02, S: 0.0910 },
  { height: 70, L: 0.0000, M: 8.22, S: 0.0930 },
  { height: 75, L: -0.0600, M: 9.15, S: 0.0935 },
  { height: 80, L: -0.1200, M: 10.00, S: 0.0900 },
  { height: 85, L: -0.1800, M: 10.80, S: 0.0880 },
  { height: 90, L: -0.2500, M: 11.80, S: 0.0870 },
  { height: 95, L: -0.3200, M: 12.70, S: 0.0865 },
  { height: 100, L: -0.3800, M: 13.90, S: 0.0870 },
  { height: 105, L: -0.4500, M: 15.20, S: 0.0880 },
  { height: 110, L: -0.5200, M: 16.50, S: 0.0900 },
  { height: 120, L: -0.6500, M: 19.80, S: 0.0960 },
]

function interpolateWFH_LMS(data, height, field) {
  if (height <= data[0].height) return data[0][field]
  if (height >= data[data.length - 1].height) return data[data.length - 1][field]
  for (let i = 0; i < data.length - 1; i++) {
    if (height >= data[i].height && height <= data[i + 1].height) {
      const ratio = (height - data[i].height) / (data[i + 1].height - data[i].height)
      return data[i][field] + ratio * (data[i + 1][field] - data[i][field])
    }
  }
  return data[data.length - 1][field]
}

// ── Malnutrition Classification (WHO standards, under-five focus) ──

// 1. STUNTING — Height-for-Age Z-score (HAZ) using LMS
// ≥ -2: Normal (Not stunted)
// < -2 to ≥ -3: Moderately stunted
// < -3: Severely stunted
export function getStuntingStatus(gender, age, height) {
  if (!height || age < 0 || age > 19) return null
  const lmsData = gender === 'boy' ? HAZ_LMS_BOYS : HAZ_LMS_GIRLS
  const { L, M, S } = getLMSValues(lmsData, age)
  const z = computeZScore(height, L, M, S)

  if (z < -3) return { status: 'severe', label: 'Severely Stunted', z: z.toFixed(2), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  if (z < -2) return { status: 'moderate', label: 'Moderately Stunted', z: z.toFixed(2), color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { status: 'normal', label: 'Normal (Not Stunted)', z: z.toFixed(2), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
}

// 2. UNDERWEIGHT — Weight-for-Age Z-score (WAZ) using LMS
// ≥ -2: Normal (Not underweight)
// < -2 to ≥ -3: Moderately underweight
// < -3: Severely underweight
export function getUnderweightStatus(gender, age, weight) {
  if (!weight || age < 0 || age > 10) return null // WHO WAZ valid up to age 10
  const lmsData = gender === 'boy' ? WAZ_LMS_BOYS : WAZ_LMS_GIRLS
  const { L, M, S } = getLMSValues(lmsData, age)
  const z = computeZScore(weight, L, M, S)

  if (z < -3) return { status: 'severe', label: 'Severely Underweight', z: z.toFixed(2), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  if (z < -2) return { status: 'moderate', label: 'Moderately Underweight', z: z.toFixed(2), color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { status: 'normal', label: 'Normal (Not Underweight)', z: z.toFixed(2), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
}

// 3. WASTING — Weight-for-Height Z-score (WHZ) using LMS
// ≥ -2: Normal (Not wasted)
// < -2 to ≥ -3: Moderately wasted
// < -3: Severely wasted
// > +2: Overweight
// > +3: Obese
export function getWastingStatus(gender, height, weight) {
  if (!height || !weight) return null
  if (height < 45 || height > 120) return null // WHO WHZ valid range

  const data = gender === 'boy' ? WHZ_LMS_BOYS : WHZ_LMS_GIRLS
  const L = interpolateWFH_LMS(data, height, 'L')
  const M = interpolateWFH_LMS(data, height, 'M')
  const S = interpolateWFH_LMS(data, height, 'S')
  const z = computeZScore(weight, L, M, S)

  if (z > 3) return { status: 'obese', label: 'Obese', z: z.toFixed(2), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  if (z > 2) return { status: 'overweight', label: 'Overweight', z: z.toFixed(2), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  if (z < -3) return { status: 'severe', label: 'Severely Wasted', z: z.toFixed(2), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
  if (z < -2) return { status: 'moderate', label: 'Moderately Wasted', z: z.toFixed(2), color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { status: 'normal', label: 'Normal (Not Wasted)', z: z.toFixed(2), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
}

export function getNutritionSummary(gender, age, height, weight) {
  return {
    stunting: getStuntingStatus(gender, age, height),
    underweight: getUnderweightStatus(gender, age, weight),
    wasting: getWastingStatus(gender, height, weight),
  }
}

function normalCDF(z) {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741
  const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const sign = z < 0 ? -1 : 1
  z = Math.abs(z) / Math.sqrt(2)
  const t = 1.0 / (1.0 + p * z)
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z)
  return 0.5 * (1.0 + sign * y)
}
