// scripts/uploadRoads.js
const admin = require("firebase-admin");
const roadsData = require("../assets/baguioRoads.json");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadRoads() {
  try {
    const roadsCollection = db.collection("baguioRoads");

    for (const feature of roadsData.features) {
      const name = feature.properties?.name || "Unnamed Road";
      const speed = feature.properties?.speed_limit || 20;

      // 🧠 Flatten the geometry for Firestore safety
      const simplifiedGeometry = {
        type: feature.geometry.type,
        coordinates: feature.geometry.coordinates.map(([lon, lat]) => ({
          lat,
          lon,
        })),
      };

      await roadsCollection.add({
        name,
        speed_limit: speed,
        geometry: simplifiedGeometry, // ✅ Safe shape
      });

      console.log(`✅ Uploaded: ${name}`);
    }

    console.log("🎉 All roads uploaded successfully!");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadRoads();
