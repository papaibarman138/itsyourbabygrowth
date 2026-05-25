




// Growth prediction utilities based on WHO/CDC reference data
// Includes WHO percentile bands (3rd, 15th, 50th, 85th, 97th) and short-term forecasting

// ── WHO Weight-for-Age Percentile Bands (BOYS) ──

const WHO_HEIGHT_BOYS = [
{ month:0,p3:46.3,p15:47.9,p50:49.9,p85:51.8,p97:53.4 },
{ month:1,p3:51.1,p15:52.7,p50:54.7,p85:56.7,p97:58.4 },
{ month:2,p3:54.7,p15:56.4,p50:58.4,p85:60.5,p97:62.2 },
{ month:3,p3:57.6,p15:59.3,p50:61.4,p85:63.5,p97:65.3 },
{ month:4,p3:60.0,p15:61.7,p50:63.9,p85:66.0,p97:67.8 },
{ month:5,p3:61.9,p15:63.7,p50:65.9,p85:68.1,p97:69.9 },
{ month:6,p3:63.6,p15:65.4,p50:67.6,p85:69.8,p97:71.6 },
{ month:7,p3:65.1,p15:66.9,p50:69.2,p85:71.4,p97:73.2 },
{ month:8,p3:66.5,p15:68.3,p50:70.6,p85:72.9,p97:74.7 },
{ month:9,p3:67.7,p15:69.6,p50:72.0,p85:74.3,p97:76.2 },
{ month:10,p3:69.0,p15:70.9,p50:73.3,p85:75.6,p97:77.6 },
{ month:11,p3:70.2,p15:72.1,p50:74.5,p85:77.0,p97:78.9 },
{ month:12,p3:71.3,p15:73.3,p50:75.7,p85:78.2,p97:80.2 },
{ month:13,p3:72.4,p15:74.4,p50:76.9,p85:79.4,p97:81.5 },
{ month:14,p3:73.4,p15:75.5,p50:78.0,p85:80.6,p97:82.7 },
{ month:15,p3:74.4,p15:76.5,p50:79.1,p85:81.8,p97:83.9 },
{ month:16,p3:75.4,p15:77.5,p50:80.2,p85:82.9,p97:85.1 },
{ month:17,p3:76.3,p15:78.5,p50:81.2,p85:84.0,p97:86.2 },
{ month:18,p3:77.2,p15:79.5,p50:82.3,p85:85.1,p97:87.3 },
{ month:19,p3:78.1,p15:80.4,p50:83.2,p85:86.1,p97:88.4 },
{ month:20,p3:78.9,p15:81.3,p50:84.2,p85:87.1,p97:89.5 },
{ month:21,p3:79.7,p15:82.2,p50:85.1,p85:88.1,p97:90.5 },
{ month:22,p3:80.5,p15:83.0,p50:86.0,p85:89.1,p97:91.6 },
{ month:23,p3:81.3,p15:83.8,p50:86.9,p85:90.0,p97:92.6 },
{ month:24,p3:81.4,p15:83.9,p50:87.1,p85:90.3,p97:92.9 },
{ month:25,p3:82.1,p15:84.7,p50:88.0,p85:91.2,p97:93.8 },
{ month:26,p3:82.8,p15:85.5,p50:88.8,p85:92.1,p97:94.8 },
{ month:27,p3:83.5,p15:86.3,p50:89.6,p85:93.0,p97:95.7 },
{ month:28,p3:84.2,p15:87.0,p50:90.4,p85:93.8,p97:96.6 },
{ month:29,p3:84.9,p15:87.7,p50:91.2,p85:94.7,p97:97.5 },
{ month:30,p3:85.5,p15:88.4,p50:91.9,p85:95.5,p97:98.3 },
{ month:31,p3:86.2,p15:89.1,p50:92.7,p85:96.2,p97:99.2 },
{ month:32,p3:86.8,p15:89.7,p50:93.4,p85:97.0,p97:100.0 },
{ month:33,p3:87.4,p15:90.4,p50:94.1,p85:97.8,p97:100.8 },
{ month:34,p3:88.0,p15:91.0,p50:94.8,p85:98.5,p97:101.5 },
{ month:35,p3:88.5,p15:91.6,p50:95.4,p85:99.2,p97:102.3 },
{ month:36,p3:89.1,p15:92.2,p50:96.1,p85:99.9,p97:103.1 },
{ month:37,p3:89.7,p15:92.8,p50:96.7,p85:100.6,p97:103.8 },
{ month:38,p3:90.2,p15:93.4,p50:97.4,p85:101.3,p97:104.5 },
{ month:39,p3:90.8,p15:94.0,p50:98.0,p85:102.0,p97:105.2 },
{ month:40,p3:91.3,p15:94.6,p50:98.6,p85:102.7,p97:105.9 },
{ month:41,p3:91.9,p15:95.2,p50:99.2,p85:103.3,p97:106.6 },
{ month:42,p3:92.4,p15:95.7,p50:99.9,p85:104.0,p97:107.3 },
{ month:43,p3:92.9,p15:96.3,p50:100.4,p85:104.6,p97:108.0 },
{ month:44,p3:93.4,p15:96.8,p50:101.0,p85:105.2,p97:108.6 },
{ month:45,p3:93.9,p15:97.4,p50:101.6,p85:105.8,p97:109.3 },
{ month:46,p3:94.4,p15:97.9,p50:102.2,p85:106.5,p97:109.9 },
{ month:47,p3:94.9,p15:98.5,p50:102.8,p85:107.1,p97:110.6 },
{ month:48,p3:95.4,p15:99.0,p50:103.3,p85:107.7,p97:111.2 },
{ month:49,p3:95.9,p15:99.5,p50:103.9,p85:108.3,p97:111.8 },
{ month:50,p3:96.4,p15:100.0,p50:104.4,p85:108.9,p97:112.5 },
{ month:51,p3:96.9,p15:100.5,p50:105.0,p85:109.5,p97:113.1 },
{ month:52,p3:97.4,p15:101.1,p50:105.6,p85:110.1,p97:113.7 },
{ month:53,p3:97.9,p15:101.6,p50:106.1,p85:110.7,p97:114.3 },
{ month:54,p3:98.4,p15:102.1,p50:106.7,p85:111.2,p97:115.0 },
{ month:55,p3:98.8,p15:102.6,p50:107.2,p85:111.8,p97:115.6 },
{ month:56,p3:99.3,p15:103.1,p50:107.8,p85:112.4,p97:116.2 },
{ month:57,p3:99.8,p15:103.6,p50:108.3,p85:113.0,p97:116.8 },
{ month:58,p3:100.3,p15:104.1,p50:108.9,p85:113.6,p97:117.4 },
{ month:59,p3:100.8,p15:104.7,p50:109.4,p85:114.2,p97:118.1 },
{ month:60,p3:101.2,p15:105.2,p50:109.9,p85:114.8,p97:118.7 }
]

// ── WHO Height-for-Age Percentile Bands (GIRLS) ──

const WHO_HEIGHT_GIRLS = [
{ month:0,p3:45.6,p15:47.2,p50:49.1,p85:51.1,p97:52.7 },
{ month:1,p3:50.0,p15:51.7,p50:53.7,p85:55.7,p97:57.4 },
{ month:2,p3:53.2,p15:55.0,p50:57.1,p85:59.2,p97:60.9 },
{ month:3,p3:55.8,p15:57.6,p50:59.8,p85:62.0,p97:63.8 },
{ month:4,p3:58.0,p15:59.8,p50:62.1,p85:64.3,p97:66.2 },
{ month:5,p3:59.9,p15:61.7,p50:64.0,p85:66.3,p97:68.2 },
{ month:6,p3:61.5,p15:63.4,p50:65.7,p85:68.1,p97:70.0 },
{ month:7,p3:62.9,p15:64.9,p50:67.3,p85:69.7,p97:71.6 },
{ month:8,p3:64.3,p15:66.3,p50:68.7,p85:71.2,p97:73.2 },
{ month:9,p3:65.6,p15:67.6,p50:70.1,p85:72.6,p97:74.7 },
{ month:10,p3:66.8,p15:68.9,p50:71.5,p85:74.0,p97:76.1 },
{ month:11,p3:68.0,p15:70.2,p50:72.8,p85:75.4,p97:77.5 },
{ month:12,p3:69.2,p15:71.3,p50:74.0,p85:76.7,p97:78.9 },
{ month:13,p3:70.3,p15:72.5,p50:75.2,p85:77.9,p97:80.2 },
{ month:14,p3:71.3,p15:73.6,p50:76.4,p85:79.2,p97:81.4 },
{ month:15,p3:72.4,p15:74.7,p50:77.5,p85:80.3,p97:82.7 },
{ month:16,p3:73.3,p15:75.7,p50:78.6,p85:81.5,p97:83.9 },
{ month:17,p3:74.3,p15:76.7,p50:79.7,p85:82.6,p97:85.0 },
{ month:18,p3:75.2,p15:77.7,p50:80.7,p85:83.7,p97:86.2 },
{ month:19,p3:76.2,p15:78.7,p50:81.7,p85:84.8,p97:87.3 },
{ month:20,p3:77.0,p15:79.6,p50:82.7,p85:85.8,p97:88.4 },
{ month:21,p3:77.9,p15:80.5,p50:83.7,p85:86.8,p97:89.4 },
{ month:22,p3:78.7,p15:81.4,p50:84.6,p85:87.8,p97:90.5 },
{ month:23,p3:79.6,p15:82.2,p50:85.5,p85:88.8,p97:91.5 },
{ month:24,p3:79.6,p15:82.4,p50:85.7,p85:89.1,p97:91.8 },
{ month:25,p3:80.4,p15:83.2,p50:86.6,p85:90.0,p97:92.8 },
{ month:26,p3:81.2,p15:84.0,p50:87.4,p85:90.9,p97:93.7 },
{ month:27,p3:81.9,p15:84.8,p50:88.3,p85:91.8,p97:94.6 },
{ month:28,p3:82.6,p15:85.5,p50:89.1,p85:92.7,p97:95.6 },
{ month:29,p3:83.4,p15:86.3,p50:89.9,p85:93.5,p97:96.4 },
{ month:30,p3:84.0,p15:87.0,p50:90.7,p85:94.3,p97:97.3 },
{ month:31,p3:84.7,p15:87.7,p50:91.4,p85:95.2,p97:98.2 },
{ month:32,p3:85.4,p15:88.4,p50:92.2,p85:95.9,p97:99.0 },
{ month:33,p3:86.0,p15:89.1,p50:92.9,p85:96.7,p97:99.8 },
{ month:34,p3:86.7,p15:89.8,p50:93.6,p85:97.5,p97:100.6 },
{ month:35,p3:87.3,p15:90.5,p50:94.4,p85:98.3,p97:101.4 },
{ month:36,p3:87.9,p15:91.1,p50:95.1,p85:99.0,p97:102.2 },
{ month:37,p3:88.5,p15:91.7,p50:95.7,p85:99.7,p97:103.0 },
{ month:38,p3:89.1,p15:92.4,p50:96.4,p85:100.5,p97:103.7 },
{ month:39,p3:89.7,p15:93.0,p50:97.1,p85:101.2,p97:104.5 },
{ month:40,p3:90.3,p15:93.6,p50:97.7,p85:101.9,p97:105.2 },
{ month:41,p3:90.8,p15:94.2,p50:98.4,p85:102.6,p97:106.0 },
{ month:42,p3:91.4,p15:94.8,p50:99.0,p85:103.3,p97:106.7 },
{ month:43,p3:92.0,p15:95.4,p50:99.7,p85:103.9,p97:107.4 },
{ month:44,p3:92.5,p15:96.0,p50:100.3,p85:104.6,p97:108.1 },
{ month:45,p3:93.0,p15:96.6,p50:100.9,p85:105.3,p97:108.8 },
{ month:46,p3:93.6,p15:97.2,p50:101.5,p85:105.9,p97:109.5 },
{ month:47,p3:94.1,p15:97.7,p50:102.1,p85:106.6,p97:110.2 },
{ month:48,p3:94.6,p15:98.3,p50:102.7,p85:107.2,p97:110.8 },
{ month:49,p3:95.1,p15:98.8,p50:103.3,p85:107.8,p97:111.5 },
{ month:50,p3:95.7,p15:99.4,p50:103.9,p85:108.4,p97:112.1 },
{ month:51,p3:96.2,p15:99.9,p50:104.5,p85:109.1,p97:112.8 },
{ month:52,p3:96.7,p15:100.4,p50:105.0,p85:109.7,p97:113.4 },
{ month:53,p3:97.2,p15:101.0,p50:105.6,p85:110.3,p97:114.1 },
{ month:54,p3:97.6,p15:101.5,p50:106.2,p85:110.9,p97:114.7 },
{ month:55,p3:98.1,p15:102.0,p50:106.7,p85:111.5,p97:115.3 },
{ month:56,p3:98.6,p15:102.5,p50:107.3,p85:112.1,p97:116.0 },
{ month:57,p3:99.1,p15:103.0,p50:107.8,p85:112.6,p97:116.6 },
{ month:58,p3:99.6,p15:103.5,p50:108.4,p85:113.2,p97:117.2 },
{ month:59,p3:100.0,p15:104.0,p50:108.9,p85:113.8,p97:117.8 },
{ month:60,p3:100.5,p15:105.2,p50:109.4,p85:114.5,p97:118.5 }
]

const WHO_WEIGHT_BOYS = [

  { month: 0,  p3: 2.5,  p15: 2.9,  p50: 3.3,  p85: 3.9,  p97: 4.3 },
  { month: 1,  p3: 3.4,  p15: 3.9,  p50: 4.5,  p85: 5.1,  p97: 5.7 },
  { month: 2,  p3: 4.4,  p15: 4.9,  p50: 5.6,  p85: 6.3,  p97: 7.0 },
  { month: 3,  p3: 5.1,  p15: 5.6,  p50: 6.4,  p85: 7.2,  p97: 7.9 },
  { month: 4,  p3: 5.6,  p15: 6.2,  p50: 7.0,  p85: 7.9,  p97: 8.6 },
  { month: 5,  p3: 6.1,  p15: 6.7,  p50: 7.5,  p85: 8.4,  p97: 9.2 },
  { month: 6,  p3: 6.4,  p15: 7.1,  p50: 7.9,  p85: 8.9,  p97: 9.7 },
  { month: 7,  p3: 6.7,  p15: 7.4,  p50: 8.3,  p85: 9.3,  p97: 10.2 },
  { month: 8,  p3: 7.0,  p15: 7.7,  p50: 8.6,  p85: 9.6,  p97: 10.5 },
  { month: 9,  p3: 7.2,  p15: 7.9,  p50: 8.9,  p85: 10.0, p97: 10.9 },
  { month: 10, p3: 7.5,  p15: 8.2,  p50: 9.2,  p85: 10.3, p97: 11.2 },
  { month: 11, p3: 7.7,  p15: 8.4,  p50: 9.4,  p85: 10.5, p97: 11.5 },
  { month: 12, p3: 7.8,  p15: 8.6,  p50: 9.6,  p85: 10.8, p97: 11.8 },
  { month: 13, p3: 8.0,  p15: 8.8,  p50: 9.9,  p85: 11.1, p97: 12.1 },
  { month: 14, p3: 8.2,  p15: 9.0,  p50: 10.1, p85: 11.3, p97: 12.4 },
  { month: 15, p3: 8.4,  p15: 9.2,  p50: 10.3, p85: 11.6, p97: 12.7 },
  { month: 16, p3: 8.5,  p15: 9.4,  p50: 10.5, p85: 11.8, p97: 12.9 },
  { month: 17, p3: 8.7,  p15: 9.6,  p50: 10.7, p85: 12.0, p97: 13.2 },
  { month: 18, p3: 8.9,  p15: 9.7,  p50: 10.9, p85: 12.3, p97: 13.5 },
  { month: 19, p3: 9.0,  p15: 9.9,  p50: 11.1, p85: 12.5, p97: 13.7 },
  { month: 20, p3: 9.2,  p15: 10.1, p50: 11.3, p85: 12.7, p97: 14.0 },
  { month: 21, p3: 9.3,  p15: 10.3, p50: 11.5, p85: 13.0, p97: 14.3 },
  { month: 22, p3: 9.5,  p15: 10.5, p50: 11.8, p85: 13.2, p97: 14.5 },
  { month: 23, p3: 9.7,  p15: 10.6, p50: 12.0, p85: 13.4, p97: 14.8 },
  { month: 24, p3: 9.8,  p15: 10.8, p50: 12.2, p85: 13.7, p97: 15.1 },
  { month: 25, p3: 10.0, p15: 11.0, p50: 12.4, p85: 13.9, p97: 15.3 },
  { month: 26, p3: 10.1, p15: 11.1, p50: 12.5, p85: 14.1, p97: 15.6 },
  { month: 27, p3: 10.2, p15: 11.3, p50: 12.7, p85: 14.4, p97: 15.9 },
  { month: 28, p3: 10.4, p15: 11.5, p50: 12.9, p85: 14.6, p97: 16.1 },
  { month: 29, p3: 10.5, p15: 11.6, p50: 13.1, p85: 14.8, p97: 16.4 },
  { month: 30, p3: 10.7, p15: 11.8, p50: 13.3, p85: 15.0, p97: 16.6 },
  { month: 31, p3: 10.8, p15: 11.9, p50: 13.5, p85: 15.2, p97: 16.9 },
  { month: 32, p3: 10.9, p15: 12.1, p50: 13.7, p85: 15.5, p97: 17.1 },
  { month: 33, p3: 11.1, p15: 12.2, p50: 13.8, p85: 15.7, p97: 17.3 },
  { month: 34, p3: 11.2, p15: 12.4, p50: 14.0, p85: 15.9, p97: 17.6 },
  { month: 35, p3: 11.3, p15: 12.5, p50: 14.2, p85: 16.1, p97: 17.8 },
  { month: 36, p3: 11.4, p15: 12.7, p50: 14.3, p85: 16.3, p97: 18.0 },
  { month: 37, p3: 11.6, p15: 12.8, p50: 14.5, p85: 16.5, p97: 18.3 },
  { month: 38, p3: 11.7, p15: 12.9, p50: 14.7, p85: 16.7, p97: 18.5 },
  { month: 39, p3: 11.8, p15: 13.1, p50: 14.8, p85: 16.9, p97: 18.7 },
  { month: 40, p3: 11.9, p15: 13.2, p50: 15.0, p85: 17.1, p97: 19.0 },
  { month: 41, p3: 12.1, p15: 13.4, p50: 15.2, p85: 17.3, p97: 19.2 },
  { month: 42, p3: 12.2, p15: 13.5, p50: 15.3, p85: 17.5, p97: 19.4 },
  { month: 43, p3: 12.3, p15: 13.6, p50: 15.5, p85: 17.7, p97: 19.7 },
  { month: 44, p3: 12.4, p15: 13.8, p50: 15.7, p85: 17.9, p97: 19.9 },
  { month: 45, p3: 12.5, p15: 13.9, p50: 15.8, p85: 18.1, p97: 20.1 },
  { month: 46, p3: 12.7, p15: 14.1, p50: 16.0, p85: 18.3, p97: 20.4 },
  { month: 47, p3: 12.8, p15: 14.2, p50: 16.2, p85: 18.5, p97: 20.6 },
  { month: 48, p3: 12.9, p15: 14.3, p50: 16.3, p85: 18.7, p97: 20.9 },
  { month: 49, p3: 13.0, p15: 14.5, p50: 16.5, p85: 18.9, p97: 21.1 },
  { month: 50, p3: 13.1, p15: 14.6, p50: 16.7, p85: 19.1, p97: 21.3 },
  { month: 51, p3: 13.3, p15: 14.7, p50: 16.8, p85: 19.3, p97: 21.6 },
  { month: 52, p3: 13.4, p15: 14.9, p50: 17.0, p85: 19.5, p97: 21.8 },
  { month: 53, p3: 13.5, p15: 15.0, p50: 17.2, p85: 19.7, p97: 22.1 },
  { month: 54, p3: 13.6, p15: 15.2, p50: 17.3, p85: 19.9, p97: 22.3 },
  { month: 55, p3: 13.7, p15: 15.3, p50: 17.5, p85: 20.1, p97: 22.5 },
  { month: 56, p3: 13.8, p15: 15.4, p50: 17.7, p85: 20.3, p97: 22.8 },
  { month: 57, p3: 13.9, p15: 15.6, p50: 17.8, p85: 20.5, p97: 23.0 },
  { month: 58, p3: 14.1, p15: 15.7, p50: 18.0, p85: 20.7, p97: 23.3 },
  { month: 59, p3: 14.2, p15: 15.8, p50: 18.2, p85: 20.9, p97: 23.5 },
  { month: 60, p3: 14.3, p15: 16.0, p50: 18.3, p85: 21.1, p97: 23.8 }

]
// ── WHO Weight-for-month Percentile Bands (GIRLS) ──

const WHO_WEIGHT_GIRLS = [

  { month: 0,  p3: 2.4,  p15: 2.8,  p50: 3.2,  p85: 3.7,  p97: 4.2 },
  { month: 1,  p3: 3.2,  p15: 3.6,  p50: 4.2,  p85: 4.8,  p97: 5.4 },
  { month: 2,  p3: 4.0,  p15: 4.5,  p50: 5.1,  p85: 5.9,  p97: 6.5 },
  { month: 3,  p3: 4.6,  p15: 5.1,  p50: 5.8,  p85: 6.7,  p97: 7.4 },
  { month: 4,  p3: 5.1,  p15: 5.6,  p50: 6.4,  p85: 7.3,  p97: 8.1 },
  { month: 5,  p3: 5.5,  p15: 6.1,  p50: 6.9,  p85: 7.8,  p97: 8.7 },
  { month: 6,  p3: 5.8,  p15: 6.4,  p50: 7.3,  p85: 8.3,  p97: 9.2 },
  { month: 7,  p3: 6.1,  p15: 6.7,  p50: 7.6,  p85: 8.7,  p97: 9.6 },
  { month: 8,  p3: 6.3,  p15: 7.0,  p50: 7.9,  p85: 9.0,  p97: 10.0 },
  { month: 9,  p3: 6.6,  p15: 7.3,  p50: 8.2,  p85: 9.3,  p97: 10.4 },
  { month: 10, p3: 6.8,  p15: 7.5,  p50: 8.5,  p85: 9.6,  p97: 10.7 },
  { month: 11, p3: 7.0,  p15: 7.7,  p50: 8.7,  p85: 9.9,  p97: 11.0 },
  { month: 12, p3: 7.1,  p15: 7.9,  p50: 8.9,  p85: 10.2, p97: 11.3 },
  { month: 13, p3: 7.3,  p15: 8.1,  p50: 9.2,  p85: 10.4, p97: 11.6 },
  { month: 14, p3: 7.5,  p15: 8.3,  p50: 9.4,  p85: 10.7, p97: 11.9 },
  { month: 15, p3: 7.7,  p15: 8.5,  p50: 9.6,  p85: 10.9, p97: 12.2 },
  { month: 16, p3: 7.8,  p15: 8.7,  p50: 9.8,  p85: 11.2, p97: 12.5 },
  { month: 17, p3: 8.0,  p15: 8.8,  p50: 10.0, p85: 11.4, p97: 12.7 },
  { month: 18, p3: 8.2,  p15: 9.0,  p50: 10.2, p85: 11.6, p97: 13.0 },
  { month: 19, p3: 8.3,  p15: 9.2,  p50: 10.4, p85: 11.9, p97: 13.3 },
  { month: 20, p3: 8.5,  p15: 9.4,  p50: 10.6, p85: 12.1, p97: 13.5 },
  { month: 21, p3: 8.7,  p15: 9.6,  p50: 10.9, p85: 12.4, p97: 13.8 },
  { month: 22, p3: 8.8,  p15: 9.8,  p50: 11.1, p85: 12.6, p97: 14.1 },
  { month: 23, p3: 9.0,  p15: 9.9,  p50: 11.3, p85: 12.8, p97: 14.3 },
  { month: 24, p3: 9.2,  p15: 10.1, p50: 11.5, p85: 13.1, p97: 14.6 },
  { month: 25, p3: 9.3,  p15: 10.3, p50: 11.7, p85: 13.3, p97: 14.9 },
  { month: 26, p3: 9.5,  p15: 10.5, p50: 11.9, p85: 13.6, p97: 15.2 },
  { month: 27, p3: 9.6,  p15: 10.7, p50: 12.1, p85: 13.8, p97: 15.4 },
  { month: 28, p3: 9.8,  p15: 10.8, p50: 12.3, p85: 14.0, p97: 15.7 },
  { month: 29, p3: 10.0, p15: 11.0, p50: 12.5, p85: 14.3, p97: 16.0 },
  { month: 30, p3: 10.1, p15: 11.2, p50: 12.7, p85: 14.5, p97: 16.2 },
  { month: 31, p3: 10.3, p15: 11.3, p50: 12.9, p85: 14.7, p97: 16.5 },
  { month: 32, p3: 10.4, p15: 11.5, p50: 13.1, p85: 15.0, p97: 16.8 },
  { month: 33, p3: 10.5, p15: 11.7, p50: 13.3, p85: 15.2, p97: 17.0 },
  { month: 34, p3: 10.7, p15: 11.8, p50: 13.5, p85: 15.4, p97: 17.3 },
  { month: 35, p3: 10.8, p15: 12.0, p50: 13.7, p85: 15.7, p97: 17.6 },
  { month: 36, p3: 11.0, p15: 12.1, p50: 13.9, p85: 15.9, p97: 17.8 },
  { month: 37, p3: 11.1, p15: 12.3, p50: 14.0, p85: 16.1, p97: 18.1 },
  { month: 38, p3: 11.2, p15: 12.5, p50: 14.2, p85: 16.3, p97: 18.4 },
  { month: 39, p3: 11.4, p15: 12.6, p50: 14.4, p85: 16.6, p97: 18.6 },
  { month: 40, p3: 11.5, p15: 12.8, p50: 14.6, p85: 16.8, p97: 18.9 },
  { month: 41, p3: 11.6, p15: 12.9, p50: 14.8, p85: 17.0, p97: 19.2 },
  { month: 42, p3: 11.8, p15: 13.1, p50: 15.0, p85: 17.3, p97: 19.5 },
  { month: 43, p3: 11.9, p15: 13.2, p50: 15.2, p85: 17.5, p97: 19.7 },
  { month: 44, p3: 12.0, p15: 13.4, p50: 15.3, p85: 17.7, p97: 20.0 },
  { month: 45, p3: 12.1, p15: 13.5, p50: 15.5, p85: 17.9, p97: 20.3 },
  { month: 46, p3: 12.3, p15: 13.7, p50: 15.7, p85: 18.2, p97: 20.6 },
  { month: 47, p3: 12.4, p15: 13.8, p50: 15.9, p85: 18.4, p97: 20.8 },
  { month: 48, p3: 12.5, p15: 14.0, p50: 16.1, p85: 18.6, p97: 21.1 },
  { month: 49, p3: 12.6, p15: 14.1, p50: 16.3, p85: 18.9, p97: 21.4 },
  { month: 50, p3: 12.8, p15: 14.3, p50: 16.4, p85: 19.1, p97: 21.7 },
  { month: 51, p3: 12.9, p15: 14.4, p50: 16.6, p85: 19.3, p97: 22.0 },
  { month: 52, p3: 13.0, p15: 14.5, p50: 16.8, p85: 19.5, p97: 22.2 },
  { month: 53, p3: 13.1, p15: 14.7, p50: 17.0, p85: 19.8, p97: 22.5 },
  { month: 54, p3: 13.2, p15: 14.8, p50: 17.2, p85: 20.0, p97: 22.8 },
  { month: 55, p3: 13.4, p15: 15.0, p50: 17.3, p85: 20.2, p97: 23.1 },
  { month: 56, p3: 13.5, p15: 15.1, p50: 17.5, p85: 20.4, p97: 23.3 },
  { month: 57, p3: 13.6, p15: 15.3, p50: 17.7, p85: 20.7, p97: 23.6 },
  { month: 58, p3: 13.7, p15: 15.4, p50: 17.9, p85: 20.9, p97: 23.9 },
  { month: 59, p3: 13.8, p15: 15.5, p50: 18.0, p85: 21.1, p97: 24.2 },
  { month: 60, p3: 14.0, p15: 15.7, p50: 18.2, p85: 21.3, p97: 24.4 }

]

// ── WHO BMI-for-Age LMS Reference Data ──
// L (skewness), M (median), S (coefficient of variation)
// Source: WHO Child Growth Standards (0-5y) + WHO Reference (5-19y)
//https://www.who.int/toolkits/child-growth-standards/standards/body-mass-index-for-age-bmi-for-age
// Age in months

// ── WHO BMI-for-Age LMS Data (BOYS) ──

const WHO_BMI_BOYS = [

{ month:0,L:-0.3053,M:13.4069,S:0.0956 },
{ month:1,L:0.2708,M:14.9441,S:0.09027 },
{ month:2,L:0.1118,M:16.3195,S:0.08677 },
{ month:3,L:0.0068,M:16.8987,S:0.08495 },
{ month:4,L:-0.0727,M:17.1579,S:0.08378 },
{ month:5,L:-0.137,M:17.2919,S:0.08296 },
{ month:6,L:-0.1913,M:17.3422,S:0.08234 },
{ month:7,L:-0.2385,M:17.3288,S:0.08183 },
{ month:8,L:-0.2802,M:17.2647,S:0.0814 },
{ month:9,L:-0.3176,M:17.1662,S:0.08102 },
{ month:10,L:-0.3516,M:17.0488,S:0.08068 },
{ month:11,L:-0.3828,M:16.9239,S:0.08037 },
{ month:12,L:-0.4115,M:16.7981,S:0.08009 },
{ month:13,L:-0.4382,M:16.6743,S:0.07982 },
{ month:14,L:-0.463,M:16.5548,S:0.07958 },
{ month:15,L:-0.4863,M:16.4409,S:0.07935 },
{ month:16,L:-0.5082,M:16.3335,S:0.07913 },
{ month:17,L:-0.5289,M:16.2329,S:0.07892 },
{ month:18,L:-0.5484,M:16.1392,S:0.07873 },
{ month:19,L:-0.5669,M:16.0528,S:0.07854 },
{ month:20,L:-0.5846,M:15.9743,S:0.07836 },
{ month:21,L:-0.6014,M:15.9039,S:0.07818 },
{ month:22,L:-0.6174,M:15.8412,S:0.07802 },
{ month:23,L:-0.6328,M:15.7852,S:0.07786 },
{ month:24,L:-0.6473,M:15.7356,S:0.07771 },
{ month:25,L:-0.584,M:15.98,S:0.07792 },
{ month:26,L:-0.5497,M:15.9414,S:0.078 },
{ month:27,L:-0.5166,M:15.9036,S:0.07808 },
{ month:28,L:-0.485,M:15.8667,S:0.07818 },
{ month:29,L:-0.4552,M:15.8306,S:0.07829 },
{ month:30,L:-0.4274,M:15.7953,S:0.07841 },
{ month:31,L:-0.4016,M:15.7606,S:0.07854 },
{ month:32,L:-0.3782,M:15.7267,S:0.07867 },
{ month:33,L:-0.3572,M:15.6934,S:0.07882 },
{ month:34,L:-0.3388,M:15.661,S:0.07897 },
{ month:35,L:-0.3231,M:15.6294,S:0.07914 },
{ month:36,L:-0.3101,M:15.5988,S:0.07931 },
{ month:37,L:-0.3,M:15.5693,S:0.0795 },
{ month:38,L:-0.2927,M:15.541,S:0.07969 },
{ month:39,L:-0.2884,M:15.514,S:0.0799 },
{ month:40,L:-0.2869,M:15.4885,S:0.08012 },
{ month:41,L:-0.2881,M:15.4645,S:0.08036 },
{ month:42,L:-0.2919,M:15.442,S:0.08061 },
{ month:43,L:-0.2981,M:15.421,S:0.08087 },
{ month:44,L:-0.3067,M:15.4013,S:0.08115 },
{ month:45,L:-0.3174,M:15.3827,S:0.08144 },
{ month:46,L:-0.3303,M:15.3652,S:0.08174 },
{ month:47,L:-0.3452,M:15.3485,S:0.08205 },
{ month:48,L:-0.3622,M:15.3326,S:0.08238 },
{ month:49,L:-0.3811,M:15.3174,S:0.08272 },
{ month:50,L:-0.4019,M:15.3029,S:0.08307 },
{ month:51,L:-0.4245,M:15.2891,S:0.08343 },
{ month:52,L:-0.4488,M:15.2759,S:0.0838 },
{ month:53,L:-0.4747,M:15.2633,S:0.08418 },
{ month:54,L:-0.5019,M:15.2514,S:0.08457 },
{ month:55,L:-0.5303,M:15.24,S:0.08496 },
{ month:56,L:-0.5599,M:15.2291,S:0.08536 },
{ month:57,L:-0.5905,M:15.2188,S:0.08577 },
{ month:58,L:-0.6223,M:15.2091,S:0.08617 },
{ month:59,L:-0.6552,M:15.2,S:0.08659 },
{ month:60,L:-0.6892,M:15.1916,S:0.087 }

]
// ── WHO BMI-for-Age LMS Data (GIRLS) ──

const WHO_BMI_GIRLS = [

{ month:0,L:-0.0631,M:13.3363,S:0.09272 },
{ month:1,L:0.3448,M:14.5679,S:0.09556 },
{ month:2,L:0.1749,M:15.7679,S:0.09371 },
{ month:3,L:0.0643,M:16.3574,S:0.09254 },
{ month:4,L:-0.0191,M:16.6703,S:0.09166 },
{ month:5,L:-0.0864,M:16.8386,S:0.09096 },
{ month:6,L:-0.1429,M:16.9083,S:0.09036 },
{ month:7,L:-0.1916,M:16.902,S:0.08984 },
{ month:8,L:-0.2344,M:16.8404,S:0.08939 },
{ month:9,L:-0.2725,M:16.7406,S:0.08898 },
{ month:10,L:-0.3068,M:16.6184,S:0.08861 },
{ month:11,L:-0.3381,M:16.4875,S:0.08828 },
{ month:12,L:-0.3667,M:16.3568,S:0.08797 },
{ month:13,L:-0.3932,M:16.2311,S:0.08768 },
{ month:14,L:-0.4177,M:16.1128,S:0.08741 },
{ month:15,L:-0.4407,M:16.0028,S:0.08716 },
{ month:16,L:-0.4623,M:15.9017,S:0.08693 },
{ month:17,L:-0.4825,M:15.8096,S:0.08671 },
{ month:18,L:-0.5017,M:15.7263,S:0.0865 },
{ month:19,L:-0.5199,M:15.6517,S:0.0863 },
{ month:20,L:-0.5372,M:15.5855,S:0.08612 },
{ month:21,L:-0.5537,M:15.5278,S:0.08594 },
{ month:22,L:-0.5695,M:15.4787,S:0.08577 },
{ month:23,L:-0.5846,M:15.438,S:0.0856 },
{ month:24,L:-0.5989,M:15.4052,S:0.08545 },
{ month:25,L:-0.5684,M:15.659,S:0.08452 },
{ month:26,L:-0.5684,M:15.6308,S:0.08449 },
{ month:27,L:-0.5684,M:15.6037,S:0.08446 },
{ month:28,L:-0.5684,M:15.5777,S:0.08444 },
{ month:29,L:-0.5684,M:15.5523,S:0.08443 },
{ month:30,L:-0.5684,M:15.5276,S:0.08444 },
{ month:31,L:-0.5684,M:15.5034,S:0.08448 },
{ month:32,L:-0.5684,M:15.4798,S:0.08455 },
{ month:33,L:-0.5684,M:15.4572,S:0.08467 },
{ month:34,L:-0.5684,M:15.4356,S:0.08484 },
{ month:35,L:-0.5684,M:15.4155,S:0.08506 },
{ month:36,L:-0.5684,M:15.3968,S:0.08535 },
{ month:37,L:-0.5684,M:15.3796,S:0.08569 },
{ month:38,L:-0.5684,M:15.3638,S:0.08609 },
{ month:39,L:-0.5684,M:15.3493,S:0.08654 },
{ month:40,L:-0.5684,M:15.3358,S:0.08704 },
{ month:41,L:-0.5684,M:15.3233,S:0.08757 },
{ month:42,L:-0.5684,M:15.3116,S:0.08813 },
{ month:43,L:-0.5684,M:15.3007,S:0.08872 },
{ month:44,L:-0.5684,M:15.2905,S:0.08931 },
{ month:45,L:-0.5684,M:15.2814,S:0.08991 },
{ month:46,L:-0.5684,M:15.2732,S:0.09051 },
{ month:47,L:-0.5684,M:15.2661,S:0.0911 },
{ month:48,L:-0.5684,M:15.2602,S:0.09168 },
{ month:49,L:-0.5684,M:15.2556,S:0.09227 },
{ month:50,L:-0.5684,M:15.2523,S:0.09286 },
{ month:51,L:-0.5684,M:15.2503,S:0.09345 },
{ month:52,L:-0.5684,M:15.2496,S:0.09403 },
{ month:53,L:-0.5684,M:15.2502,S:0.0946 },
{ month:54,L:-0.5684,M:15.2519,S:0.09515 },
{ month:55,L:-0.5684,M:15.2544,S:0.09568 },
{ month:56,L:-0.5684,M:15.2575,S:0.09618 },
{ month:57,L:-0.5684,M:15.2612,S:0.09665 },
{ month:58,L:-0.5684,M:15.2653,S:0.09709 },
{ month:59,L:-0.5684,M:15.2698,S:0.0975 },
{ month:60,L:-0.5684,M:15.2747,S:0.09789 }

]

// Compute BMI-for-Age z-score using WHO LMS method: z = ((BMI/M)^L - 1) / (L * S)
function getLMSValues(data, month) {

  if (month <= data[0].month) {
    return data[0]
  }

  if (month >= data[data.length - 1].month) {
    return data[data.length - 1]
  }

  for (let i = 0; i < data.length - 1; i++) {

    if (
      month >= data[i].month &&
      month <= data[i + 1].month
    ) {

      const ratio =
        (month - data[i].month) /
        (data[i + 1].month - data[i].month)

      return {

        L:
          data[i].L +
          ratio * (data[i + 1].L - data[i].L),

        M:
          data[i].M +
          ratio * (data[i + 1].M - data[i].M),

        S:
          data[i].S +
          ratio * (data[i + 1].S - data[i].S),
      }
    }
  }

  return data[data.length - 1]
}

function computeZScore(value, L, M, S) {
  if (L === 0) return Math.log(value / M) / S
  return (Math.pow(value / M, L) - 1) / (L * S)
}

function interpolate(data, month, field = 'p50') {

  if (month <= data[0].month) {
    return data[0][field]
  }

  if (month >= data[data.length - 1].month) {
    return data[data.length - 1][field]
  }

  for (let i = 0; i < data.length - 1; i++) {

    if (
      month >= data[i].month &&
      month <= data[i + 1].month
    ) {

      const ratio =
        (month - data[i].month) /
        (data[i + 1].month - data[i].month)

      return Math.round(
        (
        data[i][field] +
        ratio *
        (data[i + 1][field] - data[i][field])
       ) * 100
      ) / 100
    }
  }

  return data[data.length - 1][field]
}

// (interpolateBMI removed — replaced by LMS z-score method)



export function getAgeMonths(dob) {

  const birthDate = new Date(dob)
  if (isNaN(birthDate.getTime())) return 0
  const now = new Date()

  const months =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth()) +
    (now.getDate() - birthDate.getDate()) / 30.44

  if (months > 60) return 60

  return Math.round(Math.max(0, months) * 10) / 10
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


export function getCurrentBMI(height, weight) {

  if (height == null || weight == null) return null

  if (height <= 0) return null

  const heightM = height / 100

  return (
    weight / (heightM * heightM)
  ).toFixed(1)
}

export function validateChildInputs(
  ageMonths,
  height,
  weight
) {

  const errors = []

  if (ageMonths < 0 || ageMonths > 60) {
    errors.push('Age must be between 0–60 months')
  }

  if (height != null && (height < 30 || height > 130)) {
    errors.push('Invalid height value')
  }

  if (weight != null && (weight < 1 || weight > 40)) {
    errors.push('Invalid weight value')
  }

  return errors
}

// WHO BMI-for-Age z-score classification using LMS method
// Categories:
//   z < -3: Severe thinness
//   z < -2: Thinness
//   -2 ≤ z ≤ +1: Normal
//   z > +1: Overweight
//   z > +2: Obese
export function getBMIStatus(bmi, ageMonths, gender) {
  if (!bmi || ageMonths < 0) return null
  const bmiVal = parseFloat(bmi)
  const lmsData = gender === 'boy' ? WHO_BMI_BOYS : WHO_BMI_GIRLS
  const { L, M, S } = getLMSValues(lmsData, ageMonths)
  const z = computeZScore(bmiVal, L, M, S)

  if (z < -3) return { label: 'Severe Thinness', color: 'text-red-600', z: z.toFixed(2), category: 'severe-thin' }
  if (z < -2) return { label: 'Thinness', color: 'text-orange-500', z: z.toFixed(2), category: 'thin' }
  if (z <= 1) return { label: 'Normal', color: 'text-emerald-500', z: z.toFixed(2), category: 'normal' }
  if (z <= 2) return { label: 'Overweight', color: 'text-amber-500', z: z.toFixed(2), category: 'overweight' }
  return { label: 'Obese', color: 'text-red-600', z: z.toFixed(2), category: 'obese' }
}

// Get WHO BMI-for-Age LMS values for a given age and gender (for charts/display)
export function getBMILMS(ageMonths, gender) {
  const lmsData = gender === 'boy' ? WHO_BMI_BOYS : WHO_BMI_GIRLS
  const { L, M, S } = getLMSValues(lmsData, ageMonths)
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

export function getHeightPercentile(
  gender,
  ageMonths,
  height
) {

  const data =
    gender === 'boy'
      ? WHO_HEIGHT_BOYS
      : WHO_HEIGHT_GIRLS

  const bands = {
    p3: interpolate(data, ageMonths, 'p3'),
    p15: interpolate(data, ageMonths, 'p15'),
    p50: interpolate(data, ageMonths, 'p50'),
    p85: interpolate(data, ageMonths, 'p85'),
    p97: interpolate(data, ageMonths, 'p97'),
  }

  if (height <= bands.p3) return 3
  if (height <= bands.p15) return 15
  if (height <= bands.p50) return 50
  if (height <= bands.p85) return 85

  return 97
}

export function getWeightPercentile(
  gender,
  ageMonths,
  weight
) {

  const data =
    gender === 'boy'
      ? WHO_WEIGHT_BOYS
      : WHO_WEIGHT_GIRLS

  const bands = {
    p3: interpolate(data, ageMonths, 'p3'),
    p15: interpolate(data, ageMonths, 'p15'),
    p50: interpolate(data, ageMonths, 'p50'),
    p85: interpolate(data, ageMonths, 'p85'),
    p97: interpolate(data, ageMonths, 'p97'),
  }

  if (weight <= bands.p3) return 3
  if (weight <= bands.p15) return 15
  if (weight <= bands.p50) return 50
  if (weight <= bands.p85) return 85

  return 97
}

export function getGrowthCurve(gender, type) {
  if (type === 'height') {
    return gender === 'boy' ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS
  }
  return gender === 'boy' ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS
}

// ── Short-term Forecast (3m and 6m) ──
// Uses WHO velocity + child's current percentile offset to project forward

export function forecastShortTerm(
  gender,
  dob,
  currentHeight,
  currentWeight,
  measurements = []
) {

  const ageMonths = getAgeMonths(dob)

  const heightData =
    gender === 'boy'
      ? WHO_HEIGHT_BOYS
      : WHO_HEIGHT_GIRLS

  const weightData =
    gender === 'boy'
      ? WHO_WEIGHT_BOYS
      : WHO_WEIGHT_GIRLS

  const results = {
    height3m: null,
    height6m: null,
    weight3m: null,
    weight6m: null,
    method: '',
  confidence: ''
  }

  // =========================================
  // CASE 1:
  // ONLY CURRENT VALUE AVAILABLE
  // → WHO LINEAR PROJECTION
  // =========================================

  if (measurements.length < 2) {

    results.method = 'WHO Linear Projection'
  results.confidence = 'Low'

    if (currentHeight != null) {

      const currentMedian =
        interpolate(heightData, ageMonths)

      const ratio =
        currentHeight / currentMedian
const futureMedian3 =
  interpolate(heightData, ageMonths + 3)

const futureMedian6 =
  interpolate(heightData, ageMonths + 6)

const safeGrowth3 =
  futureMedian3 - currentMedian

const safeGrowth6 =
  futureMedian6 - currentMedian

     results.height3m =
    Math.max(
    currentHeight,
    Math.round(
      (currentHeight + safeGrowth3 * ratio) * 10
    ) / 10
  )

results.height6m =
  Math.max(
    currentHeight,
    Math.round(
      (currentHeight + safeGrowth6 * ratio) * 10
    ) / 10
  )

    }

    if (currentWeight != null) {

      const currentMedian =
        interpolate(weightData, ageMonths)

      const ratio =
        currentWeight / currentMedian

      results.weight3m =
        Math.round(
          interpolate(
            weightData,
            ageMonths + 3
          ) * ratio * 10
        ) / 10

      results.weight6m =
        Math.round(
          interpolate(
            weightData,
            ageMonths + 6
          ) * ratio * 10
        ) / 10
    }

    return results
  }

  // =========================================
  // CASE 2:
  // 2+ OBSERVATIONS
  // → Growth Trend Forecast
  // =========================================

  results.method = 'Trend Forecast'
 results.confidence =
  measurements.length >= 4
    ? 'High'
    : 'Moderate'

  const sorted =
    [...measurements].sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    )

  // HEIGHT FORECAST

  if (currentHeight != null) {

    let growthRates = []

    for (let i = 1; i < sorted.length; i++) {

      const prev = sorted[i - 1]
      const curr = sorted[i]

     if (
  prev.height != null &&
  curr.height != null
) {

        const monthDiff =
          (
            new Date(curr.date) -
            new Date(prev.date)
          ) /
          (30.44 * 24 * 60 * 60 * 1000)

        if (monthDiff > 0) {

          growthRates.push(
            (curr.height - prev.height) /
            monthDiff
          )
        }
      }
    }

    if (growthRates.length > 0) {

      const avgGrowth =
        growthRates.reduce(
          (a, b) => a + b,
          0
        ) / growthRates.length
let safeGrowth = avgGrowth

safeGrowth = Math.min(
  Math.max(safeGrowth, 0),
  3
)

      results.height3m =
        Math.round(
          (currentHeight + safeGrowth * 3 )* 10
        ) / 10

      results.height6m =
        Math.round(
          (currentHeight + safeGrowth * 6) * 10
        ) / 10
    }
  }

  // WEIGHT FORECAST

  if (currentWeight != null) {

    let growthRates = []

    for (let i = 1; i < sorted.length; i++) {

      const prev = sorted[i - 1]
      const curr = sorted[i]

      if (
  prev.weight != null &&
  curr.weight != null
) {

        const monthDiff =
          (
            new Date(curr.date) -
            new Date(prev.date)
          ) /
          (30.44 * 24 * 60 * 60 * 1000)

        if (monthDiff > 0) {

          growthRates.push(
            (curr.weight - prev.weight) /
            monthDiff
          )
        }
      }
    }

    if (growthRates.length > 0) {

      const avgGrowth =
        growthRates.reduce(
          (a, b) => a + b,
          0
        ) / growthRates.length

let safeGrowth = avgGrowth

safeGrowth = Math.min(
  Math.max(safeGrowth, 0),
  1
)

      results.weight3m =
        Math.round(
          (currentWeight + safeGrowth * 3) * 10
        ) / 10

      results.weight6m =
        Math.round(
          (currentWeight + safeGrowth * 6) * 10
        ) / 10
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

// ======================================================
// WHO Height-for-Age LMS Reference Data (BOYS)
// Official WHO Monthly LMS Values
// Age Range: 0–60 Months
//https://www.who.int/tools/child-growth-standards/standards/length-height-for-age
// ======================================================

export const HAZ_LMS_BOYS = [

  { month: 0,  L: 1.0000, M: 49.8842, S: 0.03795 },
  { month: 1,  L: 1.0000, M: 54.7244, S: 0.03557 },
  { month: 2,  L: 1.0000, M: 58.4249, S: 0.03424 },
  { month: 3,  L: 1.0000, M: 61.4292, S: 0.03328 },
  { month: 4,  L: 1.0000, M: 63.8860, S: 0.03257 },
  { month: 5,  L: 1.0000, M: 65.9026, S: 0.03204 },
  { month: 6,  L: 1.0000, M: 67.6236, S: 0.03165 },
  { month: 7,  L: 1.0000, M: 69.1645, S: 0.03139 },
  { month: 8,  L: 1.0000, M: 70.5994, S: 0.03124 },
  { month: 9,  L: 1.0000, M: 71.9687, S: 0.03117 },
  { month: 10, L: 1.0000, M: 73.2812, S: 0.03118 },
  { month: 11, L: 1.0000, M: 74.5388, S: 0.03125 },
  { month: 12, L: 1.0000, M: 75.7488, S: 0.03137 },
  { month: 13, L: 1.0000, M: 76.9186, S: 0.03154 },
  { month: 14, L: 1.0000, M: 78.0497, S: 0.03174 },
  { month: 15, L: 1.0000, M: 79.1458, S: 0.03197 },
  { month: 16, L: 1.0000, M: 80.2113, S: 0.03222 },
  { month: 17, L: 1.0000, M: 81.2487, S: 0.03250 },
  { month: 18, L: 1.0000, M: 82.2587, S: 0.03279 },
  { month: 19, L: 1.0000, M: 83.2418, S: 0.03310 },
  { month: 20, L: 1.0000, M: 84.1996, S: 0.03342 },
  { month: 21, L: 1.0000, M: 85.1348, S: 0.03376 },
  { month: 22, L: 1.0000, M: 86.0477, S: 0.03410 },
  { month: 23, L: 1.0000, M: 86.9410, S: 0.03445 },
  { month: 24, L: 1.0000, M: 87.8161, S: 0.03479 },
  { month: 25, L: 1.0000, M: 87.9720, S: 0.03542 },
  { month: 26, L: 1.0000, M: 88.8065, S: 0.03576 },
  { month: 27, L: 1.0000, M: 89.6197, S: 0.03610 },
  { month: 28, L: 1.0000, M: 90.4120, S: 0.03642 },
  { month: 29, L: 1.0000, M: 91.1828, S: 0.03674 },
  { month: 30, L: 1.0000, M: 91.9327, S: 0.03704 },
  { month: 31, L: 1.0000, M: 92.6631, S: 0.03733 },
  { month: 32, L: 1.0000, M: 93.3753, S: 0.03761 },
  { month: 33, L: 1.0000, M: 94.0711, S: 0.03787 },
  { month: 34, L: 1.0000, M: 94.7532, S: 0.03812 },
  { month: 35, L: 1.0000, M: 95.4236, S: 0.03836 },
  { month: 36, L: 1.0000, M: 96.0835, S: 0.03858 },
  { month: 37, L: 1.0000, M: 96.7337, S: 0.03879 },
  { month: 38, L: 1.0000, M: 97.3749, S: 0.03900 },
  { month: 39, L: 1.0000, M: 98.0073, S: 0.03919 },
  { month: 40, L: 1.0000, M: 98.6310, S: 0.03937 },
  { month: 41, L: 1.0000, M: 99.2459, S: 0.03954 },
  { month: 42, L: 1.0000, M: 99.8515, S: 0.03971 },
  { month: 43, L: 1.0000, M: 100.4485, S: 0.03986 },
  { month: 44, L: 1.0000, M: 101.0374, S: 0.04002 },
  { month: 45, L: 1.0000, M: 101.6186, S: 0.04016 },
  { month: 46, L: 1.0000, M: 102.1933, S: 0.04031 },
  { month: 47, L: 1.0000, M: 102.7625, S: 0.04045 },
  { month: 48, L: 1.0000, M: 103.3273, S: 0.04059 },
  { month: 49, L: 1.0000, M: 103.8886, S: 0.04073 },
  { month: 50, L: 1.0000, M: 104.4473, S: 0.04086 },
  { month: 51, L: 1.0000, M: 105.0041, S: 0.04100 },
  { month: 52, L: 1.0000, M: 105.5596, S: 0.04113 },
  { month: 53, L: 1.0000, M: 106.1138, S: 0.04126 },
  { month: 54, L: 1.0000, M: 106.6668, S: 0.04139 },
  { month: 55, L: 1.0000, M: 107.2188, S: 0.04152 },
  { month: 56, L: 1.0000, M: 107.7697, S: 0.04165 },
  { month: 57, L: 1.0000, M: 108.3198, S: 0.04177 },
  { month: 58, L: 1.0000, M: 108.8689, S: 0.04190 },
  { month: 59, L: 1.0000, M: 109.4170, S: 0.04202 },
  { month: 60, L: 1.0000, M: 109.9638, S: 0.04214 }

]
// ======================================================
// WHO Height-for-Age LMS Reference Data (GIRLS)
// Official WHO Monthly LMS Values
// Age Range: 0–60 Months
//https://www.who.int/tools/child-growth-standards/standards/length-height-for-age
// ======================================================

export const HAZ_LMS_GIRLS = [

  { month: 0,  L: 1.0000, M: 49.1477, S: 0.03790 },
  { month: 1,  L: 1.0000, M: 53.6872, S: 0.03640 },
  { month: 2,  L: 1.0000, M: 57.0673, S: 0.03568 },
  { month: 3,  L: 1.0000, M: 59.8029, S: 0.03520 },
  { month: 4,  L: 1.0000, M: 62.0899, S: 0.03486 },
  { month: 5,  L: 1.0000, M: 64.0301, S: 0.03463 },
  { month: 6,  L: 1.0000, M: 65.7311, S: 0.03448 },
  { month: 7,  L: 1.0000, M: 67.2873, S: 0.03441 },
  { month: 8,  L: 1.0000, M: 68.7498, S: 0.03440 },
  { month: 9,  L: 1.0000, M: 70.1435, S: 0.03444 },
  { month: 10, L: 1.0000, M: 71.4818, S: 0.03452 },
  { month: 11, L: 1.0000, M: 72.7710, S: 0.03464 },
  { month: 12, L: 1.0000, M: 74.0150, S: 0.03479 },
  { month: 13, L: 1.0000, M: 75.2176, S: 0.03496 },
  { month: 14, L: 1.0000, M: 76.3817, S: 0.03514 },
  { month: 15, L: 1.0000, M: 77.5099, S: 0.03534 },
  { month: 16, L: 1.0000, M: 78.6055, S: 0.03555 },
  { month: 17, L: 1.0000, M: 79.6710, S: 0.03576 },
  { month: 18, L: 1.0000, M: 80.7079, S: 0.03598 },
  { month: 19, L: 1.0000, M: 81.7182, S: 0.03620 },
  { month: 20, L: 1.0000, M: 82.7036, S: 0.03643 },
  { month: 21, L: 1.0000, M: 83.6654, S: 0.03666 },
  { month: 22, L: 1.0000, M: 84.6040, S: 0.03688 },
  { month: 23, L: 1.0000, M: 85.5202, S: 0.03711 },
  { month: 24, L: 1.0000, M: 85.7153, S: 0.03764 },
  { month: 25, L: 1.0000, M: 86.5904, S: 0.03786 },
  { month: 26, L: 1.0000, M: 87.4462, S: 0.03808 },
  { month: 27, L: 1.0000, M: 88.2830, S: 0.03830 },
  { month: 28, L: 1.0000, M: 89.1004, S: 0.03851 },
  { month: 29, L: 1.0000, M: 89.8991, S: 0.03872 },
  { month: 30, L: 1.0000, M: 90.6797, S: 0.03893 },
  { month: 31, L: 1.0000, M: 91.4430, S: 0.03913 },
  { month: 32, L: 1.0000, M: 92.1906, S: 0.03933 },
  { month: 33, L: 1.0000, M: 92.9239, S: 0.03952 },
  { month: 34, L: 1.0000, M: 93.6444, S: 0.03971 },
  { month: 35, L: 1.0000, M: 94.3533, S: 0.03989 },
  { month: 36, L: 1.0000, M: 95.0515, S: 0.04006 },
  { month: 37, L: 1.0000, M: 95.7399, S: 0.04024 },
  { month: 38, L: 1.0000, M: 96.4187, S: 0.04041 },
  { month: 39, L: 1.0000, M: 97.0885, S: 0.04057 },
  { month: 40, L: 1.0000, M: 97.7493, S: 0.04073 },
  { month: 41, L: 1.0000, M: 98.4015, S: 0.04089 },
  { month: 42, L: 1.0000, M: 99.0448, S: 0.04105 },
  { month: 43, L: 1.0000, M: 99.6795, S: 0.04120 },
  { month: 44, L: 1.0000, M: 100.3058, S: 0.04135 },
  { month: 45, L: 1.0000, M: 100.9238, S: 0.04150 },
  { month: 46, L: 1.0000, M: 101.5337, S: 0.04164 },
  { month: 47, L: 1.0000, M: 102.1360, S: 0.04179 },
  { month: 48, L: 1.0000, M: 102.7312, S: 0.04193 },
  { month: 49, L: 1.0000, M: 103.3197, S: 0.04206 },
  { month: 50, L: 1.0000, M: 103.9021, S: 0.04220 },
  { month: 51, L: 1.0000, M: 104.4786, S: 0.04233 },
  { month: 52, L: 1.0000, M: 105.0494, S: 0.04246 },
  { month: 53, L: 1.0000, M: 105.6148, S: 0.04259 },
  { month: 54, L: 1.0000, M: 106.1748, S: 0.04272 },
  { month: 55, L: 1.0000, M: 106.7295, S: 0.04285 },
  { month: 56, L: 1.0000, M: 107.2788, S: 0.04298 },
  { month: 57, L: 1.0000, M: 107.8227, S: 0.04310 },
  { month: 58, L: 1.0000, M: 108.3613, S: 0.04322 },
  { month: 59, L: 1.0000, M: 108.8948, S: 0.04334 },
  { month: 60, L: 1.0000, M: 109.4233, S: 0.04347 }

]

// ======================================================
// WHO Weight-for-Age LMS Reference Data (BOYS)
// Official WHO Monthly LMS Values
// Age Range: 0–60 Months
//https://www.who.int/tools/child-growth-standards/standards/weight-for-age
// ======================================================
export const WAZ_LMS_BOYS = [

  { month: 0,  L: 0.3487,  M: 3.3464,  S: 0.14602 },
  { month: 1,  L: 0.2297,  M: 4.4709,  S: 0.13395 },
  { month: 2,  L: 0.1970,  M: 5.5675,  S: 0.12385 },
  { month: 3,  L: 0.1738,  M: 6.3762,  S: 0.11727 },
  { month: 4,  L: 0.1553,  M: 7.0023,  S: 0.11316 },
  { month: 5,  L: 0.1395,  M: 7.5105,  S: 0.11080 },
  { month: 6,  L: 0.1257,  M: 7.9340,  S: 0.10958 },
  { month: 7,  L: 0.1134,  M: 8.2970,  S: 0.10902 },
  { month: 8,  L: 0.1021,  M: 8.6151,  S: 0.10882 },
  { month: 9,  L: 0.0917,  M: 8.9014,  S: 0.10881 },
  { month: 10, L: 0.0820,  M: 9.1649,  S: 0.10891 },
  { month: 11, L: 0.0730,  M: 9.4122,  S: 0.10906 },
  { month: 12, L: 0.0644,  M: 9.6479,  S: 0.10925 },
  { month: 13, L: 0.0563,  M: 9.8749,  S: 0.10949 },
  { month: 14, L: 0.0487,  M: 10.0953, S: 0.10976 },
  { month: 15, L: 0.0413,  M: 10.3108, S: 0.11007 },
  { month: 16, L: 0.0343,  M: 10.5228, S: 0.11041 },
  { month: 17, L: 0.0275,  M: 10.7319, S: 0.11079 },
  { month: 18, L: 0.0211,  M: 10.9385, S: 0.11119 },
  { month: 19, L: 0.0148,  M: 11.1430, S: 0.11164 },
  { month: 20, L: 0.0087,  M: 11.3462, S: 0.11211 },
  { month: 21, L: 0.0029,  M: 11.5486, S: 0.11261 },
  { month: 22, L: -0.0028, M: 11.7504, S: 0.11314 },
  { month: 23, L: -0.0083, M: 11.9514, S: 0.11369 },
  { month: 24, L: -0.0137, M: 12.1515, S: 0.11426 },
  { month: 25, L: -0.0189, M: 12.3502, S: 0.11485 },
  { month: 26, L: -0.0240, M: 12.5466, S: 0.11544 },
  { month: 27, L: -0.0289, M: 12.7401, S: 0.11604 },
  { month: 28, L: -0.0337, M: 12.9303, S: 0.11664 },
  { month: 29, L: -0.0385, M: 13.1169, S: 0.11723 },
  { month: 30, L: -0.0431, M: 13.3000, S: 0.11781 },
  { month: 31, L: -0.0476, M: 13.4798, S: 0.11839 },
  { month: 32, L: -0.0520, M: 13.6567, S: 0.11896 },
  { month: 33, L: -0.0564, M: 13.8309, S: 0.11953 },
  { month: 34, L: -0.0606, M: 14.0031, S: 0.12008 },
  { month: 35, L: -0.0648, M: 14.1736, S: 0.12062 },
  { month: 36, L: -0.0689, M: 14.3429, S: 0.12116 },
  { month: 37, L: -0.0729, M: 14.5113, S: 0.12168 },
  { month: 38, L: -0.0769, M: 14.6791, S: 0.12220 },
  { month: 39, L: -0.0808, M: 14.8466, S: 0.12271 },
  { month: 40, L: -0.0846, M: 15.0140, S: 0.12322 },
  { month: 41, L: -0.0883, M: 15.1813, S: 0.12373 },
  { month: 42, L: -0.0920, M: 15.3486, S: 0.12425 },
  { month: 43, L: -0.0957, M: 15.5158, S: 0.12478 },
  { month: 44, L: -0.0993, M: 15.6828, S: 0.12531 },
  { month: 45, L: -0.1028, M: 15.8497, S: 0.12586 },
  { month: 46, L: -0.1063, M: 16.0163, S: 0.12643 },
  { month: 47, L: -0.1097, M: 16.1827, S: 0.12700 },
  { month: 48, L: -0.1131, M: 16.3489, S: 0.12759 },
  { month: 49, L: -0.1165, M: 16.5150, S: 0.12819 },
  { month: 50, L: -0.1198, M: 16.6811, S: 0.12880 },
  { month: 51, L: -0.1230, M: 16.8471, S: 0.12943 },
  { month: 52, L: -0.1262, M: 17.0132, S: 0.13005 },
  { month: 53, L: -0.1294, M: 17.1792, S: 0.13069 },
  { month: 54, L: -0.1325, M: 17.3452, S: 0.13133 },
  { month: 55, L: -0.1356, M: 17.5111, S: 0.13197 },
  { month: 56, L: -0.1387, M: 17.6768, S: 0.13261 },
  { month: 57, L: -0.1417, M: 17.8422, S: 0.13325 },
  { month: 58, L: -0.1447, M: 18.0073, S: 0.13389 },
  { month: 59, L: -0.1477, M: 18.1722, S: 0.13453 },
  { month: 60, L: -0.1506, M: 18.3366, S: 0.13517 }

]

// ======================================================
// WHO Weight-for-Age LMS Reference Data (GIRLS)
// Official WHO Monthly LMS Values
// Age Range: 0–60 Months
//https://www.who.int/tools/child-growth-standards/standards/weight-for-age
// ======================================================

export const WAZ_LMS_GIRLS = [

  { month: 0,  L: 0.3809,  M: 3.2322,  S: 0.14171 },
  { month: 1,  L: 0.1714,  M: 4.1873,  S: 0.13724 },
  { month: 2,  L: 0.0962,  M: 5.1282,  S: 0.13000 },
  { month: 3,  L: 0.0402,  M: 5.8458,  S: 0.12619 },
  { month: 4,  L: -0.0050, M: 6.4237,  S: 0.12402 },
  { month: 5,  L: -0.0430, M: 6.8985,  S: 0.12274 },
  { month: 6,  L: -0.0756, M: 7.2970,  S: 0.12204 },
  { month: 7,  L: -0.1039, M: 7.6422,  S: 0.12178 },
  { month: 8,  L: -0.1288, M: 7.9487,  S: 0.12181 },
  { month: 9,  L: -0.1507, M: 8.2254,  S: 0.12199 },
  { month: 10, L: -0.1700, M: 8.4800,  S: 0.12223 },
  { month: 11, L: -0.1872, M: 8.7192,  S: 0.12247 },
  { month: 12, L: -0.2024, M: 8.9481,  S: 0.12268 },
  { month: 13, L: -0.2158, M: 9.1699,  S: 0.12283 },
  { month: 14, L: -0.2278, M: 9.3870,  S: 0.12294 },
  { month: 15, L: -0.2384, M: 9.6008,  S: 0.12299 },
  { month: 16, L: -0.2478, M: 9.8124,  S: 0.12303 },
  { month: 17, L: -0.2562, M: 10.0226, S: 0.12306 },
  { month: 18, L: -0.2637, M: 10.2315, S: 0.12309 },
  { month: 19, L: -0.2703, M: 10.4393, S: 0.12315 },
  { month: 20, L: -0.2762, M: 10.6464, S: 0.12323 },
  { month: 21, L: -0.2815, M: 10.8534, S: 0.12335 },
  { month: 22, L: -0.2862, M: 11.0608, S: 0.12350 },
  { month: 23, L: -0.2903, M: 11.2688, S: 0.12369 },
  { month: 24, L: -0.2941, M: 11.4775, S: 0.12390 },
  { month: 25, L: -0.2975, M: 11.6864, S: 0.12414 },
  { month: 26, L: -0.3005, M: 11.8947, S: 0.12441 },
  { month: 27, L: -0.3032, M: 12.1015, S: 0.12472 },
  { month: 28, L: -0.3057, M: 12.3059, S: 0.12506 },
  { month: 29, L: -0.3080, M: 12.5073, S: 0.12545 },
  { month: 30, L: -0.3101, M: 12.7055, S: 0.12587 },
  { month: 31, L: -0.3120, M: 12.9006, S: 0.12633 },
  { month: 32, L: -0.3138, M: 13.0930, S: 0.12683 },
  { month: 33, L: -0.3155, M: 13.2837, S: 0.12737 },
  { month: 34, L: -0.3171, M: 13.4731, S: 0.12794 },
  { month: 35, L: -0.3186, M: 13.6618, S: 0.12855 },
  { month: 36, L: -0.3201, M: 13.8503, S: 0.12919 },
  { month: 37, L: -0.3216, M: 14.0385, S: 0.12988 },
  { month: 38, L: -0.3230, M: 14.2265, S: 0.13059 },
  { month: 39, L: -0.3243, M: 14.4140, S: 0.13135 },
  { month: 40, L: -0.3257, M: 14.6010, S: 0.13213 },
  { month: 41, L: -0.3270, M: 14.7873, S: 0.13293 },
  { month: 42, L: -0.3283, M: 14.9727, S: 0.13376 },
  { month: 43, L: -0.3296, M: 15.1573, S: 0.13460 },
  { month: 44, L: -0.3309, M: 15.3410, S: 0.13545 },
  { month: 45, L: -0.3322, M: 15.5240, S: 0.13630 },
  { month: 46, L: -0.3335, M: 15.7064, S: 0.13716 },
  { month: 47, L: -0.3348, M: 15.8882, S: 0.13800 },
  { month: 48, L: -0.3361, M: 16.0697, S: 0.13884 },
  { month: 49, L: -0.3374, M: 16.2511, S: 0.13968 },
  { month: 50, L: -0.3387, M: 16.4322, S: 0.14051 },
  { month: 51, L: -0.3400, M: 16.6133, S: 0.14132 },
  { month: 52, L: -0.3414, M: 16.7942, S: 0.14213 },
  { month: 53, L: -0.3427, M: 16.9748, S: 0.14293 },
  { month: 54, L: -0.3440, M: 17.1551, S: 0.14371 },
  { month: 55, L: -0.3453, M: 17.3347, S: 0.14448 },
  { month: 56, L: -0.3466, M: 17.5136, S: 0.14525 },
  { month: 57, L: -0.3479, M: 17.6916, S: 0.14600 },
  { month: 58, L: -0.3492, M: 17.8686, S: 0.14675 },
  { month: 59, L: -0.3505, M: 18.0445, S: 0.14748 },
  { month: 60, L: -0.3518, M: 18.2193, S: 0.14821 }

]


// ======================================================
// WHO Weight-for-Height LMS Reference Data (BOYS)
// Official WHO WHZ LMS Values
// Length/Height: 45–120 cm
// ======================================================

export const WHZ_LMS_BOYS = [

  { length: 45.0,  L: -0.3521, M: 2.4410,  S: 0.09182 },
  { length: 45.5,  L: -0.3521, M: 2.5244,  S: 0.09153 },
  { length: 46.0,  L: -0.3521, M: 2.6077,  S: 0.09124 },
  { length: 46.5,  L: -0.3521, M: 2.6913,  S: 0.09094 },
  { length: 47.0,  L: -0.3521, M: 2.7755,  S: 0.09065 },
  { length: 47.5,  L: -0.3521, M: 2.8609,  S: 0.09036 },
  { length: 48.0,  L: -0.3521, M: 2.9480,  S: 0.09007 },
  { length: 48.5,  L: -0.3521, M: 3.0377,  S: 0.08977 },
  { length: 49.0,  L: -0.3521, M: 3.1308,  S: 0.08948 },
  { length: 49.5,  L: -0.3521, M: 3.2276,  S: 0.08919 },
  { length: 50.0,  L: -0.3521, M: 3.3278,  S: 0.08890 },
  { length: 50.5,  L: -0.3521, M: 3.4311,  S: 0.08861 },
  { length: 51.0,  L: -0.3521, M: 3.5376,  S: 0.08831 },
  { length: 51.5,  L: -0.3521, M: 3.6477,  S: 0.08801 },
  { length: 52.0,  L: -0.3521, M: 3.7620,  S: 0.08771 },
  { length: 52.5,  L: -0.3521, M: 3.8814,  S: 0.08741 },
  { length: 53.0,  L: -0.3521, M: 4.0060,  S: 0.08711 },
  { length: 53.5,  L: -0.3521, M: 4.1354,  S: 0.08681 },
  { length: 54.0,  L: -0.3521, M: 4.2693,  S: 0.08651 },
  { length: 54.5,  L: -0.3521, M: 4.4066,  S: 0.08621 },
  { length: 55.0,  L: -0.3521, M: 4.5467,  S: 0.08592 },
  { length: 55.5,  L: -0.3521, M: 4.6892,  S: 0.08563 },
  { length: 56.0,  L: -0.3521, M: 4.8338,  S: 0.08535 },
  { length: 56.5,  L: -0.3521, M: 4.9796,  S: 0.08507 },
  { length: 57.0,  L: -0.3521, M: 5.1259,  S: 0.08481 },
  { length: 57.5,  L: -0.3521, M: 5.2721,  S: 0.08455 },
  { length: 58.0,  L: -0.3521, M: 5.4180,  S: 0.08430 },
  { length: 58.5,  L: -0.3521, M: 5.5632,  S: 0.08406 },
  { length: 59.0,  L: -0.3521, M: 5.7074,  S: 0.08383 },
  { length: 59.5,  L: -0.3521, M: 5.8501,  S: 0.08362 },
  { length: 60.0,  L: -0.3521, M: 5.9907,  S: 0.08342 },
  { length: 60.5,  L: -0.3521, M: 6.1284,  S: 0.08324 },
  { length: 61.0,  L: -0.3521, M: 6.2632,  S: 0.08308 },
  { length: 61.5,  L: -0.3521, M: 6.3954,  S: 0.08292 },
  { length: 62.0,  L: -0.3521, M: 6.5251,  S: 0.08279 },
  { length: 62.5,  L: -0.3521, M: 6.6527,  S: 0.08266 },
  { length: 63.0,  L: -0.3521, M: 6.7786,  S: 0.08255 },
  { length: 63.5,  L: -0.3521, M: 6.9020,  S: 0.08245 },
  { length: 64.0,  L: -0.3521, M: 7.0255,  S: 0.08236 },
  { length: 64.5,  L: -0.3521, M: 7.1467,  S: 0.08229 },
  { length: 65.0,  L: -0.3521, M: 7.2666,  S: 0.08223 },
  { length: 65.5,  L: -0.3521, M: 7.3854,  S: 0.08218 },
  { length: 66.0,  L: -0.3521, M: 7.5034,  S: 0.08215 },
  { length: 66.5,  L: -0.3521, M: 7.6206,  S: 0.08213 },
  { length: 67.0,  L: -0.3521, M: 7.7370,  S: 0.08212 },
  { length: 67.5,  L: -0.3521, M: 7.8525,  S: 0.08212 },
  { length: 68.0,  L: -0.3521, M: 7.9674,  S: 0.08214 },
  { length: 68.5,  L: -0.3521, M: 8.0816,  S: 0.08216 },
  { length: 69.0,  L: -0.3521, M: 8.1950,  S: 0.08219 },
  { length: 69.5,  L: -0.3521, M: 8.3090,  S: 0.08224 },
  { length: 70.0,  L: -0.3521, M: 8.4227,  S: 0.08229 },
  { length: 70.5,  L: -0.3521, M: 8.5357,  S: 0.08235 },
  { length: 71.0,  L: -0.3521, M: 8.6480,  S: 0.08241 },
  { length: 71.5,  L: -0.3521, M: 8.7594,  S: 0.08248 },
  { length: 72.0,  L: -0.3521, M: 8.8697,  S: 0.08254 },
  { length: 72.5,  L: -0.3521, M: 8.9788,  S: 0.08262 },
  { length: 73.0,  L: -0.3521, M: 9.0865,  S: 0.08269 },
  { length: 73.5,  L: -0.3521, M: 9.1927,  S: 0.08276 },
  { length: 74.0,  L: -0.3521, M: 9.2971,  S: 0.08283 },
  { length: 74.5,  L: -0.3521, M: 9.4010,  S: 0.08289 },
  { length: 75.0,  L: -0.3521, M: 9.5032,  S: 0.08295 },
  { length: 75.5,  L: -0.3521, M: 9.6041,  S: 0.08301 },
  { length: 76.0,  L: -0.3521, M: 9.7033,  S: 0.08307 },
  { length: 76.5,  L: -0.3521, M: 9.8007,  S: 0.08311 },
  { length: 77.0,  L: -0.3521, M: 9.8963,  S: 0.08314 },
  { length: 77.5,  L: -0.3521, M: 9.9902,  S: 0.08317 },
  { length: 78.0,  L: -0.3521, M: 10.0827, S: 0.08318 },
  { length: 78.5,  L: -0.3521, M: 10.1741, S: 0.08318 },
  { length: 79.0,  L: -0.3521, M: 10.2649, S: 0.08316 },
  { length: 79.5,  L: -0.3521, M: 10.3558, S: 0.08313 },
  { length: 80.0,  L: -0.3521, M: 10.4475, S: 0.08308 },
  { length: 80.5,  L: -0.3521, M: 10.5405, S: 0.08301 },
  { length: 81.0,  L: -0.3521, M: 10.6350, S: 0.08293 },
  { length: 81.5,  L: -0.3521, M: 10.7322, S: 0.08284 },
  { length: 82.0,  L: -0.3521, M: 10.8321, S: 0.08273 },
  { length: 82.5,  L: -0.3521, M: 10.9350, S: 0.08266 },
  { length: 83.0,  L: -0.3521, M: 11.0415, S: 0.08246 },
  { length: 83.5,  L: -0.3521, M: 11.1516, S: 0.08231 },
  { length: 84.0,  L: -0.3521, M: 11.2651, S: 0.08215 },
  { length: 84.5,  L: -0.3521, M: 11.3817, S: 0.08198 },
  { length: 85.0,  L: -0.3521, M: 11.5007, S: 0.08181 },
  { length: 85.5,  L: -0.3521, M: 11.6218, S: 0.08163 },
  { length: 86.0,  L: -0.3521, M: 11.7444, S: 0.08145 },
  { length: 86.5,  L: -0.3521, M: 11.8678, S: 0.08128 },
  { length: 87.0,  L: -0.3521, M: 11.9915, S: 0.08111 },
  { length: 87.5,  L: -0.3521, M: 12.1152, S: 0.08096 },
  { length: 88.0,  L: -0.3521, M: 12.2380, S: 0.08082 },
  { length: 88.5,  L: -0.3521, M: 12.3603, S: 0.08069 },
  { length: 89.0,  L: -0.3521, M: 12.4815, S: 0.08058 },
  { length: 89.5,  L: -0.3521, M: 12.6017, S: 0.08048 },
  { length: 90.0,  L: -0.3521, M: 12.7209, S: 0.08041 },
  { length: 90.5,  L: -0.3521, M: 12.8390, S: 0.08034 },
  { length: 91.0,  L: -0.3521, M: 12.9569, S: 0.08030 },
  { length: 91.5,  L: -0.3521, M: 13.0742, S: 0.08026 },
  { length: 92.0,  L: -0.3521, M: 13.1910, S: 0.08025 },
  { length: 92.5,  L: -0.3521, M: 13.3075, S: 0.08025 },
  { length: 93.0,  L: -0.3521, M: 13.4239, S: 0.08026 },
  { length: 93.5,  L: -0.3521, M: 13.5404, S: 0.08029 },
  { length: 94.0,  L: -0.3521, M: 13.6572, S: 0.08034 },
  { length: 94.5,  L: -0.3521, M: 13.7746, S: 0.08040 },
  { length: 95.0,  L: -0.3521, M: 13.8928, S: 0.08047 },
  { length: 95.5,  L: -0.3521, M: 14.0112, S: 0.08056 },
  { length: 96.0,  L: -0.3521, M: 14.1325, S: 0.08067 },
  { length: 96.5,  L: -0.3521, M: 14.2547, S: 0.08078 },
  { length: 97.0,  L: -0.3521, M: 14.3780, S: 0.08092 },
  { length: 97.5,  L: -0.3521, M: 14.5038, S: 0.08106 },
  { length: 98.0,  L: -0.3521, M: 14.6316, S: 0.08122 },
  { length: 98.5,  L: -0.3521, M: 14.7614, S: 0.08139 },
  { length: 99.0,  L: -0.3521, M: 14.8934, S: 0.08157 },
  { length: 99.5,  L: -0.3521, M: 15.0275, S: 0.08177 },
  { length: 100.0, L: -0.3521, M: 15.1637, S: 0.08198 },
  { length: 100.5, L: -0.3521, M: 15.3018, S: 0.08222 },
  { length: 101.0, L: -0.3521, M: 15.4419, S: 0.08243 },
  { length: 101.5, L: -0.3521, M: 15.5838, S: 0.08267 },
  { length: 102.0, L: -0.3521, M: 15.7276, S: 0.08292 },
  { length: 102.5, L: -0.3521, M: 15.8730, S: 0.08317 },
  { length: 103.0, L: -0.3521, M: 16.0206, S: 0.08343 },
  { length: 103.5, L: -0.3521, M: 16.1697, S: 0.08370 },
  { length: 104.0, L: -0.3521, M: 16.3204, S: 0.08397 },
  { length: 104.5, L: -0.3521, M: 16.4728, S: 0.08425 },
  { length: 105.0, L: -0.3521, M: 16.6268, S: 0.08453 },
  { length: 105.5, L: -0.3521, M: 16.7826, S: 0.08481 },
  { length: 106.0, L: -0.3521, M: 16.9401, S: 0.08510 },
  { length: 106.5, L: -0.3521, M: 17.0995, S: 0.08539 },
  { length: 107.0, L: -0.3521, M: 17.2600, S: 0.08568 },
  { length: 107.5, L: -0.3521, M: 17.4237, S: 0.08599 },
  { length: 108.0, L: -0.3521, M: 17.5885, S: 0.08629 },
  { length: 108.5, L: -0.3521, M: 17.7553, S: 0.08660 },
  { length: 109.0, L: -0.3521, M: 17.9242, S: 0.08691 },
  { length: 109.5, L: -0.3521, M: 18.0954, S: 0.08723 },
  { length: 110.0, L: -0.3521, M: 18.2689, S: 0.08755 },
  { length: 110.5, L: -0.3521, M: 18.6948, S: 0.08832 },
  { length: 111.0, L: -0.3521, M: 18.8759, S: 0.08864 },
  { length: 111.5, L: -0.3521, M: 19.0500, S: 0.08896 },
  { length: 112.0, L: -0.3521, M: 19.2439, S: 0.08928 },
  { length: 112.5, L: -0.3521, M: 19.4304, S: 0.08960 },
  { length: 113.0, L: -0.3521, M: 19.6185, S: 0.08991 },
  { length: 113.5, L: -0.3521, M: 19.8081, S: 0.09022 },
  { length: 114.0, L: -0.3521, M: 19.9990, S: 0.09054 },
  { length: 114.5, L: -0.3521, M: 20.1912, S: 0.09085 },
  { length: 115.0, L: -0.3521, M: 20.3846, S: 0.09116 },
  { length: 115.5, L: -0.3521, M: 20.5789, S: 0.09147 },
  { length: 116.0, L: -0.3521, M: 20.7741, S: 0.09177 },
  { length: 116.5, L: -0.3521, M: 20.9700, S: 0.09208 },
  { length: 117.0, L: -0.3521, M: 21.1665, S: 0.09239 },
  { length: 117.5, L: -0.3521, M: 21.3635, S: 0.09270 },
  { length: 118.0, L: -0.3521, M: 21.5611, S: 0.09300 },
  { length: 118.5, L: -0.3521, M: 21.7588, S: 0.09331 },
  { length: 119.0, L: -0.3521, M: 21.9568, S: 0.09362 },
  { length: 119.5, L: -0.3521, M: 22.1549, S: 0.09393 },
  { length: 120.0, L: -0.3521, M: 22.3533, S: 0.09424 }

]

// ======================================================
// WHO Weight-for-Height LMS Reference Data (GIRLS)
// Official WHO WHZ LMS Values
// Length/Height: 45–120 cm
// ======================================================

export const WHZ_LMS_GIRLS = [

  { length: 45.0,  L: -0.3833, M: 2.4607,  S: 0.09029 },
  { length: 45.5,  L: -0.3833, M: 2.5457,  S: 0.09033 },
  { length: 46.0,  L: -0.3833, M: 2.6306,  S: 0.09037 },
  { length: 46.5,  L: -0.3833, M: 2.7150,  S: 0.09040 },
  { length: 47.0,  L: -0.3833, M: 2.8007,  S: 0.09044 },
  { length: 47.5,  L: -0.3833, M: 2.8867,  S: 0.09048 },
  { length: 48.0,  L: -0.3833, M: 2.9741,  S: 0.09052 },
  { length: 48.5,  L: -0.3833, M: 3.0636,  S: 0.09056 },
  { length: 49.0,  L: -0.3833, M: 3.1560,  S: 0.09060 },
  { length: 49.5,  L: -0.3833, M: 3.2520,  S: 0.09064 },
  { length: 50.0,  L: -0.3833, M: 3.3518,  S: 0.09068 },
  { length: 50.5,  L: -0.3833, M: 3.4557,  S: 0.09072 },
  { length: 51.0,  L: -0.3833, M: 3.5636,  S: 0.09076 },
  { length: 51.5,  L: -0.3833, M: 3.6750,  S: 0.09080 },
  { length: 52.0,  L: -0.3833, M: 3.7911,  S: 0.09085 },
  { length: 52.5,  L: -0.3833, M: 3.9105,  S: 0.09090 },
  { length: 53.0,  L: -0.3833, M: 4.0320,  S: 0.09093 },
  { length: 53.5,  L: -0.3833, M: 4.1590,  S: 0.09098 },
  { length: 54.0,  L: -0.3833, M: 4.2875,  S: 0.09102 },
  { length: 54.5,  L: -0.3833, M: 4.4179,  S: 0.09106 },
  { length: 55.0,  L: -0.3833, M: 4.5498,  S: 0.09111 },
  { length: 55.5,  L: -0.3833, M: 4.6827,  S: 0.09114 },
  { length: 56.0,  L: -0.3833, M: 4.8162,  S: 0.09118 },
  { length: 56.5,  L: -0.3833, M: 4.9500,  S: 0.09121 },
  { length: 57.0,  L: -0.3833, M: 5.0837,  S: 0.09125 },
  { length: 57.5,  L: -0.3833, M: 5.2173,  S: 0.09128 },
  { length: 58.0,  L: -0.3833, M: 5.3500,  S: 0.09130 },
  { length: 58.5,  L: -0.3833, M: 5.4837,  S: 0.09132 },
  { length: 59.0,  L: -0.3833, M: 5.6151,  S: 0.09134 },
  { length: 59.5,  L: -0.3833, M: 5.7454,  S: 0.09135 },
  { length: 60.0,  L: -0.3833, M: 5.8742,  S: 0.09136 },
  { length: 60.5,  L: -0.3833, M: 6.0014,  S: 0.09137 },
  { length: 61.0,  L: -0.3833, M: 6.1270,  S: 0.09137 },
  { length: 61.5,  L: -0.3833, M: 6.2511,  S: 0.09136 },
  { length: 62.0,  L: -0.3833, M: 6.3738,  S: 0.09135 },
  { length: 62.5,  L: -0.3833, M: 6.4948,  S: 0.09133 },
  { length: 63.0,  L: -0.3833, M: 6.6144,  S: 0.09131 },
  { length: 63.5,  L: -0.3833, M: 6.7320,  S: 0.09129 },
  { length: 64.0,  L: -0.3833, M: 6.8501,  S: 0.09126 },
  { length: 64.5,  L: -0.3833, M: 6.9662,  S: 0.09123 },
  { length: 65.0,  L: -0.3833, M: 7.0812,  S: 0.09119 },
  { length: 65.5,  L: -0.3833, M: 7.1950,  S: 0.09115 },
  { length: 66.0,  L: -0.3833, M: 7.3076,  S: 0.09110 },
  { length: 66.5,  L: -0.3833, M: 7.4189,  S: 0.09106 },
  { length: 67.0,  L: -0.3833, M: 7.5288,  S: 0.09101 },
  { length: 67.5,  L: -0.3833, M: 7.6375,  S: 0.09096 },
  { length: 68.0,  L: -0.3833, M: 7.7448,  S: 0.09090 },
  { length: 68.5,  L: -0.3833, M: 7.8509,  S: 0.09085 },
  { length: 69.0,  L: -0.3833, M: 7.9559,  S: 0.09079 },
  { length: 69.5,  L: -0.3833, M: 8.0590,  S: 0.09074 },
  { length: 70.0,  L: -0.3833, M: 8.1630,  S: 0.09068 },
  { length: 70.5,  L: -0.3833, M: 8.2651,  S: 0.09062 },
  { length: 71.0,  L: -0.3833, M: 8.3666,  S: 0.09056 },
  { length: 71.5,  L: -0.3833, M: 8.4676,  S: 0.09050 },
  { length: 72.0,  L: -0.3833, M: 8.5679,  S: 0.09043 },
  { length: 72.5,  L: -0.3833, M: 8.6674,  S: 0.09037 },
  { length: 73.0,  L: -0.3833, M: 8.7661,  S: 0.09031 },
  { length: 73.5,  L: -0.3833, M: 8.8638,  S: 0.09025 },
  { length: 74.0,  L: -0.3833, M: 8.9601,  S: 0.09018 },
  { length: 74.5,  L: -0.3833, M: 9.0552,  S: 0.09012 },
  { length: 75.0,  L: -0.3833, M: 9.1490,  S: 0.09005 },
  { length: 75.5,  L: -0.3833, M: 9.2418,  S: 0.08999 },
  { length: 76.0,  L: -0.3833, M: 9.3337,  S: 0.08992 },
  { length: 76.5,  L: -0.3833, M: 9.4252,  S: 0.08985 },
  { length: 77.0,  L: -0.3833, M: 9.5166,  S: 0.08979 },
  { length: 77.5,  L: -0.3833, M: 9.6086,  S: 0.08972 },
  { length: 78.0,  L: -0.3833, M: 9.7015,  S: 0.08965 },
  { length: 78.5,  L: -0.3833, M: 9.7957,  S: 0.08959 },
  { length: 79.0,  L: -0.3833, M: 9.8915,  S: 0.08952 },
  { length: 79.5,  L: -0.3833, M: 9.9892,  S: 0.08946 },
  { length: 80.0,  L: -0.3833, M: 10.0891, S: 0.08940 },
  { length: 80.5,  L: -0.3833, M: 10.1916, S: 0.08934 },
  { length: 81.0,  L: -0.3833, M: 10.2965, S: 0.08928 },
  { length: 81.5,  L: -0.3833, M: 10.4041, S: 0.08923 },
  { length: 82.0,  L: -0.3833, M: 10.5140, S: 0.08918 },
  { length: 82.5,  L: -0.3833, M: 10.6263, S: 0.08914 },
  { length: 83.0,  L: -0.3833, M: 10.7410, S: 0.08910 },
  { length: 83.5,  L: -0.3833, M: 10.8578, S: 0.08906 },
  { length: 84.0,  L: -0.3833, M: 10.9767, S: 0.08903 },
  { length: 84.5,  L: -0.3833, M: 11.0974, S: 0.08900 },
  { length: 85.0,  L: -0.3833, M: 11.2198, S: 0.08898 },
  { length: 85.5,  L: -0.3833, M: 11.3435, S: 0.08897 },
  { length: 86.0,  L: -0.3833, M: 11.4684, S: 0.08895 },
  { length: 86.5,  L: -0.3833, M: 11.5940, S: 0.08895 },
  { length: 87.0,  L: -0.3833, M: 11.7201, S: 0.08895 },
  { length: 87.5,  L: -0.3833, M: 11.8461, S: 0.08896 },
  { length: 88.0,  L: -0.3833, M: 11.9720, S: 0.08896 },
  { length: 88.5,  L: -0.3833, M: 12.0976, S: 0.08898 },
  { length: 89.0,  L: -0.3833, M: 12.2229, S: 0.08900 },
  { length: 89.5,  L: -0.3833, M: 12.3477, S: 0.08903 },
  { length: 90.0,  L: -0.3833, M: 12.4723, S: 0.08906 },
  { length: 90.5,  L: -0.3833, M: 12.5965, S: 0.08909 },
  { length: 91.0,  L: -0.3833, M: 12.7205, S: 0.08913 },
  { length: 91.5,  L: -0.3833, M: 12.8442, S: 0.08918 },
  { length: 92.0,  L: -0.3833, M: 12.9681, S: 0.08923 },
  { length: 92.5,  L: -0.3833, M: 13.0920, S: 0.08928 },
  { length: 93.0,  L: -0.3833, M: 13.2158, S: 0.08934 },
  { length: 93.5,  L: -0.3833, M: 13.3399, S: 0.08941 },
  { length: 94.0,  L: -0.3833, M: 13.4643, S: 0.08948 },
  { length: 94.5,  L: -0.3833, M: 13.5892, S: 0.08955 },
  { length: 95.0,  L: -0.3833, M: 13.7146, S: 0.08963 },
  { length: 95.5,  L: -0.3833, M: 13.8408, S: 0.08972 },
  { length: 96.0,  L: -0.3833, M: 13.9675, S: 0.08981 },
  { length: 96.5,  L: -0.3833, M: 14.0953, S: 0.08990 },
  { length: 97.0,  L: -0.3833, M: 14.2239, S: 0.09000 },
  { length: 97.5,  L: -0.3833, M: 14.3537, S: 0.09010 },
  { length: 98.0,  L: -0.3833, M: 14.4848, S: 0.09021 },
  { length: 98.5,  L: -0.3833, M: 14.6174, S: 0.09033 },
  { length: 99.0,  L: -0.3833, M: 14.7519, S: 0.09044 },
  { length: 99.5,  L: -0.3833, M: 14.8882, S: 0.09057 },
  { length: 100.0, L: -0.3833, M: 15.0267, S: 0.09069 },
  { length: 100.5, L: -0.3833, M: 15.1676, S: 0.09083 },
  { length: 101.0, L: -0.3833, M: 15.3108, S: 0.09096 },
  { length: 101.5, L: -0.3833, M: 15.4564, S: 0.09110 },
  { length: 102.0, L: -0.3833, M: 15.6046, S: 0.09125 },
  { length: 102.5, L: -0.3833, M: 15.7553, S: 0.09139 },
  { length: 103.0, L: -0.3833, M: 15.9087, S: 0.09155 },
  { length: 103.5, L: -0.3833, M: 16.0645, S: 0.09170 },
  { length: 104.0, L: -0.3833, M: 16.2229, S: 0.09186 },
  { length: 104.5, L: -0.3833, M: 16.3837, S: 0.09203 },
  { length: 105.0, L: -0.3833, M: 16.5470, S: 0.09219 },
  { length: 105.5, L: -0.3833, M: 16.7123, S: 0.09236 },
  { length: 106.0, L: -0.3833, M: 16.8814, S: 0.09254 },
  { length: 106.5, L: -0.3833, M: 17.0527, S: 0.09271 },
  { length: 107.0, L: -0.3833, M: 17.2269, S: 0.09289 },
  { length: 107.5, L: -0.3833, M: 17.4039, S: 0.09307 },
  { length: 108.0, L: -0.3833, M: 17.5863, S: 0.09344 },
  { length: 108.5, L: -0.3833, M: 17.7668, S: 0.09363 },
  { length: 109.0, L: -0.3833, M: 17.9526, S: 0.09382 },
  { length: 109.5, L: -0.3833, M: 18.1412, S: 0.09401 },
  { length: 110.0, L: -0.3833, M: 18.3324, S: 0.09440 },
  { length: 110.5, L: -0.3833, M: 18.8015, S: 0.09448 },
  { length: 111.0, L: -0.3833, M: 19.0000, S: 0.09467 },
  { length: 111.5, L: -0.3833, M: 19.2024, S: 0.09487 },
  { length: 112.0, L: -0.3833, M: 19.4060, S: 0.09507 },
  { length: 112.5, L: -0.3833, M: 19.6116, S: 0.09527 },
  { length: 113.0, L: -0.3833, M: 19.8189, S: 0.09546 },
  { length: 113.5, L: -0.3833, M: 20.0280, S: 0.09566 },
  { length: 114.0, L: -0.3833, M: 20.2385, S: 0.09586 },
  { length: 114.5, L: -0.3833, M: 20.4502, S: 0.09606 },
  { length: 115.0, L: -0.3833, M: 20.6629, S: 0.09626 },
  { length: 115.5, L: -0.3833, M: 20.8766, S: 0.09646 },
  { length: 116.0, L: -0.3833, M: 21.0909, S: 0.09666 },
  { length: 116.5, L: -0.3833, M: 21.3059, S: 0.09686 },
  { length: 117.0, L: -0.3833, M: 21.5213, S: 0.09707 },
  { length: 117.5, L: -0.3833, M: 21.7370, S: 0.09727 },
  { length: 118.0, L: -0.3833, M: 21.9529, S: 0.09747 },
  { length: 118.5, L: -0.3833, M: 22.1690, S: 0.09767 },
  { length: 119.0, L: -0.3833, M: 22.3851, S: 0.09788 },
  { length: 119.5, L: -0.3833, M: 22.6012, S: 0.09809 },
  { length: 120.0, L: -0.3833, M: 22.8174, S: 0.09830 }

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
export function getUnderweightStatus(
  gender,
  dob,
  weight
) {

  if (!weight) return null

  const ageMonths = getAgeMonths(dob)

  const lmsData =
    gender === 'boy'
      ? WAZ_LMS_BOYS
      : WAZ_LMS_GIRLS

  const { L, M, S } =
    getLMSValues(lmsData, ageMonths)

  const z =
    computeZScore(weight, L, M, S)

  if (z < -3) {

    return {
      status: 'severe',
      label: 'Severely Underweight',
      z: z.toFixed(2),
      color: 'text-red-600',
    }
  }

  if (z < -2) {

    return {
      status: 'moderate',
      label: 'Moderately Underweight',
      z: z.toFixed(2),
      color: 'text-orange-500',
    }
  }

  return {

    status: 'normal',
    label: 'Normal',
    z: z.toFixed(2),
    color: 'text-green-600',
  }
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
    underweight: getUnderweightStatus(
  gender,
  dob,
  weight
),
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
