/**
 * JuiceTap - Google Apps Script API Endpoint
 * 
 * Instructions for setup:
 * 1. Open Google Sheets (https://sheets.google.com).
 * 2. Create a new Sheet and name it "JuiceTap Locations".
 * 3. In Row 1 (Header row), set the following exact column names:
 *    id | name | address | city | state | pincode | latitude | longitude | phone | timings | status | created_at
 * 
 * 4. Add your location data in subsequent rows. Set status to "active" for locations to appear on the public website.
 * 
 * 5. Open Extensions > Apps Script in Google Sheets menu.
 * 6. Replace all contents in Code.gs with this script code.
 * 7. Click "Deploy" > "New deployment".
 * 8. Select type: "Web app".
 * 9. Description: "JuiceTap Location API".
 * 10. Execute as: "Me" (your Google Account).
 * 11. Who has access: "Anyone" (allows public read access without requiring login).
 * 12. Click "Deploy", authorize permissions if prompted, and copy the Web App URL.
 * 13. Set VITE_LOCATION_API_URL in your JuiceTap project .env file to the Web App URL.
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (!data || data.length <= 1) {
      return createJsonResponse({
        success: true,
        locations: []
      });
    }

    const headers = data[0].map(h => String(h).trim().toLowerCase());
    
    // Map column indices safely
    const getIndex = (colName) => headers.indexOf(colName.toLowerCase());
    
    const idIdx = getIndex('id');
    const nameIdx = getIndex('name');
    const addressIdx = getIndex('address');
    const cityIdx = getIndex('city');
    const stateIdx = getIndex('state');
    const pincodeIdx = getIndex('pincode');
    const latIdx = getIndex('latitude');
    const lngIdx = getIndex('longitude');
    const phoneIdx = getIndex('phone');
    const timingsIdx = getIndex('timings');
    const statusIdx = getIndex('status');

    const locations = [];

    // Loop through data rows (skipping header at row index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      const status = statusIdx !== -1 ? String(row[statusIdx] || '').trim().toLowerCase() : '';
      
      // Filter strictly for active locations
      if (status === 'active') {
        const id = idIdx !== -1 ? String(row[idIdx] || '').trim() : `JT${i.toString().padStart(3, '0')}`;
        const name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : '';
        const address = addressIdx !== -1 ? String(row[addressIdx] || '').trim() : '';
        const city = cityIdx !== -1 ? String(row[cityIdx] || '').trim() : '';
        const state = stateIdx !== -1 ? String(row[stateIdx] || '').trim() : '';
        const pincode = pincodeIdx !== -1 ? String(row[pincodeIdx] || '').trim() : '';
        
        let latitude = latIdx !== -1 ? parseFloat(row[latIdx]) : null;
        let longitude = lngIdx !== -1 ? parseFloat(row[lngIdx]) : null;
        
        if (isNaN(latitude)) latitude = null;
        if (isNaN(longitude)) longitude = null;
        
        const phone = phoneIdx !== -1 ? String(row[phoneIdx] || '').trim() : '';
        const timings = timingsIdx !== -1 ? String(row[timingsIdx] || '').trim() : '';

        // Include valid row if name or address exists
        if (name || address) {
          locations.push({
            id: id || `JT${i.toString().padStart(3, '0')}`,
            name,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            phone,
            timings
          });
        }
      }
    }

    return createJsonResponse({
      success: true,
      locations: locations
    });

  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "Unable to retrieve locations",
      locations: []
    });
  }
}

/**
 * OPTIONAL: Run this function directly inside Google Apps Script editor
 * to automatically seed/populate all 46 JuiceTap locations into the sheet.
 * Existing IDs will not be duplicated.
 */
function seedInitialJuiceTapLocations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Create Header if missing
  if (!data || data.length === 0 || data[0].length === 0 || data[0][0] === '') {
    sheet.appendRow([
      'id', 'name', 'address', 'city', 'state', 'pincode',
      'latitude', 'longitude', 'phone', 'timings', 'status', 'created_at'
    ]);
  }

  const existingIds = new Set();
  const currentData = sheet.getDataRange().getValues();
  for (let i = 1; i < currentData.length; i++) {
    if (currentData[i][0]) {
      existingIds.add(String(currentData[i][0]).trim());
    }
  }

  // Pre-formatted array of all 46 existing JuiceTap locations
  const initialData = [
    ["JT001","VR Mall","Dumas Rd, Magdalla, Surat, Gujarat 395007","Surat","Gujarat","395007",21.1462,72.7702,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT002","International Wealth Centre (IWC)","UG-5, International Wealth Centre, Vip Road, Golkiwad, Vesu, Surat, Gujarat 395002","Surat","Gujarat","395002",21.1524,72.7758,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT003","Funstrike","Pal Gam, Surat, Gujarat 394510","Surat","Gujarat","394510",21.1963,72.7842,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT004","Venus Hospital","SRSS Venus Hospital Rd, Rampura, Katargam Darwaja, Surat, Gujarat 395003","Surat","Gujarat","395003",21.2052,72.8251,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT005","SIDS Hospital","Ring Rd, near Shell Petrol Pump, Sosyo Circle, Khatodra Wadi, Surat, Gujarat 395002","Surat","Gujarat","395002",21.1714,72.8362,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT006","SUR Office","Surat Central Corporate Office, Surat, Gujarat 395003","Surat","Gujarat","395003",21.1702,72.8311,"+918511533004","09 AM - 08 PM","active","2026-08-12"],
    ["JT007","Aljamea-tus-Saifiyah","Devdi Mubarak, Zampa Bazaar, Surat, Gujarat 395003","Surat","Gujarat","395003",21.1985,72.8339,"+918511533004","08 AM - 08 PM","active","2026-08-12"],
    ["JT008","Rebounce","Next to Prime Shoppers, opp. Happy Residency, Vesu, Surat, Gujarat 395007","Surat","Gujarat","395007",21.1448,72.7663,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT009","Vesu Canal Walkway","Canal Road, Vesu Promenade, Surat, Gujarat 395007","Surat","Gujarat","395007",21.1492,72.7695,"+918511533004","06 AM - 10 PM","active","2026-08-12"],
    ["JT010","Equinox BKC","Lal Bahadur Shastri Marg, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070","Mumbai","Maharashtra","400070",19.0682,72.8712,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT011","ATLAS SkillTech University","Equinox Business Park, Ambedkar Nagar, Kurla West, Kurla, Mumbai, Maharashtra 400070","Mumbai","Maharashtra","400070",19.0685,72.8715,"+918511533004","08 AM - 08 PM","active","2026-08-12"],
    ["JT012","Inorbit Mall Malad","New Link Rd, Malad, Malad West, Mumbai, Maharashtra 400104","Mumbai","Maharashtra","400104",19.1732,72.8361,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT013","Reliance Corporate Park (Office 1)","Thane - Belapur Rd, Reliance Corporate Park, Ghansoli, Navi Mumbai, Maharashtra 400701","Mumbai","Maharashtra","400701",19.1245,73.0135,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT014","Reliance Corporate Park (Office 2)","Thane - Belapur Rd, Reliance Corporate Park, Ghansoli, Navi Mumbai, Maharashtra 400701","Mumbai","Maharashtra","400701",19.125,73.014,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT015","Vivarea Tower E","Ground floor, Raheja Platinum, Road, off Andheri - Kurla Road, Sag Baug, Marol, Andheri East, Mumbai 400059","Mumbai","Maharashtra","400059",19.1172,72.8875,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT016","TRIL Infinity IT Park Goregaon","Podium Floor, Infinity IT Park, Building 4, 239 General A.K. Vaidya Marg, Malad East, Mumbai 400097","Mumbai","Maharashtra","400097",19.1752,72.8685,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT017","Vivarea Tower B, Mahalaxmi","Raheja Modern Vivarea, Keshavrao Khadye Marg, Clerk Road, Mahalaxmi, Mumbai 400011","Mumbai","Maharashtra","400011",18.9812,72.8275,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT018","Bounce Infiniti Mall","4th Floor, Infiniti Mall, New Link Rd, Malad West, Mumbai, Maharashtra 400064","Mumbai","Maharashtra","400064",19.1852,72.8345,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT019","Trade Centre BKC","Trade Centre BKC, 309, Kolivery Village, MMRDA Area, Kalina, Bandra East, Mumbai 400098","Mumbai","Maharashtra","400098",19.0645,72.8665,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT020","Nesco IT Park","Western Express Highway, NESCO, Goregaon, Mumbai, Maharashtra 400063","Mumbai","Maharashtra","400063",19.1558,72.8542,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT021","Artesia Building, Worli","Raheja Artesia, Dr Annie Besant Rd, Worli, Mumbai, Maharashtra 400030","Mumbai","Maharashtra","400030",19.0145,72.8182,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT022","Saki Naka Metro Station","Andheri-Ghatkopar Link Road, Junction near Saki Naka, Mumbai, Maharashtra 400072","Mumbai","Maharashtra","400072",19.0882,72.8812,"+918511533004","06 AM - 11 PM","active","2026-08-12"],
    ["JT023","DN Nagar Metro Station","Sahayog Nagar, Bhudargarh Colony, Andheri West, Mumbai, Maharashtra 400053","Mumbai","Maharashtra","400053",19.1252,72.8262,"+918511533004","06 AM - 11 PM","active","2026-08-12"],
    ["JT024","JLL Workplace One BKC","One BKC, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051","Mumbai","Maharashtra","400051",19.0642,72.8672,"+918511533004","09 AM - 08 PM","active","2026-08-12"],
    ["JT025","Marathon Futurex","Mafatlal Mills Compound, NM Joshi Marg, Lower Parel, Mumbai, Maharashtra 400013","Mumbai","Maharashtra","400013",18.9952,72.8302,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT026","NESCO Exhibition Centre","Western Express Hwy, NESCO, Goregaon East, Mumbai, Maharashtra 400063","Mumbai","Maharashtra","400063",19.1565,72.855,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT027","Rupa Renaissance","D-33, Turbhe MIDC Rd, TTC Industrial Area, MIDC Industrial Area, Turbhe, Navi Mumbai 400703","Mumbai","Maharashtra","400703",19.0522,73.0182,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT028","CSMIA Airport T1 & T2 Arrivals","Chhatrapati Shivaji Maharaj International Airport, Arrivals Level, Vile Parle, Mumbai 400099","Mumbai","Maharashtra","400099",19.0896,72.8656,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT029","Aurum Q Park","Thane - Belapur Rd, Reliance Corporate Park, MIDC Industrial Area, Ghansoli, Navi Mumbai 400710","Mumbai","Maharashtra","400710",19.1235,73.0125,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT030","Winchester Powai","Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076","Mumbai","Maharashtra","400076",19.1192,72.9092,"+918511533004","09 AM - 09 PM","active","2026-08-12"],
    ["JT031","Marengo CIMS Hospital","Plot No. 67/1, opp. Panchamrut Bunglows, nr. Shukan Mall, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat 380060","Ahmedabad","Gujarat","380060",23.0762,72.5262,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT032","Adani International School","Shantigram, S.G. Highway Ring Road, Ahmedabad, Gujarat 382421","Ahmedabad","Gujarat","382421",23.1382,72.5592,"+918511533004","08 AM - 05 PM","active","2026-08-12"],
    ["JT033","Noble Gastro Hospital","5th & 6th Floor, Shaival Imperia, Mithakhali Six Rd, opp. Nalanda Hotel, Ellisbridge, Ahmedabad, Gujarat 380009","Ahmedabad","Gujarat","380009",23.0232,72.5642,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT034","Welspun GCC","CH-6, Adani Shantigram, Adalaj, Ahmedabad, Gujarat 382501","Ahmedabad","Gujarat","382501",23.1362,72.5572,"+918511533004","09 AM - 08 PM","active","2026-08-12"],
    ["JT035","Shree Balaji Agora Mall","Tapovan Circle, Bhat Circle, 200 ft Sardar Patel Ring Rd, Chandkheda, Ahmedabad, Gujarat 382421","Ahmedabad","Gujarat","382421",23.1182,72.5952,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT036","KD Hospital","Sarkhej - Gandhinagar Hwy, Vaishno Devi Circle, Ahmedabad, Gujarat 382421","Ahmedabad","Gujarat","382421",23.1142,72.5382,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT037","Delhi Escorts Fortis IPD","Metro Station, Okhla Rd, opp. Sukhdev Vihar, New Friends Colony, New Delhi, Delhi 110025","Delhi","Delhi NCR","110025",28.5612,77.2782,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT038","Delhi Escorts Fortis OPD","Fortis Escorts Heart Institute, Okhla Road, New Friends Colony, New Delhi, Delhi 110025","Delhi","Delhi NCR","110025",28.5615,77.2785,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT039","Mall of Jaipur","Gandhi Path Rd, B Block, Vaishali Nagar, Jaipur, Rajasthan 302021","Jaipur","Rajasthan","302021",26.8982,75.7482,"+918511533004","10 AM - 10 PM","active","2026-08-12"],
    ["JT040","Metro Mass Hospital","Shipra Path, Near Technology park, Shanthi Nagar, Mansarovar, Jaipur, Rajasthan 302020","Jaipur","Rajasthan","302020",26.8532,75.7682,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT041","CK Birla Hospital","Gopalpura Bypass Rd, near Triveni Bridge, Vishveshvariya Nagar, Gopal Pura Mode, Jaipur, Rajasthan 302018","Jaipur","Rajasthan","302018",26.8622,75.7892,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT042","Indus Hospital","Shipra Path, near Technology Park, Shanthi Nagar, Mansarovar, Jaipur, Rajasthan 302020","Jaipur","Rajasthan","302020",26.8535,75.7685,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT043","Rungta Hospital","Calgiri Marg, near Police Station, Jhalana Gram, Malviya Nagar, Jaipur, Rajasthan 302017","Jaipur","Rajasthan","302017",26.8542,75.8142,"+918511533004","24 Hours","active","2026-08-12"],
    ["JT044","SOU Children Nutrition Park","Children Nutrition Park Complex, Ekta Nagar, Kevadia, Gujarat 393151","Statue of Unity","Gujarat","393151",21.8382,73.7142,"+918511533004","09 AM - 07 PM","active","2026-08-12"],
    ["JT045","Jungle Safari SOU","Jungle Safari Complex, Kevadia, Narmada District, Gujarat 393151","Statue of Unity","Gujarat","393151",21.8422,73.7212,"+918511533004","09 AM - 07 PM","active","2026-08-12"],
    ["JT046","SOU SBB (Shreshtha Bharat Bhavan)","Shreshtha Bharat Bhavan Complex, Kevadia, Gujarat 393151","Statue of Unity","Gujarat","393151",21.8352,73.7182,"+918511533004","09 AM - 07 PM","active","2026-08-12"]
  ];

  let addedCount = 0;
  initialData.forEach(row => {
    const id = row[0];
    if (!existingIds.has(id)) {
      sheet.appendRow(row);
      addedCount++;
    }
  });

  Logger.log('Seeded ' + addedCount + ' new JuiceTap locations.');
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
