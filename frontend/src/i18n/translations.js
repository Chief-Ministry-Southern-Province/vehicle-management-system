export const languages = [
  { code: "en", nativeLabel: "English", locale: "en-LK" },
  { code: "si", nativeLabel: "සිංහල", locale: "si-LK" },
  { code: "ta", nativeLabel: "தமிழ்", locale: "ta-LK" },
];

export const translations = {
  en: { "app.name":"Vehicle Management System","app.ministry":"Chief Ministry","app.location":"Dakshinapaya, Labuduwa, Galle","app.fleet":"Government Fleet","app.country":"Sri Lanka","language.label":"Language","user.government":"Government User","role.employee":"Employee","role.department_officer":"Department Officer","role.subject_officer":"Subject Officer","role.deputy_secretary":"Assistance Secreatry","role.senior_deputy_secretary":"Senior Assistance Secretary","role.secretary":"Secretary","role.driver":"Driver","nav.main":"Main","nav.fleet_operations":"Fleet Operations","nav.details":"Details","nav.organization":"Organization","nav.dashboard":"Dashboard","nav.request_history":"Request History","nav.approved_journeys":"Approved Journeys","nav.total_approvals":"Total Approvals","nav.pending_approvals":"Pending Approvals","nav.vehicle_directory":"Vehicle Directory","nav.driver_directory":"Driver Directory","nav.fuel_management":"Fuel Management","nav.service_records":"Service Records","nav.repair_records":"Repair Records","nav.vehicle_details":"Vehicle Details","nav.driver_details":"Driver Details","nav.fuel_records":"Fuel Records","nav.reports":"Reports","nav.drivers":"Drivers","nav.user_settings":"User Settings","nav.return_to_previous_page":"Return to previous page","nav.logout":"Logout" },
  si: { "app.name":"වාහන කළමනාකරණ පද්ධතිය","app.ministry":"ප්‍රධාන අමාත්‍යාංශය","app.location":"දක්ෂිණපාය, ලබුදූව, ගාල්ල","app.fleet":"රජයේ වාහන සංචිතය","app.country":"ශ්‍රී ලංකාව","language.label":"භාෂාව","user.government":"රාජ්‍ය පරිශීලක","role.employee":"සේවක","role.department_officer":"දෙපාර්තමේන්තු නිලධාරී","role.subject_officer":"විෂය නිලධාරී","role.deputy_secretary":"නියෝජ්‍ය ලේකම්","role.senior_deputy_secretary":"ජ්‍යෙෂ්ඨ නියෝජ්‍ය ලේකම්","role.secretary":"ලේකම්","role.driver":"රියදුරු","nav.main":"ප්‍රධාන","nav.fleet_operations":"වාහන මෙහෙයුම්","nav.details":"විස්තර","nav.organization":"ආයතනය","nav.dashboard":"උපකරණ පුවරුව","nav.request_history":"ඉල්ලීම් ඉතිහාසය","nav.approved_journeys":"අනුමත ගමන්","nav.total_approvals":"සියලු අනුමැති","nav.pending_approvals":"අපේක්ෂිත අනුමැති","nav.vehicle_directory":"වාහන නාමාවලිය","nav.driver_directory":"රියදුරු නාමාවලිය","nav.fuel_management":"ඉන්ධන කළමනාකරණය","nav.service_records":"සේවා වාර්තා","nav.repair_records":"අලුත්වැඩියා වාර්තා","nav.vehicle_details":"වාහන විස්තර","nav.driver_details":"රියදුරු විස්තර","nav.fuel_records":"ඉන්ධන වාර්තා","nav.reports":"වාර්තා","nav.drivers":"රියදුරන්","nav.user_settings":"පරිශීලක සැකසුම්","nav.return_to_previous_page":"පෙර පිටුවට ආපසු යන්න","nav.logout":"ඉවත් වන්න" },
  ta: { "app.name":"வாகன முகாமைத்துவ அமைப்பு","app.ministry":"முதன்மை அமைச்சு","app.location":"தக்ஷிணபாய, லபுதுவ, காலி","app.fleet":"அரச வாகனத் தொகுதி","app.country":"இலங்கை","language.label":"மொழி","user.government":"அரச பயனர்","role.employee":"ஊழியர்","role.department_officer":"திணைக்கள அலுவலர்","role.subject_officer":"விடய அலுவலர்","role.deputy_secretary":"பிரதிச் செயலாளர்","role.senior_deputy_secretary":"சிரேஷ்ட பிரதிச் செயலாளர்","role.secretary":"செயலாளர்","role.driver":"சாரதி","nav.main":"முதன்மை","nav.fleet_operations":"வாகனச் செயற்பாடுகள்","nav.details":"விபரங்கள்","nav.organization":"நிறுவனம்","nav.dashboard":"முகப்புப்பலகை","nav.request_history":"கோரிக்கை வரலாறு","nav.approved_journeys":"அங்கீகரிக்கப்பட்ட பயணங்கள்","nav.total_approvals":"அனைத்து அங்கீகாரங்கள்","nav.pending_approvals":"நிலுவை அங்கீகாரங்கள்","nav.vehicle_directory":"வாகனப் பட்டியல்","nav.driver_directory":"சாரதிப் பட்டியல்","nav.fuel_management":"எரிபொருள் முகாமைத்துவம்","nav.service_records":"சேவைப் பதிவுகள்","nav.repair_records":"திருத்தப் பதிவுகள்","nav.vehicle_details":"வாகன விபரங்கள்","nav.driver_details":"சாரதி விபரங்கள்","nav.fuel_records":"எரிபொருள் பதிவுகள்","nav.reports":"அறிக்கைகள்","nav.drivers":"சாரதிகள்","nav.user_settings":"பயனர் அமைப்புகள்","nav.return_to_previous_page":"முந்தைய பக்கத்திற்குத் திரும்பு","nav.logout":"வெளியேறு" },
};

Object.assign(translations.en, {
  "odometer.reviewCompleted": "Review completed trips and their actual distance traveled.",
  "odometer.totalActual": "Total actual distance",
  "odometer.totalDetail": "Recorded journeys only; shared journeys counted once",
  "odometer.calculation": "Ending meter reading minus starting meter reading",
  "odometer.start": "Starting meter reading (km)",
  "odometer.end": "Ending meter reading (km)",
  "odometer.actual": "Actual distance traveled",
  "odometer.allocated": "Allocated distance (round trip)",
  "odometer.notRecorded": "Not recorded",
  "odometer.missingStart": "This journey has no starting reading. Enter the reading recorded before departure to complete it.",
  "odometer.shared": "These readings apply to the whole consolidated journey and are saved for each included request.",
});
Object.assign(translations.si, {
  "odometer.reviewCompleted": "අවසන් කළ ගමන් සහ ගමන් කළ සැබෑ දුර සමාලෝචනය කරන්න.",
  "odometer.totalActual": "මුළු සැබෑ දුර",
  "odometer.totalDetail": "කියවීම් ඇති ගමන් පමණි; ඒකාබද්ධ ගමන් එක් වරක් ගණනය කෙරේ",
  "odometer.calculation": "අවසාන මීටර් කියවීමෙන් ආරම්භක මීටර් කියවීම අඩු කිරීම",
  "odometer.start": "ආරම්භක මීටර් කියවීම (කි.මී.)",
  "odometer.end": "අවසාන මීටර් කියවීම (කි.මී.)",
  "odometer.actual": "ගමන් කළ සැබෑ දුර",
  "odometer.allocated": "වෙන් කළ දුර (යාම සහ ආපසු ඒම)",
  "odometer.notRecorded": "සටහන් කර නැත",
  "odometer.missingStart": "මෙම ගමනේ ආරම්භක කියවීමක් නැත. ගමන අවසන් කිරීමට පිටත් වීමට පෙර සටහන් කළ කියවීම ඇතුළත් කරන්න.",
  "odometer.shared": "මෙම කියවීම් සම්පූර්ණ ඒකාබද්ධ ගමනට අදාළ වන අතර ඇතුළත් සෑම ඉල්ලීමකටම සුරැකේ.",
});
Object.assign(translations.ta, {
  "odometer.reviewCompleted": "முடிக்கப்பட்ட பயணங்களையும் பயணித்த உண்மையான தூரத்தையும் பார்வையிடவும்.",
  "odometer.totalActual": "மொத்த உண்மையான தூரம்",
  "odometer.totalDetail": "அளவீடுள்ள பயணங்கள் மட்டும்; இணைந்த பயணங்கள் ஒருமுறை கணக்கிடப்படும்",
  "odometer.calculation": "இறுதி மீட்டர் அளவீட்டிலிருந்து தொடக்க மீட்டர் அளவீட்டைக் கழித்தல்",
  "odometer.start": "தொடக்க மீட்டர் அளவீடு (கி.மீ.)",
  "odometer.end": "இறுதி மீட்டர் அளவீடு (கி.மீ.)",
  "odometer.actual": "பயணித்த உண்மையான தூரம்",
  "odometer.allocated": "ஒதுக்கப்பட்ட தூரம் (இருவழிப் பயணம்)",
  "odometer.notRecorded": "பதிவு செய்யப்படவில்லை",
  "odometer.missingStart": "இந்தப் பயணத்தின் தொடக்க அளவீடு இல்லை. பயணத்தை முடிக்க புறப்படுவதற்கு முன் பதிவு செய்த அளவீட்டை உள்ளிடவும்.",
  "odometer.shared": "இந்த அளவீடுகள் முழு இணைந்த பயணத்திற்கும் பொருந்தும். சேர்க்கப்பட்ட ஒவ்வொரு கோரிக்கைக்கும் சேமிக்கப்படும்.",
});

Object.assign(translations.en, {
  "notifications.title": "Notifications",
  "notifications.deviceAlertsEnabled": "Device alerts enabled",
  "notifications.enableDeviceAlerts": "Enable alerts when the app is closed",
  "notifications.enablingDeviceAlerts": "Enabling device alerts…",
  "notifications.deviceAlertsDenied": "Device alerts are blocked in your browser settings.",
  "notifications.deviceAlertsUnsupported": "This browser does not support device alerts.",
  "notifications.deviceAlertsError": "Unable to enable device alerts.",
});

Object.assign(translations.si, {
  "notifications.title": "දැනුම්දීම්",
  "notifications.deviceAlertsEnabled": "උපාංග දැනුම්දීම් සක්‍රියයි",
  "notifications.enableDeviceAlerts": "යෙදුම වසා ඇති විට දැනුම්දීම් සක්‍රිය කරන්න",
  "notifications.enablingDeviceAlerts": "උපාංග දැනුම්දීම් සක්‍රිය කරමින්…",
  "notifications.deviceAlertsDenied": "ඔබගේ බ්‍රවුසර සැකසුම් තුළ උපාංග දැනුම්දීම් අවහිර කර ඇත.",
  "notifications.deviceAlertsUnsupported": "මෙම බ්‍රවුසරය උපාංග දැනුම්දීම් සඳහා සහය නොදක්වයි.",
  "notifications.deviceAlertsError": "උපාංග දැනුම්දීම් සක්‍රිය කළ නොහැක.",
});

Object.assign(translations.ta, {
  "notifications.title": "அறிவிப்புகள்",
  "notifications.deviceAlertsEnabled": "சாதன அறிவிப்புகள் இயக்கப்பட்டுள்ளன",
  "notifications.enableDeviceAlerts": "செயலி மூடப்பட்டிருக்கும்போது அறிவிப்புகளை இயக்கவும்",
  "notifications.enablingDeviceAlerts": "சாதன அறிவிப்புகள் இயக்கப்படுகின்றன…",
  "notifications.deviceAlertsDenied": "உங்கள் உலாவி அமைப்புகளில் சாதன அறிவிப்புகள் தடுக்கப்பட்டுள்ளன.",
  "notifications.deviceAlertsUnsupported": "இந்த உலாவி சாதன அறிவிப்புகளை ஆதரிக்கவில்லை.",
  "notifications.deviceAlertsError": "சாதன அறிவிப்புகளை இயக்க முடியவில்லை.",
});

// Fuel Analysis table and journey detail labels.
const fuelLabels = {
  monthlyDistance: ["Monthly distance analysis", "මාසික දුර විශ්ලේෂණය", "மாதாந்திர தூரப் பகுப்பாய்வு"],
  monthlyExtraFuel: ["Monthly Extra Fuel", "මාසික අමතර ඉන්ධන", "மாதாந்திர கூடுதல் எரிபொருள்"],
  month: ["Month", "මාසය", "மாதம்"],
  chartDetail: ["Completion month • Selected filters apply • Missing values are excluded", "අවසන් කළ මාසය • තෝරාගත් පෙරහන් අදාළ වේ • නොමැති අගයන් බැහැර කෙරේ", "முடிவடைந்த மாதம் • தேர்ந்தெடுத்த வடிகட்டிகள் பொருந்தும் • விடுபட்ட மதிப்புகள் விலக்கப்படும்"],
  chartLoading: ["Loading analysis…", "විශ්ලේෂණය පූරණය වෙමින්…", "பகுப்பாய்வு ஏற்றப்படுகிறது…"],
  chartError: ["Unable to load analysis.", "විශ්ලේෂණය පූරණය කළ නොහැක.", "பகுப்பாய்வை ஏற்ற முடியவில்லை."],
  chartEmpty: ["No recorded values for these filters.", "මෙම පෙරහන් සඳහා වාර්තා කළ අගයන් නොමැත.", "இந்த வடிகட்டிகளுக்குப் பதிவுசெய்யப்பட்ட மதிப்புகள் இல்லை."],
  completedFrom: ["Completed from", "අවසන් කළ දිනය සිට", "முடிவடைந்த திகதி முதல்"],
  completedTo: ["Completed to", "අවසන් කළ දිනය දක්වා", "முடிவடைந்த திகதி வரை"],
  clearFilters: ["Clear filters", "පෙරහන් ඉවත් කරන්න", "வடிகட்டிகளை அழி"],
  invalidRange: ["The end date must be on or after the start date.", "අවසන් දිනය ආරම්භක දිනයට පෙර විය නොහැක.", "இறுதித் திகதி தொடக்கத் திகதிக்கு முந்தையதாக இருக்கக்கூடாது."],
  totalAllocated: ["Total allocated distance", "මුළු වෙන් කළ දුර", "மொத்த ஒதுக்கப்பட்ட தூரம்"],
  allocatedDetail: ["Sum of each request's planned round trip", "එක් එක් ඉල්ලීමේ යාම සහ ඒම සඳහා සැලසුම් කළ දුර එකතුව", "ஒவ்வொரு கோரிக்கையின் திட்டமிட்ட இருவழித் தூரத்தின் கூட்டுத்தொகை"],
  filteredTotals: ["Totals for displayed requests", "පෙන්වන ඉල්ලීම්වල එකතුව", "காட்டப்படும் கோரிக்கைகளின் மொத்தம்"],
  driverName: ["Driver Name", "රියදුරු නම", "சாரதி பெயர்"],
  extraFuel: ["Extra Fuel (L)", "අමතර ඉන්ධන (L)", "கூடுதல் எரிபொருள் (L)"],
  view: ["View more", "තවත් බලන්න", "மேலும் பார்க்க"],
  close: ["Close", "වසන්න", "மூடு"],
  requester: ["Requester", "ඉල්ලුම්කරු", "கோரிக்கையாளர்"],
  department: ["Department", "දෙපාර්තමේන්තුව", "திணைக்களம்"],
  purpose: ["Purpose", "අරමුණ", "நோக்கம்"],
  starting: ["Starting location", "ආරම්භක ස්ථානය", "தொடக்க இடம்"],
  destination: ["Destination", "ගමනාන්තය", "சேருமிடம்"],
  passengers: ["Passenger count", "මගීන් ගණන", "பயணிகள் எண்ணிக்கை"],
  passengerNames: ["Passenger names", "මගීන්ගේ නම්", "பயணிகள் பெயர்கள்"],
  driverId: ["Driver number", "රියදුරු අංකය", "சாரதி எண்"],
  vehicle: ["Vehicle registration number", "වාහන ලියාපදිංචි අංකය", "வாகனப் பதிவு எண்"],
  parking: ["Parking location", "නවතා තබන ස්ථානය", "நிறுத்துமிடம்"],
  recommender: ["Recommended by", "නිර්දේශ කළේ", "பரிந்துரைத்தவர்"],
  notes: ["Recommendation notes", "නිර්දේශ සටහන්", "பரிந்துரைக் குறிப்புகள்"],
  allocator: ["Allocated by", "වෙන් කළේ", "ஒதுக்கியவர்"],
  approver: ["Approved by", "අනුමත කළේ", "அனுமதித்தவர்"],
  departure_at: ["Departure", "පිටත්වීම", "புறப்பாடு"],
  expected_return_at: ["Expected return", "අපේක්ෂිත ආපසු පැමිණීම", "எதிர்பார்க்கப்படும் திரும்புதல்"],
  journey_started_at: ["Journey started", "ගමන ආරම්භ කළ වේලාව", "பயணம் தொடங்கிய நேரம்"],
  journey_completed_at: ["Journey completed", "ගමන අවසන් කළ වේලාව", "பயணம் முடிந்த நேரம்"],
  recommended_at: ["Recommended at", "නිර්දේශ කළ වේලාව", "பரிந்துரைத்த நேரம்"],
  allocated_at: ["Allocated at", "වෙන් කළ වේලාව", "ஒதுக்கிய நேரம்"],
  approved_at: ["Approved at", "අනුමත කළ වේලාව", "அனுமதித்த நேரம்"],
  reallocated_at: ["Reallocated at", "නැවත වෙන් කළ වේලාව", "மீண்டும் ஒதுக்கிய நேரம்"],
  reallocation: ["Reallocation reason", "නැවත වෙන් කිරීමට හේතුව", "மீண்டும் ஒதுக்கிய காரணம்"],
  attachment: ["View attachment", "ඇමුණුම බලන්න", "இணைப்பைப் பார்க்க"],
};
for (const [key, labels] of Object.entries(fuelLabels)) {
  ["en", "si", "ta"].forEach((language, index) => { translations[language][`fuel.${key}`] = labels[index]; });
}
