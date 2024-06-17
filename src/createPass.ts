import { PKPass } from "passkit-generator";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const readCertificate = (fileName: string) =>
  readFile(join(process.cwd(), "certs", fileName));

export const readAsset = (fileName: string) =>
  readFile(join(process.cwd(), "assets", fileName));

export const l = async (fileName: string, resolvePath?: string) => [
  fileName,
  await readAsset(resolvePath ?? fileName),
];

export const createPass = async () => {
  const [wwdr, signerCert, signerKey] = await Promise.all([
    readCertificate("wwdr.pem"),
    readCertificate("signerCert.pem"),
    readCertificate("signerKey.pem"),
  ]);

  const pass = new PKPass(
    Object.fromEntries(
      await Promise.all([
        l("artwork.png"),
        l("artwork@2x.png", "artwork.png"),
        l("background.png"),
        l("icon.png"),
        l("logo.png"),
        l("logo@2x.png"),
        l("secondaryLogo.png", "logo.png"),
        l("secondaryLogo@2x.png", "logo@2x.png"),
        l("thumbnail.png"),
        l("thumbnail@2x.png"),
      ]),
    ),
    {
      wwdr,
      signerCert,
      signerKey,
      signerKeyPassphrase: process.env.SIGNER_KEY,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: process.env.APPLE_PASS_ID,
      teamIdentifier: process.env.APPLE_TEAM_ID,
      organizationName: "Creatorsgarten",
      description: "Creatorsgarten Event Ticket",
      serialNumber: "ahsdg2",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 0)",
      labelColor: "rgb(255, 255, 255)",
      semantics: {
        eventName: "The 8th Stupid Hackathon of Thailand",
        eventType: "PKEventTypeConference",
        eventStartDate: "2024-07-13T00:00+07:00",
        eventEndDate: "2024-07-14T23:59+07:00",
        relevantDates: [
          {
            startDate: "2024-07-13T08:00+07:00",
            endDate: "2024-07-14T23:59+07:00",
          },
        ],
        // admissionLevel: "ElysiaJS",
        venueRegionName: "Bangkok",
        venueName: "Chulalongkorn University",
        venueEntrance: "100",
        venueLocation: {
          latitude: 13.736890436019664,
          longitude: 100.53318181209069,
        },
        seats: [
          {
            seatDescription: "Normal Seat",
            seatIdentifier: "112-12-16",
            seatNumber: "5",
            seatRow: "3",
            seatSection: "100",
            venueEntranceGate: "3",
          },
        ],
      },
    },
  );

  pass.setRelevantDate(new Date("2024-07-13T08:00+07:00"));

  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: "QGZRQR",
    altText: "QGZRQR",
  });

  pass.type = "eventTicket";
  pass.headerFields.push({
    key: "date",
    label: "DATE",
    value: "13 Jul",
  });
  pass.primaryFields.push({
    key: "event",
    label: "EVENT",
    value: "The 8th Stupid Hackathon of Thailand",
  });
  pass.secondaryFields.push({
    key: "loc",
    label: "LOCATION",
    value: "Faculty of Engineering, Chulalongkorn University",
  });

  pass.preferredStyleSchemes = ["posterEventTicket", "eventTicket"];

  return pass;
};
