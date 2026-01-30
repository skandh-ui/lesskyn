import { google } from "googleapis";
import crypto from "crypto";

interface CreateMeetInput {
  title: string;
  description?: string;
  startTimeUTC: Date;
  endTimeUTC: Date;
  attendees: {
    email: string;
  }[];
  attachments?: {
    url: string;
    title?: string;
    mimeType?: string;
  }[];
}

export async function createGoogleMeetEvent({
  title,
  description,
  startTimeUTC,
  endTimeUTC,
  attendees,
  attachments,
}: CreateMeetInput) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const impersonateUser = process.env.GOOGLE_IMPERSONATE_USER;

  if (!privateKey || !clientEmail || !impersonateUser) {
    throw new Error(
      "Missing Google Calendar credentials. Please set GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL, and GOOGLE_IMPERSONATE_USER in environment variables.",
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
    subject: impersonateUser,
  });

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: title,
      description,
      start: {
        dateTime: startTimeUTC.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endTimeUTC.toISOString(),
        timeZone: "UTC",
      },
      attendees: attendees.map((a) => ({ email: a.email })),
      attachments: attachments?.map((att) => ({
        fileUrl: att.url,
        title: att.title || "Attachment",
        mimeType: att.mimeType || "application/octet-stream",
      })),
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(), // More unique identifier
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const event = response.data;

  // Check conference creation status
  const status = event.conferenceData?.status?.statusCode;
  if (status === "pending") {
    console.warn("Conference creation is pending");
  }

  if (!event.conferenceData?.entryPoints) {
    throw new Error("No conference data returned");
  }

  const meetLink = event.conferenceData.entryPoints.find(
    (e) => e.entryPointType === "video",
  )?.uri;

  if (!meetLink) {
    throw new Error("Failed to generate Google Meet link");
  }

  return {
    eventId: event.id!,
    meetLink,
    calendarEventLink: event.htmlLink!,
    conferenceStatus: status,
  };
}
