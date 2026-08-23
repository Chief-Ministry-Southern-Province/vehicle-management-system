export const languages = [
  { code: "en", nativeLabel: "English", locale: "en-LK" },
  { code: "si", nativeLabel: "සිංහල", locale: "si-LK" },
  { code: "ta", nativeLabel: "தமிழ்", locale: "ta-LK" },
];

export const translations = {
  en: { "app.name":"Vehicle Management System","app.ministry":"Chief Ministry","app.location":"Dakshinapaya, Labuduwa, Galle","app.fleet":"Government Fleet","app.country":"Sri Lanka","language.label":"Language","user.government":"Government User","role.employee":"Employee","role.department_officer":"Department Officer","role.subject_officer":"Subject Officer","role.deputy_secretary":"Assistance Secreatry","role.senior_deputy_secretary":"Senior Assistance Secretary","role.secretary":"Secretary","role.driver":"Driver","nav.main":"Main","nav.fleet_operations":"Fleet Operations","nav.details":"Details","nav.organization":"Organization","nav.dashboard":"Dashboard","nav.request_history":"Request History","nav.approved_journeys":"Approved Journeys","nav.total_approvals":"Total Approvals","nav.pending_approvals":"Pending Approvals","nav.vehicle_directory":"Vehicle Directory","nav.driver_directory":"Driver Directory","nav.fuel_management":"Fuel Management","nav.service_records":"Service Records","nav.repair_records":"Repair Records","nav.vehicle_details":"Vehicle Details","nav.driver_details":"Driver Details","nav.fuel_records":"Fuel Records","nav.reports":"Reports","nav.drivers":"Drivers","nav.user_settings":"User Settings","nav.logout":"Logout" },
  si: { "app.name":"වාහන කළමනාකරණ පද්ධතිය","app.ministry":"ප්‍රධාන අමාත්‍යාංශය","app.location":"දක්ෂිණපාය, ලබුදූව, ගාල්ල","app.fleet":"රජයේ වාහන සංචිතය","app.country":"ශ්‍රී ලංකාව","language.label":"භාෂාව","user.government":"රාජ්‍ය පරිශීලක","role.employee":"සේවක","role.department_officer":"දෙපාර්තමේන්තු නිලධාරී","role.subject_officer":"විෂය නිලධාරී","role.deputy_secretary":"නියෝජ්‍ය ලේකම්","role.senior_deputy_secretary":"ජ්‍යෙෂ්ඨ නියෝජ්‍ය ලේකම්","role.secretary":"ලේකම්","role.driver":"රියදුරු","nav.main":"ප්‍රධාන","nav.fleet_operations":"වාහන මෙහෙයුම්","nav.details":"විස්තර","nav.organization":"ආයතනය","nav.dashboard":"උපකරණ පුවරුව","nav.request_history":"ඉල්ලීම් ඉතිහාසය","nav.approved_journeys":"අනුමත ගමන්","nav.total_approvals":"සියලු අනුමැති","nav.pending_approvals":"අපේක්ෂිත අනුමැති","nav.vehicle_directory":"වාහන නාමාවලිය","nav.driver_directory":"රියදුරු නාමාවලිය","nav.fuel_management":"ඉන්ධන කළමනාකරණය","nav.service_records":"සේවා වාර්තා","nav.repair_records":"අලුත්වැඩියා වාර්තා","nav.vehicle_details":"වාහන විස්තර","nav.driver_details":"රියදුරු විස්තර","nav.fuel_records":"ඉන්ධන වාර්තා","nav.reports":"වාර්තා","nav.drivers":"රියදුරන්","nav.user_settings":"පරිශීලක සැකසුම්","nav.logout":"ඉවත් වන්න" },
  ta: { "app.name":"வாகன முகாமைத்துவ அமைப்பு","app.ministry":"முதன்மை அமைச்சு","app.location":"தக்ஷிணபாய, லபுதுவ, காலி","app.fleet":"அரச வாகனத் தொகுதி","app.country":"இலங்கை","language.label":"மொழி","user.government":"அரச பயனர்","role.employee":"ஊழியர்","role.department_officer":"திணைக்கள அலுவலர்","role.subject_officer":"விடய அலுவலர்","role.deputy_secretary":"பிரதிச் செயலாளர்","role.senior_deputy_secretary":"சிரேஷ்ட பிரதிச் செயலாளர்","role.secretary":"செயலாளர்","role.driver":"சாரதி","nav.main":"முதன்மை","nav.fleet_operations":"வாகனச் செயற்பாடுகள்","nav.details":"விபரங்கள்","nav.organization":"நிறுவனம்","nav.dashboard":"முகப்புப்பலகை","nav.request_history":"கோரிக்கை வரலாறு","nav.approved_journeys":"அங்கீகரிக்கப்பட்ட பயணங்கள்","nav.total_approvals":"அனைத்து அங்கீகாரங்கள்","nav.pending_approvals":"நிலுவை அங்கீகாரங்கள்","nav.vehicle_directory":"வாகனப் பட்டியல்","nav.driver_directory":"சாரதிப் பட்டியல்","nav.fuel_management":"எரிபொருள் முகாமைத்துவம்","nav.service_records":"சேவைப் பதிவுகள்","nav.repair_records":"திருத்தப் பதிவுகள்","nav.vehicle_details":"வாகன விபரங்கள்","nav.driver_details":"சாரதி விபரங்கள்","nav.fuel_records":"எரிபொருள் பதிவுகள்","nav.reports":"அறிக்கைகள்","nav.drivers":"சாரதிகள்","nav.user_settings":"பயனர் அமைப்புகள்","nav.logout":"வெளியேறு" },
};

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
