const CLIENT_ID =
  "737571193290-31jqfn6m05tmoeq56ou3qa1et3e2mh4n.apps.googleusercontent.com";
const API_KEY = "AIzaSyBDaMw9z30sX-R0Gw8tdPGvVESxFeWDbcQ";
const DISCOVERY_DOC =
  "https://www.googleapis.com.discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
  console.log("Инициализация Google API...");
  gapi.load("client", initializeGapiClient);
}

// Функция для инициализации Google API
 function initializeGapiClient() {
  try {
    console.log("Google API нач инициализировано");

     gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    console.log("Google API инициализировано");
    gapiInited = true;
    gapi.client.load('calendar', 'v3', () => {
        console.log('Google Calendar API loaded');
      });
    gisLoaded(); // Перемещаем вызов gisLoaded сюда
  } catch (error) {
    console.error("Ошибка при инициализации Google API:", error);
  }
}

function gisLoaded() {
  if (!gapiInited) {
    console.error("Google API ещё не инициализировано");
    return; // Убедитесь, что эта функция не продолжает выполняться, если API не инициализировано
  }
  console.log("Инициализация Google Identity Services...");
  // Здесь нет нужды в проверке gapiInited, так как эта функция вызывается только после инициализации gapi
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: tokenResponseCallback, // Определите эту функцию, если она ещё не определена
  });
  gisInited = true;
}
function tokenResponseCallback(resp) {
  if (resp.error !== undefined) {
    console.error("Ошибка при получении токена: ", resp.error);
    return;
  }
  // Дальнейшие действия после успешной авторизации
}
function createGoogleEvent(appointment) {
  if (!gapiInited || !gisInited) {
    console.log(gapiInited, gisInited);
    console.error(
      "Google API или Google Identity Services не инициализированы"
    );
    return;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw resp;
    }
    await addNotif(appointment);
  };
  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

async function addNotif(appointment) {
  const event = {
    summary: "Прием у врача: " + appointment.specialty,
    description: appointment.problem_description,
    start: {
      dateTime: getGoogleCalendarDateTime(
        appointment.date,
        appointment.start_time
      ),
      timeZone: "Europe/Moscow", // Измените на соответствующий часовой пояс
    },
    end: {
      dateTime: getGoogleCalendarDateTime(
        appointment.date,
        appointment.end_time
      ),
      timeZone: "Europe/Moscow", // Измените на соответствующий часовой пояс
    },
    // Другие параметры события по необходимости
  };
  const response = await gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then((response) => {
      console.info("Event created: " + response.result.htmlLink);
    });
}

function getGoogleCalendarDateTime(date, time) {
  const datePart = date.split("T")[0]; // Получает только дату
  return datePart + "T" + time; // Соединяет дату с временем
}
